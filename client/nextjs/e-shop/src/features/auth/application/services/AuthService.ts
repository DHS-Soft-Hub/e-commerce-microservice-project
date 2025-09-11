import { IResult } from '@dhs-hub/core';
import { TokenStorageUtils } from '../../../../utils/tokenStorage';
import { UserEntity } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { AuthResult, LoginCredentials, RegistrationData } from '../../domain/types/auth.domain.types';
import { IAuthService } from '../abstractions/IAuthService';

/**
 * Implementation of IAuthService
 * Provides authentication operations using repository pattern
 */
export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {
    // Repository must be injected - no default instantiation
    if (!authRepository) {
      throw new Error('AuthRepository is required for AuthService');
    }
  }

  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginCredentials): Promise<IResult<AuthResult>> {
    try {
      return await this.authRepository.authenticate(credentials);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Register new user
   */
  async register(data: RegistrationData): Promise<IResult<UserEntity>> {
    try {
      return await this.authRepository.register(data);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<IResult<void>> {
    try {
      // Get current token to revoke it
      const token = TokenStorageUtils.getAccessToken();

      if (token) {
        // Attempt to revoke token with the backend
        await this.authRepository.revokeToken(token);
      }

      // Clear local storage regardless of API call result
      TokenStorageUtils.clearTokens();

      return {
        isSuccess: true,
        isFailure: false,
        value: undefined
      };
    } catch (error) {
      // Even if API call fails, clear local storage
      TokenStorageUtils.clearTokens();

      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<IResult<UserEntity | null>> {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token || TokenStorageUtils.isTokenExpired()) {
        return {
          isSuccess: true,
          isFailure: false,
          value: null
        };
      }

      // Validate token and get user information
      const result = await this.authRepository.validateToken(token);

      if (!result.isSuccess) {
        // Token is invalid, clear it
        TokenStorageUtils.clearTokens();

        return {
          isSuccess: true,
          isFailure: false,
          value: null
        };
      }

      return result;
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token || TokenStorageUtils.isTokenExpired()) {
        return false;
      }

      // Validate token with backend
      const userResult = await this.getCurrentUser();
      return userResult.isSuccess && userResult.value !== null;
    } catch {
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<IResult<AuthResult>> {
    try {
      const token = TokenStorageUtils.getAccessToken();

      if (!token) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('No token available for refresh')
        };
      }

      return await this.authRepository.refreshToken(token);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<IResult<void>> {
    try {
      return await this.authRepository.verifyEmail(token);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<IResult<void>> {
    try {
      return await this.authRepository.requestPasswordReset(email);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<IResult<void>> {
    try {
      return await this.authRepository.resetPassword(token, newPassword);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Request new verification code for email
   */
  async requestNewVerificationCode(email: string): Promise<IResult<void>> {
    try {
      return await this.authRepository.resendVerificationCode(email);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(_oldPassword: string, _newPassword: string): Promise<IResult<void>> {
    try {
      // Get current user first to validate they're authenticated
      const userResult = await this.getCurrentUser();
      if (!userResult.isSuccess || !userResult.value) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('User not authenticated')
        };
      }

      // For password change, we would need a dedicated endpoint
      // For now, return a not implemented error
      return {
        isSuccess: false,
        isFailure: true,
        error: new Error('Password change functionality not implemented in backend API')
      };
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error as Error
      };
    }
  }
}
