using Auth.Api.Entities;

namespace Auth.Api.Services;

public interface IRefreshTokenStore
{
    Task<string> IssueAsync(AuthUser user, string? oldToken = null, CancellationToken ct = default);
    Task<bool> ValidateAndRotateAsync(AuthUser user, string refreshToken, CancellationToken ct = default);
    Task RevokeFamilyAsync(AuthUser user, string refreshToken, CancellationToken ct = default);
    Task<string?> ExtractUserIdAsync(string refreshToken, CancellationToken ct = default);
}