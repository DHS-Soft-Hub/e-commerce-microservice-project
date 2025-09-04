'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLoginMutation, useRegisterClientMutation } from '../../../infrastructure/api/authApi';
import { extractEmailFromContext, isEmailVerificationError } from '../../../infrastructure/utils/errorUtils';
import { useAuthTranslations } from '../../hooks/Auth/useAuthTranslations';
import { ClientRegistrationFormData, LoginFormData } from '../../types/auth.types';
import { VerifyEmailButton } from '../ui/VerifyEmailButton';

interface ClientRegistrationProps {
    onClientCreated: () => void;
    onReturningClientAuthenticated?: () => void;
    readOnly?: boolean;
}

// Validation schemas
const clientRegistrationSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string(),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    tax_id: z.string().optional(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
});

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().default(false),
});

export function ClientRegistration({
    onClientCreated,
    onReturningClientAuthenticated,
    readOnly = false
}: ClientRegistrationProps) {
    const auth = useAuthTranslations();
    const [loginMode, setLoginMode] = useState<'new' | 'returning'>('returning');
    const [error, setError] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [registerClient] = useRegisterClientMutation();
    const [loginClient] = useLoginMutation();

    // Registration form
    const registrationForm = useForm<ClientRegistrationFormData>({
        resolver: zodResolver(clientRegistrationSchema),
        defaultValues: {
            email: '',
            password: '',
            passwordConfirm: '',
            first_name: '',
            last_name: '',
            company: '',
            phone: '',
            address: '',
            tax_id: '',
        },
    });

    // Login form
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    // Handle client registration
    const handleClientRegistration = async (data: ClientRegistrationFormData) => {
        try {
            setError(null);
            setIsCreating(true);

            const registrationData = {
                email: data.email,
                password: data.password,
                first_name: data.first_name,
                last_name: data.last_name,
                company: data.company || undefined,
                phone: data.phone || undefined,
                address: data.address || undefined,
                tax_id: data.tax_id || undefined,
            };

            const result = await registerClient(registrationData).unwrap().catch((err: unknown) => {
                const error = err as { data?: { message?: string }; message?: string };
                const errorMessage = error?.data?.message || error?.message || auth.errors.generic;
                setError(errorMessage);
                throw new Error(errorMessage);
            });

            if (result.success) {
                // Registration successful, show success message
                onClientCreated();
            }
        } catch (err: unknown) {
            const error = err as { data?: { message?: string }; message?: string };
            const errorMessage = error?.data?.message || error?.message || auth.errors.generic;
            setError(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    // Handle client login for returning clients
    const handleClientLogin = async (data: LoginFormData) => {
        try {
            setSearchError(null);
            setError(null);
            setIsSearching(true);

            const credentials = {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe, // Include remember me preference
            };

            await loginClient(credentials).unwrap().catch((err: unknown) => {
                const error = err as { data?: { detail?: string }; message?: string };
                const errorMessage = error?.data?.detail || error?.message || auth.login.errors.invalidCredentials;
                setSearchError(errorMessage);
                throw new Error(errorMessage);
            });

            if (onReturningClientAuthenticated) {
                onReturningClientAuthenticated();
            } else {
                onClientCreated();
            }
        } catch (err: unknown) {
            const error = err as { data?: { detail?: string }; message?: string };
            const errorMessage = error?.data?.detail || error?.message || auth.login.errors.invalidCredentials;
            setSearchError(errorMessage);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Card className="form-card animate-in fade-in bg-purple-60/80 dark:bg-purple-600/10">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gradient">{auth.register.client.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                    {auth.register.client.subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 animate-in fade-in">
                        <div className="flex items-center justify-between gap-3">
                            <span className="flex-1">{error}</span>
                            {isEmailVerificationError(error) && (
                                <VerifyEmailButton
                                    email={extractEmailFromContext(registrationForm.getValues())}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/40"
                                />
                            )}
                        </div>
                    </div>
                )}

                {readOnly && (
                    <div className="glassmorphism bg-purple-50/70 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-4 py-3 rounded-lg mb-4 animate-in fade-in">
                        <strong>{auth.guards.accessDenied}</strong> {auth.guards.noPermission}
                    </div>
                )}

                <div className="space-y-6">
                    {/* RETURNING CLIENT SECTION */}
                    <div
                        className={`option-card glassmorphism ${loginMode === 'returning' ? 'selected' : ''} transition-all duration-300`}
                        onClick={() => !readOnly && setLoginMode('returning')}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-center justify-center mr-3">
                                {loginMode === 'returning' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{auth.login.userTypes.client} - {auth.register.alreadyHaveAccount}</h3>
                        </div>

                        {loginMode === 'returning' && (
                            <div className="animate-in fade-in">
                                {searchError && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex-1">{searchError}</span>
                                            {isEmailVerificationError(searchError) && (
                                                <VerifyEmailButton
                                                    email={extractEmailFromContext(loginForm.getValues())}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/40"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(handleClientLogin)} className="space-y-4">
                                        <FormField
                                            control={loginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.login.email}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder={auth.login.email}
                                                            disabled={readOnly || isSearching}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.login.password}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder={auth.login.password}
                                                            disabled={readOnly || isSearching}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={readOnly || isSearching}
                                        >
                                            {isSearching ? auth.login.loading : auth.login.submit}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        )}
                    </div>

                    {/* NEW CLIENT SECTION */}
                    <div
                        className={`option-card glassmorphism ${loginMode === 'new' ? 'selected' : ''} transition-all duration-300`}
                        onClick={() => !readOnly && setLoginMode('new')}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-center justify-center mr-3">
                                {loginMode === 'new' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{auth.register.title} {auth.login.userTypes.client}</h3>
                        </div>

                        {loginMode === 'new' && (
                            <div className="animate-in fade-in">
                                <Form {...registrationForm}>
                                    <form onSubmit={registrationForm.handleSubmit(handleClientRegistration)} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={registrationForm.control}
                                                name="first_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{auth.register.firstName}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={auth.register.firstName}
                                                                disabled={readOnly || isCreating}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={registrationForm.control}
                                                name="last_name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{auth.register.lastName}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={auth.register.lastName}
                                                                disabled={readOnly || isCreating}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={registrationForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.register.email}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder={auth.register.email}
                                                            disabled={readOnly || isCreating}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registrationForm.control}
                                            name="company"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.register.company}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={auth.register.company}
                                                            disabled={readOnly || isCreating}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registrationForm.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.register.phone}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={auth.register.phone}
                                                            disabled={readOnly || isCreating}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registrationForm.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.register.address}</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={auth.register.address}
                                                            disabled={readOnly || isCreating}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registrationForm.control}
                                            name="tax_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.register.taxId}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={auth.register.taxId}
                                                            disabled={readOnly || isCreating}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={registrationForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{auth.register.password}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder={auth.register.password}
                                                                disabled={readOnly || isCreating}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={registrationForm.control}
                                                name="passwordConfirm"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{auth.register.confirmPassword}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder={auth.register.confirmPassword}
                                                                disabled={readOnly || isCreating}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={readOnly || isCreating}
                                        >
                                            {isCreating ? auth.register.loading : auth.register.submit}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
