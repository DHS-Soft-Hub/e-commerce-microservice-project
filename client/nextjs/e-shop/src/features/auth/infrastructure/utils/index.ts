/**
 * Authentication utilities index
 * Re-exports all utility classes and functions
 */

// Validation utilities
export { ValidationUtils } from './validation';

// Permission utilities
export { PermissionUtils } from './permissions';

// Redirect utilities
export { RedirectUtils } from './redirects';

// Security utilities
export { SecurityUtils } from './security';

// Authentication utilities
export * from './authUtils';

// Error handling utilities
export * from './errorUtils';

// Legacy exports for backward compatibility
export { validateEmail, validatePassword } from './validation';

