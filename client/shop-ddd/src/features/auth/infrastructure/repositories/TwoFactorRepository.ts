import { store } from '@/store';
import { IResult } from '@dhs-hub/core';
import { ITwoFactorRepository, ITwoFactorSetupResult, ITwoFactorStatus } from '../../domain/repositories/ITwoFactorRepository';
import { authApi } from '../api/authApi';
import { extractErrorMessage } from '../utils';

/**
 * Two-Factor Authentication Repository Implementation
 * Concrete implementation using RTK Query for API communication
 * Implements Repository Pattern for 2FA operations
 */
export class TwoFactorRepository implements ITwoFactorRepository {
    /**
     * Setup two-factor authentication for user
     * Generates QR code and backup codes
     * @returns Promise with setup data including QR code and backup codes
     */
    async setupTwoFactor(): Promise<IResult<ITwoFactorSetupResult>> {
        try {
            // Use the correct setup endpoint that returns everything in one call
            const setupResult = await store.dispatch(
                authApi.endpoints.setup2FA.initiate()
            );

            if ('error' in setupResult) {
                return {
                    isSuccess: false,
                    isFailure: true,
                    error: new Error(extractErrorMessage(setupResult.error)),
                };
            }

            const setupData: ITwoFactorSetupResult = {
                qrCodeUrl: setupResult.data?.qr_code_url || '',
                secret: setupResult.data?.secret || '',
                backupCodes: setupResult.data?.backup_codes || [],
            };

            return {
                isSuccess: true,
                isFailure: false,
                value: setupData,
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
     * Enable two-factor authentication after setup
     * @param totpCode - TOTP code to verify setup is working correctly
     * @returns Promise with operation result
     */
    async enableTwoFactor(totpCode: string): Promise<IResult<void>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.enable2FA.initiate({ totp_code: totpCode })
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
     * Disable two-factor authentication
     * @param password - User password for security verification
     * @param totpCode - Current TOTP code for verification
     * @returns Promise with operation result
     */
    async disableTwoFactor(password: string, totpCode: string): Promise<IResult<void>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.disable2FA.initiate({ password, totp_code: totpCode })
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
     * Verify TOTP code during authentication or setup
     * @param totpCode - Time-based one-time password code
     * @returns Promise with verification result
     */
    async verifyTotpCode(totpCode: string): Promise<IResult<boolean>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.verify2FA.initiate({ totp_code: totpCode })
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
                value: true,
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
     * Verify backup code for account recovery
     * @param backupCode - One-time backup code
     * @returns Promise with verification result
     */
    async verifyBackupCode(backupCode: string): Promise<IResult<boolean>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.verifyBackupCode.initiate({ backup_code: backupCode })
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
                value: true,
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
     * Get QR code URL for authenticator app setup
     * @returns Promise with QR code URL
     */
    async getQrCodeUrl(): Promise<IResult<string>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.get2FAQRCode.initiate()
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
                value: result.data?.qr_code_url || '',
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
     * Get backup codes for user
     * @returns Promise with array of backup codes
     */
    async getBackupCodes(): Promise<IResult<string[]>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.getBackupCodes.initiate()
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
                value: result.data?.backup_codes || [],
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
     * Regenerate backup codes
     * @param totpCode - TOTP code for security verification
     * @returns Promise with new backup codes
     */
    async regenerateBackupCodes(totpCode: string): Promise<IResult<string[]>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.regenerateBackupCodes.initiate({ totp_code: totpCode })
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
                value: result.data?.backup_codes || [],
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
     * Get two-factor authentication status
     * @returns Promise with 2FA status information
     */
    async getTwoFactorStatus(): Promise<IResult<ITwoFactorStatus>> {
        try {
            const result = await store.dispatch(
                authApi.endpoints.get2FAStatus.initiate()
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
                value: {
                    isEnabled: result.data?.two_factor_enabled || false,
                    backupCodesCount: result.data?.backup_codes_remaining || 0,
                },
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
