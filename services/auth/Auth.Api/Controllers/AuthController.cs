using Auth.Api.Models;
using Auth.Api.Services;
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
    public async Task<IActionResult> Register([FromBody] RegisterModel request)
    {
        var (user, result) = await _authService.RegisterAsync(request.Email, request.Password, request.UserName);

        if (result.Succeeded && user != null)
        {
            return Ok(new
            {
                Success = true,
                Data = user,
                Message = "Registration successful"
            });
        }

        // Return structured error response
        return BadRequest(new
        {
            Success = false,
            Errors = result.Errors.Select(e => new
            {
                Code = e.Code,
                Description = e.Description
            }).ToList(),
            Message = "Registration failed"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel request)
    {
        var result = await _authService.LoginAsync(request.Email, request.Password);
        if (result.tokenResponse != null)
        {
            SetRefreshTokenCookie(result.refreshToken ?? string.Empty);
            return Ok(result.tokenResponse);
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