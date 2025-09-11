import { IResult } from '@dhs-hub/core';
import { ITwoFactorRepository, ITwoFactorSetupResult, ITwoFactorStatus } from '../../domain/repositories/ITwoFactorRepository';

/**
 * Two-Factor Authentication Application Service
 * Implements business logic for 2FA operations
 * Follows Single Responsibility Principle - focused on 2FA business rules
 * Uses dependency injection for repository abstraction
 */
export class TwoFactorService {
    constructor(
        private readonly twoFactorRepository: ITwoFactorRepository
    ) { }

    /**
     * Setup two-factor authentication for user
     * Business rules:
     * - User must not already have 2FA enabled
     * - Must generate QR code and backup codes
     * @returns Promise with setup data including QR code and backup codes
     */
    async setupTwoFactor(): Promise<IResult<ITwoFactorSetupResult>> {
        try {
            // Delegate to repository for data access
            const result = await this.twoFactorRepository.setupTwoFactor();

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to setup two-factor authentication'),
                };
            }

            // Business rule: Validate setup result contains required data
            const setupData = result.value;
            if (!setupData) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Invalid setup data received'),
                };
            }

            if (!setupData.qrCodeUrl) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('QR code URL is required for setup'),
                };
            }

            if (!setupData.backupCodes || setupData.backupCodes.length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Backup codes are required for setup'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: setupData,
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to setup two-factor authentication'),
            };
        }
    }

    /**
     * Enable two-factor authentication after setup
     * Business rules:
     * - User must have completed setup process
     * - TOTP code must be valid to confirm setup is working
     * - TOTP code must be 6 digits
     * @param totpCode - TOTP code to verify setup is working correctly
     * @returns Promise with operation result
     */
    async enableTwoFactor(totpCode: string): Promise<IResult<void>> {
        try {
            // Business rule: Validate TOTP code format
            if (!totpCode || totpCode.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code is required to enable two-factor authentication'),
                };
            }

            const trimmedTotpCode = totpCode.trim();
            if (!/^\d{6}$/.test(trimmedTotpCode)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code must be exactly 6 digits'),
                };
            }

            // Delegate to repository for data access
            const result = await this.twoFactorRepository.enableTwoFactor(trimmedTotpCode);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to enable two-factor authentication'),
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
                error: new Error(error instanceof Error ? error.message : 'Failed to enable two-factor authentication'),
            };
        }
    }

    /**
     * Disable two-factor authentication
     * Business rules:
     * - User must provide current password for security
     * - Must provide valid TOTP code to confirm identity
     * - Password must not be empty
     * - TOTP code must be 6 digits
     * @param password - User password for security verification
     * @param totpCode - Current TOTP code for verification
     * @returns Promise with operation result
     */
    async disableTwoFactor(password: string, totpCode: string): Promise<IResult<void>> {
        try {
            // Business rule: Validate password
            if (!password || password.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Password is required to disable two-factor authentication'),
                };
            }

            // Business rule: Validate TOTP code format
            if (!totpCode || totpCode.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code is required to disable two-factor authentication'),
                };
            }

            const trimmedTotpCode = totpCode.trim();
            if (!/^\d{6}$/.test(trimmedTotpCode)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code must be 6 digits'),
                };
            }

            // Delegate to repository for data access
            const result = await this.twoFactorRepository.disableTwoFactor(password.trim(), trimmedTotpCode);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to disable two-factor authentication'),
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
                error: new Error(error instanceof Error ? error.message : 'Failed to disable two-factor authentication'),
            };
        }
    }

    /**
     * Verify TOTP code during authentication or setup
     * Business rules:
     * - TOTP code must be 6 digits
     * - Code must not be empty
     * @param totpCode - Time-based one-time password code
     * @returns Promise with verification result
     */
    async verifyTotpCode(totpCode: string): Promise<IResult<boolean>> {
        try {
            // Business rule: Validate TOTP code format
            if (!totpCode || totpCode.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code is required'),
                };
            }

            const trimmedTotpCode = totpCode.trim();
            if (!/^\d{6}$/.test(trimmedTotpCode)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code must be 6 digits'),
                };
            }

            // Delegate to repository for data access
            const result = await this.twoFactorRepository.verifyTotpCode(trimmedTotpCode);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to verify TOTP code'),
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
                error: new Error(error instanceof Error ? error.message : 'Failed to verify TOTP code'),
            };
        }
    }

    /**
     * Verify backup code for account recovery
     * Business rules:
     * - Backup code must not be empty
     * - Backup code format validation (typically alphanumeric)
     * @param backupCode - One-time backup code
     * @returns Promise with verification result
     */
    async verifyBackupCode(backupCode: string): Promise<IResult<boolean>> {
        try {
            // Business rule: Validate backup code
            if (!backupCode || backupCode.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Backup code is required'),
                };
            }

            const trimmedBackupCode = backupCode.trim();

            // Business rule: Basic backup code format validation
            if (trimmedBackupCode.length < 6) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Invalid backup code format'),
                };
            }

            // Delegate to repository for data access
            const result = await this.twoFactorRepository.verifyBackupCode(trimmedBackupCode);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to verify backup code'),
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
                error: new Error(error instanceof Error ? error.message : 'Failed to verify backup code'),
            };
        }
    }

    /**
     * Get QR code URL for authenticator app setup
     * Business rules:
     * - User must be authenticated
     * - 2FA must not already be enabled
     * @returns Promise with QR code URL
     */
    async getQrCodeUrl(): Promise<IResult<string>> {
        try {
            // Delegate to repository for data access
            const result = await this.twoFactorRepository.getQrCodeUrl();

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to get QR code URL'),
                };
            }

            // Business rule: Validate QR code URL
            const qrCodeUrl = result.value;
            if (!qrCodeUrl || qrCodeUrl.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('Invalid QR code URL received'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: qrCodeUrl,
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to get QR code URL'),
            };
        }
    }

    /**
     * Get backup codes for user
     * Business rules:
     * - User must be authenticated
     * - 2FA must be set up
     * @returns Promise with array of backup codes
     */
    async getBackupCodes(): Promise<IResult<string[]>> {
        try {
            // Delegate to repository for data access
            const result = await this.twoFactorRepository.getBackupCodes();

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to get backup codes'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: result.value || [],
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to get backup codes'),
            };
        }
    }

    /**
     * Regenerate backup codes
     * Business rules:
     * - User must be authenticated
     * - 2FA must be enabled
     * - TOTP code must be valid for security verification
     * - Old backup codes will be invalidated
     * @param totpCode - TOTP code for security verification
     * @returns Promise with new backup codes
     */
    async regenerateBackupCodes(totpCode: string): Promise<IResult<string[]>> {
        try {
            // Business rule: Validate TOTP code format
            if (!totpCode || totpCode.trim().length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code is required to regenerate backup codes'),
                };
            }

            const trimmedTotpCode = totpCode.trim();
            if (!/^\d{6}$/.test(trimmedTotpCode)) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('TOTP code must be exactly 6 digits'),
                };
            }

            // Delegate to repository for data access
            const result = await this.twoFactorRepository.regenerateBackupCodes(trimmedTotpCode);

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to regenerate backup codes'),
                };
            }

            // Business rule: Validate new backup codes
            const backupCodes = result.value;
            if (!backupCodes || backupCodes.length === 0) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error('No backup codes generated'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: backupCodes,
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to regenerate backup codes'),
            };
        }
    }

    /**
     * Get two-factor authentication status
     * Business rules:
     * - User must be authenticated
     * @returns Promise with 2FA status information
     */
    async getTwoFactorStatus(): Promise<IResult<ITwoFactorStatus>> {
        try {
            // Delegate to repository for data access
            const result = await this.twoFactorRepository.getTwoFactorStatus();

            if (!result.isSuccess) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: result.error || new Error('Failed to get two-factor status'),
                };
            }

            return {
                isSuccess: true,
                isFailure: false,
                value: result.value || { isEnabled: false, backupCodesCount: 0 },
            };
        } catch (error: unknown) {
            return {
                isSuccess: false,
                isFailure: true,
                error: new Error(error instanceof Error ? error.message : 'Failed to get two-factor status'),
            };
        }
    }
}
