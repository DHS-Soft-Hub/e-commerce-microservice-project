/**
 * Form validation utilities
 * Comprehensive validation functions for authentication forms
 */

/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Email validation with comprehensive regex
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  /**
   * Password strength validation
   */
  static getPasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isValid: boolean;
  } {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Password must contain at least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Password must contain at least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 20;
    } else {
      feedback.push('Password must contain at least one number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Password must contain at least one special character');
    }

    // Common password check
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      score = Math.max(0, score - 40);
      feedback.push('Password is too common');
    }

    // Sequential characters check
    if (/(.)\1{2,}/.test(password)) {
      score = Math.max(0, score - 20);
      feedback.push('Password should not contain repeated characters');
    }

    return {
      score,
      feedback,
      isValid: score >= 80 && feedback.length === 0
    };
  }

  /**
   * Username validation
   */
  static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * Phone number validation
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
  }

  /**
   * URL validation
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize input to prevent XSS
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
   * Validate file upload
   */
  static validateFileUpload(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; error?: string } {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    } = options;

    // Size check
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSize / (1024 * 1024)}MB`
      };
    }

    // Type check
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Extension check
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension ${extension} is not allowed`
      };
    }

    return { isValid: true };
  }

  /**
   * Validate confirm password
   */
  static validateConfirmPassword(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Validate required field
   */
  static isRequired(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }

  /**
   * Validate minimum length
   */
  static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  /**
   * Validate maximum length
   */
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  /**
   * Validate pattern match
   */
  static matchesPattern(value: string, pattern: RegExp): boolean {
    return pattern.test(value);
  }

  /**
   * Get validation errors for a field
   */
  static getFieldErrors(
    value: string,
    rules: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      custom?: (value: string) => string | null;
    }
  ): string[] {
    const errors: string[] = [];

    if (rules.required && !this.isRequired(value)) {
      errors.push('This field is required');
    }

    if (value && rules.minLength && !this.hasMinLength(value, rules.minLength)) {
      errors.push(`Must be at least ${rules.minLength} characters`);
    }

    if (value && rules.maxLength && !this.hasMaxLength(value, rules.maxLength)) {
      errors.push(`Must be no more than ${rules.maxLength} characters`);
    }

    if (value && rules.pattern && !this.matchesPattern(value, rules.pattern)) {
      errors.push('Invalid format');
    }

    if (value && rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return errors;
  }
}

// Legacy exports for backward compatibility
export const validateEmail = ValidationUtils.isValidEmail;
export const validatePassword = (password: string): boolean => {
  return ValidationUtils.getPasswordStrength(password).isValid;
};

/**
 * Password strength checker
 * Returns strength level and feedback
 */
export const getPasswordStrength = (password: string): {
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  if (/[@$!%*#?&]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters (@$!%*#?&)');
  }

  if (password.length >= 12) {
    score += 1;
  }

  const levels: Record<number, 'weak' | 'medium' | 'strong' | 'very-strong'> = {
    0: 'weak',
    1: 'weak',
    2: 'weak',
    3: 'medium',
    4: 'strong',
    5: 'very-strong',
    6: 'very-strong',
  };

  return {
    level: levels[score] || 'weak',
    score,
    feedback,
  };
};

/**
 * Username validation utility
 */
export const validateUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Name validation utility
 */
export const validateName = (name: string): boolean => {
  // 2-50 characters, letters, spaces, hyphens, and apostrophes only
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
};

/**
 * Confirm password validation utility
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};

/**
 * Phone number validation utility
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // International phone number format
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * URL validation utility
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Required field validation
 */
export const validateRequired = (value: string | number | boolean | null | undefined): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Age validation utility
 */
export const validateAge = (birthDate: Date, minAge: number = 13): boolean => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge;
  }
  
  return age >= minAge;
};

/**
 * File validation utilities
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateImageFile = (file: File, maxSizeInMB: number = 5): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!validateFileType(file, allowedTypes)) {
    return { isValid: false, error: 'Please select a valid image file (JPEG, PNG, or WebP)' };
  }
  
  if (!validateFileSize(file, maxSizeInMB)) {
    return { isValid: false, error: `File size must be less than ${maxSizeInMB}MB` };
  }
  
  return { isValid: true };
};

/**
 * Generic form validation utility
 */
export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, (value: unknown) => boolean | string>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field as keyof T]);
    
    if (typeof result === 'string') {
      errors[field as keyof T] = result;
    } else if (!result) {
      errors[field as keyof T] = `${field} is invalid`;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
