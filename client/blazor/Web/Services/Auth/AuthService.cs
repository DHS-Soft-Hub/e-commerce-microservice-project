using Blazored.LocalStorage;
using Web.Services.Auth.DTOs;
using Web.Models;
using System.Text.Json;

namespace Web.Services.Auth
{
    public class AuthService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILocalStorageService _localStorage;
        private readonly CustomAuthStateProvider _authStateProvider;

        public AuthService(
            IHttpClientFactory httpClientFactory,
            ILocalStorageService localStorage,
            CustomAuthStateProvider authStateProvider)
        {
            _httpClientFactory = httpClientFactory;
            _localStorage = localStorage;
            _authStateProvider = authStateProvider;
        }

        public async Task<bool> LoginAsync(LoginModel loginModel)
        {
            try
            {
                using var httpClient = _httpClientFactory.CreateClient("APIGateway");
                
                var response = await httpClient.PostAsJsonAsync("/api/auth/login", loginModel);
                
                if (response.IsSuccessStatusCode)
                {
                    var tokenResponse = await response.Content.ReadFromJsonAsync<TokenResponseDto>();
                    if (tokenResponse != null)
                    {
                        // Store only the access token in local storage (refresh token is in HTTP-only cookie)
                        await _localStorage.SetItemAsync("authToken", new
                        {
                            AccessToken = tokenResponse.AccessToken,
                            AccessTokenExpiry = tokenResponse.AccessTokenExpiry
                        });
                        
                        _authStateProvider.NotifyUserAuthentication(tokenResponse);
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
            }
            
            return false;
        }

        public async Task<bool> RegisterAsync(RegisterModel registerModel)
        {
            try
            {
                using var httpClient = _httpClientFactory.CreateClient("APIGateway");
                
                // Register with auth service
                var authResponse = await httpClient.PostAsJsonAsync("/api/auth/register", registerModel);
                if (!authResponse.IsSuccessStatusCode) return false;

                var authUser = await authResponse.Content.ReadFromJsonAsync<AuthUserDto>();
                if (authUser == null) return false;

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                return false;
            }
        }

        public async Task LogoutAsync()
        {
            try
            {
                // Revoke the refresh token on the server
                using var httpClient = _httpClientFactory.CreateClient("APIGateway");
                await httpClient.PostAsync("/api/auth/revoke-token", null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Logout error: {ex.Message}");
            }
            finally
            {
                // Clear local storage and notify auth state provider
                await _localStorage.RemoveItemAsync("authToken");
                _authStateProvider.NotifyUserLogout();
            }
        }

        public async Task<string?> GetValidAccessTokenAsync()
        {
            try
            {
                var tokenData = await _localStorage.GetItemAsync<dynamic>("authToken");
                if (tokenData == null) return null;

                // Parse the token data
                var tokenJson = JsonSerializer.Serialize(tokenData);
                var tokenInfo = JsonSerializer.Deserialize<TokenInfo>(tokenJson);
                
                if (tokenInfo == null || string.IsNullOrEmpty(tokenInfo.AccessToken))
                    return null;

                // Check if token is expired (with 5 minute buffer)
                if (tokenInfo.AccessTokenExpiry <= DateTime.UtcNow.AddMinutes(5))
                {
                    // Try to refresh the token
                    var refreshed = await RefreshTokenAsync();
                    if (!refreshed)
                    {
                        await LogoutAsync();
                        return null;
                    }
                    
                    // Get the new token
                    tokenData = await _localStorage.GetItemAsync<dynamic>("authToken");
                    if (tokenData == null) return null;
                    
                    tokenJson = JsonSerializer.Serialize(tokenData);
                    tokenInfo = JsonSerializer.Deserialize<TokenInfo>(tokenJson);
                }

                return tokenInfo?.AccessToken;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Get token error: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> IsLoggedInAsync()
        {
            var token = await GetValidAccessTokenAsync();
            return !string.IsNullOrEmpty(token);
        }

        private async Task<bool> RefreshTokenAsync()
        {
            try
            {
                using var httpClient = _httpClientFactory.CreateClient("APIGateway");
                
                // The refresh token is automatically sent as HTTP-only cookie
                var response = await httpClient.PostAsync("/api/auth/refresh-token", null);
                
                if (response.IsSuccessStatusCode)
                {
                    var newTokenResponse = await response.Content.ReadFromJsonAsync<TokenResponseDto>();
                    if (newTokenResponse != null)
                    {
                        // Update local storage with new access token
                        await _localStorage.SetItemAsync("authToken", new
                        {
                            AccessToken = newTokenResponse.AccessToken,
                            AccessTokenExpiry = newTokenResponse.AccessTokenExpiry
                        });
                        
                        _authStateProvider.NotifyUserAuthentication(newTokenResponse);
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token refresh error: {ex.Message}");
            }
            
            return false;
        }

        private class TokenInfo
        {
            public string AccessToken { get; set; } = string.Empty;
            public DateTime AccessTokenExpiry { get; set; }
        }
    }
}
