using Auth.Api.Contracts.Requests;
using Auth.Api.Enums;
using Auth.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var (user, result) = await _authService.RegisterAsync(request.Email, request.Password, request.UserName);
        if (result.Succeeded && user != null)
            return Ok(new { success = true, data = user, message = "Registration successful" });

        return BadRequest(new {
            success = false,
            errors = result.Errors.Select(e => new { e.Code, e.Description }),
            message = "Registration failed"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (tokenResponse, refreshToken) = await _authService.LoginAsync(request.Email, request.Password);
        if (tokenResponse is not null)
        {
            SetRefreshTokenCookie(refreshToken ?? string.Empty);
            return Ok(tokenResponse);
        }
        return BadRequest("Invalid credentials");
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest("Refresh token not found");
        }

        var result = await _authService.RefreshTokenAsync(refreshToken);
        if (result != null)
        {
            return Ok(result);
        }
        
        // Clear invalid refresh token
        Response.Cookies.Delete("refreshToken");
        return BadRequest("Invalid refresh token");
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(refreshToken))
        {
            return BadRequest("Refresh token not found");
        }

        var result = await _authService.RevokeTokenAsync(refreshToken);
        if (result)
        {
            Response.Cookies.Delete("refreshToken");
            return Ok("Token revoked successfully");
        }
        
        return BadRequest("Failed to revoke token");
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // Use true for HTTPS in production
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7), // Refresh token expiry
            // Path = "/api/auth" // Restrict to auth endpoints
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}