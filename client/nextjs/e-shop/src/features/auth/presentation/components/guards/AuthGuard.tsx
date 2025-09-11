'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthState } from '../../providers/AuthStateProvider';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * AuthGuard Component
 * Protects routes based on authentication status and role requirements
 * Automatically attempts token refresh if access token is expired
 */
export const AuthGuard = ({
  children,
  requireAuth = true,
  requiredRoles = [],
  redirectTo,
  fallback
}: AuthGuardProps) => {
  const {
    isAuthenticated,
    isLoading,
    roles,
    user,
    isEmailVerified,
    refreshToken,
    isTokenExpired
  } = useAuthState();
  const router = useRouter();
  const [hasTriedRefresh, setHasTriedRefresh] = useState(false);

  // Check if token needs refresh and attempt refresh
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!isLoading && !isAuthenticated && !hasTriedRefresh && isTokenExpired()) {
        // Try to refresh token first
        try {
          setHasTriedRefresh(true);
          const success = await refreshToken();

          if (!success) {
            // If refresh fails and auth is required, redirect to login
            if (requireAuth) {
              const currentPath = window.location.pathname + window.location.search;
              const defaultRedirect = '/auth/login';
              const redirectUrl = `${redirectTo || defaultRedirect}?redirect=${encodeURIComponent(currentPath)}`;
              router.push(redirectUrl);
            }
          }
        } catch (_error) {
          // If refresh fails and auth is required, redirect to login
          if (requireAuth) {
            const currentPath = window.location.pathname + window.location.search;
            const defaultRedirect = '/auth/login';
            const redirectUrl = `${redirectTo || defaultRedirect}?redirect=${encodeURIComponent(currentPath)}`;
            router.push(redirectUrl);
          }
        }
      }
    };

    checkAndRefreshToken();
  }, [isAuthenticated, isLoading, hasTriedRefresh, requireAuth, redirectTo, router, refreshToken, isTokenExpired]);

  // Handle authentication requirements
  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      const defaultRedirect = '/auth/login';
      const redirectUrl = `${redirectTo || defaultRedirect}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return;
    }

    // If authentication is not required but user is authenticated
    if (!requireAuth && isAuthenticated) {
      // Redirect authenticated users away from auth pages
      const defaultRedirect = '/dashboard';
      router.push(redirectTo || defaultRedirect);
      return;
    }

    // Check email verification requirement
    if (requireAuth && isAuthenticated && !isEmailVerified) {
      console.log('Email verification required, redirecting...');
      router.push('/auth/verify-email');
      return;
    }

    // Check role requirements
    if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
      if (!hasRequiredRole) {
        // router.push('/unauthorized'); // Leave this commented for now
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    roles,
    user,
    isEmailVerified,
    requireAuth,
    requiredRoles,
    redirectTo,
    router
  ]);

  // Show loading while checking authentication or refreshing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {fallback || (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // Show fallback if authentication requirements are not met
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {fallback || (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Redirecting to login...</span>
          </div>
        )}
      </div>
    );
  }

  // Show fallback if email verification is required but not completed
  if (requireAuth && isAuthenticated && !isEmailVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {fallback || (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Email verification required...</span>
          </div>
        )}
      </div>
    );
  }

  // Show fallback if role requirements are not met
  if (requireAuth && isAuthenticated && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          {fallback || (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
            </div>
          )}
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};