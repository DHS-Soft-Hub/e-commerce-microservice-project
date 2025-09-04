import { TokenStorageUtils } from '@/utils/tokenStorage';
import type { SerializedError } from '@reduxjs/toolkit';
import { createListenerMiddleware, isAnyOf, isRejectedWithValue, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../../infrastructure/api/authApi';
import {
  clearAuth
} from '../slices/authSlice';

// Create the listener middleware instance
export const tokenRefreshMiddleware = createListenerMiddleware();

/**
 * Token Refresh Middleware - Centralized Token Refresh Management
 * 
 * This middleware handles:
 * - Automatic token refresh on 401 errors
 * - Proactive token refresh before expiry
 * - Centralized token storage after refresh
 * - Proper error handling and auth state cleanup
 * 
 * All token refresh operations are centralized here to ensure consistency.
 */

// Track if refresh is already in progress to prevent multiple concurrent requests
let isRefreshing = false;
let refreshPromise: Promise<unknown> | null = null;

/**
 * Check if error is due to expired token
 */
const isTokenExpiredError = (error: unknown): boolean => {
  const errorObj = error as {
    status?: number;
    originalStatus?: number;
    data?: {
      code?: string;
      detail?: string;
    };
    message?: string;
  };

  return (errorObj?.status === 401) ||
    (errorObj?.originalStatus === 401) ||
    (errorObj?.data?.code === 'TOKEN_EXPIRED') ||
    (errorObj?.data?.detail?.includes('token') === true) ||
    (errorObj?.message?.includes('token expired') === true) ||
    (errorObj?.message?.includes('Unauthorized') === true);
};

/**
 * Handle API errors and attempt token refresh
 * Enhanced to handle retry after successful refresh
 */
tokenRefreshMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async (action: PayloadAction<unknown, string, { arg: unknown; requestId: string; requestStatus: 'rejected' }, SerializedError>, { dispatch, getState }) => {
    const error = action.payload;

    // Only handle token expiration errors
    if (!isTokenExpiredError(error)) {
      return;
    }

    // Prevent multiple concurrent refresh attempts
    if (isRefreshing) {
      return;
    }

    isRefreshing = true;

    try {
      // Get current auth state
      const state = getState() as { auth?: { isAuthenticated?: boolean } };
      const isAuthenticated = state.auth?.isAuthenticated;

      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      // Create the refresh promise using RTK Query
      refreshPromise = dispatch(authApi.endpoints.refreshToken.initiate()).unwrap();
      await refreshPromise;

      // The authMiddleware will handle token storage automatically
      // Optionally retry the original request here if needed

    } catch (refreshError: unknown) {
      const errorObj = refreshError as {
        status?: number;
        data?: { code?: string };
      };

      // Check if refresh failed due to refresh token being invalid/expired
      const isRefreshTokenInvalid = errorObj?.status === 401 ||
        errorObj?.status === 403 ||
        errorObj?.data?.code === 'REFRESH_TOKEN_EXPIRED' ||
        errorObj?.data?.code === 'REFRESH_TOKEN_INVALID';

      if (isRefreshTokenInvalid) {
        // Clear auth state and redirect to login
        dispatch(clearAuth());

        // Redirect to login page if needed
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify-email', '/auth/reset-password', '/auth/oauth/callback', '/'];

          if (!publicPaths.includes(currentPath)) {
            window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
      }

      throw refreshError;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  },
});

/**
 * Monitor successful auth operations and handle token storage
 * This ensures tokens are stored consistently after any auth operation
 */
tokenRefreshMiddleware.startListening({
  matcher: isAnyOf(
    authApi.endpoints.login.matchFulfilled,
    authApi.endpoints.refreshToken.matchFulfilled
  ),
  effect: async (action: PayloadAction<unknown>, { dispatch, getState }) => {
    const tokenData = action.payload as { access_token: string; expires_in?: number };

    if (tokenData?.access_token) {
      // CENTRALIZED TOKEN STORAGE - This is the only place where tokens are stored after API calls
      TokenStorageUtils.setAccessToken(tokenData.access_token);
      console.debug('Token stored via refresh middleware');
    }

    // Get token expiration time for scheduling next refresh
    const timeUntilExpiry = TokenStorageUtils.getTimeUntilExpiry();
    let refreshTime = 10 * 60 * 1000; // Default: 10 minutes

    if (timeUntilExpiry) {
      // Refresh when 80% of the token lifetime has passed or at least 5 minutes before expiry
      refreshTime = Math.min(timeUntilExpiry * 0.8, timeUntilExpiry - (5 * 60 * 1000));
      refreshTime = Math.max(refreshTime, 30 * 1000); // Minimum 30 seconds
    }

    // Schedule proactive token refresh
    const timeoutId = setTimeout(async () => {
      // Check if user is still authenticated
      const currentState = getState() as { auth?: { isAuthenticated?: boolean } };

      if (currentState.auth?.isAuthenticated && TokenStorageUtils.needsRefresh()) {
        try {
          await dispatch(authApi.endpoints.refreshToken.initiate()).unwrap();
          console.debug('Proactive token refresh completed');
        } catch (error) {
          console.error('Proactive token refresh failed:', error);
          dispatch(clearAuth());

          // Redirect to login if not on public page
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify-email', '/auth/reset-password', '/'];

            if (!publicPaths.includes(currentPath)) {
              window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
            }
          }
        }
      }
    }, refreshTime);

    // Store the timeout ID for cleanup if needed
    if (typeof window !== 'undefined') {
      (window as typeof window & { __tokenRefreshTimeout?: NodeJS.Timeout }).__tokenRefreshTimeout = timeoutId;
    }
  },
});

/**
 * Utility functions for token management
 */

/**
 * Check if current token needs refresh
 * Updated to work with TokenStorageUtils
 * 
 * Note: This function is also duplicated in useTokenRefresh.ts to avoid circular dependencies
 */
export const shouldRefreshToken = (): boolean => {
  try {
    const storedToken = TokenStorageUtils.getAccessToken();
    if (!storedToken) return false;

    // Use TokenStorageUtils methods instead of manual parsing
    return TokenStorageUtils.needsRefresh();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return false;
  }
};

/**
 * Check if current token is expired
 * 
 * Note: This function is also duplicated in useTokenRefresh.ts to avoid circular dependencies
 */
export const isTokenExpired = (): boolean => {
  try {
    const storedToken = TokenStorageUtils.getAccessToken();
    if (!storedToken) return true;

    // Use TokenStorageUtils method
    return TokenStorageUtils.isTokenExpired();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get time until token expires (in milliseconds)
 */
export const getTimeUntilTokenExpiry = (): number => {
  try {
    const timeUntilExpiry = TokenStorageUtils.getTimeUntilExpiry();
    return timeUntilExpiry ?? 0;
  } catch (error) {
    console.error('Error getting time until token expiry:', error);
    return 0;
  }
};
