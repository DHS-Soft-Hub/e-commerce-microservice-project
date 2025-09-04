namespace Auth.Api.DTOs
{
    public record TokenResponseDto(string AccessToken, DateTime AccessTokenExpiry);
}