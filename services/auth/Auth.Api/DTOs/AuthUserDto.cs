namespace Auth.Api.DTOs;
public record AuthUserDto(
    string Id,
    string UserName,
    string Password,
    string Email
);
