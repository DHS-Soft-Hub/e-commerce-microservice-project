import { IResult } from '@dhs-hub/core';

/**
 * Two-Factor Authentication Setup Result Interface
 */
export interface ITwoFactorSetupResult {
    qrCodeUrl: string;
    secret: string;
    backupCodes: string[];
}

/**
 * Two-Factor Authentication Status Interface
 */
export interface ITwoFactorStatus {
    isEnabled: boolean;
    backupCodesCount: number;
    lastUsed?: Date;
}

/**
 * Two-Factor Authentication Repository Interface
 * Defines contracts for 2FA data operations
 * Following Interface Segregation Principle - focused on 2FA operations only
 */
export interface ITwoFactorRepository {
    /**
     * Setup two-factor authentication for user
     * Generates QR code and backup codes
     * @returns Promise with setup data including QR code and backup codes
     */
    setupTwoFactor(): Promise<IResult<ITwoFactorSetupResult>>;

    /**
     * Enable two-factor authentication after setup
     * @param totpCode - TOTP code to verify setup is working correctly
     * @returns Promise with operation result
     */
    enableTwoFactor(totpCode: string): Promise<IResult<void>>;

    /**
     * Disable two-factor authentication
     * @param password - User password for security verification
     * @param totpCode - Current TOTP code for verification
     * @returns Promise with operation result
     */
    disableTwoFactor(password: string, totpCode: string): Promise<IResult<void>>;

    /**
     * Verify TOTP code during authentication or setup
     * @param totpCode - Time-based one-time password code
     * @returns Promise with verification result
     */
    verifyTotpCode(totpCode: string): Promise<IResult<boolean>>;

    /**
     * Verify backup code for account recovery
     * @param backupCode - One-time backup code
     * @returns Promise with verification result
     */
    verifyBackupCode(backupCode: string): Promise<IResult<boolean>>;

    /**
     * Get QR code URL for authenticator app setup
     * @returns Promise with QR code URL
     */
    getQrCodeUrl(): Promise<IResult<string>>;

    /**
     * Get backup codes for user
     * @returns Promise with array of backup codes
     */
    getBackupCodes(): Promise<IResult<string[]>>;

    /**
     * Regenerate backup codes
     * @param totpCode - TOTP code for security verification
     * @returns Promise with new backup codes
     */
    regenerateBackupCodes(totpCode: string): Promise<IResult<string[]>>;

    /**
     * Get two-factor authentication status
     * @returns Promise with 2FA status information
     */
    getTwoFactorStatus(): Promise<IResult<ITwoFactorStatus>>;
}
