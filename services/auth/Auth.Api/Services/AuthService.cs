using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MapsterMapper;
using Auth.Api.Entities;
using Auth.Api.Contracts.Responses;
using Auth.Api.Options;
using Auth.Api.Services.Interfaces;

namespace Auth.Api.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<AuthUser> _userManager;
    private readonly SignInManager<AuthUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenStore _refreshTokenStore;
    private readonly JwtOptions _jwtOptions;

    private readonly IMapper _mapper;

    public AuthService(
        UserManager<AuthUser> userManager,
        SignInManager<AuthUser> signInManager,
        ITokenService tokenService,
        IMapper mapper,
        RoleManager<IdentityRole> roleManager,
        IRefreshTokenStore refreshTokenStore,
        JwtOptions jwtOptions)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _mapper = mapper;
        _roleManager = roleManager;
        _refreshTokenStore = refreshTokenStore;
        _jwtOptions = jwtOptions;
    }

    public async Task<(TokenResponse? tokenResponse, string? refreshToken)> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        // Return uniform failure (do not reveal user existence)
        if (user == null) return (null, null);

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        if (!result.Succeeded) return (null, null);

        var claims = await BuildUserClaimsAsync(user);

        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = await _refreshTokenStore.IssueAsync(user);

        return (new TokenResponse(accessToken, DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes)), refreshToken);
    }

    public async Task<(AuthUserResponse?, IdentityResult)> RegisterAsync(string email, string password, string username)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser != null) return (null, IdentityResult.Failed(new IdentityError { Description = "User already exists" }));

        // Create new user
        var user = new AuthUser { Email = email, UserName = username };
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded) return (null, result);

        // Assign default role
        var defaultRole = "User";
        if (!await _roleManager.RoleExistsAsync(defaultRole))
        {
            await _roleManager.CreateAsync(new IdentityRole(defaultRole));
        }
        await _userManager.AddToRoleAsync(user, defaultRole);

        // Map to response DTO
        var userDto = _mapper.Map<AuthUserResponse>(user);
        return (userDto, result);
    }

    public async Task<TokenResponse?> RefreshTokenAsync(string refreshToken)
    {
        // Look up refresh token in persistent store (validate + rotate)
        // (Opaque tokens recommended; no direct JWT validation here)
        var principalUserId = await _refreshTokenStore.ExtractUserIdAsync(refreshToken); // hypothetical helper
        if (principalUserId == null) return null;

        var user = await _userManager.FindByIdAsync(principalUserId);
        if (user == null) return null;

        var ok = await _refreshTokenStore.ValidateAndRotateAsync(user, refreshToken);
        if (!ok) return null;

        var claims = await BuildUserClaimsAsync(user);
        var accessToken = _tokenService.GenerateAccessToken(claims);
        return new TokenResponse(accessToken, DateTime.UtcNow.AddMinutes(_jwtOptions.AccessTokenExpirationMinutes));
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken)
    {
        var userId = await _refreshTokenStore.ExtractUserIdAsync(refreshToken);
        if (userId == null) return false;
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;
        await _refreshTokenStore.RevokeFamilyAsync(user, refreshToken);
        return true;
    }
    
    private async Task<List<Claim>> BuildUserClaimsAsync(AuthUser user)
    {
        var userClaims = await _userManager.GetClaimsAsync(user);
        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName ?? ""),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        claims.AddRange(userClaims);

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
            var roleEntity = await _roleManager.FindByNameAsync(role);
            if (roleEntity != null)
            {
                var roleClaims = await _roleManager.GetClaimsAsync(roleEntity);
                claims.AddRange(roleClaims);
            }
        }

        return claims;
    }
}
