import { TokenEntity, UserEntity } from '../../domain/entities';

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'github';

/**
 * OAuth provider configuration interface
 */
export interface IOAuthProviderConfig {
    name: OAuthProvider;
    displayName: string;
    icon: string;
    color: string;
    authorizeUrl: string;
    scopes?: string[];
}

/**
 * OAuth authentication result interface
 */
export interface IOAuthAuthResult {
    user: UserEntity;
    provider: OAuthProvider;
    token?: TokenEntity;
    refreshToken?: string;
}

/**
 * OAuth callback parameters interface
 */
export interface IOAuthCallbackParams {
    code?: string;
    state?: string;
    error?: string;
    error_description?: string;
    provider: OAuthProvider;
}

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
 * OAuth error interface
 */
export interface IOAuthError {
    code: string;
    message: string;
    provider: OAuthProvider;
    details?: Record<string, unknown>;
}

/**
 * OAuth hook return interface
 */
export interface IOAuthHookReturn {
    isLoading: boolean;
    error: string | null;
    initiateLogin: (provider: OAuthProvider, returnUrl?: string) => Promise<void>;
    handleCallback: (params: IOAuthCallbackParams) => Promise<void>;
    clearError: () => void;
}

/**
 * OAuth component props interface
 */
export interface IOAuthComponentProps {
    providers?: OAuthProvider[];
    onSuccess?: (result: IOAuthAuthResult) => void;
    onError?: (error: IOAuthError) => void;
    isLoading?: boolean;
    className?: string;
    returnUrl?: string;
}
