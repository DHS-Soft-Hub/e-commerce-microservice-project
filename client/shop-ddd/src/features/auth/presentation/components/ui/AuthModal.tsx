'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';
import { ForgotPasswordForm } from '../forms/ForgotPasswordForm';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  onSuccess?: () => void;
}

/**
 * AuthModal Component
 * Modal wrapper for authentication forms
 * Allows switching between login, register, and forgot password modes
 */
export const AuthModal = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  const _handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return (
          <div className="space-y-4">
            <LoginForm />

            <div className="text-center space-y-2">
              <Button
                variant="link"
                className="text-sm"
                onClick={() => setMode('forgot-password')}
              >
                Forgot your password?
              </Button>

              <div className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setMode('register')}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="space-y-4">
            <RegisterForm />

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setMode('login')}
              >
                Sign in
              </Button>
            </div>
          </div>
        );

      case 'forgot-password':
        return (
          <div className="space-y-4">
            <ForgotPasswordForm />

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setMode('login')}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to your account';
      case 'register':
        return 'Create your account';
      case 'forgot-password':
        return 'Reset your password';
      default:
        return 'Authentication';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getTitle()}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
