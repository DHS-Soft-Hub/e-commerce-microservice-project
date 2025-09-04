/**
 * Error utility functions for authentication
 * Follows Single Responsibility Principle - focused on error detection and handling
 */

/**
 * Common email verification error messages from backend
 */
const EMAIL_VERIFICATION_ERROR_MESSAGES = [
    'Please verify your email before logging in',
    'Email not verified',
    'Please verify your email',
    'Email verification required',
    'Account not verified'
] as const;

/**
 * Check if an error message indicates that email verification is required
 * @param errorMessage - Error message to check
 * @returns boolean indicating if error is related to email verification
 */
export function isEmailVerificationError(errorMessage: string): boolean {
    if (!errorMessage) {
        return false;
    }

    const normalizedMessage = errorMessage.toLowerCase().trim();

    return EMAIL_VERIFICATION_ERROR_MESSAGES.some(message =>
        normalizedMessage.includes(message.toLowerCase())
    );
}

/**
 * Extract email from form data or error context
 * @param formData - Form data that might contain an email field
 * @returns string | undefined - Email address if found
 */
export function extractEmailFromContext(formData: Record<string, unknown> | { email?: string } | null | undefined): string | undefined {
    if (!formData) {
        return undefined;
    }

    // First check if it has an email property directly (for typed form data)
    if ('email' in formData && typeof formData.email === 'string') {
        return formData.email;
    }

    // Fallback to checking common field names for untyped data
    const emailFields = ['username', 'user_email', 'emailAddress'];

    for (const field of emailFields) {
        // Type guard to check if formData is Record<string, unknown>
        if (typeof formData === 'object' && formData !== null && !('email' in formData)) {
            const value = (formData as Record<string, unknown>)[field];
            if (value && typeof value === 'string') {
                return value;
            }
        }
    }

    return undefined;
}

/**
 * Check if an error object indicates email verification is required
 * @param error - Error object from API response
 * @returns boolean indicating if error is related to email verification
 */
export function isEmailVerificationErrorFromResponse(error: unknown): boolean {
    if (typeof error === 'string') {
        return isEmailVerificationError(error);
    }

    // Type guard for error objects
    const isErrorWithData = (err: unknown): err is {
        data?: { detail?: string; message?: string };
        message?: string;
        detail?: string;
    } => {
        return typeof err === 'object' && err !== null;
    };

    if (!isErrorWithData(error)) {
        return false;
    }

    // Check different possible error message locations
    const errorMessages = [
        error.data?.detail,
        error.data?.message,
        error.message,
        error.detail
    ].filter(Boolean) as string[];

    return errorMessages.some(msg => isEmailVerificationError(msg));
}

/**
 * Helper function to extract error message from RTK Query error
 */
export function extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
        return error;
    }

    // Type guard for error objects
    const isErrorWithData = (err: unknown): err is { data?: { detail?: string; message?: string }; status?: number; message?: string } => {
        return typeof err === 'object' && err !== null;
    };

    if (!isErrorWithData(error)) {
        return 'Unknown error occurred';
    }

    // Handle the specific error format from your backend:
    // { error: { data: { detail: "message", success: false }, status: 401 } }
    if (error.data?.detail) {
        return error.data.detail;
    }

    if (error.data?.message) {
        // Generic message format
        return error.data.message;
    }

    if (error.message) {
        // Standard error message
        return error.message;
    }

    if (error.status && error.data) {
        // HTTP status error with data
        if (typeof error.data === 'string') {
            return `HTTP ${error.status}: ${error.data}`;
        }
        // Try to extract any text from data object
        const dataStr = JSON.stringify(error.data);
        return `HTTP ${error.status}: ${dataStr}`;
    }

    if (error.status) {
        // HTTP status error without useful data
        return `HTTP ${error.status}: Unknown error`;
    }

    // Fallback: try to stringify the error object
    try {
        return JSON.stringify(error);
    } catch {
        return 'Unknown error occurred';
    }
}
