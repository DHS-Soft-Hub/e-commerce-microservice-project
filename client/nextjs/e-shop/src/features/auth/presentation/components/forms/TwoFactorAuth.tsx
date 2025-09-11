'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { twoFactorVerifySchema, TwoFactorVerifyValues } from './validation-schemas';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTwoFactor } from '../../hooks/useTwoFactor';

interface TwoFactorSetupProps {
    onComplete?: (success: boolean) => void;
    redirectUrl?: string;
}

/**
 * Two-factor authentication setup component
 */
export function TwoFactorSetup({ onComplete, redirectUrl }: TwoFactorSetupProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
    const router = useRouter();

    // Use the custom two-factor hook
    const {
        setupTwoFactor,
        enableTwoFactor,
    } = useTwoFactor();

    const form = useForm<TwoFactorVerifyValues>({
        resolver: zodResolver(twoFactorVerifySchema),
        defaultValues: {
            code: '',
        },
    });

    // Fetch 2FA setup data
    const handleSetupTwoFactor = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await setupTwoFactor();
            setQrCodeUrl(response.qrCodeUrl);
            setSecret(response.secret);
            if (response.backupCodes) {
                setBackupCodes(response.backupCodes);
            }
            setStep('verify');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to set up two-factor authentication.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Verify 2FA code and enable 2FA
    const verifyCode = async (data: TwoFactorVerifyValues) => {
        setIsLoading(true);
        setError(null);

        try {
            // Verify the code and enable 2FA in one step
            const enabled = await enableTwoFactor(data.code);
            if (enabled) {
                setStep('backup');
            } else {
                setError('Invalid verification code. Please try again.');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to verify code.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Complete setup
    const completeSetup = () => {
        if (onComplete) {
            onComplete(true);
        }

        if (redirectUrl) {
            router.push(redirectUrl);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {step === 'setup' ? 'Set Up Two-Factor Authentication' :
                        step === 'verify' ? 'Verify Two-Factor Authentication' :
                            'Save Your Backup Codes'}
                </CardTitle>
                <CardDescription>
                    {step === 'setup' ? 'Enhance your account security with two-factor authentication' :
                        step === 'verify' ? 'Scan the QR code with your authenticator app and enter the code' :
                            'Store these backup codes safely to regain access if you lose your device'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {step === 'setup' && (
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-sm text-center">
                            Two-factor authentication adds an extra layer of security to your account.
                            Once enabled, you&apos;ll need your password and a code from your authenticator app to log in.
                        </p>
                        <Button
                            onClick={handleSetupTwoFactor}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? 'Setting up...' : 'Set Up Two-Factor Authentication'}
                        </Button>
                    </div>
                )}

                {step === 'verify' && qrCodeUrl && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="border p-2 inline-block">
                            <QRCodeSVG value={qrCodeUrl} size={200} />
                        </div>

                        {secret && (
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    If you can&apos;t scan the QR code, enter this code manually:
                                </p>
                                <code className="bg-muted p-1 rounded text-sm font-mono">
                                    {secret}
                                </code>
                            </div>
                        )}

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(verifyCode)} className="w-full space-y-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verification Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter 6-digit code"
                                                    {...field}
                                                    maxLength={6}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Code'}
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}

                {step === 'backup' && backupCodes.length > 0 && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-full p-4 bg-muted rounded">
                            <h3 className="font-medium mb-2">Backup Codes</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {backupCodes.map((code, index) => (
                                    <code key={index} className="font-mono text-sm">
                                        {code}
                                    </code>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-center text-muted-foreground">
                            Save these backup codes in a secure place. Each code can only be used once.
                        </p>

                        <Button
                            onClick={completeSetup}
                            className="w-full"
                        >
                            I&apos;ve Saved My Backup Codes
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface TwoFactorVerifyProps {
    userId?: number;
    onSuccess?: () => void;
    redirectUrl?: string;
}

/**
 * Two-factor verification component
 */
export function TwoFactorVerify({ onSuccess, redirectUrl }: TwoFactorVerifyProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { verifyTwoFactor } = useTwoFactor();

    const form = useForm<TwoFactorVerifyValues>({
        resolver: zodResolver(twoFactorVerifySchema),
        defaultValues: {
            code: '',
        },
    });

    async function onSubmit(data: TwoFactorVerifyValues) {
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await verifyTwoFactor(data.code);

            if (result) {
                if (onSuccess) {
                    onSuccess();
                }

                if (redirectUrl) {
                    router.push(redirectUrl);
                }
            } else {
                setError('Invalid verification code. Please try again.');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to verify code.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
                <CardDescription>
                    Enter the code from your authenticator app
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter 6-digit code"
                                            {...field}
                                            maxLength={6}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify Code'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
