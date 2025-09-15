using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.Authorization;
using Blazored.LocalStorage;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using Web.Services.Auth.DTOs;
using Microsoft.JSInterop;

namespace Web.Services;
public class CustomAuthStateProvider : AuthenticationStateProvider
{
    private readonly ILocalStorageService _localStorage;
    private readonly IJSRuntime _jsRuntime;
    private ClaimsPrincipal _currentUser = new(new ClaimsIdentity());

    public CustomAuthStateProvider(ILocalStorageService localStorage, IJSRuntime jsRuntime)
    {
        _localStorage = localStorage;
        _jsRuntime = jsRuntime;
    }

    public override Task<AuthenticationState> GetAuthenticationStateAsync()
    {
        return Task.FromResult(new AuthenticationState(_currentUser));
    }

    public async Task LoadUserFromStorageAsync()
    {
        try
        {
            var tokenData = await _localStorage.GetItemAsync<TokenInfo>("authToken");
            if (tokenData == null)
            {
                Console.WriteLine("No token data found in localStorage");
                _currentUser = new ClaimsPrincipal(new ClaimsIdentity());
                NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
                return;
            }

            Console.WriteLine($"Token found - AccessToken: {!string.IsNullOrEmpty(tokenData.AccessToken)}, Expiry: {tokenData.AccessTokenExpiry}");

            if (string.IsNullOrEmpty(tokenData.AccessToken) || tokenData.AccessTokenExpiry < DateTime.UtcNow)
            {
                Console.WriteLine("Token is empty or expired");
                _currentUser = new ClaimsPrincipal(new ClaimsIdentity());
            }
            else
            {
                var claims = ParseClaimsFromJwt(tokenData.AccessToken);
                var identity = new ClaimsIdentity(claims, "jwt");
                _currentUser = new ClaimsPrincipal(identity);
                
                Console.WriteLine($"User authenticated - IsAuthenticated: {_currentUser.Identity?.IsAuthenticated}, Claims count: {claims.Count()}");
                Console.WriteLine($"Sub claim: {_currentUser.FindFirst("sub")?.Value}");
                Console.WriteLine($"Name claim: {_currentUser.FindFirst(ClaimTypes.Name)?.Value}");
            }

            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading user from storage: {ex.Message}");
            _currentUser = new ClaimsPrincipal(new ClaimsIdentity());
            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
        }
    }

    public void NotifyUserAuthentication(TokenResponseDto token)
    {
        var identity = new ClaimsIdentity(ParseClaimsFromJwt(token.AccessToken), "jwt");
        _currentUser = new ClaimsPrincipal(identity);

        NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
    }

    public void NotifyUserLogout()
    {
        _currentUser = new ClaimsPrincipal(new ClaimsIdentity());
        NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_currentUser)));
    }

    private IEnumerable<Claim> ParseClaimsFromJwt(string jwt)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwt);
            return token.Claims;
        }
        catch
        {
            return new List<Claim>();
        }
    }
}

public class TokenInfo
{
    public string AccessToken { get; set; } = string.Empty;
    public DateTime AccessTokenExpiry { get; set; }
}
