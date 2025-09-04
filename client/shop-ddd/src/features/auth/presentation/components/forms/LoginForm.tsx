'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuthState } from '../../providers/AuthStateProvider';
import { LoginFormData } from '../../types/auth.types';
import { OAuthLoginButtons } from '../oauth/OAuthLoginButtons';
import Link from 'next/link';

interface LoginFormProps {
  onSuccess?: () => void;
  allowUserTypeSelection?: boolean;
  defaultUserType?: 'client' | 'developer' | 'basic';
}

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
  userType: z.enum(['client', 'developer', 'basic']).optional(),
  totpCode: z.string().optional(),
});

/**
 * Login Form Component
 * Handles user authentication with email and password
 * Supports different user types (client, developer, basic)
 */
export const LoginForm = ({
  onSuccess,
  allowUserTypeSelection = true,
  defaultUserType = 'basic'
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading } = useAuthState();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      userType: defaultUserType,
      totpCode: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError(null);

      const credentials = {
        email: data.email,
        password: data.password,
        totp_code: data.totpCode || undefined,
      };

      await login(credentials, data.userType || defaultUserType);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const error = err as { data?: { detail?: string }; message?: string };
      const errorMessage = error?.data?.detail || error?.message || 'Login failed';
      setError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email and password to access your account
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            {/* User Type Selection */}
            {allowUserTypeSelection && (
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic User</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        disabled={isLoading}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TOTP Code Field (Optional) */}
            <FormField
              control={form.control}
              name="totpCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two-Factor Code (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Remember me</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Keep me signed in on this device
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {/* OAuth Login Buttons */}
        <OAuthLoginButtons
          providers={['google', 'github']}
          returnUrl="/dashboard"
          onSuccess={onSuccess}
          onError={(error) => {
            setError(error.message || 'OAuth authentication failed');
          }}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
};          
