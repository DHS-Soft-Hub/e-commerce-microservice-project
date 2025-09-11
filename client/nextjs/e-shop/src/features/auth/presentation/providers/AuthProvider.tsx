/**
 * Combined Auth Provider
 * Orchestrates dependency injection and state management providers
 * Follows proper separation of concerns: Services → State → Permissions
 */

'use client';

import React, { ReactNode } from 'react';
import { UserEntity } from '../../domain';
import { Email } from '../../domain/value-objects/Email';
import { AuthServiceProvider } from './AuthServiceProvider';
import { AuthStateProvider, useAuthState } from './AuthStateProvider';
import { PermissionProvider } from './PermissionProvider';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Inner component that has access to auth state
 * Used to pass user data to PermissionProvider
 */
function AuthProviderInner({ children }: AuthProviderProps) {
  const { user } = useAuthState();

  // Convert presentation layer User to domain UserEntity for PermissionProvider
  // The PermissionProvider expects UserEntity from domain layer
  const domainUser: UserEntity | null = user ? new UserEntity(
    user.id.toString(),
    Email.create(user.email), // Proper Email value object
    undefined, // username
    user.first_name,
    user.last_name,
    user.roles || [],
    [], // permissions
    user.is_active ?? true,
    user.is_email_verified ?? false,
    user.two_factor_enabled ?? false,
    new Date(), // createdAt
    new Date(), // updatedAt
    user.last_login ? new Date(user.last_login) : undefined,
    {} // metadata
  ) : null;

  return (
    <PermissionProvider user={domainUser}>
      {children}
    </PermissionProvider>
  );
}

/**
 * Combined auth provider with proper layer separation:
 * 1. AuthServiceProvider (Dependency Injection)
 * 2. AuthStateProvider (State Management) 
 * 3. PermissionProvider (Authorization Logic)
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthServiceProvider>
      <AuthStateProvider>
        <AuthProviderInner>
          {children}
        </AuthProviderInner>
      </AuthStateProvider>
    </AuthServiceProvider>
  );
}

/**
 * HOC that provides both auth and permission context
 */
export function withFullAuth<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent = (props: P) => {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    );
  };

  WrappedComponent.displayName = `withFullAuth(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
