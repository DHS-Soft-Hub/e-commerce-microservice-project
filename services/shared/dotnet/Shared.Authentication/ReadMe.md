# Shared Authentication in Microservices
In a microservices architecture, Shared Authentication should contain reusable components related to user authentication and authorization. This avoids duplication across multiple services.

## What to Include in /Shared/Authentication
- JWT Token Handling
    - Generating, validating, and refreshing JWT tokens.
    - Storing secrets for signing tokens.

- Authentication Middleware
    - Middleware to validate JWT tokens across microservices.

- Authorization Policies
    - Role-based access control (RBAC).
    - Claim-based authorization.

- User Claims & Identity Extensions
    - Extension methods for retrieving user details from claims.

- OAuth & OpenID Connect
    - Helper methods for integrating with external identity providers (Google, Azure AD).

- Common Models (DTOs)
    - UserDto – Common user representation.
    - AuthResponseDto – Standard authentication response.