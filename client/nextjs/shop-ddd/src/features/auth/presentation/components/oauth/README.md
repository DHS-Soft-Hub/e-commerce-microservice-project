# OAuth Integration Documentation

## Overview

This document describes the comprehensive OAuth integration implementation for Google and GitHub authentication in the base web app template. The implementation follows SOLID principles and provides a complete, production-ready OAuth solution.

## Architecture

### Backend Architecture

The backend OAuth implementation consists of:

1. **OAuth Configuration** (`apps/auth/config/oauth_config.py`)
   - Centralized OAuth provider configuration
   - Supports Google and GitHub providers
   - Uses Authlib for OAuth 2.0 implementation

2. **OAuth Service** (`apps/auth/services/oauth_service.py`)
   - Business logic for OAuth flows
   - User creation and account linking
   - Token management

3. **OAuth Endpoints** (`apps/auth/endpoints/oauth_endpoints.py`)
   - RESTful API endpoints for OAuth flows
   - Supports `/oauth/{provider}/authorize` and `/oauth/{provider}/callback`

### Frontend Architecture

The frontend OAuth implementation follows a layered architecture:

1. **Types Layer** (`types/oauth.types.ts`)
   - TypeScript interfaces and types for OAuth
   - Strong typing for all OAuth operations

2. **Abstractions Layer** (`abstractions/`)
   - Abstract base classes for services and repositories
   - Enforces interface contracts

3. **Services Layer** (`services/OAuthService.ts`)
   - Business logic implementation
   - Provider configuration management
   - OAuth flow orchestration

4. **Repository Layer** (`repositories/OAuthRepository.ts`)
   - Data access using RTK Query
   - API communication with backend

5. **Hooks Layer** (`hooks/useOAuth.ts`)
   - React hooks for OAuth functionality
   - State management and side effects

6. **Components Layer** (`components/oauth/`)
   - Reusable UI components
   - OAuth buttons and callback handlers

## Setup and Configuration

### Backend Configuration

1. **Environment Variables**
   Add the following to your `.env` file:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   OAUTH_SUCCESS_REDIRECT_URL=http://localhost:3000/auth/oauth/callback
   ```

2. **OAuth Provider Setup**
   - **Google**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/)
   - **GitHub**: Create OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)

### Frontend Configuration

No additional configuration required. The OAuth system automatically detects supported providers and configures itself.

## Usage

### Basic OAuth Integration

#### 1. Using the OAuth Buttons Component

```tsx
import { OAuthLoginButtons } from '@/features/auth/components/oauth';

function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      {/* Traditional login form */}
      
      {/* OAuth Buttons */}
      <OAuthLoginButtons
        providers={['google', 'github']}
        returnUrl="/dashboard"
        onSuccess={(result) => {
          console.log('OAuth success:', result);
        }}
        onError={(error) => {
          console.error('OAuth error:', error);
        }}
      />
    </div>
  );
}
```

#### 2. Using Individual OAuth Buttons

```tsx
import { OAuthButton } from '@/features/auth/components/oauth';

function CustomLoginForm() {
  return (
    <div>
      <OAuthButton
        provider="google"
        variant="outline"
        returnUrl="/dashboard"
      />
      
      <OAuthButton
        provider="github"
        variant="outline"
        returnUrl="/dashboard"
      />
    </div>
  );
}
```

#### 3. Using OAuth Hooks

```tsx
import { useOAuth } from '@/features/auth/hooks';

function CustomOAuthHandler() {
  const { isLoading, error, initiateLogin, clearError } = useOAuth();

  const handleGoogleLogin = async () => {
    await initiateLogin('google', '/dashboard');
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <button onClick={handleGoogleLogin} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login with Google'}
      </button>
    </div>
  );
}
```

### OAuth Callback Handling

The OAuth callback is automatically handled by the `OAuthCallbackHandler` component:

```tsx
// pages/auth/oauth/callback/page.tsx
import { OAuthCallbackHandler } from '@/features/auth/components/oauth';

export default function OAuthCallbackPage() {
  return <OAuthCallbackHandler />;
}
```

### Integration with Existing Login Form

The existing `LoginForm` component has been updated to include OAuth options:

```tsx
import { LoginForm } from '@/features/auth/components/forms';

function LoginPage() {
  return (
    <div>
      <LoginForm />
      {/* OAuth buttons are automatically included */}
    </div>
  );
}
```

## API Endpoints

### OAuth Authorization

**Endpoint**: `GET /oauth/{provider}/authorize`

**Parameters**:
- `provider`: `google` | `github`

**Description**: Initiates OAuth flow and redirects to provider

**Response**: Redirect to OAuth provider authorization page

### OAuth Callback

**Endpoint**: `GET /oauth/{provider}/callback`

**Parameters**:
- `provider`: `google` | `github`
- `code`: Authorization code from provider
- `state`: State parameter for security

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "is_active": true,
    "is_verified": true
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "provider": "google"
}
```

## Security Features

