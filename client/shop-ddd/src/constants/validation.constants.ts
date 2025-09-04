/**
 * Validation rule constants
 * Form validation patterns, rules, and error messages
 */

import { authConstants } from './auth.constants';

/**
 * Validation rules
 */
export const validationRules = {
  // Email validation
  EMAIL: {
    REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    MAX_LENGTH: 254,
    MESSAGES: {
      REQUIRED: 'Email is required',
      INVALID: 'Please enter a valid email address',
      TOO_LONG: 'Email must be less than 254 characters',
    },
  },

  // Password validation
  PASSWORD: {
    MIN_LENGTH: authConstants.PASSWORD.MIN_LENGTH,
    MAX_LENGTH: authConstants.PASSWORD.MAX_LENGTH,
    REGEX: {
      UPPERCASE: /[A-Z]/,
      LOWERCASE: /[a-z]/,
      NUMBERS: /\d/,
      SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/,
      NO_REPEATING: /^(?!.*(.)\1{2,})/,
    },
    MESSAGES: {
      REQUIRED: 'Password is required',
      TOO_SHORT: `Password must be at least ${authConstants.PASSWORD.MIN_LENGTH} characters`,
      TOO_LONG: `Password must be less than ${authConstants.PASSWORD.MAX_LENGTH} characters`,
      NO_UPPERCASE: 'Password must contain at least one uppercase letter',
      NO_LOWERCASE: 'Password must contain at least one lowercase letter',
      NO_NUMBERS: 'Password must contain at least one number',
      NO_SPECIAL_CHARS: 'Password must contain at least one special character',
      REPEATING_CHARS: 'Password should not contain repeated characters',
      TOO_COMMON: 'Password is too common, please choose a different one',
    },
  },

  // Username validation
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    REGEX: /^[a-zA-Z0-9_-]+$/,
    RESERVED: [
      'admin',
      'administrator',
      'root',
      'system',
      'api',
      'www',
      'mail',
      'support',
      'help',
      'info',
      'contact',
      'about',
      'terms',
      'privacy',
      'security',
      'login',
      'register',
      'auth',
      'oauth',
      'signup',
      'signin',
    ],
    MESSAGES: {
      REQUIRED: 'Username is required',
      TOO_SHORT: 'Username must be at least 3 characters',
      TOO_LONG: 'Username must be less than 20 characters',
      INVALID: 'Username can only contain letters, numbers, underscores, and hyphens',
      RESERVED: 'This username is reserved and cannot be used',
    },
  },

  // Name validation
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-Z\s'-]+$/,
    MESSAGES: {
      REQUIRED: 'Name is required',
      TOO_SHORT: 'Name must be at least 1 character',
      TOO_LONG: 'Name must be less than 50 characters',
      INVALID: 'Name can only contain letters, spaces, apostrophes, and hyphens',
    },
  },

  // Phone validation
  PHONE: {
    REGEX: /^\+?[1-9]\d{1,14}$/,
    MESSAGES: {
      INVALID: 'Please enter a valid phone number',
      TOO_LONG: 'Phone number is too long',
    },
  },

  // URL validation
  URL: {
    REGEX: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    MESSAGES: {
      INVALID: 'Please enter a valid URL',
    },
  },

  // File validation
  FILE: {
    AVATAR: {
      MAX_SIZE: authConstants.UPLOAD.AVATAR_MAX_SIZE,
      ALLOWED_TYPES: authConstants.UPLOAD.AVATAR_ALLOWED_TYPES,
      ALLOWED_EXTENSIONS: authConstants.UPLOAD.AVATAR_ALLOWED_EXTENSIONS,
      MESSAGES: {
        TOO_LARGE: `File must be less than ${authConstants.UPLOAD.AVATAR_MAX_SIZE / (1024 * 1024)}MB`,
        INVALID_TYPE: 'Only JPEG, PNG, and WebP images are allowed',
        INVALID_EXTENSION: 'Invalid file extension',
      },
    },
  },

  // Two-factor authentication
  TWO_FACTOR: {
    CODE_LENGTH: 6,
    CODE_REGEX: /^\d{6}$/,
    MESSAGES: {
      REQUIRED: 'Verification code is required',
      INVALID: 'Please enter a valid 6-digit code',
    },
  },
} as const;
