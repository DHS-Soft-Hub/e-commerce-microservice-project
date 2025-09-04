'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VerifyEmailForm } from '@/features/auth/presentation/components/forms/VerifyEmailForm';
import AUTH_ROUTES from '@/routes/auth.routes';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

/**
 * Email Verification Page Component with Search Params
 * Handles the internal content that requires useSearchParams
 */
function EmailVerificationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get email from URL params if available
    const emailFromParams = searchParams.get('email');
    const tokenFromParams = searchParams.get('token');

    // If there's a token in the URL, this might be a direct verification link
    useEffect(() => {
        if (tokenFromParams) {
            // Could automatically attempt verification here
            console.log('Direct verification token detected:', tokenFromParams);
        }
    }, [tokenFromParams]);

    const handleBackToLogin = () => {
        router.push(AUTH_ROUTES.LOGIN);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please check your email and enter the verification code to continue
                    </p>
                    {emailFromParams && (
                        <p className="mt-1 text-sm text-blue-600">
                            Verification code sent to: {emailFromParams}
                        </p>
                    )}
                </div>

                {/* Verification Form */}
                <VerifyEmailForm />

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
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-2">Need help?</p>
                            <ul className="space-y-1 text-blue-700">
                                <li>• Check your spam/junk folder</li>
                                <li>• Verification codes expire after 15 minutes</li>
                                <li>• Use the &quot;Resend Code&quot; button if needed</li>
                                <li>• Contact support if you continue having issues</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/**
 * Email Verification Page Component
 * Wraps content in Suspense boundary for useSearchParams
 */
export default function EmailVerificationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading verification page...</p>
                </div>
            </div>
        }>
            <EmailVerificationContent />
        </Suspense>
    );
}
