import { TokenStorageUtils } from '@/utils/tokenStorage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../../infrastructure/api/authApi';
import { UserMapper } from '../../../infrastructure/mappers/UserMapper';
import { TokenData } from '../../../infrastructure/types/api.types';
import { AuthState, User } from '../../types/auth.types';

// Utility function to get token from storage using TokenStorageUtils
const getTokenFromStorage = (): string | null => {
  return TokenStorageUtils.getAccessToken();
};

// Utility function to set token in storage using TokenStorageUtils
const setTokenInStorage = (token: string | null, rememberMe?: boolean) => {
  if (token) {
    TokenStorageUtils.setAccessToken(token, rememberMe);
  } else {
    TokenStorageUtils.clearTokens();
  }
};

// Initialize state from storage if available (only in browser)
const token = typeof window !== 'undefined' ? getTokenFromStorage() : null;

const initialState: AuthState = {
  user: null,
  token,
  refreshToken: null,
  isAuthenticated: Boolean(token),
  isLoading: false,
  error: null,
  lastActivity: null,
  profileInfo: {},
  roles: [],
  permissions: [],
  twoFactorEnabled: false,
  isEmailVerified: false,
};

/**
 * Auth slice for Redux state management
 * Handles authentication state updates with RTK Query integration
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear auth state
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
      state.isLoading = false;
      state.profileInfo = {};
      state.roles = [];
      state.permissions = [];
      state.twoFactorEnabled = false;
      state.isEmailVerified = false;
      setTokenInStorage(null);
    },

    // Set authentication from token data
    setAuthFromTokenData: (state, action: PayloadAction<TokenData>) => {
      const tokenData = action.payload;
      state.token = tokenData.access_token;
      state.isAuthenticated = true;
      state.roles = tokenData.roles;
      state.permissions = tokenData.permissions;
      state.profileInfo = tokenData.profile_info;
      state.twoFactorEnabled = tokenData.two_factor_enabled;
      state.isEmailVerified = tokenData.is_email_verified;
      state.lastActivity = new Date().toISOString();
      state.error = null;
      // Note: Token storage should be handled by middleware, not here
    },

    // Set user action
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Update auth state fields from user data
      state.isEmailVerified = action.payload.is_email_verified;
      state.twoFactorEnabled = action.payload.two_factor_enabled;
      state.roles = action.payload.roles;
      state.permissions = action.payload.permissions;
    },

    // Rehydrate user from storage (when app starts)
    rehydrateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // Rehydrate auth state from storage (when app starts in browser)
    rehydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = getTokenFromStorage();
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },

    // Update user action
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update auth state fields if they're included in the update
        if ('is_email_verified' in action.payload) {
          state.isEmailVerified = action.payload.is_email_verified!;
        }
        if ('two_factor_enabled' in action.payload) {
          state.twoFactorEnabled = action.payload.two_factor_enabled!;
        }
        if ('roles' in action.payload) {
          state.roles = action.payload.roles!;
        }
        if ('permissions' in action.payload) {
          state.permissions = action.payload.permissions!;
        }
      }
    },

    // Update tokens
    updateTokens: (state, action: PayloadAction<TokenData>) => {
      const tokenData = action.payload;
      state.token = tokenData.access_token;
      state.roles = tokenData.roles;
      state.permissions = tokenData.permissions;
      state.profileInfo = tokenData.profile_info;
      state.twoFactorEnabled = tokenData.two_factor_enabled;
      state.isEmailVerified = tokenData.is_email_verified;
      // Note: Token storage should be handled by middleware, not here
    },

    // Clear error action
    clearError: (state) => {
      state.error = null;
    },

    // Update last activity
    updateLastActivity: (state, action: PayloadAction<string>) => {
      state.lastActivity = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set authentication state
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    // Set error action
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
      state.isLoading = false;
      state.profileInfo = {};
      state.roles = [];
      state.permissions = [];
      state.twoFactorEnabled = false;
      state.isEmailVerified = false;
      setTokenInStorage(null);
    },
  },
  extraReducers: (builder) => {
    // Handle login mutation
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        const tokenData = action.payload;
        state.token = tokenData.access_token;
        state.isAuthenticated = true;
        state.roles = tokenData.roles;
        state.permissions = tokenData.permissions;
        state.profileInfo = tokenData.profile_info;
        state.twoFactorEnabled = tokenData.two_factor_enabled;
        state.isEmailVerified = tokenData.is_email_verified;
        state.lastActivity = new Date().toISOString();
        state.error = null;
        // Note: Token storage is now handled by tokenRefreshMiddleware to ensure consistency
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.error.message || 'Login failed';
        setTokenInStorage(null);
      })

      // Handle get current user
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        // Convert API UserResponse to UserEntity, then to serializable format for Redux store
        const userResponse = action.payload;
        const userEntity = UserMapper.fromApiUserResponse(userResponse);
        const user = UserMapper.toSerializable(userEntity);
        state.user = user;
        state.isAuthenticated = true;
        // Update auth state fields from user data
        state.isEmailVerified = user.is_email_verified;
        state.twoFactorEnabled = user.two_factor_enabled;
        state.roles = user.roles;
        state.permissions = user.permissions;
      })

      // Handle logout
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.lastActivity = null;
        state.isLoading = false;
        state.profileInfo = {};
        state.roles = [];
        state.permissions = [];
        state.twoFactorEnabled = false;
        state.isEmailVerified = false;
        setTokenInStorage(null);
      });
  },
});

// Export actions
export const {
  clearAuth,
  setAuthFromTokenData,
  setUser,
  rehydrateUser,
  rehydrateAuth,
  updateUser,
  updateTokens,
  clearError,
  updateLastActivity,
  setLoading,
  setAuthenticated,
  setError,
  logout,
} = authSlice.actions;

// Export actions for convenience
export const authActions = {
  clearAuth,
  setAuthFromTokenData,
  setUser,
  rehydrateUser,
  rehydrateAuth,
  updateUser,
  updateTokens,
  clearError,
  updateLastActivity,
  setLoading,
  setAuthenticated,
  setError,
  logout,
};

// Export reducer
export default authSlice.reducer;

