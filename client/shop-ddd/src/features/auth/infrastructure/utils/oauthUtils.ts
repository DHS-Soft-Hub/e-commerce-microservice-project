/**
 * OAuth Utility Functions
 * Helper functions for OAuth-related operations
 */

import { OAuthProvider } from '../../infrastructure/types';

/**
 * OAuth Provider Configurations
 * Static configuration for supported OAuth providers
 */
export const OAUTH_PROVIDERS_CONFIG = {
  google: {
    name: 'google' as const,
    displayName: 'Google',
    icon: 'google',
    color: '#db4437',
    brandColor: '#4285f4',
    authorizeUrl: '/oauth/google/authorize',
    scopes: ['openid', 'profile', 'email']
  },
  github: {
    name: 'github' as const,
    displayName: 'GitHub',
    icon: 'github',
    color: '#333333',
    brandColor: '#24292e',
    authorizeUrl: '/oauth/github/authorize',
    scopes: ['user:email', 'read:user']
  }
} as const;

/**
 * Get OAuth provider configuration
 */
export const getOAuthProviderConfig = (provider: OAuthProvider) => {
  return OAUTH_PROVIDERS_CONFIG[provider];
};

/**
 * Generate OAuth state parameter
 */
export const generateOAuthState = (provider: OAuthProvider, returnUrl?: string): string => {
  const state = {
    provider,
    returnUrl,
    nonce: generateSecureNonce(),
    timestamp: Date.now()
  };

  return btoa(JSON.stringify(state));
};

/**
 * Parse OAuth state parameter
 */
export const parseOAuthState = (stateParam: string) => {
  try {
    const decoded = atob(stateParam);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse OAuth state:', error);
    return null;
  }
};

/**
 * Generate secure nonce for OAuth flow
 */
export const generateSecureNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate OAuth callback URL parameters
 */
export const validateOAuthCallback = (searchParams: URLSearchParams) => {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    return {
      isValid: false,
      error: error,
      errorDescription: errorDescription
    };
  }

  if (!code || !state) {
    return {
      isValid: false,
      error: 'missing_parameters',
      errorDescription: 'Missing required OAuth callback parameters'
    };
  }

  return {
    isValid: true,
    code,
    state
  };
};

/**
 * Build OAuth authorization URL
 */
export const buildOAuthUrl = (
  provider: OAuthProvider,
  state?: string,
  additionalParams?: Record<string, string>
): string => {
  const config = getOAuthProviderConfig(provider);
  if (!config) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const baseUrl = `${window.location.origin}${config.authorizeUrl}`;
  const url = new URL(baseUrl);

  if (state) {
    url.searchParams.set('state', state);
  }

  if (config.scopes?.length) {
    url.searchParams.set('scope', config.scopes.join(' '));
  }

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
};

/**
 * Get OAuth provider from current URL
 */
export const getProviderFromUrl = (pathname: string): OAuthProvider | null => {
  // Extract provider from pathname like /auth/oauth/google/callback
  const pathParts = pathname.split('/');
  const oauthIndex = pathParts.findIndex(part => part === 'oauth');

  if (oauthIndex === -1 || oauthIndex + 1 >= pathParts.length) {
    return null;
  }

  const provider = pathParts[oauthIndex + 1];

  if (provider === 'google' || provider === 'github') {
    return provider;
  }

  return null;
};

/**
 * OAuth error messages mapping
 */
export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'You denied access to your account. Please try again if you want to continue.',
  invalid_request: 'The authentication request was invalid. Please try again.',
  unauthorized_client: 'This application is not authorized. Please contact support.',
  unsupported_response_type: 'The authentication method is not supported.',
  invalid_scope: 'The requested permissions are not available.',
  server_error: 'Authentication server error. Please try again later.',
  temporarily_unavailable: 'Authentication service is temporarily unavailable.',
  invalid_grant: 'The authorization code is invalid or has expired.',
  invalid_client: 'Invalid client credentials.',
  network_error: 'Network error occurred. Please check your connection and try again.',
  unknown_error: 'An unknown error occurred during authentication.'
};

/**
 * Get user-friendly error message
 */
export const getOAuthErrorMessage = (errorCode: string): string => {
  return OAUTH_ERROR_MESSAGES[errorCode] || OAUTH_ERROR_MESSAGES.unknown_error;
};

/**
 * Check if OAuth is supported in current environment
 */
export const isOAuthSupported = (): boolean => {
  return typeof window !== 'undefined' &&
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function';
};

/**
 * Local storage keys for OAuth
 */
export const OAUTH_STORAGE_KEYS = {
  STATE: 'oauth_state',
  RETURN_URL: 'oauth_return_url',
  PROVIDER: 'oauth_provider'
} as const;
