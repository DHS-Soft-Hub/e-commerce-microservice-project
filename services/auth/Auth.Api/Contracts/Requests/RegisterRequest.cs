using System.ComponentModel.DataAnnotations;

namespace Auth.Api.Contracts.Requests;

public sealed record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    [Required, MinLength(3)] string UserName);