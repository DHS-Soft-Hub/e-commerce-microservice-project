'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DefaultLoginPage() {
    const router = useRouter();

    // Default redirect to client login
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/auth/login/client');
        }, 5000); // Redirect after 5 seconds

        return () => clearTimeout(timer);
    }, [router]);

    const handleRoleSelect = (role: 'client' | 'developer') => {
        router.push(`/auth/login/${role}`);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <Card className="form-card animate-in fade-in bg-purple-60/80 dark:bg-purple-600/10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gradient">
                            Welcome to DHS Hub
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                            Please select your role to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() => handleRoleSelect('client')}
                            className="w-full h-12 text-lg glassmorphism bg-blue-500/80 hover:bg-blue-600/80 text-white transition-all duration-300"
                            size="lg"
                        >
                            Continue as Client
                        </Button>

                        <Button
                            onClick={() => handleRoleSelect('developer')}
                            className="w-full h-12 text-lg glassmorphism bg-purple-500/80 hover:bg-purple-600/80 text-white transition-all duration-300"
                            size="lg"
                        >
                            Continue as Developer
                        </Button>

                        <div className="text-center text-sm text-muted-foreground mt-6">
                            Redirecting to Client login in 5 seconds...
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
