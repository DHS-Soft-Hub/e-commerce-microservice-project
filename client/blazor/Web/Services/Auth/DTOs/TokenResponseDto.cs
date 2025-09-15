using System.Text.Json.Serialization;

namespace Web.Services.Auth.DTOs
{
    public class TokenResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        
        [JsonPropertyName("ExpiresAtUtc")]
        public DateTime AccessTokenExpiry { get; set; }
    }
}
