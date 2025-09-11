
/**
 * User roles enum
 */
export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  PROJECT_LEAD = 'project_lead',
  CLIENT = 'client',
}

/**
 * Authentication result interface matching backend TokenData
 */
export interface AuthResult {
  access_token: string;
  token_type: string;
  user_id: number;
  expires_in: number;
  roles: string[];
  permissions: string[];
  profile_info: Record<string, unknown>;
  two_factor_enabled: boolean;
  is_email_verified: boolean;
}

/**
 * User information interface matching backend UserResponse
 * This represents the serializable user data for Redux store
 */
export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  roles: string[];
  permissions: string[];
  is_active: boolean;
  is_email_verified: boolean;
  two_factor_enabled: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

/**
 * Custom Auth Error class for authentication-related errors
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Auth state interface for Redux store
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: string | null;
  profileInfo: Record<string, unknown>;
  roles: string[];
  permissions: string[];
  twoFactorEnabled: boolean;
  isEmailVerified: boolean;
}

/**
 * Permission state interface
 */
export interface PermissionState {
  permissions: string[];
  roles: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Login form data interface
 */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
  userType?: 'client' | 'developer' | 'basic';
  totpCode?: string;
}

/**
 * Client registration form data interface
 */
export interface ClientRegistrationFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
}

/**
 * Developer registration form data interface
 */
export interface DeveloperRegistrationFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
  tax_id?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
}

/**
 * Registration form data interface
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username?: string;
  agreeToTerms: boolean;
  subscribeToNewsletter: boolean;
}

/**
 * Form error type for registration
 */
export type RegisterFormErrors = {
  [K in keyof RegisterFormData]?: string;
};

/**
 * Password reset form data interface
 */
export interface PasswordResetFormData {
  email: string;
}

/**
 * Change password form data interface
 */
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Auth action types for Redux
 */
export enum AuthActionTypes {
  LOGIN_START = 'auth/loginStart',
  LOGIN_SUCCESS = 'auth/loginSuccess',
  LOGIN_FAILURE = 'auth/loginFailure',
  LOGOUT = 'auth/logout',
  REGISTER_START = 'auth/registerStart',
  REGISTER_SUCCESS = 'auth/registerSuccess',
  REGISTER_FAILURE = 'auth/registerFailure',
  REFRESH_TOKEN_START = 'auth/refreshTokenStart',
  REFRESH_TOKEN_SUCCESS = 'auth/refreshTokenSuccess',
  REFRESH_TOKEN_FAILURE = 'auth/refreshTokenFailure',
  SET_USER = 'auth/setUser',
  CLEAR_ERROR = 'auth/clearError',
  UPDATE_LAST_ACTIVITY = 'auth/updateLastActivity'
}

/**
 * API response wrapper interface
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
  success: boolean;
  timestamp: string;
}

/**
 * Pagination interface
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
