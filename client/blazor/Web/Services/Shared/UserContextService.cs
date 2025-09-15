using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.JSInterop;
using System.Security.Claims;

namespace Web.Services.Shared
{
    public class UserContextService
    {
        private readonly AuthenticationStateProvider _authenticationStateProvider;
        private readonly IJSRuntime _jsRuntime;

        public UserContextService(AuthenticationStateProvider authenticationStateProvider, IJSRuntime jsRuntime)
        {
            _authenticationStateProvider = authenticationStateProvider;
            _jsRuntime = jsRuntime;
        }

        /// <summary>
        /// Gets the current user ID from the JWT token's 'sub' claim.
        /// Returns string.Empty if the user is not authenticated or the claim is not found.
        /// </summary>
        /// <returns>The user ID or string.Empty</returns>
        public async Task<string> GetUserIdAsync()
        {
            try
            {
                var authState = await _authenticationStateProvider.GetAuthenticationStateAsync();
                
                Console.WriteLine($"UserContextService - IsAuthenticated: {authState.User.Identity?.IsAuthenticated}");
                Console.WriteLine($"UserContextService - Identity type: {authState.User.Identity?.GetType().Name}");
                Console.WriteLine($"UserContextService - Authentication type: {authState.User.Identity?.AuthenticationType}");
                
                if (authState.User.Identity?.IsAuthenticated == true)
                {
                    var subClaim = authState.User.FindFirst("sub")?.Value ?? string.Empty;
                    Console.WriteLine($"UserContextService - Sub claim found: {subClaim}");
                    return subClaim;
                }
                
                Console.WriteLine("UserContextService - User not authenticated, returning empty string");
                return string.Empty;
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"UserContextService - JavaScript interop not available: {ex.Message}");
                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting user ID: {ex.Message}");
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets the current user name from the JWT token's name claim.
        /// Returns string.Empty if the user is not authenticated or the claim is not found.
        /// </summary>
        /// <returns>The user name or string.Empty</returns>
        public async Task<string> GetUserNameAsync()
        {
            try
            {
                var authState = await _authenticationStateProvider.GetAuthenticationStateAsync();
                
                if (authState.User.Identity?.IsAuthenticated == true)
                {
                    return authState.User.FindFirst(ClaimTypes.Name)?.Value ?? 
                           authState.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value ?? 
                           string.Empty;
                }
                
                return string.Empty;
            }
            catch (InvalidOperationException)
            {
                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting user name: {ex.Message}");
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets the current user's role from the JWT token.
        /// Returns string.Empty if the user is not authenticated or the claim is not found.
        /// </summary>
        /// <returns>The user role or string.Empty</returns>
        public async Task<string> GetUserRoleAsync()
        {
            try
            {
                var authState = await _authenticationStateProvider.GetAuthenticationStateAsync();
                
                if (authState.User.Identity?.IsAuthenticated == true)
                {
                    return authState.User.FindFirst(ClaimTypes.Role)?.Value ?? 
                           authState.User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value ?? 
                           string.Empty;
                }
                
                return string.Empty;
            }
            catch (InvalidOperationException)
            {
                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting user role: {ex.Message}");
                return string.Empty;
            }
        }

        /// <summary>
        /// Checks if the current user is authenticated.
        /// </summary>
        /// <returns>True if authenticated, false otherwise</returns>
        public async Task<bool> IsAuthenticatedAsync()
        {
            try
            {
                var authState = await _authenticationStateProvider.GetAuthenticationStateAsync();
                return authState.User.Identity?.IsAuthenticated == true;
            }
            catch (InvalidOperationException)
            {
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking authentication: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Gets a dummy session ID for the current session.
        /// This can be replaced with actual session management logic if needed.
        /// </summary>
        /// <returns>A dummy session ID</returns>
        public string GetSessionId()
        {
            // Return dummy session ID as requested
            return "00000000-0000-0000-0000-000000000002";
        }

        /// <summary>
        /// Gets the user context with ID and session information.
        /// </summary>
        /// <returns>User context with userId and sessionId</returns>
        public async Task<UserContext> GetUserContextAsync()
        {
            var userId = await GetUserIdAsync();
            var sessionId = GetSessionId();
            var isAuthenticated = await IsAuthenticatedAsync();
            var userName = await GetUserNameAsync();
            var userRole = await GetUserRoleAsync();

            return new UserContext
            {
                UserId = userId,
                SessionId = sessionId,
                IsAuthenticated = isAuthenticated,
                UserName = userName,
                UserRole = userRole
            };
        }

        /// <summary>
        /// Gets the user context synchronously (for cases where async is not possible).
        /// Note: This will return default values during prerendering.
        /// </summary>
        /// <returns>User context with default values</returns>
        public UserContext GetUserContextSync()
        {
            try
            {
                var authState = _authenticationStateProvider.GetAuthenticationStateAsync().GetAwaiter().GetResult();
                var userId = authState.User.Identity?.IsAuthenticated == true 
                    ? authState.User.FindFirst("sub")?.Value ?? string.Empty 
                    : string.Empty;
                
                return new UserContext
                {
                    UserId = userId,
                    SessionId = GetSessionId(),
                    IsAuthenticated = authState.User.Identity?.IsAuthenticated == true,
                    UserName = authState.User.Identity?.IsAuthenticated == true
                        ? authState.User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty
                        : string.Empty,
                    UserRole = authState.User.Identity?.IsAuthenticated == true
                        ? authState.User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty
                        : string.Empty
                };
            }
            catch
            {
                return new UserContext
                {
                    UserId = string.Empty,
                    SessionId = GetSessionId(),
                    IsAuthenticated = false,
                    UserName = string.Empty,
                    UserRole = string.Empty
                };
            }
        }
    }

    /// <summary>
    /// Represents the current user context
    /// </summary>
    public class UserContext
    {
        public string UserId { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public bool IsAuthenticated { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty;
    }
}
