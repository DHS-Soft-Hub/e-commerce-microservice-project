'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useOAuth, useOAuthCallbackParams } from '../../hooks';

/**
 * OAuth Callback Handler Component
 * Handles OAuth callback and redirects user appropriately
 */
export const OAuthCallbackHandler: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Processing authentication...');

  const router = useRouter();
  const { handleCallback, error } = useOAuth();
  const callbackParams = useOAuthCallbackParams();

  useEffect(() => {
    const processCallback = async () => {
      if (!callbackParams) {
        setStatus('error');
        setMessage('Invalid OAuth callback parameters');
        return;
      }

      try {
        setStatus('loading');
        setMessage('Completing authentication...');

        await handleCallback(callbackParams);

        // If we reach here, authentication was successful
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
      } catch (error) {
        setStatus('error');
        setMessage((error as Error)?.message || 'Authentication failed. Please try again.');
      }
    };

    processCallback();
  }, [callbackParams, handleCallback, error]);

  const handleRetry = () => {
    router.push('/auth/login');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h2 className="text-xl font-semibold">Authenticating...</h2>
            <p className="text-muted-foreground text-center">
              {message}
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-xl font-semibold text-green-600">Success!</h2>
            <p className="text-muted-foreground text-center">
              {message}
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">Authentication Failed</h2>
            <p className="text-muted-foreground text-center">
              {message}
            </p>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="mt-4"
            >
              Return to Login
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * OAuth Error Display Component
 * Shows OAuth-specific errors with helpful messaging
 */
interface OAuthErrorDisplayProps {
  error?: string;
  provider?: string;
  onRetry?: () => void;
  className?: string;
}

export const OAuthErrorDisplay: React.FC<OAuthErrorDisplayProps> = ({
  error,
  provider,
  onRetry,
  className = ''
}) => {
  if (!error) return null;

  const getErrorMessage = (error: string) => {
    // Common OAuth error mappings
    const errorMessages: Record<string, string> = {
      'access_denied': 'You denied access to your account. Please try again if you want to continue.',
      'invalid_request': 'The authentication request was invalid. Please try again.',
      'unauthorized_client': 'This application is not authorized. Please contact support.',
      'unsupported_response_type': 'The authentication method is not supported.',
      'invalid_scope': 'The requested permissions are not available.',
      'server_error': 'Authentication server error. Please try again later.',
      'temporarily_unavailable': 'Authentication service is temporarily unavailable.',
    };

    return errorMessages[error] || `Authentication error: ${error}`;
  };

  return (
    <div className={`rounded-md bg-destructive/10 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-destructive">
            {provider ? `${provider} Authentication Failed` : 'Authentication Failed'}
          </h3>
          <div className="mt-2 text-sm text-destructive/80">
            <p>{getErrorMessage(error)}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
