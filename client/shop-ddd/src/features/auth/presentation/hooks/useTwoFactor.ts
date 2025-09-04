/**
 * Two-Factor Authentication Hook
 * Custom hook that provides 2FA functionality using TwoFactorService
 * Following the architectural pattern: Hook -> Service -> Repository
 * Follows the principle to use services inside hooks rather than direct API calls
 */

import { useToast } from '@/hooks/use-toast';
import { useCallback, useEffect, useState } from 'react';
import { ITwoFactorSetupResult, ITwoFactorStatus } from '../../domain/repositories/ITwoFactorRepository';
import { TwoFactorServiceFactory } from '../../infrastructure/factories/VerificationServiceFactory';

/**
 * Two-factor authentication hook that uses TwoFactorService
 * Provides methods for 2FA setup, verification, and management
 */
export function useTwoFactor() {
    const twoFactorService = TwoFactorServiceFactory.createTwoFactorService();
    const { toast } = useToast();

    // State management
    const [isSetupLoading, setIsSetupLoading] = useState(false);
    const [isVerifyLoading, setIsVerifyLoading] = useState(false);
    const [isDisableLoading, setIsDisableLoading] = useState(false);
    const [isQRCodeLoading, setIsQRCodeLoading] = useState(false);
    const [isBackupCodesLoading, setIsBackupCodesLoading] = useState(false);

    // Data state
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
    const [twoFactorStatus, setTwoFactorStatus] = useState<ITwoFactorStatus | null>(null);

    /**
     * Setup two-factor authentication
     * This combines getting QR code and backup codes, then enabling 2FA
     */
    const setupTwoFactor = useCallback(async (): Promise<ITwoFactorSetupResult> => {
        setIsSetupLoading(true);
        try {
            const result = await twoFactorService.setupTwoFactor();

            if (result.isSuccess && result.value) {
                setQrCodeUrl(result.value.qrCodeUrl);
                setBackupCodes(result.value.backupCodes);
                return result.value;
            } else {
                const errorMessage = result.error?.message || 'Failed to setup two-factor authentication';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to setup two-factor authentication';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            throw new Error(errorMessage);
        } finally {
            setIsSetupLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Enable two-factor authentication
     * This is called after the user has set up their authenticator app and verified the TOTP code
     * @param totpCode - TOTP code to verify setup is working correctly
     */
    const enableTwoFactor = useCallback(async (totpCode: string): Promise<boolean> => {
        setIsSetupLoading(true);
        try {
            const result = await twoFactorService.enableTwoFactor(totpCode);

            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: "Two-factor authentication enabled successfully!",
                });
                return true;
            } else {
                const errorMessage = result.error?.message || 'Failed to enable two-factor authentication';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to enable two-factor authentication';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            throw new Error(errorMessage);
        } finally {
            setIsSetupLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Verify two-factor authentication code
     * Used both during setup and for login verification
     */
    const verifyTwoFactor = useCallback(async (code: string): Promise<boolean> => {
        setIsVerifyLoading(true);
        try {
            const result = await twoFactorService.verifyTotpCode(code);

            if (result.isSuccess && result.value) {
                return true;
            } else {
                const errorMessage = result.error?.message || 'Failed to verify two-factor authentication code';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to verify two-factor authentication code';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            throw new Error(errorMessage);
        } finally {
            setIsVerifyLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Disable two-factor authentication
     * Requires password and TOTP code for security
     */
    const disableTwoFactor = useCallback(async (password: string, totpCode: string): Promise<boolean> => {
        setIsDisableLoading(true);
        try {
            const result = await twoFactorService.disableTwoFactor(password, totpCode);

            if (result.isSuccess) {
                toast({
                    title: "Success",
                    description: "Two-factor authentication disabled successfully!",
                });
                // Clear local state
                setQrCodeUrl(null);
                setBackupCodes(null);
                // Refresh status
                await getTwoFactorStatus();
                return true;
            } else {
                const errorMessage = result.error?.message || 'Failed to disable two-factor authentication';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to disable two-factor authentication';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            throw new Error(errorMessage);
        } finally {
            setIsDisableLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Verify backup code for account recovery
     */
    const verifyBackupCode = useCallback(async (backupCode: string): Promise<boolean> => {
        setIsVerifyLoading(true);
        try {
            const result = await twoFactorService.verifyBackupCode(backupCode);

            if (result.isSuccess && result.value) {
                toast({
                    title: "Success",
                    description: "Backup code verified successfully!",
                });
                return true;
            } else {
                const errorMessage = result.error?.message || 'Invalid backup code';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to verify backup code';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            throw new Error(errorMessage);
        } finally {
            setIsVerifyLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Get QR code URL for authenticator setup
     */
    const refetchQRCode = useCallback(async () => {
        setIsQRCodeLoading(true);
        try {
            const result = await twoFactorService.getQrCodeUrl();

            if (result.isSuccess && result.value) {
                setQrCodeUrl(result.value);
                return { data: { qr_code_url: result.value } };
            } else {
                const errorMessage = result.error?.message || 'Failed to get QR code';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to get QR code';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            return { error: errorMessage };
        } finally {
            setIsQRCodeLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Get backup codes
     */
    const refetchBackupCodes = useCallback(async () => {
        setIsBackupCodesLoading(true);
        try {
            const result = await twoFactorService.getBackupCodes();

            if (result.isSuccess && result.value) {
                setBackupCodes(result.value);
                return { data: { backup_codes: result.value } };
            } else {
                const errorMessage = result.error?.message || 'Failed to get backup codes';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to get backup codes';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            return { error: errorMessage };
        } finally {
            setIsBackupCodesLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Regenerate backup codes
     * @param totpCode - TOTP code for security verification
     */
    const regenerateBackupCodes = useCallback(async (totpCode: string): Promise<string[]> => {
        setIsBackupCodesLoading(true);
        try {
            const result = await twoFactorService.regenerateBackupCodes(totpCode);

            if (result.isSuccess && result.value) {
                setBackupCodes(result.value);
                toast({
                    title: "Success",
                    description: "Backup codes regenerated successfully!",
                });
                return result.value;
            } else {
                const errorMessage = result.error?.message || 'Failed to regenerate backup codes';
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
                throw new Error(errorMessage);
            }
        } catch (error: unknown) {
            const errorMessage = (error as Error)?.message || 'Failed to regenerate backup codes';
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
            throw new Error(errorMessage);
        } finally {
            setIsBackupCodesLoading(false);
        }
    }, [twoFactorService]);

    /**
     * Get two-factor authentication status
     */
    const getTwoFactorStatus = useCallback(async (): Promise<ITwoFactorStatus | null> => {
        try {
            const result = await twoFactorService.getTwoFactorStatus();

            if (result.isSuccess && result.value) {
                setTwoFactorStatus(result.value);
                return result.value;
            } else {
                return null;
            }
        } catch (error: unknown) {
            console.error('Failed to get two-factor status:', error);
            return null;
        }
    }, [twoFactorService]);

    // Load initial data
    useEffect(() => {
        getTwoFactorStatus();
    }, [getTwoFactorStatus]);

    return {
        // Methods
        setupTwoFactor,
        enableTwoFactor,
        verifyTwoFactor,
        verifyBackupCode,
        disableTwoFactor,
        regenerateBackupCodes,
        getTwoFactorStatus,

        // Loading states
        isSetupLoading,
        isVerifyLoading,
        isDisableLoading,
        isQRCodeLoading,
        isBackupCodesLoading,

        // Data
        qrCodeUrl,
        backupCodes,
        twoFactorStatus,

        // Refetch functions for compatibility
        refetchQRCode,
        refetchBackupCodes,
    };
}
