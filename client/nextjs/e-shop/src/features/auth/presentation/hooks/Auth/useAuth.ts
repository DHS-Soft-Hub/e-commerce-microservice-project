'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { TokenStorageUtils } from '@/utils/tokenStorage';
import { useCallback, useEffect, useState } from 'react';
import {
  AuthResult,
  LoginCredentials
} from '../../../domain/types/auth.domain.types';
import { UserMapper } from '../../../infrastructure/mappers/UserMapper';
import { LoginRequest, TokenData } from '../../../infrastructure/types/api.types';
import { getProfileInfoFromToken, getUserIdFromToken, getUserRolesFromToken } from '../../../infrastructure/utils/authUtils';
import { useAuthService } from '../../providers/AuthServiceProvider';
import { authActions } from '../../stores/slices/authSlice';

/**
 * Authentication hook that provides the same interface
 * This hook uses the AuthService through dependency injection
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(state => state.auth);

  // Get auth service instance from provider (dependency injection)
  const authService = useAuthService();

  // Loading states for different operations
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);

  // Extract additional data from JWT token for UI display (READ-ONLY)
  const profileInfo = authState.token ? getProfileInfoFromToken(authState.token) : null;
  const userId = authState.token ? getUserIdFromToken(authState.token) : null;

  // Derive role information from auth state or token (READ-ONLY)
  const tokenRoles = authState.token ? getUserRolesFromToken(authState.token) : [];
  const roles = authState.roles.length > 0 ? authState.roles : tokenRoles;
  const isClient = roles.includes('client');
  const isDeveloper = roles.includes('developer');
  const isAdmin = roles.includes('admin');
  const isProjectLead = roles.includes('project_lead');

  // Combined loading state
  const isLoading = authState.isLoading || isUserLoading || isLoginLoading || isLogoutLoading;

  // Check if token is expired using TokenStorageUtils (READ-ONLY)
  const isTokenExpiredCheck = useCallback(() => {
    if (!authState.token) return true;
    return TokenStorageUtils.isTokenExpired();
  }, [authState.token]);

  // Login function with automatic user type detection or explicit type
  const loginUser = useCallback(async (
    credentials: LoginRequest,
    _userType?: 'client' | 'developer' | 'basic'
  ): Promise<TokenData | null> => {
    try {
      setIsLoginLoading(true);

      // Convert LoginRequest to LoginCredentials
      const loginCredentials: LoginCredentials = {
        email: credentials.email,
        password: credentials.password,
        totp_code: credentials.totp_code || undefined
      };

      const result = await authService.login(loginCredentials);

      if (!result.isSuccess || !result.value) {
        throw new Error(result.error?.message || 'Login failed');
      }

      const authResult: AuthResult = result.value;

      // Convert UserEntity to User for Redux state using centralized mapper
      const user = UserMapper.toSerializable(authResult.user);

      // Update auth state with login result
      dispatch(authActions.setUser(user));
      dispatch(authActions.updateTokens({
        access_token: authResult.accessToken,
        token_type: 'Bearer',
        user_id: user.id,
        expires_in: 3600,
        roles: user.roles || [],
        permissions: [],
        profile_info: {},
        two_factor_enabled: user.two_factor_enabled,
        is_email_verified: user.is_email_verified
      }));

      // Return token data in expected format
      return {
        access_token: authResult.accessToken,
        token_type: 'Bearer',
        user_id: user.id,
        expires_in: 3600,
        roles: user.roles || [],
        permissions: [],
        profile_info: {},
        two_factor_enabled: user.two_factor_enabled,
        is_email_verified: user.is_email_verified
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoginLoading(false);
    }
  }, [authService, dispatch]);

  // Logout function
  const logoutUser = useCallback(async (): Promise<void> => {
    try {
      setIsLogoutLoading(true);

      const result = await authService.logout();

      if (!result.isSuccess) {
        console.error('Logout API failed:', result.error?.message);
      }

      // Clear auth state regardless of API result
      dispatch(authActions.logout());
    } catch (error) {
      // Force logout even if API call fails
      dispatch(authActions.logout());
      console.error('Logout failed, but user logged out locally:', error);
    } finally {
      setIsLogoutLoading(false);
    }
  }, [authService, dispatch]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const result = await authService.refreshToken();

      if (!result.isSuccess || !result.value) {
        console.error('Token refresh failed:', result.error?.message);
        dispatch(authActions.logout());
        return false;
      }

      const authResult: AuthResult = result.value;

      // Convert UserEntity to User for Redux state using centralized mapper
      const user = UserMapper.toSerializable(authResult.user);

      // Update tokens in state
      dispatch(authActions.updateTokens({
        access_token: authResult.accessToken,
        token_type: 'Bearer',
        user_id: user.id,
        expires_in: 3600,
        roles: user.roles || [],
        permissions: [],
        profile_info: {},
        two_factor_enabled: user.two_factor_enabled,
        is_email_verified: user.is_email_verified
      }));

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch(authActions.logout());
      return false;
    }
  }, [authService, dispatch]);

  // Get current user function
  const getCurrentUser = useCallback(async () => {
    try {
      setIsUserLoading(true);

      const result = await authService.getCurrentUser();

      if (result.isSuccess && result.value) {
        // Convert UserEntity to User for Redux state using centralized mapper
        const user = UserMapper.toSerializable(result.value);
        dispatch(authActions.setUser(user));
        return user;
      }

      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    } finally {
      setIsUserLoading(false);
    }
  }, [authService, dispatch]);

  // Initialize auth state from storage on mount
  useEffect(() => {
    if (authState.token && !isTokenExpiredCheck()) {
      // Token exists and is valid, fetch current user
      getCurrentUser();
    } else if (authState.token && isTokenExpiredCheck()) {
      // Token exists but expired, try to refresh
      refreshToken();
    }
  }, []); // Only run on mount

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!authState.token || isTokenExpiredCheck()) return;

    const timeUntilExpiry = TokenStorageUtils.getTimeUntilExpiry();
    if (!timeUntilExpiry) return;

    // Refresh when 80% of the token lifetime has passed or at least 5 minutes before expiry
    const refreshTime = Math.min(timeUntilExpiry * 0.8, timeUntilExpiry - (5 * 60 * 1000));
    const finalRefreshTime = Math.max(refreshTime, 30 * 1000); // Minimum 30 seconds

    const timer = setTimeout(() => {
      if (authState.isAuthenticated && !isTokenExpiredCheck()) {
        refreshToken();
      }
    }, finalRefreshTime);

    return () => clearTimeout(timer);
  }, [authState.token, authState.isAuthenticated, refreshToken, isTokenExpiredCheck]);

  return {
    // User information
    user: authState.user,
    userId: authState.user?.id || userId,
    clientId: profileInfo?.client_id,
    developerId: profileInfo?.developer_id,

    // Authentication state
    isAuthenticated: authState.isAuthenticated && !isTokenExpiredCheck(),
    isLoading,
    token: authState.token,
    isTokenExpired: isTokenExpiredCheck,

    // Role information
    roles,
    isClient,
    isDeveloper,
    isAdmin,
    isProjectLead,

    // Profile information
    profileInfo: authState.profileInfo,
    permissions: authState.permissions,

    // Two-factor authentication
    twoFactorEnabled: authState.twoFactorEnabled,
    isEmailVerified: authState.isEmailVerified,

    // Actions
    login: loginUser,
    logout: logoutUser,
    refreshToken,
    getCurrentUser,

    // Auth state management
    clearAuth: () => dispatch(authActions.clearAuth()),
    updateLastActivity: () => dispatch(authActions.updateLastActivity(new Date().toISOString())),

    // Error handling
    error: authState.error,
    clearError: () => dispatch(authActions.clearError()),
  };
}