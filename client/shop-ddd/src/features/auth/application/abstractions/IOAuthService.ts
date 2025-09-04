import { IResult } from '@dhs-hub/core';
import {
  IOAuthAuthResult,
  IOAuthCallbackParams,
  IOAuthProviderConfig,
  IOAuthState,
  OAuthProvider
} from '../../infrastructure/types/oauth.types';

export interface IOAuthService {
  /**
   * Get all available OAuth providers
   */
  getProviders(): IOAuthProviderConfig[];

  /**
   * Get specific provider configuration
   */
  getProvider(provider: OAuthProvider): IOAuthProviderConfig | undefined;

  /**
   * Initiate OAuth login flow
   */
  initiateLogin(provider: OAuthProvider, returnUrl?: string): Promise<IResult<string>>;

  /**
   * Handle OAuth callback and complete authentication
   */
  handleCallback(params: IOAuthCallbackParams): Promise<IResult<IOAuthAuthResult>>;

  /**
   * Get OAuth authorization URL for provider
   */
  getAuthorizationUrl(provider: OAuthProvider, state?: string): Promise<IResult<string>>;

  /**
   * Validate OAuth state parameter
   */
  validateState(state: string): Promise<IResult<IOAuthState>>;
}

/**
 * Abstract base OAuth service interface
 * Defines the contract for OAuth business logic operations
 */
export abstract class AbstractOAuthService implements IOAuthService {
  protected readonly providers: Map<OAuthProvider, IOAuthProviderConfig> = new Map();

  constructor() {
    this.initializeProviders();
  }

  /**
   * Get all available OAuth providers
   */
  getProviders(): IOAuthProviderConfig[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get specific provider configuration
   */
  getProvider(provider: OAuthProvider): IOAuthProviderConfig | undefined {
    return this.providers.get(provider);
  }

  /**
   * Initiate OAuth login flow
   */
  abstract initiateLogin(provider: OAuthProvider, returnUrl?: string): Promise<IResult<string>>;

  /**
   * Handle OAuth callback and complete authentication
   */
  abstract handleCallback(params: IOAuthCallbackParams): Promise<IResult<IOAuthAuthResult>>;

  /**
   * Get OAuth authorization URL for provider
   */
  abstract getAuthorizationUrl(provider: OAuthProvider, state?: string): Promise<IResult<string>>;

  /**
   * Validate OAuth state parameter
   */
  abstract validateState(state: string): Promise<IResult<IOAuthState>>;

  /**
   * Initialize supported OAuth providers
   */
  protected abstract initializeProviders(): void;

  /**
   * Validate provider is supported
   */
  protected validateProvider(provider: OAuthProvider): boolean {
    return this.providers.has(provider);
  }

  /**
   * Generate state parameter for OAuth flow
   */
  protected generateState(provider: OAuthProvider, returnUrl?: string): IOAuthState {
    return {
      provider,
      returnUrl,
      nonce: this.generateNonce(),
      timestamp: Date.now()
    };
  }

  /**
   * Generate cryptographically secure nonce
   */
  protected generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Build authorization URL with parameters
   */
  protected buildAuthorizationUrl(
    baseUrl: string,
    params: Record<string, string>
  ): string {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }
}

/**
 * OAuth service factory interface
 */
export interface IOAuthServiceFactory {
  create(): IOAuthService;
}

/**
 * Abstract OAuth service factory
 */
export abstract class AbstractOAuthServiceFactory implements IOAuthServiceFactory {
  abstract create(): IOAuthService;
}
