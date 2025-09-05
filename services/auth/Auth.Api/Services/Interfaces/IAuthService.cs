using Auth.Api.Contracts.Responses;
using Microsoft.AspNetCore.Identity;

namespace Auth.Api.Services.Interfaces;

public interface IAuthService
{
    Task<(AuthUserResponse? userDto, IdentityResult result)> RegisterAsync(string email, string password, string fullName);
    Task<(TokenResponse? tokenResponse, string? refreshToken)> LoginAsync(string email, string password);
    Task<TokenResponse?> RefreshTokenAsync(string refreshToken);
    Task<bool> RevokeTokenAsync(string refreshToken);
}