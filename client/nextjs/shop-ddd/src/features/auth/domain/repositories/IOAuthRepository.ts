import { IResult } from '@dhs-hub/core/shared/types/IResult';

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'github';

/**
 * OAuth state interface for storing temporary data
 */
export interface IOAuthState {
    provider: OAuthProvider;
    returnUrl?: string;
    nonce?: string;
    timestamp: number;
}

/**
 * OAuth authentication result interface
 */
export interface IOAuthAuthResult {
    user: import('../entities/User').UserEntity;
    provider: OAuthProvider;
    token?: import('../entities/Token').TokenEntity;
    refreshToken?: string;
}

/**
 * OAuth error interface
 */
export interface IOAuthError {
    code: string;
    message: string;
    provider: OAuthProvider;
    details?: Record<string, unknown>;
}

/**
 * Domain OAuth repository interface
 * Defines the contract for OAuth data access operations
 */
export interface IOAuthRepository {
    /**
     * Store OAuth state temporarily for security validation
     */
    storeState(state: IOAuthState): Promise<IResult<void>>;

    /**
     * Retrieve stored OAuth state by ID
     */
    getState(stateId: string): Promise<IResult<IOAuthState>>;

    /**
     * Clear OAuth state after successful validation
     */
    clearState(stateId: string): Promise<IResult<void>>;

    /**
     * Exchange authorization code for access token with provider
     */
    exchangeCodeForToken(
        provider: OAuthProvider,
        code: string,
        state: string
    ): Promise<IResult<IOAuthAuthResult>>;
}
