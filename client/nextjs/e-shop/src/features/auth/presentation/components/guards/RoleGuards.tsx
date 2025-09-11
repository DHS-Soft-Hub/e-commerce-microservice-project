'use client';

import { ReactNode } from 'react';
import { AuthGuard } from './AuthGuard';

interface ClientGuardProps {
    children: ReactNode;
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * ClientGuard Component
 * Protects routes that require client role access
 */
export const ClientGuard = ({ children, ...props }: ClientGuardProps) => {
    return (
        <AuthGuard
            requiredRoles={['client']}
            redirectTo="/auth/login/client"
            {...props}
        >
            {children}
        </AuthGuard>
    );
};

interface DeveloperGuardProps {
    children: ReactNode;
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * DeveloperGuard Component
 * Protects routes that require developer role access
 */
export const DeveloperGuard = ({ children, ...props }: DeveloperGuardProps) => {
    return (
        <AuthGuard
            requiredRoles={['developer']}
            redirectTo="/auth/login/developer"
            {...props}
        >
            {children}
        </AuthGuard>
    );
};

interface ProjectLeadGuardProps {
    children: ReactNode;
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * ProjectLeadGuard Component
 * Protects routes that require project lead role access
 */
export const ProjectLeadGuard = ({ children, ...props }: ProjectLeadGuardProps) => {
    return (
        <AuthGuard
            requiredRoles={['project_lead']}
            redirectTo="/auth/login"
            {...props}
        >
            {children}
        </AuthGuard>
    );
};

interface AdminGuardProps {
    children: ReactNode;
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * AdminGuard Component
 * Protects routes that require admin role access
 */
export const AdminGuard = ({ children, ...props }: AdminGuardProps) => {
    return (
        <AuthGuard
            requiredRoles={['admin']}
            redirectTo="/auth/login"
            {...props}
        >
            {children}
        </AuthGuard>
    );
};

interface PublicGuardProps {
    children: ReactNode;
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * PublicGuard Component
 * Protects routes that should only be accessible to unauthenticated users
 * Redirects authenticated users to dashboard
 */
export const PublicGuard = ({ children, ...props }: PublicGuardProps) => {
    return (
        <AuthGuard
            requireAuth={false}
            redirectTo="/dashboard"
            {...props}
        >
            {children}
        </AuthGuard>
    );
};

interface RoleGuardProps {
    children: ReactNode;
    roles: string[];
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * RoleGuard Component
 * Protects routes that require specific role access
 * More flexible than the predefined guards above
 */
export const RoleGuard = ({ children, roles, ...props }: RoleGuardProps) => {
    return (
        <AuthGuard
            requiredRoles={roles}
            redirectTo="/unauthorized"
            {...props}
        >
            {children}
        </AuthGuard>
    );
};
