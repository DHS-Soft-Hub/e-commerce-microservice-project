import { TokenStorageUtils } from '@/utils/tokenStorage';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  clearAuth,
  setAuthenticated,
  setUser
} from '../slices/authSlice';

// Create the listener middleware instance
export const authMiddleware = createListenerMiddleware();

/**
 * Auth Middleware - Centralized Token Management
 * 
 * This middleware handles ALL token storage operations to ensure consistency:
 * - Token storage when user logs in
 * - Token cleanup when user logs out
 * - Auth state initialization from storage
 * 
 * Components and other parts of the app should ONLY read auth state,
 * never directly manipulate tokens.
 */

// Handle user data storage when user is set
authMiddleware.startListening({
  actionCreator: setUser,
  effect: async (action, { dispatch: _dispatch }) => {
    const user = action.payload;
    try {
      // Note: Token storage is handled separately via login actions
      // This just logs the user setting for debugging
      console.debug('User set in auth state:', user.email);
    } catch (error) {
      console.error('Failed to process user data:', error);
    }
  },
});

// Handle logout and auth clearing - CENTRALIZED TOKEN CLEANUP
authMiddleware.startListening({
  actionCreator: clearAuth,
  effect: async (_action, { dispatch: _dispatch }) => {
    // Clear stored auth data - This is the ONLY place tokens should be cleared
    try {
      TokenStorageUtils.clearTokens();
      console.debug('Auth tokens cleared via middleware');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }

    // Redirect to login page if needed
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify-email', '/auth/reset-password', '/auth/oauth/callback', '/'];

      if (!publicPaths.includes(currentPath)) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
  },
});

/**
 * Initialize auth state from storage - CENTRALIZED TOKEN READING
 * This is called once on app startup to restore auth state
 */
export const initializeAuthFromStorage = () => (dispatch: (action: unknown) => void) => {
  try {
    const accessToken = TokenStorageUtils.getAccessToken();

    if (accessToken && !TokenStorageUtils.isTokenExpired()) {
      // Set user and authentication state
      dispatch(setAuthenticated(true));
      console.debug('Auth state initialized from storage');
    } else if (TokenStorageUtils.isTokenExpired()) {
      // Token is expired, clear stored data
      TokenStorageUtils.clearTokens();
      console.debug('Expired token cleared during initialization');
    }
  } catch (error) {
    console.error('Failed to initialize auth state:', error);
    // Clear invalid stored data
    TokenStorageUtils.clearTokens();
  }
};
