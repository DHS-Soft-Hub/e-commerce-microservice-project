import { store } from '@/store';
import { IResult } from '@dhs-hub/core';
import { IEmailVerificationRepository } from '../../domain/repositories/IEmailVerificationRepository';
import { authApi } from '../api/authApi';
import { extractErrorMessage } from '../utils';

/**
 * Email Verification Repository Implementation
 * Concrete implementation using RTK Query for API communication
 * Implements Repository Pattern for email verification operations
 */
export class EmailVerificationRepository implements IEmailVerificationRepository {
    /**
     * Verify email address with verification token
     * @param token - Combined email:code token or verification token
     * @returns Promise with verification result
     */
    async verifyEmail(token: string): Promise<IResult<void>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.verifyEmail.initiate({ token })
            );

            if ('error' in result) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error(extractErrorMessage(result.error)),
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
                error: new Error(extractErrorMessage(error)),
            };
        }
    }

    /**
     * Request new verification code for email
     * @param email - Email address to send verification code to
     * @returns Promise with operation result
     */
    async requestVerificationCode(email: string): Promise<IResult<void>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.resendVerification.initiate({ email })
            );

            if ('error' in result) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error(extractErrorMessage(result.error)),
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
                error: new Error(extractErrorMessage(error)),
            };
        }
    }

    /**
     * Resend existing verification code
     * @param email - Email address to resend code to
     * @returns Promise with operation result
     */
    async resendVerificationCode(email: string): Promise<IResult<void>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.resendVerification.initiate({ email })
            );

            if ('error' in result) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error(extractErrorMessage(result.error)),
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
                error: new Error(extractErrorMessage(error)),
            };
        }
    }

    /**
     * Check if email verification is required for user
     * @param email - Email address to check
     * @returns Promise with verification requirement status
     */
    async isVerificationRequired(_email: string): Promise<IResult<boolean>> {
        try {
            // Note: This would typically be a separate API endpoint
            // For now, we'll assume verification is required if user is not verified
            // This could be enhanced with a dedicated endpoint
            return {
                isSuccess: true,
                isFailure: false,
                value: true, // Default assumption
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(extractErrorMessage(error)),
            };
        }
    }

    /**
     * Get verification status for email
     * @param email - Email address to check status for
     * @returns Promise with verification status
     */
    async getVerificationStatus(_email: string): Promise<IResult<{ isVerified: boolean; codeExpiry?: Date }>> {
        try {
            // Note: This would typically require a dedicated API endpoint
            // For now, we'll return a default status
            // This should be implemented with proper backend endpoint
            return {
                isSuccess: true,
                isFailure: false,
                value: { isVerified: false },
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(extractErrorMessage(error)),
            };
        }
    }
}
