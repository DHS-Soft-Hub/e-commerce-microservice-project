/**
 * Authentication Dependency Provider
 * Provides auth service instances for dependency injection
 * Follows the Factory Pattern for service creation
 */

'use client';

import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { AuthService } from '../../application/services/AuthService';
import { AuthServiceFactory } from '../../infrastructure/factories/AuthServiceFactory';

/**
 * Auth service context interface - focused on dependency provision
 */
interface AuthServiceContextValue {
    authService: AuthService;
}

/**
 * Auth service context
 */
const AuthServiceContext = createContext<AuthServiceContextValue | undefined>(undefined);

/**
 * Auth service provider props
 */
interface AuthServiceProviderProps {
    children: ReactNode;
}

/**
 * Simplified AuthServiceProvider - only provides service dependencies
 * Business logic is handled by hooks, not providers
 */
export function AuthServiceProvider({ children }: AuthServiceProviderProps) {
    // Factory pattern for service creation - memoized to prevent re-creation
    const authService = useMemo(() => AuthServiceFactory.createAuthService(), []);

    const contextValue: AuthServiceContextValue = useMemo(() => ({
        authService
    }), [authService]);

    return (
        <AuthServiceContext.Provider value={contextValue}>
            {children}
        </AuthServiceContext.Provider>
    );
}

/**
 * Hook to access auth service dependency
 * This is the only way components should access the auth service
 */
export function useAuthService(): AuthService {
    const context = useContext(AuthServiceContext);

    if (context === undefined) {
        throw new Error('useAuthService must be used within an AuthServiceProvider');
    }

    return context.authService;
}

/**
 * HOC to provide auth service dependency
 */
export function withAuthService<P extends object>(Component: React.ComponentType<P>) {
    const WrappedComponent = (props: P) => {
        return (
            <AuthServiceProvider>
                <Component {...props} />
            </AuthServiceProvider>
        );
    };

    WrappedComponent.displayName = `withAuthService(${Component.displayName || Component.name})`;

    return WrappedComponent;
}
