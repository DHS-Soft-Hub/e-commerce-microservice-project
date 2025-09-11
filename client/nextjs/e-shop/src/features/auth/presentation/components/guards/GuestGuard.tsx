'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect } from 'react';
import { useAuthState } from '../../providers/AuthStateProvider';

interface GuestGuardProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * GuestGuard Component
 * Protects routes that should only be accessible to unauthenticated users
 * Redirects authenticated users to dashboard or specified route
 */
export const GuestGuard = ({
  children,
  redirectTo = '/dashboard',
  fallback
}: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthState();
  const router = useRouter();

  // Robust navigation function with multiple fallback strategies
  const navigateToRoute = useCallback(async (targetUrl: string) => {
    try {
      // First try: use router.replace (recommended for redirects)
      await router.replace(targetUrl);

    } catch (routerError) {
      console.warn('Router.replace failed, trying fallback methods:', routerError);

      try {
        // Second try: use window.location.replace (more reliable)
        if (typeof window !== 'undefined') {
          window.location.replace(targetUrl);
        }
      } catch (windowError) {
        console.error('All navigation methods failed:', windowError);

        // Last resort: log error and manual navigation
        console.error('Please manually navigate to:', targetUrl);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && typeof window !== 'undefined') {
      // Check if there's a redirect URL from the query params
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');

      const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : redirectTo;

      // Add a delay to avoid hydration issues and RSC payload problems
      const timeoutId = setTimeout(() => {
        navigateToRoute(targetUrl);
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading, redirectTo, navigateToRoute]);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render children if authenticated
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
