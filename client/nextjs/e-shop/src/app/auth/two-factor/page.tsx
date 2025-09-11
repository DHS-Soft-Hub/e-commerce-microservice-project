'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TwoFactorSetup, TwoFactorVerify } from '@/features/auth/presentation/components/forms/TwoFactorAuth';
import AUTH_ROUTES from '@/routes/auth.routes';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Two-Factor Authentication Page Component with Search Params
 * Handles the internal content that requires useSearchParams
 */
function TwoFactorAuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get mode from URL params (setup, verify, or default to setup)
    const mode = searchParams.get('mode') || 'setup';
    const redirectUrl = searchParams.get('redirect') || '/dashboard';
    const userIdParam = searchParams.get('userId');
    const userId = userIdParam ? parseInt(userIdParam, 10) : undefined;

    const handleBackToLogin = () => {
        router.push(AUTH_ROUTES.LOGIN);
    };

    const handleSetupComplete = (success: boolean) => {
        if (success) {
            // Redirect to specified URL or dashboard
            router.push(redirectUrl);
        }
    };

    const handleVerifySuccess = () => {
        // Redirect to specified URL or dashboard
        router.push(redirectUrl);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {mode === 'verify' ? 'Two-Factor Authentication' : 'Secure Your Account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {mode === 'verify'
                            ? 'Enter your authentication code to continue'
                            : 'Set up two-factor authentication for enhanced security'
                        }
                    </p>
                </div>

                {/* Two-Factor Component */}
                {mode === 'verify' ? (
                    <TwoFactorVerify
                        userId={userId}
                        onSuccess={handleVerifySuccess}
                        redirectUrl={redirectUrl}
                    />
                ) : (
                    <TwoFactorSetup
                        onComplete={handleSetupComplete}
                        redirectUrl={redirectUrl}
                    />
                )}

                {/* Navigation */}
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={handleBackToLogin}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Button>
                </div>

                {/* Help Text */}
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="text-sm text-green-800">
                            <p className="font-medium mb-2">Security Information</p>
                            <ul className="space-y-1 text-green-700">
                                <li>• Two-factor authentication adds an extra layer of security</li>
                                <li>• Use apps like Google Authenticator or Authy</li>
                                <li>• Save your backup codes in a secure location</li>
                                <li>• You can disable 2FA anytime from your account settings</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/**
 * Two-Factor Authentication Page Component
 * Wraps content in Suspense boundary for useSearchParams
 */
export default function TwoFactorAuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading two-factor authentication...</p>
                </div>
            </div>
        }>
            <TwoFactorAuthContent />
        </Suspense>
    );
}
