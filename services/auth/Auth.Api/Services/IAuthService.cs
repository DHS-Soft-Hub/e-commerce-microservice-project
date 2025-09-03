using Auth.Api.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Auth.Api.Services;

public interface IAuthService
{
    Task<(AuthUserDto? userDto, IdentityResult result)> RegisterAsync(string email, string password, string fullName);
    Task<(TokenResponseDto? tokenResponse, string? refreshToken)> LoginAsync(string email, string password);
    Task<TokenResponseDto?> RefreshTokenAsync(string refreshToken);
    Task<bool> RevokeTokenAsync(string refreshToken);
}