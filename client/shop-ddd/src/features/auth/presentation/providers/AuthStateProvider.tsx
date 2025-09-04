/**
 * Authentication State Provider
 * Provides auth state management using hooks
 * Separates business logic (hooks) from dependency injection (service providers)
 */

'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { useAuth } from '../hooks';

/**
 * Auth state context - provides hook functionality to components
 */
type AuthStateContextValue = ReturnType<typeof useAuth>;

/**
 * Auth state context
 */
const AuthStateContext = createContext<AuthStateContextValue | undefined>(undefined);

/**
 * Auth state provider props
 */
interface AuthStateProviderProps {
    children: ReactNode;
}

/**
 * AuthStateProvider - manages React state using hooks
 * This provider uses the useUnifiedAuth hook for all business logic
 */
export function AuthStateProvider({ children }: AuthStateProviderProps) {
    // Use the auth hook for all authentication state and operations
    const authState = useAuth();

    return (
        <AuthStateContext.Provider value={authState}>
            {children}
        </AuthStateContext.Provider>
    );
}

/**
 * Hook to access auth state and operations
 * This provides the same interface as useUnifiedAuth but through context
 */
export function useAuthState(): AuthStateContextValue {
    const context = useContext(AuthStateContext);

    if (context === undefined) {
        throw new Error('useAuthState must be used within an AuthStateProvider');
    }

    return context;
}

/**
 * HOC to provide auth state context
 */
export function withAuthState<P extends object>(Component: React.ComponentType<P>) {
    const WrappedComponent = (props: P) => {
        return (
            <AuthStateProvider>
                <Component {...props} />
            </AuthStateProvider>
        );
    };

    WrappedComponent.displayName = `withAuthState(${Component.displayName || Component.name})`;

    return WrappedComponent;
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use useAuthState instead
 */
export const useAuthContext = useAuthState;
