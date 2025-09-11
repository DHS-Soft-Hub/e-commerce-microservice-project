'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AUTH_ROUTES from '@/routes/auth.routes';
import { AlertCircle, CheckCircle, Loader2, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useEmailVerification } from '../../hooks/useEmailVerification';

/**
 * Email Verification Form Component
 * Handles URL token-based verification only
 * - If token in URL: auto-verify and redirect or show error with resend option
 * - If no token: show message to check email with resend option
 */

export const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');

  const {
    formData,
    isResending,
    updateField,
    verifyEmail,
    handleResendCode,
  } = useEmailVerification();

  // Component state
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [initialTokenVerification, setInitialTokenVerification] = useState(false);

  // Auto-verify with URL token on component mount
  useEffect(() => {
    const autoVerifyToken = async () => {
      if (urlToken && !initialTokenVerification) {
        setInitialTokenVerification(true);

        try {
          const result = await verifyEmail(undefined, undefined, urlToken);

          if (result && result.success) {
            setVerificationSuccess(true);
          } else {
            setTokenError(result?.error || 'Invalid or expired verification token');
          }
        } catch (error: unknown) {
          setTokenError((error as Error)?.message || 'Verification failed');
        }
      }
    };

    autoVerifyToken();
  }, [urlToken, verifyEmail, initialTokenVerification]);

  // Redirect to login after successful verification
  useEffect(() => {
    if (verificationSuccess) {
      const timeout = setTimeout(() => {
        window.location.href = AUTH_ROUTES.LOGIN;
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [verificationSuccess]);

  // Loading state while auto-verifying token
  if (urlToken && !initialTokenVerification) {
    return (
      <Card className="w-full max-w-md mx-auto p-6">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Verifying Email</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Success state
  if (verificationSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto p-6">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Email verified successfully</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your email address has been verified. Redirecting to login page...
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        </div>
      </Card>
    );
  }

  // Token error state - show resend option
  if (tokenError) {
    return (
      <Card className="w-full max-w-md mx-auto p-6">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Verification Failed</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {tokenError}
            </p>
          </div>

          {/* Resend verification form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="resend-email">Email Address</Label>
              <Input
                id="resend-email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </div>
            <Button
              onClick={handleResendCode}
              disabled={isResending || !formData.email}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = AUTH_ROUTES.LOGIN}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // No token provided - show message to check email with resend option
  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Check Your Email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
          </p>
        </div>

        {/* Resend verification form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
            />
          </div>
          <Button
            onClick={handleResendCode}
            disabled={isResending || !formData.email}
            className="w-full"
            variant="outline"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = AUTH_ROUTES.LOGIN}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </Card>
  );
};