### 1. State Parameter Validation
- Prevents CSRF attacks
- Includes timestamp for replay attack prevention
- Cryptographically secure random nonce

### 2. Token Management
- Secure token storage
- Automatic token refresh
- Token revocation on logout

### 3. User Account Linking
- Automatic account linking by email
- Support for multiple OAuth providers per user
- Prevents duplicate accounts

## Error Handling

### OAuth Errors

The system handles various OAuth errors:

- `access_denied`: User denied access
- `invalid_request`: Malformed request
- `server_error`: Provider server error
- `temporarily_unavailable`: Service unavailable

### Error Display

```tsx
import { OAuthErrorDisplay } from '@/features/auth/components/oauth';

function LoginForm() {
  const [error, setError] = useState(null);

  return (
    <div>
      <OAuthErrorDisplay
        error={error}
        provider="google"
        onRetry={() => setError(null)}
      />
    </div>
  );
}
```

## Customization

### Adding New OAuth Providers

1. **Backend Configuration**:
   ```python
   # apps/auth/config/oauth_config.py
   oauth.register(
       name="microsoft",
       client_id=settings.MICROSOFT_CLIENT_ID,
       client_secret=settings.MICROSOFT_CLIENT_SECRET,
       # ... additional configuration
   )
   ```

2. **Frontend Configuration**:
   ```typescript
   // Update OAuthProvider type
   export type OAuthProvider = 'google' | 'github' | 'microsoft';

   // Add provider configuration
   export const OAUTH_PROVIDERS_CONFIG = {
     // ... existing providers
     microsoft: {
       name: 'microsoft' as const,
       displayName: 'Microsoft',
       icon: 'microsoft',
       color: '#0078d4',
       authorizeUrl: '/oauth/microsoft/authorize',
       scopes: ['openid', 'profile', 'email']
     }
   };
   ```

### Custom OAuth Buttons

```tsx
import { useOAuth } from '@/features/auth/hooks';

function CustomGoogleButton() {
  const { initiateLogin, isLoading } = useOAuth();

  return (
    <button
      onClick={() => initiateLogin('google')}
      disabled={isLoading}
      className="custom-google-button"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}
```

## Testing

### Unit Tests

```typescript
// Test OAuth service
describe('OAuthService', () => {
  it('should initiate OAuth login', async () => {
    const service = new OAuthService();
    const result = await service.initiateLogin('google', '/dashboard');
    expect(result.isSuccess).toBe(true);
  });
});

// Test OAuth hooks
describe('useOAuth', () => {
  it('should handle OAuth callback', async () => {
    const { result } = renderHook(() => useOAuth());
    await act(async () => {
      await result.current.handleCallback({
        provider: 'google',
        code: 'auth_code',
        state: 'valid_state'
      });
    });
    expect(result.current.error).toBeNull();
  });
});
```

### Integration Tests

```typescript
// Test OAuth flow end-to-end
describe('OAuth Integration', () => {
  it('should complete Google OAuth flow', async () => {
    // Mock OAuth provider response
    // Simulate OAuth callback
    // Verify user authentication
  });
});
```

## Best Practices

### 1. Security
- Always validate state parameters
- Use HTTPS in production
- Implement proper CORS policies
- Store tokens securely

### 2. User Experience
- Provide clear error messages
- Show loading states
- Handle network failures gracefully
- Support accessibility requirements

### 3. Performance
- Lazy load OAuth components
- Cache provider configurations
- Minimize API calls
- Use efficient state management

### 4. Maintenance
- Keep OAuth libraries updated
- Monitor OAuth provider changes
- Log OAuth events for debugging
- Document configuration changes

## Troubleshooting

### Common Issues

1. **Invalid Client Error**
   - Check client ID and secret
   - Verify OAuth app configuration
   - Ensure correct redirect URIs

2. **State Mismatch Error**
   - Check state generation and storage
   - Verify timestamp validation
   - Ensure proper cleanup

3. **User Creation Failures**
   - Check database permissions
   - Verify user model fields
   - Review validation rules

### Debug Mode

Enable OAuth debugging by setting:
```env
DEBUG=true
OAUTH_DEBUG=true
```

## Migration Guide

### From Existing OAuth Implementation

1. Update imports:
   ```typescript
   // Before
   import { SocialLoginButtons } from './SocialLoginButtons';

   // After
   import { OAuthLoginButtons } from '@/features/auth/components/oauth';
   ```

2. Update component usage:
   ```tsx
   // Before
   <SocialLoginButtons onGoogleLogin={handleGoogle} />

   // After
   <OAuthLoginButtons providers={['google', 'github']} />
   ```

3. Update callbacks:
   ```typescript
   // Before: Manual callback handling
   // After: Automatic with OAuthCallbackHandler
   ```

## Support and Resources

- **Documentation**: See this README and inline code comments
- **Issues**: Report bugs in the project repository
- **Examples**: Check the demo application
- **Community**: Join the Discord/Slack channel for help

---

This OAuth integration provides a complete, secure, and maintainable solution for social authentication in your web application.
