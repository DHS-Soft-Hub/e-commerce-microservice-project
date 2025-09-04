namespace Auth.Api.Contracts.Responses;

public sealed record AuthUserResponse(
    string Id,
    string UserName,
    string Email);