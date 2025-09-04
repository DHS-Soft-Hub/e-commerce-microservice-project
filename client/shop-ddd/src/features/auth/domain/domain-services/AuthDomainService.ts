import { Password } from '../value-objects';

/**
 * Auth Domain Service
 * Contains domain logic that doesn't belong to any specific entity
 */
export class AuthDomainService {
  /**
   * Check if password meets complexity requirements
   */
  static isPasswordComplex(password: string): boolean {
    try {
      Password.validate(password);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate a secure temporary password
   */
  static generateTemporaryPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required category
    password += 'A'; // uppercase
    password += 'a'; // lowercase
    password += '1'; // digit
    password += '!'; // special char
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check if user can login based on account status
   */
  static canUserLogin(isActive: boolean, isEmailVerified: boolean): boolean {
    return isActive && isEmailVerified;
  }

  /**
   * Calculate session expiry time
   */
  static calculateSessionExpiry(rememberMe: boolean): Date {
    const now = new Date();
    const hours = rememberMe ? 24 * 30 : 24; // 30 days vs 24 hours
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  }
}
