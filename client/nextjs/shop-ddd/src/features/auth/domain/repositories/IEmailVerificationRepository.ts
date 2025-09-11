import { IResult } from '@dhs-hub/core';

/**
 * Email Verification Repository Interface
 * Defines contracts for email verification data operations
 * Following Interface Segregation Principle - focused on email verification only
 */
export interface IEmailVerificationRepository {
    /**
     * Verify email address with verification token
     * @param token - Combined email:code token or verification token
     * @returns Promise with verification result
     */
    verifyEmail(token: string): Promise<IResult<void>>;

    /**
     * Request new verification code for email
     * @param email - Email address to send verification code to
     * @returns Promise with operation result
     */
    requestVerificationCode(email: string): Promise<IResult<void>>;

    /**
     * Resend existing verification code
     * @param email - Email address to resend code to
     * @returns Promise with operation result
     */
    resendVerificationCode(email: string): Promise<IResult<void>>;

    /**
     * Check if email verification is required for user
     * @param email - Email address to check
     * @returns Promise with verification requirement status
     */
    isVerificationRequired(email: string): Promise<IResult<boolean>>;

    /**
     * Get verification status for email
     * @param email - Email address to check status for
     * @returns Promise with verification status
     */
    getVerificationStatus(email: string): Promise<IResult<{ isVerified: boolean; codeExpiry?: Date }>>;
}
