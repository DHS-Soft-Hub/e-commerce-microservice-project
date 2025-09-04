/**
 * Auth state selectors
 * Memoized selectors for accessing auth state from Redux store
 */

import type { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Base auth state selector
 */
export const selectAuth = (state: RootState) => state.auth;

/**
 * User selector
 */
export const selectUser = createSelector(
  selectAuth,
  (auth) => auth.user
);

/**
 * Authentication status selector
 */
export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth.isAuthenticated
);

/**
 * Auth token selector
 */
export const selectAuthToken = createSelector(
  selectAuth,
  (auth) => auth.token
);

/**
 * Loading state selector
 */
export const selectAuthLoading = createSelector(
  selectAuth,
  (auth) => auth.isLoading
);

/**
 * Error state selector
 */
export const selectAuthError = createSelector(
  selectAuth,
  (auth) => auth.error
);

/**
 * Last activity selector
 */
export const selectLastActivity = createSelector(
  selectAuth,
  (auth) => auth.lastActivity
);

/**
 * Combined auth status selector
 */
export const selectAuthStatus = createSelector(
  selectAuth,
  (auth) => ({
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
  })
);

/**
 * User profile selector
 */
export const selectUserProfile = createSelector(
  selectUser,
  (user) => user ? {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    isEmailVerified: user.is_email_verified,
    isActive: user.is_active,
    twoFactorEnabled: user.two_factor_enabled,
    lastLogin: user.last_login,
  } : null
);

/**
 * User permissions selector
 */
export const selectUserPermissions = createSelector(
  selectUser,
  (user) => user?.permissions || []
);

/**
 * User roles selector
 */
export const selectUserRoles = createSelector(
  selectUser,
  (user) => user?.roles || []
);

/**
 * Session validity selector
 */
export const selectSessionValid = createSelector(
  [selectIsAuthenticated, selectAuthToken, selectLastActivity],
  (isAuthenticated, token, lastActivity) => {
    if (!isAuthenticated || !token || !lastActivity) {
      return false;
    }

    // Check if token is expired (basic check)
    const now = new Date().getTime();
    const lastActivityTime = new Date(lastActivity).getTime();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes

    return (now - lastActivityTime) < sessionTimeout;
  }
);
