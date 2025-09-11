import { Session } from '../entities/Session';
import { UserEntity } from '../entities/User';

/**
 * Domain-specific types for the auth feature
 */

export interface LoginCredentials {
  email: string;
  password: string;
  totp_code?: string; // Optional for TOTP authentication
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  agreeToTerms: boolean;
}

export interface AuthResult {
  user: UserEntity;  // Changed from User interface to UserEntity class
  session: Session;
  accessToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
}

export interface EmailVerificationData {
  token: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  username?: string;
}
