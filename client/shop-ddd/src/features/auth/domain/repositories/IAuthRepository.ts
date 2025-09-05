import { IBaseRepository, IResult } from '@dhs-hub/core';
import { UserEntity } from '../entities/User';
import { AuthResult, LoginCredentials, RegistrationData } from '../types/auth.domain.types';

/**
 * Authentication Repository Interface
 * Data access operations for authentication
 */
export interface IAuthRepository extends IBaseRepository<UserEntity, string> {
  /**
   * Authenticate user with credentials
   */
  authenticate(credentials: LoginCredentials): Promise<IResult<AuthResult>>;

  /**
   * Register new user
   */
  register(data: RegistrationData): Promise<IResult<UserEntity>>;

  /**
   * Refresh authentication token
   */
  refreshToken(refreshToken: string): Promise<IResult<AuthResult>>;

  /**
   * Revoke authentication token
   */
  revokeToken(token: string): Promise<IResult<void>>;

  /**
   * Validate authentication token
   */
  validateToken(token: string): Promise<IResult<UserEntity>>;

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
   * Check if email exists
   */
  emailExists(email: string): Promise<boolean>;

  /**
   * Send verification email
   */
  sendVerificationEmail(email: string): Promise<IResult<void>>;

  /**
   * Resend verification code
   */
  resendVerificationCode(email: string): Promise<IResult<void>>;
}
