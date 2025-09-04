'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLoginMutation, useRegisterDeveloperMutation } from '../../../infrastructure/api/authApi';
import { extractEmailFromContext, isEmailVerificationError } from '../../../infrastructure/utils/errorUtils';
import { useAuthTranslations } from '../../hooks/Auth/useAuthTranslations';
import { DeveloperRegistrationFormData, LoginFormData } from '../../types/auth.types';
import { VerifyEmailButton } from '../ui/VerifyEmailButton';

interface DeveloperRegistrationProps {
    onDeveloperCreated: () => void;
    onReturningDeveloperAuthenticated?: () => void;
    readOnly?: boolean;
}

// Validation schemas
const developerRegistrationSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string(),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    tax_id: z.string().optional(),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    skills: z.array(z.string()).optional(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
});

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().default(false),
});

export function DeveloperRegistration({
    onDeveloperCreated,
    onReturningDeveloperAuthenticated,
    readOnly = false
}: DeveloperRegistrationProps) {
    const auth = useAuthTranslations();
    const [loginMode, setLoginMode] = useState<'new' | 'returning'>('returning');
    const [error, setError] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [skillInput, setSkillInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [registerDeveloper] = useRegisterDeveloperMutation();
    const [loginDeveloper] = useLoginMutation();

    // Registration form
    const registrationForm = useForm<DeveloperRegistrationFormData>({
        resolver: zodResolver(developerRegistrationSchema),
        defaultValues: {
            email: '',
            password: '',
            passwordConfirm: '',
            first_name: '',
            last_name: '',
            phone: '',
            tax_id: '',
            github: '',
            linkedin: '',
            skills: [],
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

    // Handle adding skills
    const addSkill = () => {
        const currentSkills = registrationForm.getValues('skills') || [];
        const trimmedSkill = skillInput.trim();

        if (trimmedSkill && !currentSkills.includes(trimmedSkill)) {
            registrationForm.setValue('skills', [...currentSkills, trimmedSkill]);
            setSkillInput('');
        }
    };

    // Handle removing skills
    const removeSkill = (skillToRemove: string) => {
        const currentSkills = registrationForm.getValues('skills') || [];
        registrationForm.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
    };

    // Handle key press in skill input
    const handleSkillKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    // Handle developer registration
    const handleDeveloperRegistration = async (data: DeveloperRegistrationFormData) => {
        try {
            setError(null);
            setIsCreating(true);

            const registrationData = {
                email: data.email,
                password: data.password,
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone || undefined,
                tax_id: data.tax_id || undefined,
                github: data.github || undefined,
                linkedin: data.linkedin || undefined,
                skills: data.skills || undefined,
            };

            const result = await registerDeveloper(registrationData).unwrap().catch((err: unknown) => {
                const error = err as { data?: { message?: string }; message?: string };
                const errorMessage = error?.data?.message || error?.message || auth.errors.generic;
                setError(errorMessage);
                throw new Error(errorMessage);
            });

            if (result.success) {
                // Registration successful, show success message
                onDeveloperCreated();
            }
        } catch (err: unknown) {
            const error = err as { data?: { message?: string }; message?: string };
            const errorMessage = error?.data?.message || error?.message || auth.errors.generic;
            setError(errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    // Handle developer login for returning developers
    const handleDeveloperLogin = async (data: LoginFormData) => {
        try {
            setSearchError(null);
            setError(null);
            setIsSearching(true);

            const credentials = {
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe, // Include remember me preference
            };

            await loginDeveloper(credentials).unwrap().catch((err: unknown) => {
                const error = err as { data?: { detail?: string }; message?: string };
                const errorMessage = error?.data?.detail || error?.message || auth.login.errors.invalidCredentials;
                setSearchError(errorMessage);
                throw new Error(errorMessage);
            });

            if (onReturningDeveloperAuthenticated) {
                onReturningDeveloperAuthenticated();
            } else {
                onDeveloperCreated();
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
                <CardTitle className="text-2xl font-bold text-gradient">{auth.register.developer.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                    {auth.register.developer.subtitle}
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
                    {/* RETURNING DEVELOPER SECTION */}
                    <div
                        className={`option-card glassmorphism ${loginMode === 'returning' ? 'selected' : ''} transition-all duration-300`}
                        onClick={() => !readOnly && setLoginMode('returning')}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-center justify-center mr-3">
                                {loginMode === 'returning' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{auth.login.userTypes.developer} - {auth.register.alreadyHaveAccount}</h3>
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
                                    <form onSubmit={loginForm.handleSubmit(handleDeveloperLogin)} className="space-y-4">
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
                                            className="w-full glassmorphism bg-purple-500/80 hover:bg-purple-600/80 text-white transition-all duration-300"
                                            disabled={readOnly || isSearching}
                                        >
                                            {isSearching ? auth.login.loading : auth.login.submit}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        )}
                    </div>

                    {/* NEW DEVELOPER SECTION */}
                    <div
                        className={`option-card glassmorphism ${loginMode === 'new' ? 'selected' : ''} transition-all duration-300`}
                        onClick={() => !readOnly && setLoginMode('new')}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-center justify-center mr-3">
                                {loginMode === 'new' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{auth.register.title} {auth.login.userTypes.developer}</h3>
                        </div>

                        {loginMode === 'new' && (
                            <div className="animate-in fade-in">
                                <Form {...registrationForm}>
                                    <form onSubmit={registrationForm.handleSubmit(handleDeveloperRegistration)} className="space-y-4">
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

                                        <FormField
                                            control={registrationForm.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.register.phone}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
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
                                                name="github"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{auth.register.githubProfile}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={auth.register.githubProfile}
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
                                                name="linkedin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{auth.register.linkedinProfile}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={auth.register.linkedinProfile}
                                                                disabled={readOnly || isCreating}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Skills Section */}
                                        <FormField
                                            control={registrationForm.control}
                                            name="skills"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{auth.register.skills}</FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder={auth.register.skillsPlaceholder}
                                                                    value={skillInput}
                                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                                    onKeyPress={handleSkillKeyPress}
                                                                    disabled={readOnly || isCreating}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={addSkill}
                                                                    disabled={readOnly || isCreating || !skillInput.trim()}
                                                                >
                                                                    {auth.register.skillsAdd}
                                                                </Button>
                                                            </div>

                                                            {/* Display current skills */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {field.value?.map((skill, index) => (
                                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                                        {skill}
                                                                        <X
                                                                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                                            onClick={() => removeSkill(skill)}
                                                                        />
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full glassmorphism bg-purple-500/80 hover:bg-purple-600/80 text-white transition-all duration-300"
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
