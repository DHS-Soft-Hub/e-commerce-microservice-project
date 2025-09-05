using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MapsterMapper;
using Auth.Api.Entities;
using Auth.Api.Contracts.Responses;

namespace Auth.Api.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<AuthUser> _userManager;
    private readonly SignInManager<AuthUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    private readonly ITokenService _tokenService;

    private readonly IMapper _mapper;

    public AuthService(
        UserManager<AuthUser> userManager,
        SignInManager<AuthUser> signInManager,
        ITokenService tokenService,
        IConfiguration configuration,
        IMapper mapper,
        RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _configuration = configuration;
        _mapper = mapper;
        _roleManager = roleManager;
    }

    public async Task<(TokenResponse? tokenResponse, string? refreshToken)> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return (null, null);

        var result = await _signInManager.PasswordSignInAsync(user, password, false, false);
        if (!result.Succeeded) return (null, null);

        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = _tokenService.GenerateAccessToken(authClaims);
        var refreshToken = _tokenService.GenerateRefreshToken(authClaims);

        return (new TokenResponse(token, DateTime.UtcNow.AddHours(1)), refreshToken);
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
        try
        {
            // Validate the JWT refresh token
            var principal = _tokenService.ValidateAccessToken(refreshToken);
            if (principal == null) return null;

            // Extract username from the validated token
            var username = principal.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username)) return null;

            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return null;

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = _tokenService.GenerateAccessToken(authClaims);
            return new TokenResponse(token, DateTime.UtcNow.AddHours(1));
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken)
    {
        try
        {
            // Validate the JWT refresh token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "");
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(refreshToken, validationParameters, out SecurityToken validatedToken);
            
            if (validatedToken is not JwtSecurityToken jwtToken || 
                !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return false;
            }

            // Extract username from the validated token
            var username = principal.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(username)) return false;

            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return false;

            // In a real implementation, you would maintain a blacklist of revoked tokens
            // or store refresh tokens in a database with an active/revoked status
            // For now, we'll return true as the token validation was successful
            return true;
        }
        catch
        {
            return false;
        }
    }
}
