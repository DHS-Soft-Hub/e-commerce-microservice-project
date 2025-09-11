'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import { usePasswordReset } from '../../hooks/usePasswordReset';

/**
 * Forgot Password Form Component
 * Multi-step password reset process
 * Step 1: Request password reset via email
 */
export const ForgotPasswordForm = () => {
  const {
    email,
    isLoading,
    error,
    isEmailSent,
    updateEmail,
    handleSubmitEmailRequest,
    isEmailValid
  } = usePasswordReset();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitEmailRequest();
  };

  // Success state after email is sent
  if (isEmailSent) {
    return (
      <Card className="w-full max-w-md mx-auto p-6">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
            <p className="text-sm text-muted-foreground mt-2">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <Alert>
            <AlertDescription>
              If you don&apos;t see the email, check your spam folder or try again with a different email address.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/auth/login'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>

            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => window.location.reload()}
            >
              Try with different email
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Reset your password</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={(e) => updateEmail(e.target.value)}
                required
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isEmailValid || isLoading}
          >
            {isLoading ? 'Sending...' : 'Send reset link'}
          </Button>

          {/* Back to Login */}
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => window.location.href = '/auth/login'}
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </form>
      </div>
    </Card>
  );
};
