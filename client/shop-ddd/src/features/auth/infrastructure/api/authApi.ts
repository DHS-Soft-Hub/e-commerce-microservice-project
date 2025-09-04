/**
 * Enhanced Auth API matching backend endpoints
 * Handles authentication, registration, password management, 2FA, and sessions
 */

import { apiSlice } from '@/store/api';
import {
  ChangePasswordRequest,
  ClientRegistrationRequest,
  DeveloperRegistrationRequest,
  GenericResponse,
  LoginRequest,
  OAuthCallbackRequest,
  PasswordResetConfirm,
  PasswordResetRequest,
  RegistrationResponse,
  SessionInfo,
  TokenData,
  TwoFactorSetup,
  TwoFactorVerify,
  UserResponse
} from '../types/api.types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ===== AUTHENTICATION ENDPOINTS =====

    login: builder.mutation<TokenData, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    refreshToken: builder.mutation<TokenData, void>({
      query: () => ({
        url: '/auth/token/refresh',
        method: 'POST',
      }),
    }),

    logout: builder.mutation<GenericResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User', 'Session'],
    }),

    getCurrentUser: builder.query<UserResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Auth', 'User'],
    }),

    // ===== REGISTRATION ENDPOINTS =====

    registerBasicUser: builder.mutation<RegistrationResponse, { email: string; password: string; firstName?: string; lastName?: string }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    registerClient: builder.mutation<RegistrationResponse, ClientRegistrationRequest>({
      query: (data) => ({
        url: '/auth/register/client',
        method: 'POST',
        body: data,
      }),
    }),

    registerDeveloper: builder.mutation<RegistrationResponse, DeveloperRegistrationRequest>({
      query: (data) => ({
        url: '/auth/register/developer',
        method: 'POST',
        body: data,
      }),
    }),

    // ===== PASSWORD MANAGEMENT =====

    requestPasswordReset: builder.mutation<GenericResponse, PasswordResetRequest>({
      query: (data) => ({
        url: '/auth/password/reset-request',
        method: 'POST',
        body: data,
      }),
    }),

    confirmPasswordReset: builder.mutation<GenericResponse, PasswordResetConfirm>({
      query: (data) => ({
        url: '/auth/password/reset-confirm',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<GenericResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: '/auth/password/change',
        method: 'POST',
        body: data,
      }),
    }),

    // ===== EMAIL VERIFICATION =====

    verifyEmail: builder.mutation<GenericResponse, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/verify/${token}`,
        method: 'GET',
      }),
    }),

    resendVerification: builder.mutation<GenericResponse, { email: string }>({
      query: (data) => ({
        url: '/auth/verify/resend-verification',
        method: 'POST',
        body: data,
      }),
    }),

    // ===== TWO-FACTOR AUTHENTICATION =====

    setup2FA: builder.mutation<TwoFactorSetup, void>({
      query: () => ({
        url: '/auth/2fa/setup',
        method: 'POST',
      }),
    }),

    enable2FA: builder.mutation<GenericResponse, TwoFactorVerify>({
      query: (data) => ({
        url: '/auth/2fa/enable',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    disable2FA: builder.mutation<GenericResponse, { password: string; totp_code: string }>({
      query: (data) => ({
        url: '/auth/2fa/disable',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    verify2FA: builder.mutation<GenericResponse, TwoFactorVerify>({
      query: (data) => ({
        url: '/auth/2fa/verify',
        method: 'POST',
        body: data,
      }),
    }),

    verifyBackupCode: builder.mutation<GenericResponse, { backup_code: string }>({
      query: (data) => ({
        url: '/auth/2fa/verify-backup-code',
        method: 'POST',
        body: data,
      }),
    }),

    get2FAStatus: builder.query<{ two_factor_enabled: boolean; backup_codes_remaining: number; success: boolean }, void>({
      query: () => '/auth/2fa/status',
    }),

    get2FAQRCode: builder.query<{ qr_code_url: string; success: boolean }, void>({
      query: () => '/auth/2fa/qr-code',
    }),

    getBackupCodes: builder.query<{ backup_codes: string[]; success: boolean }, void>({
      query: () => '/auth/2fa/backup-codes',
    }),

    regenerateBackupCodes: builder.mutation<{ backup_codes: string[]; message: string; success: boolean }, TwoFactorVerify>({
      query: (data) => ({
        url: '/auth/2fa/regenerate-backup-codes',
        method: 'POST',
        body: data,
      }),
    }),

    // ===== SESSION MANAGEMENT =====

    getSessions: builder.query<SessionInfo[], void>({
      query: () => '/auth/sessions/active',
      providesTags: ['Session'],
    }),

    revokeSession: builder.mutation<GenericResponse, string>({
      query: (sessionKey) => ({
        url: `/auth/sessions/${sessionKey}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Session'],
    }),

    revokeAllSessions: builder.mutation<GenericResponse, void>({
      query: () => ({
        url: '/auth/sessions/revoke-all',
        method: 'DELETE',
      }),
      invalidatesTags: ['Session'],
    }),

    // ===== OAUTH ENDPOINTS =====

    getOAuthProviders: builder.query<{ providers: string[] }, void>({
      query: () => '/auth/oauth/providers',
    }),

    initiateOAuth: builder.query<{ authorization_url: string }, { provider: string; state?: string }>({
      query: ({ provider, state }) => {
        const params = state ? `?state=${encodeURIComponent(state)}` : '';
        return `/auth/oauth/${provider}/authorize${params}`;
      },
    }),

    oauthCallback: builder.mutation<TokenData, OAuthCallbackRequest>({
      query: (data) => ({
        url: `/auth/oauth/${data.provider}/callback`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    refreshOAuthToken: builder.mutation<TokenData, { provider: string }>({
      query: ({ provider }) => ({
        url: `/auth/oauth/${provider}/refresh`,
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Authentication
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,

  // Registration
  useRegisterBasicUserMutation,
  useRegisterClientMutation,
  useRegisterDeveloperMutation,

  // Password management
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
  useChangePasswordMutation,

  // Email verification
  useVerifyEmailMutation,
  useResendVerificationMutation,

  // Two-factor authentication
  useSetup2FAMutation,
  useEnable2FAMutation,
  useDisable2FAMutation,
  useVerify2FAMutation,
  useVerifyBackupCodeMutation,
  useGet2FAStatusQuery,
  useGet2FAQRCodeQuery,
  useGetBackupCodesQuery,
  useRegenerateBackupCodesMutation,

  // Session management
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,

  // OAuth
  useGetOAuthProvidersQuery,
  useInitiateOAuthQuery,
  useOauthCallbackMutation,
  useRefreshOAuthTokenMutation,
} = authApi;
