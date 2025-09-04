import type { AppDispatch } from '@/store';
import { IResult } from '@dhs-hub/core/shared/types/IResult';
import { TokenEntity, TokenType } from '../../domain/entities/Token';
import { IOAuthAuthResult, IOAuthError, IOAuthRepository, IOAuthState, OAuthProvider } from '../../domain/repositories/IOAuthRepository';
import { authApi } from '../api/authApi';
import { UserMapper } from '../mappers';

// Store reference - this will need to be injected or imported from the store setup
let storeDispatch: AppDispatch | null = null;

// Function to set the store dispatch (to be called during app initialization)
export const setOAuthRepositoryDispatch = (dispatch: AppDispatch) => {
  storeDispatch = dispatch;
};

/**
 * Abstract base OAuth repository interface
 * Provides common functionality for OAuth repositories
 */
export abstract class AbstractOAuthRepository implements IOAuthRepository {
  /**
   * Store OAuth state temporarily for security validation
   */
  abstract storeState(state: IOAuthState): Promise<IResult<void>>;

  /**
   * Retrieve stored OAuth state by ID
   */
  abstract getState(stateId: string): Promise<IResult<IOAuthState>>;

  /**
   * Clear OAuth state after successful validation
   */
  abstract clearState(stateId: string): Promise<IResult<void>>;

  /**
   * Exchange authorization code for access token with provider
   */
  abstract exchangeCodeForToken(
    provider: OAuthProvider,
    code: string,
    state: string
  ): Promise<IResult<IOAuthAuthResult>>;

  /**
   * Validate state timestamp to prevent replay attacks
   */
  protected validateStateTimestamp(state: IOAuthState, maxAgeMinutes: number = 10): boolean {
    const now = Date.now();
    const stateAge = now - state.timestamp;
    const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds

    return stateAge <= maxAge;
  }

  /**
   * Generate secure random state for OAuth flow
   */
  protected generateSecureState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * RTK Query-based OAuth repository implementation
 * Handles OAuth data access through API endpoints
 */
export class OAuthRTKRepository extends AbstractOAuthRepository {
  private readonly stateStorage: Map<string, IOAuthState> = new Map();
  private readonly STATE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

  async storeState(state: IOAuthState): Promise<IResult<void>> {
    try {
      const stateId = this.generateSecureState();

      // Store in memory (in production, use secure storage)
      this.stateStorage.set(stateId, {
        ...state,
        timestamp: Date.now()
      });

      // Clean up expired states
      this.cleanupExpiredStates();

      return {
        isSuccess: true,
        isFailure: false,
        value: undefined
      };
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  async getState(stateId: string): Promise<IResult<IOAuthState>> {
    try {
      const state = this.stateStorage.get(stateId);

      if (!state) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('OAuth state not found or expired')
        };
      }

      // Validate state is not expired
      if (!this.validateStateTimestamp(state)) {
        this.stateStorage.delete(stateId);
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('OAuth state has expired')
        };
      }

      return {
        isSuccess: true,
        isFailure: false,
        value: state
      };
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  async clearState(stateId: string): Promise<IResult<void>> {
    try {
      this.stateStorage.delete(stateId);

      return {
        isSuccess: true,
        isFailure: false,
        value: undefined
      };
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  async exchangeCodeForToken(
    provider: OAuthProvider,
    code: string,
    state: string
  ): Promise<IResult<IOAuthAuthResult>> {
    try {
      // Use RTK Query mutation to call backend OAuth callback endpoint
      // Create the mutation action
      const mutationAction = authApi.endpoints.oauthCallback.initiate({
        provider,
        code,
        state
      });

      // If we have access to store dispatch, use it
      if (storeDispatch) {
        const result = await storeDispatch(mutationAction).unwrap();

        // Clear the state after successful exchange
        await this.clearState(state);

        // Create proper domain entities using available TokenData properties
        const userEntity = UserMapper.fromApiUserResponse({
          id: result.user_id,
          email: result.profile_info?.email as string || `user${result.user_id}@oauth.local`,
          is_active: true,
          is_email_verified: result.is_email_verified,
          two_factor_enabled: result.two_factor_enabled,
        });

        const tokenEntity = TokenEntity.create(
          result.user_id.toString(),
          result.access_token,
          TokenType.ACCESS,
          result.expires_in || 3600
        );

        return {
          isSuccess: true,
          isFailure: false,
          value: {
            user: userEntity,
            provider,
            token: tokenEntity,
          }
        };
      } else {
        // Fallback to direct fetch if store dispatch is not available
        const response = await fetch(`/oauth/${provider}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Clear the state after successful exchange
        await this.clearState(state);

        // Create proper domain entities
        const userEntity = UserMapper.fromApiUserResponse(result.user);
        const tokenEntity = TokenEntity.create(
          userEntity.id,
          result.access_token,
          TokenType.ACCESS,
          result.expires_in || 3600
        );

        return {
          isSuccess: true,
          isFailure: false,
          value: {
            user: userEntity,
            provider,
            token: tokenEntity,
            refreshToken: result.refresh_token
          }
        };
      }
    } catch (error: unknown) {
      const isErrorWithDetails = (err: unknown): err is { code?: string; message?: string; details?: Record<string, unknown> } => {
        return typeof err === 'object' && err !== null;
      };

      const errorDetails = isErrorWithDetails(error) ? error : {};
      const errorMessage = errorDetails.message || (error instanceof Error ? error.message : 'Failed to exchange authorization code for token');

      const oauthError: IOAuthError = {
        code: errorDetails.code || 'OAUTH_EXCHANGE_FAILED',
        message: errorMessage,
        provider,
        details: errorDetails.details || {}
      };

      return {
        isSuccess: false,
        isFailure: true,
        error: new Error(oauthError.message)
      };
    }
  }

  /**
   * Clean up expired OAuth states to prevent memory leaks
   */
  private cleanupExpiredStates(): void {
    const now = Date.now();

    for (const [stateId, state] of this.stateStorage.entries()) {
      if (now - state.timestamp > this.STATE_EXPIRY_MS) {
        this.stateStorage.delete(stateId);
      }
    }
  }
}

/**
 * OAuth repository factory implementation
 */
export class OAuthRepositoryFactory {
  static create(): OAuthRTKRepository {
    return new OAuthRTKRepository();
  }
}
