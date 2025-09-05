import { IResult } from '@dhs-hub/core';
import { Token } from '../../domain/entities';

/**
 * Token Management Service Interface
 * Operations for managing authentication tokens
 */
export interface ITokenService {
  /**
   * Store authentication token
   */
  storeToken(token: Token): Promise<void>;

  /**
   * Get stored token
   */
  getToken(): Promise<Token | null>;

  /**
   * Remove stored token
   */
  removeToken(): Promise<void>;

  /**
   * Check if token is valid (not expired)
   */
  isTokenValid(token?: Token): Promise<boolean>;

  /**
   * Check if token is expired
   */
  isTokenExpired(token?: Token): boolean;

  /**
   * Get time until token expiration
   */
  getTokenExpirationTime(token?: Token): number;

  /**
   * Refresh token if needed
   */
  refreshTokenIfNeeded(): Promise<IResult<Token | null>>;

  /**
   * Decode token payload
   */
  decodeToken(token: string): Record<string, unknown>;

  /**
   * Validate token format
   */
  validateTokenFormat(token: string): boolean;

  /**
   * Get token from storage
   */
  getStoredAccessToken(): string | null;

  /**
   * Get refresh token from storage
   */
  getStoredRefreshToken(): string | null;

  /**
   * Clear all stored tokens
   */
  clearAllTokens(): Promise<void>;

  /**
   * Set token expiration handler
   */
  setTokenExpirationHandler(handler: () => void): void;

  /**
   * Remove token expiration handler
   */
  removeTokenExpirationHandler(): void;
}
