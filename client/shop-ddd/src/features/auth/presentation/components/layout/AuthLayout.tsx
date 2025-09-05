'use client';

import { ReactNode } from 'react';
import { AuthFooter } from '../ui/AuthFooter';
import { AuthHeader } from '../ui/AuthHeader';

interface AuthLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

/**
 * AuthLayout Component
 * Provides consistent layout for authentication pages
 */
export const AuthLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  className = ''
}: AuthLayoutProps) => {
  return (
    <div className={`${className}`}>
      <main>
        <div>
          {showHeader && <AuthHeader />}
          {children}
          {showFooter && <AuthFooter />}
        </div>
      </main>
    </div>
  );
};
