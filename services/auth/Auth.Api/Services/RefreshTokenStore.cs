using System.Security.Cryptography;
using System.Text;
using Auth.Api.Data.Context;
using Auth.Api.Entities;
using Auth.Api.Options;
using Microsoft.EntityFrameworkCore;

namespace Auth.Api.Services;

public class RefreshTokenStore : IRefreshTokenStore
{
    private readonly AuthDbContext _dbContext;
    private readonly JwtOptions _jwtOptions;

    public RefreshTokenStore(
        AuthDbContext dbContext,
        JwtOptions jwtOptions)
    {
        _dbContext = dbContext;
        _jwtOptions = jwtOptions;
    }

    public async Task<string> IssueAsync(AuthUser user, string? oldToken = null, CancellationToken ct = default)
    {
        // Revoke old token if supplied
        if (!string.IsNullOrWhiteSpace(oldToken))
        {
            var oldHash = ComputeHash(oldToken);
            var oldRefreshToken = await _dbContext.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.TokenHash == oldHash && rt.UserId == user.Id && rt.RevokedAtUtc == null, ct);
            if (oldRefreshToken != null)
            {
                oldRefreshToken.RevokedAtUtc = DateTime.UtcNow;
            }
        }

        var plainToken = GenerateOpaqueToken();
        var newEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = ComputeHash(plainToken),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtOptions.RefreshTokenExpirationDays)
        };

        _dbContext.RefreshTokens.Add(newEntity);
        await _dbContext.SaveChangesAsync(ct);

        return plainToken; // return the raw token (only time it is revealed)
    }

    public async Task<bool> ValidateAndRotateAsync(AuthUser user, string refreshToken, CancellationToken ct = default)
    {
        var hash = ComputeHash(refreshToken);
        var existing = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.TokenHash == hash && rt.UserId == user.Id, ct);

        if (existing is null) return false;
        if (existing.RevokedAtUtc is not null) return false;
        if (existing.ExpiresAtUtc <= DateTime.UtcNow) return false;

        // NOTE: For now we only validate (no rotation returned to caller). Rotation would
        // require returning the new refresh token to the API consumer (interface change).
        return true;
    }

    public async Task RevokeFamilyAsync(AuthUser user, string refreshToken, CancellationToken ct = default)
    {
        var hash = ComputeHash(refreshToken);
        var reference = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.TokenHash == hash && rt.UserId == user.Id, ct);
        if (reference is null) return;

        var tokensToRevoke = await _dbContext.RefreshTokens
            .Where(rt => rt.UserId == user.Id && rt.CreatedAtUtc <= reference.CreatedAtUtc && rt.RevokedAtUtc == null)
            .ToListAsync(ct);

        var now = DateTime.UtcNow;
        foreach (var t in tokensToRevoke)
        {
            t.RevokedAtUtc = now;
        }

        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task<string?> ExtractUserIdAsync(string refreshToken, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken)) return null;
        var hash = ComputeHash(refreshToken);
        var token = await _dbContext.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(rt => rt.TokenHash == hash, ct);
        if (token is null) return null;
        if (token.RevokedAtUtc is not null) return null;
        if (token.ExpiresAtUtc <= DateTime.UtcNow) return null;
        return token.UserId;
    }

    private static string GenerateOpaqueToken()
    {
        Span<byte> bytes = stackalloc byte[64];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    }

    private static string ComputeHash(string token)
    {
        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash);
    }
}
