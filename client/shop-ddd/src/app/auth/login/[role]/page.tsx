'use client';

import { ClientRegistration } from '@/features/auth/presentation/components/forms/ClientLogin';
import { DeveloperRegistration } from '@/features/auth/presentation/components/forms/DeveloperLogin';
import { AuthLayout } from '@/features/auth/presentation/components/layout';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

type UserRole = 'client' | 'developer';

export default function RoleLoginPage() {
    const params = useParams();
    const router = useRouter();
    const role = params?.role as UserRole;

    // Validate role parameter
    useEffect(() => {
        if (!role || !['client', 'developer'].includes(role)) {
            // Redirect to a default login page if role is invalid
            router.push('/auth/login/client');
            return;
        }
    }, [role, router]);

    if (!role || !['client', 'developer'].includes(role)) {
        return null; // Show nothing while redirecting
    }

    const handleAuthenticationSuccess = () => {
        // Redirect to the appropriate role-based dashboard
        router.push(`/${role}/dashboard`);
    };

    const handleReturningUserAuthenticated = () => {
        // For returning users, also redirect to dashboard
        router.push(`/${role}/dashboard`);
    };

    const roleConfig = {
        client: {
            bgGradient: 'from-blue-500/5 via-transparent to-blue-600/5',
        },
        developer: {
            bgGradient: 'from-purple-500/5 via-transparent to-purple-600/5',
        }
    };

    const config = roleConfig[role];

    return (
        <AuthLayout showHeader={false} showFooter={false}>
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                {/* Role-specific background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} pointer-events-none`} />

                <div className="relative z-10 w-full max-w-2xl">
                    {role === 'client' && (
                        <ClientRegistration
                            onClientCreated={handleAuthenticationSuccess}
                            onReturningClientAuthenticated={handleReturningUserAuthenticated}
                            readOnly={false}
                        />
                    )}

                    {role === 'developer' && (
                        <DeveloperRegistration
                            onDeveloperCreated={handleAuthenticationSuccess}
                            onReturningDeveloperAuthenticated={handleReturningUserAuthenticated}
                            readOnly={false}
                        />
                    )}
                </div>
            </div>
        </AuthLayout>
    );
}
