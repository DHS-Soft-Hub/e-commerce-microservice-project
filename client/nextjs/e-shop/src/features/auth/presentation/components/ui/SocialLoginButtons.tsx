'use client';

import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { OAuthProvider } from '../../../infrastructure/types/oauth.types';
import { OAuthLoginButtons } from '../oauth';
import Link from 'next/link';

interface SocialLoginButtonsProps {
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  onMicrosoftLogin?: () => void;
  isLoading?: boolean;
  className?: string;
  returnUrl?: string;
  providers?: OAuthProvider[];
}

/**
 * Social Login Buttons Component
 * Updated to use the new OAuth system while maintaining backward compatibility
 */
export const SocialLoginButtons = ({
  onGoogleLogin,
  onGithubLogin,
  onMicrosoftLogin,
  isLoading = false,
  className = '',
  returnUrl,
  providers = ['google', 'github']
}: SocialLoginButtonsProps) => {
  // If custom handlers are provided, use legacy implementation
  if (onGoogleLogin || onGithubLogin || onMicrosoftLogin) {
    return <LegacySocialLoginButtons
      onGoogleLogin={onGoogleLogin}
      onGithubLogin={onGithubLogin}
      onMicrosoftLogin={onMicrosoftLogin}
      isLoading={isLoading}
      className={className}
    />;
  }

  // Use new OAuth system
  return (
    <OAuthLoginButtons
      providers={providers}
      isLoading={isLoading}
      className={className}
      returnUrl={returnUrl}
    />
  );
};

/**
 * Legacy Social Login Implementation
 * Kept for backward compatibility
 */
const LegacySocialLoginButtons = ({
  onGoogleLogin,
  onGithubLogin,
  onMicrosoftLogin,
  isLoading = false,
  className = ''
}: Omit<SocialLoginButtonsProps, 'returnUrl' | 'providers'>) => {
  const handleGoogleLogin = async () => {
    try {
      if (onGoogleLogin) {
        onGoogleLogin();
      } else {
        // Default Google OAuth flow (legacy)
        window.location.href = '/api/auth/google';
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      if (onGithubLogin) {
        onGithubLogin();
      } else {
        // Default GitHub OAuth flow (legacy)
        window.location.href = '/api/auth/github';
      }
    } catch (error) {
      console.error('GitHub login failed:', error);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      if (onMicrosoftLogin) {
        onMicrosoftLogin();
      } else {
        // Default Microsoft OAuth flow (legacy)
        window.location.href = '/api/auth/microsoft';
      }
    } catch (error) {
      console.error('Microsoft login failed:', error);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full"
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        {/* GitHub Login */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGithubLogin}
          disabled={isLoading}
          className="w-full"
        >
          <Github className="w-4 h-4 mr-2" />
          Continue with GitHub
        </Button>

        {/* Microsoft Login */}
        <Button
          type="button"
          variant="outline"
          onClick={handleMicrosoftLogin}
          disabled={isLoading}
          className="w-full"
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00A4EF" />
          </svg>
          Continue with Microsoft
        </Button>
      </div>

      {/* Terms Notice */}
      <p className="text-xs text-center text-muted-foreground mt-4">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};
