using System.Security.Claims;

namespace Auth.Api.Services
{
    public interface ITokenService
    {
        /// <summary>
        /// Generates an access token for the user.
        /// /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <param name="userName">The username of the user.</param>
        /// <returns>A string representing the access token.</returns>
        string GenerateAccessToken(IEnumerable<Claim> claims);
        /// <summary>
        /// Generates a refresh token for the user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A string representing the refresh token.</returns>
        string GenerateRefreshToken(IEnumerable<Claim> claims);
        /// <summary>
        /// Validates the access token and returns the user ID if valid.
        /// </summary>
        /// <param name="token">The access token to validate.</param>
        /// <returns>The user ID if the token is valid; otherwise, null.</returns>
        ClaimsPrincipal? ValidateAccessToken(string token);

    }

}