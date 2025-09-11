/**
 * Message constants
 * Error and success messages for authentication flows
 */

/**
 * Error messages
 */
export const errorMessages = {
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account has been locked due to multiple failed login attempts',
    ACCOUNT_DISABLED: 'Your account has been disabled',
    EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in',
    SESSION_EXPIRED: 'Your session has expired, please log in again',
    TOKEN_INVALID: 'Invalid or expired authentication token',
    TOKEN_REFRESH_FAILED: 'Failed to refresh authentication token',
    LOGOUT_FAILED: 'Failed to log out, please try again',
    TWO_FACTOR_REQUIRED: 'Two-factor authentication is required',
    TWO_FACTOR_INVALID: 'Invalid two-factor authentication code',
  },

  // Registration errors
  REGISTRATION: {
    EMAIL_EXISTS: 'An account with this email already exists',
    USERNAME_EXISTS: 'This username is already taken',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    TERMS_NOT_ACCEPTED: 'You must accept the terms of service',
    INVALID_INVITE_CODE: 'Invalid or expired invitation code',
    REGISTRATION_DISABLED: 'Registration is currently disabled',
  },

  // Password errors
  PASSWORD: {
    CURRENT_INCORRECT: 'Current password is incorrect',
    SAME_AS_CURRENT: 'New password must be different from current password',
    RESET_TOKEN_INVALID: 'Password reset token is invalid or expired',
    RESET_TOKEN_USED: 'Password reset token has already been used',
    RESET_RATE_LIMIT: 'Too many password reset attempts, please try again later',
    HISTORY_VIOLATION: 'Password has been used recently, please choose a different one',
  },

  // Permission errors
  PERMISSION: {
    ACCESS_DENIED: 'You do not have permission to access this resource',
    INSUFFICIENT_PRIVILEGES: 'Insufficient privileges to perform this action',
    ROLE_REQUIRED: 'A specific role is required to access this resource',
    FEATURE_DISABLED: 'This feature is currently disabled',
  },

  // Session errors
  SESSION: {
    EXPIRED: 'Your session has expired',
    INVALID: 'Invalid session',
    CONCURRENT_LIMIT: 'Maximum number of concurrent sessions reached',
    DEVICE_NOT_TRUSTED: 'Device is not trusted',
    SUSPICIOUS_ACTIVITY: 'Suspicious activity detected',
  },

  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    TOO_SHORT: 'Value is too short',
    TOO_LONG: 'Value is too long',
    INVALID_CHARACTERS: 'Contains invalid characters',
    MISMATCH: 'Values do not match',
  },

  // Network errors
  NETWORK: {
    CONNECTION_FAILED: 'Failed to connect to server',
    TIMEOUT: 'Request timed out',
    SERVER_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    RATE_LIMITED: 'Too many requests, please try again later',
  },

  // Generic errors
  GENERIC: {
    UNKNOWN_ERROR: 'An unknown error occurred',
    OPERATION_FAILED: 'Operation failed',
    TRY_AGAIN: 'Please try again',
    CONTACT_SUPPORT: 'Please contact support if the problem persists',
  },
} as const;

/**
 * Success messages
 */
export const successMessages = {
  AUTH: {
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
    REGISTRATION_SUCCESS: 'Account created successfully',
    EMAIL_VERIFIED: 'Email address verified successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
    TWO_FACTOR_ENABLED: 'Two-factor authentication enabled',
    TWO_FACTOR_DISABLED: 'Two-factor authentication disabled',
  },
  PROFILE: {
    UPDATED: 'Profile updated successfully',
    AVATAR_UPLOADED: 'Avatar uploaded successfully',
    EMAIL_CHANGED: 'Email address changed successfully',
    PREFERENCES_SAVED: 'Preferences saved successfully',
  },
  SESSION: {
    TERMINATED: 'Session terminated successfully',
    ALL_TERMINATED: 'All sessions terminated successfully',
  },
} as const;
