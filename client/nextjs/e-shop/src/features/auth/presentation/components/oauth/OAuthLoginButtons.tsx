import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import React from 'react';
import { IOAuthComponentProps, OAuthProvider } from '../../../infrastructure/types/oauth.types';
import { useOAuth, useOAuthProviders } from '../../hooks';
import Link from 'next/link';

/**
 * OAuth Login Buttons Component
 * Displays OAuth provider buttons for social login
 */
export const OAuthLoginButtons: React.FC<IOAuthComponentProps> = ({
  providers,
  onError,
  isLoading: externalLoading = false,
  className = '',
  returnUrl
}) => {
  const { isLoading, error, initiateLogin, clearError } = useOAuth();
  const availableProviders = useOAuthProviders();

  // Filter providers based on props or use all available
  const displayProviders = providers
    ? availableProviders.filter(p => providers.includes(p.name))
    : availableProviders;

  const loading = isLoading || externalLoading;

  const handleProviderLogin = async (provider: OAuthProvider) => {
    clearError();
    try {
      await initiateLogin(provider, returnUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth login failed';
      onError?.({
        code: 'OAUTH_INITIATION_FAILED',
        message: errorMessage,
        provider
      });
    }
  };

  const getProviderIcon = (provider: OAuthProvider) => {
    switch (provider) {
      case 'google':
        return (
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
        );
      case 'github':
        return <Github className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  if (displayProviders.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
          {error}
        </div>
      )}

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

      {/* OAuth Provider Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {displayProviders.map((providerConfig) => (
          <Button
            key={providerConfig.name}
            type="button"
            variant="outline"
            onClick={() => handleProviderLogin(providerConfig.name)}
            disabled={loading}
            className="w-full"
          >
            {getProviderIcon(providerConfig.name)}
            Continue with {providerConfig.displayName}
          </Button>
        ))}
      </div>

      {/* Terms Notice */}
      <p className="text-xs text-center text-muted-foreground mt-4">
        By continuing, you agree to our{' '}
        < Link href="/terms" className="underline hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        < Link href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

/**
 * Simple OAuth Button Component
 * Single button for a specific provider
 */
interface OAuthButtonProps {
  provider: OAuthProvider;
  returnUrl?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onSuccess?: (result: unknown) => void;
  onError?: (error: unknown) => void;
}

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  returnUrl,
  className = '',
  variant = 'outline',
  size = 'default',
  disabled = false,
  onError
}) => {
  const { isLoading, initiateLogin, clearError } = useOAuth();
  const availableProviders = useOAuthProviders();

  const providerConfig = availableProviders.find(p => p.name === provider);

  if (!providerConfig) {
    return null;
  }

  const handleClick = async () => {
    clearError();
    try {
      await initiateLogin(provider, returnUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth login failed';
      onError?.({
        code: 'OAUTH_INITIATION_FAILED',
        message: errorMessage,
        provider
      });
    }
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        );
      case 'github':
        return <Github className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={className}
    >
      {getIcon()}
      {size !== 'icon' && (
        <span className="ml-2">
          {providerConfig.displayName}
        </span>
      )}
    </Button>
  );
};
