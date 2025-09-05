'use client';

import { OAuthCallbackHandler } from '@/features/auth/presentation/components/oauth/OAuthCallbackHandler';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface OAuthCallbackPageProps {
    params: Promise<{
        provider: string;
    }>;
}

/**
 * OAuth Callback Page
 * Handles OAuth callback from providers (Google, GitHub, etc.)
 */
export default function OAuthCallbackPage({ params }: OAuthCallbackPageProps) {
    const router = useRouter();

    // Validate provider
    const validProviders = useMemo(() => ['google', 'github'], []);

    useEffect(() => {
        const checkProvider = async () => {
            const resolvedParams = await params;
            const provider = resolvedParams.provider;

            if (!validProviders.includes(provider)) {
                router.push('/auth/login?error=Invalid OAuth provider');
                return;
            }
        };

        checkProvider();
    }, [params, router, validProviders]);

    return (
        <div className="container max-w-screen-md mx-auto my-8 px-4">
            <div className="flex justify-center">
                <div className="w-full max-w-md">
                    <OAuthCallbackHandler />
                </div>
            </div>
        </div>
    );
}
