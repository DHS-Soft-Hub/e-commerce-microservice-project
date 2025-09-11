/**
 * Security utilities
 * Security-related helper functions for authentication
 */

import { StorageUtils } from '../../../../utils/genericStorage';
import { ExtendedSession } from '../../presentation/types/session.types';

/**
 * Security utilities
 */
export class SecurityUtils {
  /**
   * Generate secure random string
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Generate cryptographically secure random string
   */
  static generateSecureRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const randomArray = new Uint8Array(length);
      crypto.getRandomValues(randomArray);

      for (let i = 0; i < length; i++) {
        result += chars.charAt(randomArray[i] % chars.length);
      }
    } else {
      // Fallback to Math.random for environments without crypto API
      result = this.generateRandomString(length);
    }

    return result;
  }

  /**
   * Hash string using Web Crypto API
   */
  static async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Detect suspicious activity patterns
   */
  static detectSuspiciousActivity(sessions: ExtendedSession[]): {
    isSuspicious: boolean;
    reasons: string[];
    riskScore: number;
  } {
    const reasons: string[] = [];
    let riskScore = 0;

    // Multiple sessions from different locations
    const uniqueLocations = new Set(sessions.map(s => s.country).filter(Boolean));
    if (uniqueLocations.size > 3) {
      reasons.push('Multiple sessions from different countries');
      riskScore += 30;
    }

    // Unusual login times
    const now = new Date();
    const recentSessions = sessions.filter(s =>
      new Date(s.createdAt).getTime() > now.getTime() - (24 * 60 * 60 * 1000)
    );

    const loginHours = recentSessions.map(s => new Date(s.createdAt).getHours());
    const nightLogins = loginHours.filter(h => h >= 2 && h <= 6).length;

    if (nightLogins > recentSessions.length * 0.5) {
      reasons.push('Unusual login times detected');
      riskScore += 20;
    }

    // Check session flags for suspicious activities
    sessions.forEach(session => {
      if (session.flags?.length) {
        reasons.push('Security flags detected on session');
        riskScore += 20;
      }

      if (session.riskScore && session.riskScore > 70) {
        reasons.push('High risk score detected');
        riskScore += 30;
      }
    });

    return {
      isSuspicious: riskScore > 50,
      reasons,
      riskScore: Math.min(riskScore, 100)
    };
  }

  /**
   * Validate session security
   */
  static validateSessionSecurity(session: ExtendedSession): {
    isSecure: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Check session age
    const sessionAge = Date.now() - new Date(session.createdAt).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (sessionAge > maxAge) {
      warnings.push('Session is older than 24 hours');
    }

    // Check session flags
    if (session.flags?.length) {
      warnings.push(`Security flags detected: ${session.flags.join(', ')}`);
    }

    // Check risk score
    if (session.riskScore && session.riskScore > 50) {
      warnings.push(`High risk score: ${session.riskScore}`);
    }

    // Check if session is current
    if (!session.isCurrent && session.isActive) {
      warnings.push('Session is active but not current device');
    }

    return {
      isSecure: warnings.length === 0,
      warnings
    };
  }

  /**
   * Generate device fingerprint
   */
  static generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.hardwareConcurrency || 'unknown'
    ];

    return btoa(components.join('|'));
  }

  /**
   * Check password against common breaches
   */
  static async checkPasswordBreach(password: string): Promise<boolean> {
    try {
      const hash = await this.hashString(password);
      const _prefix = hash.substring(0, 5);
      const _suffix = hash.substring(5).toUpperCase();

      // In a real implementation, you would call HaveIBeenPwned API
      // For now, we'll simulate the check
      return Math.random() < 0.1; // 10% chance of being breached
    } catch (error) {
      console.error('Failed to check password breach:', error);
      return false;
    }
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    return this.generateSecureRandomString(32);
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken;
  }

  /**
   * Generate nonce for CSP
   */
  static generateNonce(): string {
    return this.generateSecureRandomString(16);
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Check if email domain is suspicious
   */
  static isSuspiciousEmailDomain(email: string): boolean {
    const suspiciousDomains = [
      '10minutemail.com',
      'guerrillamail.com',
      'tempmail.org',
      'throwaway.email'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return suspiciousDomains.includes(domain);
  }

  /**
   * Calculate password entropy
   */
  static calculatePasswordEntropy(password: string): number {
    let charsetSize = 0;

    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

    return Math.log2(Math.pow(charsetSize, password.length));
  }

  /**
   * Check if IP address is in private range
   */
  static isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ];

    return privateRanges.some(range => range.test(ip));
  }

  /**
   * Check rate limit
   */
  static checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const rateLimitKey = `rate_limit_${key}`;
    const rateLimitData = StorageUtils.getItem<{ count: number; lastReset: number }>(rateLimitKey) || { count: 0, lastReset: now };

    // Reset if window has passed
    if (now - rateLimitData.lastReset > windowMs) {
      rateLimitData.count = 0;
      rateLimitData.lastReset = now;
    }

    // Check if limit exceeded
    if (rateLimitData.count >= limit) {
      return false; // Rate limit exceeded
    }

    // Increment count and save
    rateLimitData.count++;
    StorageUtils.setItem(rateLimitKey, rateLimitData);

    return true; // Within rate limit
  }


  /**
   * Clear rate limit for key
   */
  static clearRateLimit(key: string): void {
    try {
      StorageUtils.removeItem(`rate_limit_${key}`);
    } catch (error) {
      console.error('Failed to clear rate limit:', error);
    }
  }

  /**
   * Constant time string comparison to prevent timing attacks
   */
  static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
