import { IResult } from '@dhs-hub/core';
import { UserEntity } from '../../domain/entities/User';
import { AuthResult, LoginCredentials, RegistrationData } from '../../domain/types/auth.domain.types';

/**
 * Main Authentication Service Interface
 * Central authentication operations
 */
export interface IAuthService {
  /**
   * Authenticate user with credentials
   */
  login(credentials: LoginCredentials): Promise<IResult<AuthResult>>;

  /**
   * Register new user
   */
  register(data: RegistrationData): Promise<IResult<UserEntity>>;

  /**
   * Logout current user
   */
  logout(): Promise<IResult<void>>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<IResult<UserEntity | null>>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<IResult<AuthResult>>;

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Promise<IResult<void>>;

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Promise<IResult<void>>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<IResult<void>>;

  /**
   * Change password for authenticated user
   */
  changePassword(oldPassword: string, newPassword: string): Promise<IResult<void>>;
}
