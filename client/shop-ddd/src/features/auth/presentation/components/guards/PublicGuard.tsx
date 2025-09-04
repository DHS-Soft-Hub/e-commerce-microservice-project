'use client';

import { ReactNode } from 'react';

interface PublicGuardProps {
  children: ReactNode;
}

/**
 * PublicGuard Component
 * Ensures public routes are accessible without authentication
 * Can be used to wrap public pages like login, register, verify-email, etc.
 */
export const PublicGuard = ({ children }: PublicGuardProps) => {
  // Public routes don't need any authentication checks
  // Just render the children directly
  return <>{children}</>;
};
