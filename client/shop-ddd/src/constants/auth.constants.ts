/**
 * Core authentication constants
 * Token configuration, session settings, and security parameters
 */

/**
 * Authentication constants
 */
export const authConstants = {
  // Token configuration
  TOKEN: {
    ACCESS_TOKEN_KEY: 'access_token',
    TOKEN_TYPE: 'Bearer',
    DEFAULT_EXPIRES_IN: 3600, // 1 hour in seconds
    REFRESH_THRESHOLD: 300, // 5 minutes in seconds
    STORAGE_TYPE: 'localStorage' as 'localStorage' | 'sessionStorage', // Configurable storage choice
  },

  // Session configuration
  SESSION: {
    DEFAULT_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
    WARNING_TIMEOUT: 5 * 60 * 1000, // 5 minutes in milliseconds
    MAX_CONCURRENT_SESSIONS: 5,
  },

  // Storage keys
  STORAGE: {
    USER_DATA_KEY: 'auth_user',
    USER_PREFERENCES_KEY: 'user_preferences',
    USER_SESSION_KEY: 'user_session',
  },

  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SPECIAL_CHARS: '!@#$%^&*(),.?":{}|<>',
    COMMON_PASSWORDS: [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey'
    ],
  },

  // Rate limiting
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
    LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
    PASSWORD_RESET_ATTEMPTS: 3,
    PASSWORD_RESET_WINDOW: 60 * 60 * 1000, // 1 hour
    EMAIL_VERIFICATION_ATTEMPTS: 5,
    EMAIL_VERIFICATION_WINDOW: 60 * 60 * 1000, // 1 hour
  },

  // File upload limits
  UPLOAD: {
    AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    AVATAR_ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    AVATAR_ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
    DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    DOCUMENT_ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  },

  // API configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    ENDPOINTS: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/token/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
      CHANGE_PASSWORD: '/auth/change-password',
      CHANGE_EMAIL: '/auth/change-email',
      PROFILE: '/auth/profile',
      SESSIONS: '/auth/sessions',
      PERMISSIONS: '/auth/permissions',
      TWO_FACTOR: '/auth/2fa',
    },
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Security settings
  SECURITY: {
    CSRF_TOKEN_HEADER: 'X-CSRF-Token',
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
    PASSWORD_HISTORY_COUNT: 5,
    SESSION_TIMEOUT_WARNING: 5 * 60 * 1000, // 5 minutes
    SUSPICIOUS_ACTIVITY_THRESHOLD: 50,
    HIGH_RISK_SCORE_THRESHOLD: 70,
  },

  // Two-factor authentication
  TWO_FACTOR: {
    BACKUP_CODES_COUNT: 10,
    TOTP_WINDOW: 2,
    SMS_CODE_LENGTH: 6,
    SMS_CODE_EXPIRY: 5 * 60 * 1000, // 5 minutes
    EMAIL_CODE_LENGTH: 6,
    EMAIL_CODE_EXPIRY: 10 * 60 * 1000, // 10 minutes
  },

  // User preferences
  PREFERENCES: {
    THEME_OPTIONS: ['light', 'dark', 'system'],
    LANGUAGE_OPTIONS: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],
    TIMEZONE_OPTIONS: [
      'UTC',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
    ],
    NOTIFICATION_TYPES: [
      'email',
      'push',
      'sms',
      'in_app'
    ],
  },
} as const;
