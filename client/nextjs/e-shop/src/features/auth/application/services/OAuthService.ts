import { IResult } from '@dhs-hub/core';
import { IOAuthAuthResult, IOAuthRepository, IOAuthState, OAuthProvider } from '../../domain/repositories/IOAuthRepository';
import {
  IOAuthCallbackParams,
  IOAuthProviderConfig
} from '../../infrastructure/types/oauth.types';

import { IOAuthService } from '../abstractions';

/**
 * Implementation of IOAuthService
 * Provides OAuth authentication operations using repository pattern
 */
export class OAuthService implements IOAuthService {
  constructor(private readonly oauthRepository: IOAuthRepository) {
    if (!oauthRepository) {
      throw new Error('OAuthRepository is required for OAuthService');
    }
  }
  getProvider(provider: OAuthProvider): IOAuthProviderConfig | undefined {
    throw new Error('Method not implemented.');
  }

  /**
   * Get available OAuth providers
   */
  getProviders(): IOAuthProviderConfig[] {
    return [
      {
        name: 'google',
        displayName: 'Google',
        icon: '/icons/google.svg',
        color: '#DB4437',
        authorizeUrl: 'https://accounts.google.com/oauth/authorize',
        scopes: ['openid', 'email', 'profile']
      },
      {
        name: 'github',
        displayName: 'GitHub',
        icon: '/icons/github.svg',
        color: '#333',
        authorizeUrl: 'https://github.com/login/oauth/authorize',
        scopes: ['user:email']
      }
    ];
  }

  /**
   * Initiate OAuth login flow
   */
  async initiateLogin(provider: OAuthProvider, returnUrl?: string): Promise<IResult<string>> {
    try {
      const providerConfig = this.getProviders().find(p => p.name === provider);
      if (!providerConfig) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error(`Unsupported OAuth provider: ${provider}`)
        };
      }

      // Create OAuth state for security
      const stateData = {
        provider,
        returnUrl: returnUrl || '/dashboard',
        timestamp: Date.now(),
        nonce: this.generateNonce()
      };

      // Store state for later validation
      const storeResult = await this.oauthRepository.storeState(stateData);
      if (!storeResult.isSuccess) {
        return {
          isSuccess: false,
          isFailure: true,
          error: storeResult.error || new Error('Failed to store OAuth state')
        };
      }

      // Use the backend OAuth authorization endpoint
      // The backend will handle the redirect to the OAuth provider
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const authUrl = `${backendUrl}/auth/oauth/${provider}/authorize?state=${encodeURIComponent(stateData.nonce)}`;

      return {
        isSuccess: true,
        isFailure: false,
        value: authUrl
      };
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Generate a secure nonce for the OAuth state
   */
  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Handle OAuth callback after user authorization
   */
  async handleCallback(params: IOAuthCallbackParams): Promise<IResult<IOAuthAuthResult>> {
    try {
      if (!params.code || !params.state) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('Missing required OAuth callback parameters')
        };
      }

      const result = await this.oauthRepository.exchangeCodeForToken(
        params.provider,
        params.code,
        params.state
      );

      if (!result.isSuccess) {
        return result;
      }

      // Clear the state after successful exchange
      await this.oauthRepository.clearState(params.state);

      return result;
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Get authorization URL for OAuth provider
   */
  async getAuthorizationUrl(provider: OAuthProvider, state?: string): Promise<IResult<string>> {
    try {
      const providerConfig = this.getProviders().find(p => p.name === provider);
      if (!providerConfig) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error(`Unsupported OAuth provider: ${provider}`)
        };
      }

      // Use the backend OAuth authorization endpoint
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const authUrl = `${backendUrl}/oauth/${provider}/authorize${state ? `?state=${encodeURIComponent(state)}` : ''}`;

      return {
        isSuccess: true,
        isFailure: false,
        value: authUrl
      };
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Validate OAuth state
   */
  async validateState(state: string): Promise<IResult<IOAuthState>> {
    try {
      return await this.oauthRepository.getState(state);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }
}
