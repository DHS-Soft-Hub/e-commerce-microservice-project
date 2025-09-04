'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

/**
 * OAuth Success Content Component
 * Contains the main success page logic
 */
function OAuthSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const provider = searchParams.get('provider');
    const isNewUser = searchParams.get('is_new_user') === 'true';

    useEffect(() => {
        // Auto-redirect after 3 seconds
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="container max-w-screen-md mx-auto my-8 px-4">
            <div className="flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl">Authentication Successful!</CardTitle>
                        <CardDescription>
                            {isNewUser
                                ? `Welcome! Your account has been created using ${provider?.charAt(0).toUpperCase()}${provider?.slice(1)}.`
                                : `Welcome back! You've successfully signed in with ${provider?.charAt(0).toUpperCase()}${provider?.slice(1)}.`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            You will be redirected to your dashboard in a few seconds...
                        </p>
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="w-full"
                        >
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/**
 * OAuth Success Page
 * Displayed after successful OAuth authentication
 * Wrapped in Suspense to handle useSearchParams()
 */
export default function OAuthSuccessPage() {
    return (
        <Suspense fallback={
            <div className="container max-w-screen-md mx-auto my-8 px-4">
                <div className="flex justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="h-16 w-16 text-muted-foreground animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl">Loading...</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        }>
            <OAuthSuccessContent />
        </Suspense>
    );
}
