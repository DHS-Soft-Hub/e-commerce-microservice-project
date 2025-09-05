using Microsoft.AspNetCore.Identity;

namespace Auth.Api.Entities;

/// <summary>
/// Represents an authenticated user in the system.
/// Inherits from IdentityUser to leverage built-in identity features.
/// Whereas IdentityUser contains basic properties like Id, Email, and PasswordHash,
/// AuthUser contains additional properties like FullName, Roles, and DateCreated.
/// </summary>
public class AuthUser : IdentityUser
{
    // Additional properties specific to AuthUser can be added here
}
