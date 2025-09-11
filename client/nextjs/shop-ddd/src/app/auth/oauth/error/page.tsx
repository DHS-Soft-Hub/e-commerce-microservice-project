'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * OAuth Error Content Component
 * Contains the main error page logic
 */
function OAuthErrorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const error = searchParams.get('error');
    const provider = searchParams.get('provider');
    const errorCode = searchParams.get('error_code');

    const getErrorMessage = () => {
        if (error) {
            return decodeURIComponent(error);
        }
        return 'An unexpected error occurred during authentication.';
    };

    return (
        <div className="container max-w-screen-md mx-auto my-8 px-4">
            <div className="flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-16 w-16 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl">Authentication Failed</CardTitle>
                        <CardDescription>
                            {provider
                                ? `There was an issue signing in with ${provider.charAt(0).toUpperCase()}${provider.slice(1)}.`
                                : 'There was an issue with the OAuth authentication.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-destructive/10 p-3 rounded-md">
                            <p className="text-sm text-destructive">
                                <strong>Error:</strong> {getErrorMessage()}
                            </p>
                            {errorCode && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Error Code: {errorCode}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Button
                                onClick={() => router.push('/auth/login')}
                                className="w-full"
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/contact')}
                                className="w-full"
                            >
                                Contact Support
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/**
 * OAuth Error Page
 * Displayed when OAuth authentication fails
 * Wrapped in Suspense to handle useSearchParams()
 */
export default function OAuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="container max-w-screen-md mx-auto my-8 px-4">
                <div className="flex justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="h-16 w-16 text-muted-foreground animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl">Loading...</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        }>
            <OAuthErrorContent />
        </Suspense>
    );
}
