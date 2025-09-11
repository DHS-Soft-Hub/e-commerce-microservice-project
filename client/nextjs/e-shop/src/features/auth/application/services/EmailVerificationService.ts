import { IResult } from '@dhs-hub/core';
import { IEmailVerificationRepository } from '../../domain/repositories/IEmailVerificationRepository';

/**
 * Email Verification Application Service        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Resend verification failed'),
            };mplements business logic for email verification operations
 * Follows Single Responsibility Principle - focused on email verification business rules
 * Uses dependency injection for repository abstraction
 */
export class EmailVerificationService {
    constructor(
        private readonly emailVerificationRepository: IEmailVerificationRepository
    ) { }

    /**
     * Verify user email with verification token
     * Business rules:
     * - Token must be valid format (email:code or verification token)
     * - Handles both token formats for backward compatibility
     * @param token - Verification token (email:code format or direct token)
     * @returns Promise with verification result
     */
    async verifyEmail(token: string): Promise<IResult<void>> {
        try {
            // Validate token format
            if (!token || token.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Verification token is required'),
                };
            }

            // Business rule: Support both email:code and direct token formats
            const trimmedToken = token.trim();

            // If token contains colon, validate email:code format
            if (trimmedToken.includes(':')) {
                const [email, code] = trimmedToken.split(':');

                if (!email || !code) {
                    return {
                        isSuccess: false,
                        isFailure: true,
                        error: new Error('Invalid token format. Expected email:code'),
                    };
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return {
                        isSuccess: false,
                        isFailure: true,
                        error: new Error('Invalid email format in token'),
                    };
                }

                // Validate code format (8 digits)
                if (!/^\d{8}$/.test(code)) {
                    return {
                        isSuccess: false,
                        isFailure: true,
                        error: new Error('Invalid verification code format. Expected 8 digits'),
                    };
                }
            }

            // Delegate to repository for data access
            const result = await this.emailVerificationRepository.verifyEmail(trimmedToken);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Email verification failed'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: undefined,
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Email verification failed'),
            };
        }
    }

    /**
     * Request new verification code for email
     * Business rules:
     * - Email must be valid format
     * - Rate limiting should be handled by backend
     * @param email - Email address to send verification code to
     * @returns Promise with operation result
     */
    async requestNewVerificationCode(email: string): Promise<IResult<void>> {
        try {
            // Validate email format
            if (!email || email.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Email address is required'),
                };
            }

            const trimmedEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(trimmedEmail)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Please enter a valid email address'),
                };
            }

            // Delegate to repository for data access
            const result = await this.emailVerificationRepository.requestVerificationCode(trimmedEmail);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to send verification code'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: undefined,
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to request verification code'),
            };
        }
    }

    /**
     * Resend existing verification code
     * Business rules:
     * - Email must be valid format
     * - Previous verification attempt must exist
     * @param email - Email address to resend verification code to
     * @returns Promise with operation result
     */
    async resendVerificationCode(email: string): Promise<IResult<void>> {
        try {
            // Validate email format
            if (!email || email.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Email address is required'),
                };
            }

            const trimmedEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(trimmedEmail)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Please enter a valid email address'),
                };
            }

            // Delegate to repository for data access
            const result = await this.emailVerificationRepository.resendVerificationCode(trimmedEmail);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to resend verification code'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: undefined,
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to resend verification code'),
            };
        }
    }

    /**
     * Check if email verification is required
     * Business rules:
     * - Email must be valid format
     * @param email - Email address to check
     * @returns Promise with verification requirement status
     */
    async isVerificationRequired(email: string): Promise<IResult<boolean>> {
        try {
            // Validate email format
            if (!email || email.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Email address is required'),
                };
            }

            const trimmedEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(trimmedEmail)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Please enter a valid email address'),
                };
            }

            // Delegate to repository for data access
            const result = await this.emailVerificationRepository.isVerificationRequired(trimmedEmail);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to check verification requirement'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: result.value || false,
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to check verification requirement'),
            };
        }
    }

    /**
     * Get verification status for email
     * Business rules:
     * - Email must be valid format
     * @param email - Email address to check status for
     * @returns Promise with verification status
     */
    async getVerificationStatus(email: string): Promise<IResult<{ isVerified: boolean; codeExpiry?: Date }>> {
        try {
            // Validate email format
            if (!email || email.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Email address is required'),
                };
            }

            const trimmedEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(trimmedEmail)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Please enter a valid email address'),
                };
            }

            // Delegate to repository for data access
            const result = await this.emailVerificationRepository.getVerificationStatus(trimmedEmail);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to get verification status'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: result.value || { isVerified: false },
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to get verification status'),
            };
        }
    }
}
