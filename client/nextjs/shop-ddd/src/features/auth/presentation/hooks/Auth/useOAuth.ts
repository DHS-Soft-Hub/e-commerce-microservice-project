'use client';

import { useAppDispatch } from '@/hooks/redux';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthServiceFactory } from '../../../infrastructure/factories/AuthServiceFactory';
import { UserMapper } from '../../../infrastructure/mappers/UserMapper';
import {
  IOAuthAuthResult,
  IOAuthCallbackParams,
  IOAuthHookReturn,
  OAuthProvider
} from '../../../infrastructure/types/oauth.types';
import { initializeOAuthRepository } from '../../../infrastructure/utils/oauthInit';
import {
  setAuthenticated,
  setUser,
  updateLastActivity
} from '../../stores/slices/authSlice';

/**
 * Custom hook for OAuth authentication
 * Provides state management and methods for OAuth flows
 */
export const useOAuth = (): IOAuthHookReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const oauthService = AuthServiceFactory.createOAuthService();

  // Initialize OAuth repository with store dispatch
  useEffect(() => {
    initializeOAuthRepository();
  }, []);

  /**
   * Clear any existing error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initiate OAuth login flow
   */
  const initiateLogin = useCallback(async (
    provider: OAuthProvider,
    returnUrl?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await oauthService.initiateLogin(provider, returnUrl);

      if (result.isSuccess && result.value) {
        // Redirect to OAuth provider
        window.location.href = result.value;
      } else {
        const errorMessage = result.error?.message || 'Failed to initiate OAuth login';
        setError(errorMessage);
        console.error('OAuth initiation failed:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown OAuth error';
      setError(errorMessage);
      console.error('OAuth initiation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [oauthService]);

  /**
   * Handle OAuth callback and complete authentication
   */
  const handleCallback = useCallback(async (
    params: IOAuthCallbackParams
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await oauthService.handleCallback(params);

      if (result.isSuccess && result.value) {
        const authResult: IOAuthAuthResult = result.value;

        // Convert OAuth user to presentation ExtendedUser for Redux state
        const serializableUser = UserMapper.toSerializable(authResult.user);

        // Update auth context with the user and tokens
        dispatch(setUser(serializableUser));
        dispatch(setAuthenticated(true));
        dispatch(updateLastActivity(new Date().toISOString()));

        // Redirect to success page or return URL
        const returnUrl = '/dashboard'; // Default return URL
        router.push(returnUrl);
      } else {
        const errorMessage = result.error?.message || 'OAuth authentication failed';
        setError(errorMessage);

        // Redirect to login page with error
        router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown OAuth callback error';
      setError(errorMessage);

      // Redirect to login page with error
      router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`);
      console.error('OAuth callback error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [oauthService, dispatch, router]);

  return {
    isLoading,
    error,
    initiateLogin,
    handleCallback,
    clearError
  };
};

/**
 * Hook for getting OAuth providers configuration
 */
export const useOAuthProviders = () => {
  const oauthService = AuthServiceFactory.createOAuthService();
  return oauthService.getProviders();
};

/**
 * Helper hook for parsing OAuth callback URL parameters
 */
export const useOAuthCallbackParams = (): IOAuthCallbackParams | null => {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname;

  // Extract provider from pathname (e.g., /auth/oauth/google/callback -> google)
  const pathParts = pathname.split('/');
  const providerIndex = pathParts.findIndex(part => part === 'oauth');
  const provider = pathParts[providerIndex + 1] as OAuthProvider;

  if (!provider || !['google', 'github'].includes(provider)) {
    return null;
  }

  return {
    provider,
    code: urlParams.get('code') || undefined,
    state: urlParams.get('state') || undefined,
    error: urlParams.get('error') || undefined,
    error_description: urlParams.get('error_description') || undefined
  };
};
