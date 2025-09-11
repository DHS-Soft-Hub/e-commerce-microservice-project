'use client';

import { Button } from '@/components/ui/button';
import AUTH_ROUTES from '@/routes/auth.routes';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VerifyEmailButtonProps {
    email?: string;
    className?: string;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Verify Email Button Component
 * Provides a consistent way to redirect users to email verification page
 * Follows Component Composition Pattern for reusability
 */
export function VerifyEmailButton({
    email,
    className = '',
    variant = 'outline',
    size = 'sm'
}: VerifyEmailButtonProps) {
    const router = useRouter();

    const handleVerifyEmail = () => {
        // Construct the verification URL with email parameter if available
        let verificationUrl = AUTH_ROUTES.EMAIL_VERIFICATION;

        if (email) {
            const url = new URL(verificationUrl, window.location.origin);
            url.searchParams.set('email', email);
            verificationUrl = url.pathname + url.search;
        }

        router.push(verificationUrl);
    };

    return (
        <Button
            onClick={handleVerifyEmail}
            variant={variant}
            size={size}
            className={`inline-flex items-center gap-2 ${className}`}
        >
            <Mail className="w-4 h-4" />
            Verify Email
        </Button>
    );
}
