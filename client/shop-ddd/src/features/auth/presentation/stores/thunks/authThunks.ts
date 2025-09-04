/**
 * Auth async thunks
 * Redux toolkit async actions for authentication operations
 */

import { authConstants } from '@/constants';
import { TokenStorageUtils } from '@/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Login async thunk
 */
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string; rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      // This would typically call an API service
      // For now, we'll simulate the API call
      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.rememberMe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store tokens
      TokenStorageUtils.setAccessToken(data.access_token, data.expires_in);

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

/**
 * Register async thunk
 */
export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username?: string;
      agreeToTerms: boolean;
      subscribeToNewsletter?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

/**
 * Logout async thunk
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (token) {
        await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Clear tokens regardless of API call success
      TokenStorageUtils.clearTokens();

      return null;
    } catch (error) {
      // Clear tokens even if logout API fails
      TokenStorageUtils.clearTokens();
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
    }
  }
);

/**
 * Verify token async thunk
 */
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('No token available');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.PROFILE}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        TokenStorageUtils.clearTokens();
        return rejectWithValue('Token verification failed');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      TokenStorageUtils.clearTokens();
      return rejectWithValue(error instanceof Error ? error.message : 'Token verification failed');
    }
  }
);

/**
 * Update profile async thunk
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    profileData: {
      firstName?: string;
      lastName?: string;
      username?: string;
      bio?: string;
      location?: string;
      website?: string;
      avatar?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.PROFILE}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Profile update failed');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Profile update failed');
    }
  }
);

/**
 * Change password async thunk
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.CHANGE_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Password change failed');
      }

      return { message: 'Password changed successfully' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Password change failed');
    }
  }
);

/**
 * Change email async thunk
 */
export const changeEmail = createAsyncThunk(
  'auth/changeEmail',
  async (
    emailData: { newEmail: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.CHANGE_EMAIL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Email change failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Email change failed');
    }
  }
);

/**
 * Forgot password async thunk
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (emailData: { email: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Password reset request failed');
      }

      return { message: 'Password reset email sent' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Password reset request failed');
    }
  }
);

/**
 * Reset password async thunk
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    resetData: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.RESET_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Password reset failed');
      }

      return { message: 'Password reset successfully' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Password reset failed');
    }
  }
);

/**
 * Verify email async thunk
 */
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (tokenData: { token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.VERIFY_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Email verification failed');
      }

      return { message: 'Email verified successfully' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Email verification failed');
    }
  }
);

/**
 * Resend verification async thunk
 */
export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (emailData: { email: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.RESEND_VERIFICATION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Resend verification failed');
      }

      return { message: 'Verification email sent' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Resend verification failed');
    }
  }
);

/**
 * Terminate session async thunk
 */
export const terminateSession = createAsyncThunk(
  'auth/terminateSession',
  async (sessionData: { sessionId: string }, { rejectWithValue }) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.SESSIONS}/${sessionData.sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Session termination failed');
      }

      return { sessionId: sessionData.sessionId };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Session termination failed');
    }
  }
);

/**
 * Terminate all sessions async thunk
 */
export const terminateAllSessions = createAsyncThunk(
  'auth/terminateAllSessions',
  async (options: { keepCurrent?: boolean }, { rejectWithValue }) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.SESSIONS}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keep_current: options.keepCurrent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Session termination failed');
      }

      return { message: 'All sessions terminated' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Session termination failed');
    }
  }
);

/**
 * Enable two-factor authentication async thunk
 */
export const enableTwoFactor = createAsyncThunk(
  'auth/enableTwoFactor',
  async (
    twoFactorData: { method: 'totp' | 'sms' | 'email'; phoneNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.TWO_FACTOR}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(twoFactorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Two-factor setup failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Two-factor setup failed');
    }
  }
);

/**
 * Verify two-factor authentication async thunk
 */
export const verifyTwoFactor = createAsyncThunk(
  'auth/verifyTwoFactor',
  async (
    verificationData: { code: string; method: 'totp' | 'sms' | 'email' },
    { rejectWithValue }
  ) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.TWO_FACTOR}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Two-factor verification failed');
      }

      return { message: 'Two-factor authentication verified' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Two-factor verification failed');
    }
  }
);

/**
 * Disable two-factor authentication async thunk
 */
export const disableTwoFactor = createAsyncThunk(
  'auth/disableTwoFactor',
  async (
    disableData: { password: string; code?: string },
    { rejectWithValue }
  ) => {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(`${authConstants.API.BASE_URL}${authConstants.API.ENDPOINTS.TWO_FACTOR}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disableData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Two-factor disable failed');
      }

      return { message: 'Two-factor authentication disabled' };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Two-factor disable failed');
    }
  }
);
