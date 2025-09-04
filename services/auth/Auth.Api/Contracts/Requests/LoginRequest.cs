using System.ComponentModel.DataAnnotations;

namespace Auth.Api.Contracts.Requests;

public sealed record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);