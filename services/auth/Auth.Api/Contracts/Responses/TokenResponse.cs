namespace Auth.Api.Contracts.Responses;

public sealed record TokenResponse(
    string AccessToken,
    DateTime ExpiresAtUtc);