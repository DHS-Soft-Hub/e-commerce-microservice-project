/**
 * Token storage utilities
 * Centralized token management for authentication
 * 
 * This utility provides:
 * - Configurable storage (localStorage/sessionStorage)
 * - Consistent storage format (stores raw token values)
 * - JWT token parsing and validation
 * - Refresh token management via HTTP-only cookies
 * - Centralized token operations for middleware use
 */

import { authConstants } from '@/constants/auth.constants';

interface JWTPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  user_id?: number;
  roles?: string[];
  permissions?: string[];
  profile_info?: {
    client_id?: number;
    developer_id?: number;
  };
  is_email_verified?: boolean;
  two_factor_enabled?: boolean;
  [key: string]: unknown;
}

/**
 * Centralized Token Storage Utilities
 * Handles all token operations in one place for middleware and components
 */
export class TokenStorageUtils {
  private static readonly ACCESS_TOKEN_KEY = authConstants.TOKEN.ACCESS_TOKEN_KEY;
  private static readonly STORAGE_TYPE = authConstants.TOKEN.STORAGE_TYPE;

  /**
   * Get the appropriate storage mechanism based on configuration
   */
  private static getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;

    try {
      return this.STORAGE_TYPE === 'sessionStorage' ? sessionStorage : localStorage;
    } catch {
      // Fallback to localStorage if sessionStorage is not available
      return localStorage;
    }
  }

  /**
   * Decode JWT token payload
   */
  static decodeJWT(token: string): JWTPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JWTPayload;
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  }

  /**
   * Get token expiration from JWT
   */
  private static getTokenExpiration(token: string): number | null {
    const payload = this.decodeJWT(token);
    return payload?.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  }

  /**
   * Store access token (RAW VALUE ONLY for consistency)
   */
  static setAccessToken(token: string, rememberMe?: boolean): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      // Override storage type if rememberMe is specified
      const targetStorage = rememberMe === true
        ? localStorage
        : rememberMe === false
          ? sessionStorage
          : storage;

      // Store raw token value directly (no wrapper object)
      targetStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  /**
   * Get access token (RAW VALUE ONLY)
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      // Check both localStorage and sessionStorage for flexibility
      const localToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const sessionToken = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);

      // Return whichever exists (prioritize based on configuration)
      return this.STORAGE_TYPE === 'sessionStorage'
        ? sessionToken || localToken
        : localToken || sessionToken;
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(): boolean {
    try {
      const token = this.getAccessToken();
      if (!token) return true;

      const expiry = this.getTokenExpiration(token);
      if (!expiry) return true;

      return Date.now() >= expiry;
    } catch (error) {
      console.error('Failed to check token expiry:', error);
      return true;
    }
  }

  /**
   * Check if token is valid (exists and not expired)
   */
  static isTokenValid(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Clear all tokens from all storage locations
   */
  static clearTokens(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clear from both localStorage and sessionStorage to ensure cleanup
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Get token info for auth state management
   */
  static getTokenInfo(): {
    hasAccessToken: boolean;
    isExpired: boolean;
    expiresAt?: Date;
    storageType?: string;
  } {
    const hasAccessToken = !!this.getAccessToken();
    const isExpired = this.isTokenExpired();

    let expiresAt: Date | undefined;
    let storageType: string | undefined;

    try {
      const token = this.getAccessToken();
      if (token) {
        const expiry = this.getTokenExpiration(token);
        if (expiry) {
          expiresAt = new Date(expiry);
        }

        // Determine where token is stored
        const inLocal = !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
        const inSession = !!sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
        storageType = inLocal && inSession ? 'both' : inLocal ? 'localStorage' : inSession ? 'sessionStorage' : undefined;
      }
    } catch (error) {
      console.error('Failed to get token expiry:', error);
    }

    return {
      hasAccessToken,
      isExpired,
      expiresAt,
      storageType
    };
  }

  /**
   * Get time until token expiry
   */
  static getTimeUntilExpiry(): number | null {
    try {
      const token = this.getAccessToken();
      if (!token) return null;

      const expiry = this.getTokenExpiration(token);
      if (!expiry) return null;

      const timeUntilExpiry = expiry - Date.now();
      return timeUntilExpiry > 0 ? timeUntilExpiry : 0;
    } catch (error) {
      console.error('Failed to get time until expiry:', error);
      return null;
    }
  }

  /**
   * Check if token needs refresh (within threshold of expiry)
   */
  static needsRefresh(threshold: number = authConstants.TOKEN.REFRESH_THRESHOLD * 1000): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    if (timeUntilExpiry === null) return true;

    return timeUntilExpiry <= threshold;
  }

  /**
   * Check if user has valid session
   */
  static hasValidSession(): boolean {
    const { hasAccessToken, isExpired } = this.getTokenInfo();
    return hasAccessToken && !isExpired;
  }

  /**
   * Set storage preference for current session
   */
  static setStoragePreference(storageType: 'localStorage' | 'sessionStorage'): void {
    // This would typically update a configuration setting
    // For now, we'll migrate tokens if needed
    const currentToken = this.getAccessToken();
    if (currentToken) {
      this.clearTokens();

      // Store in preferred location
      const targetStorage = storageType === 'sessionStorage' ? sessionStorage : localStorage;
      try {
        targetStorage.setItem(this.ACCESS_TOKEN_KEY, currentToken);
      } catch (error) {
        console.error('Failed to migrate token to preferred storage:', error);
        // Restore to original location as fallback
        this.setAccessToken(currentToken);
      }
    }
  }
}
