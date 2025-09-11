/**
 * Permission Provider
 * React context provider for permission checking and role-based access control
 */

'use client';

import { roles as roleConstants } from '@/constants';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { UserEntity } from '../../domain/entities/User';
import { AssignmentContext } from '../../domain/types/permission.types';
import { User } from '../types/auth.types';

/**
 * Helper function to normalize different user types
 */
function normalizeUser(user: UserEntity | User | null): { id: string; roles: string[] } | null {
  if (!user) return null;

  // Check if it's a UserEntity
  if ('domainEvents' in user) {
    return {
      id: user.id,
      roles: user.roles || []
    };
  }

  // Otherwise it's a User interface
  return {
    id: user.id?.toString() || '',
    roles: user.roles || []
  };
}

/**
 * Permission context interface
 */
interface PermissionContextValue {
  // State
  userPermissions: string[];
  userRoles: string[];
  isLoading: boolean;
  error: string | null;

  // Permission checking functions
  hasPermission: (resource: string, action: string, context?: AssignmentContext) => boolean;
  hasAnyPermission: (permissions: Array<{ resource: string; action: string; context?: AssignmentContext }>) => boolean;
  hasAllPermissions: (permissions: Array<{ resource: string; action: string; context?: AssignmentContext }>) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;

  // Role hierarchy checking
  hasMinimumRole: (minimumRole: string) => boolean;
  getRoleHierarchyLevel: (role: string) => number;

  // Utility functions
  canAccess: (requiredPermissions?: string[], requiredRoles?: string[]) => boolean;
  canModify: (resource: string, ownerId?: string) => boolean;
  canAdministrate: () => boolean;

  // Actions
  refreshPermissions: () => Promise<void>;
  clearError: () => void;
}

/**
 * Permission context
 */
const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

/**
 * Permission provider props
 */
interface PermissionProviderProps {
  children: ReactNode;
  user: UserEntity | User | null;
}

/**
 * Permission provider component
 */
export function PermissionProvider({ children, user }: PermissionProviderProps) {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load user permissions and roles
   */
  const loadPermissions = useCallback(async () => {
    const normalizedUser = normalizeUser(user);

    if (!normalizedUser) {
      setUserPermissions([]);
      setUserRoles([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract roles from normalized user
      const roles = normalizedUser.roles || [];
      setUserRoles(roles);

      // Get permissions for each role (simplified implementation)
      const allPermissions: string[] = [];

      roles.forEach(role => {
        const defaultPermissions = roleConstants.DEFAULT_PERMISSIONS[role as keyof typeof roleConstants.DEFAULT_PERMISSIONS] || [];
        allPermissions.push(...defaultPermissions);
      });

      // Remove duplicates
      const uniquePermissions = Array.from(new Set(allPermissions));
      setUserPermissions(uniquePermissions);

    } catch (err) {
      console.error('Failed to load permissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Load permissions when user changes
   */
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback((resource: string, action: string, _context?: AssignmentContext): boolean => {
    if (!user) return false;

    // Simple permission checking based on roles and permissions arrays
    const permissionString = `${resource}:${action}`;
    return userPermissions.includes(permissionString) ||
      userRoles.includes('admin') ||
      userRoles.includes('super_admin');
  }, [user, userPermissions, userRoles]);

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback((permissionChecks: Array<{ resource: string; action: string; context?: AssignmentContext }>): boolean => {
    if (!user) return false;

    return permissionChecks.some(check => hasPermission(check.resource, check.action, check.context));
  }, [user, hasPermission]);

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useCallback((permissionChecks: Array<{ resource: string; action: string; context?: AssignmentContext }>): boolean => {
    if (!user) return false;

    return permissionChecks.every(check => hasPermission(check.resource, check.action, check.context));
  }, [user, hasPermission]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    return userRoles.includes(role);
  }, [userRoles]);

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback((roleList: string[]): boolean => {
    return roleList.some(role => userRoles.includes(role));
  }, [userRoles]);

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = useCallback((roleList: string[]): boolean => {
    return roleList.every(role => userRoles.includes(role));
  }, [userRoles]);

  /**
   * Check if user has minimum role level
   */
  const hasMinimumRole = useCallback((minimumRole: string): boolean => {
    const minimumLevel = roleConstants.HIERARCHY[minimumRole as keyof typeof roleConstants.HIERARCHY] || 0;

    return userRoles.some(role => {
      const roleLevel = roleConstants.HIERARCHY[role as keyof typeof roleConstants.HIERARCHY] || 0;
      return roleLevel >= minimumLevel;
    });
  }, [userRoles]);

  /**
   * Get role hierarchy level
   */
  const getRoleHierarchyLevel = useCallback((role: string): number => {
    return roleConstants.HIERARCHY[role as keyof typeof roleConstants.HIERARCHY] || 0;
  }, []);

  /**
   * Check if user can access based on required permissions and roles
   */
  const canAccess = useCallback((requiredPermissions?: string[], requiredRoles?: string[]): boolean => {
    // If no requirements specified, allow access
    if (!requiredPermissions?.length && !requiredRoles?.length) {
      return true;
    }

    // Check roles first (faster)
    if (requiredRoles?.length) {
      const hasRequiredRole = hasAnyRole(requiredRoles);
      if (!hasRequiredRole) return false;
    }

    // Check permissions
    if (requiredPermissions?.length) {
      const hasRequiredPermission = requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );
      if (!hasRequiredPermission) return false;
    }

    return true;
  }, [userPermissions, hasAnyRole]);

  /**
   * Check if user can modify a resource (owns it or has admin rights)
   */
  const canModify = useCallback((resource: string, ownerId?: string): boolean => {
    const normalizedUser = normalizeUser(user);
    if (!normalizedUser) return false;

    // Admin users can modify anything
    if (hasRole(roleConstants.ADMIN) || hasRole(roleConstants.SUPER_ADMIN)) {
      return true;
    }

    // Check if user owns the resource
    if (ownerId && normalizedUser.id === ownerId) {
      return true;
    }

    // Check specific update permission for the resource
    return hasPermission(resource, 'update');
  }, [user, hasRole, hasPermission]);

  /**
   * Check if user can administrate
   */
  const canAdministrate = useCallback((): boolean => {
    return hasAnyRole([roleConstants.ADMIN, roleConstants.SUPER_ADMIN]);
  }, [hasAnyRole]);

  /**
   * Refresh permissions
   */
  const refreshPermissions = useCallback(async (): Promise<void> => {
    await loadPermissions();
  }, [loadPermissions]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Context value
   */
  const contextValue: PermissionContextValue = {
    // State
    userPermissions,
    userRoles,
    isLoading,
    error,

    // Permission checking functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Role hierarchy checking
    hasMinimumRole,
    getRoleHierarchyLevel,

    // Utility functions
    canAccess,
    canModify,
    canAdministrate,

    // Actions
    refreshPermissions,
    clearError,
  };

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
}

/**
 * Custom hook to use permission context
 */
export function usePermissionContext(): PermissionContextValue {
  const context = useContext(PermissionContext);

  if (context === undefined) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }

  return context;
}

/**
 * HOC to provide permission context
 */
export function withPermissions<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[],
  requiredRoles?: string[]
) {
  const WrappedComponent = (props: P) => {
    const { canAccess } = usePermissionContext();

    // Check access
    if (!canAccess(requiredPermissions, requiredRoles)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don&apos;t have permission to access this resource.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPermissions(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Component to conditionally render based on permissions
 */
interface PermissionGateProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
  fallback?: ReactNode;
  requireAll?: boolean; // If true, requires all permissions/roles; if false, requires any
}

export function PermissionGate({
  children,
  permissions,
  roles,
  fallback = null,
  requireAll = false
}: PermissionGateProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles
  } = usePermissionContext();

  let hasAccess = true;

  // Check permissions
  if (permissions?.length) {
    if (requireAll) {
      const permissionChecks = permissions.map(permission => {
        const [resource, action] = permission.split(':');
        return { resource, action };
      });
      hasAccess = hasAccess && hasAllPermissions(permissionChecks);
    } else {
      hasAccess = hasAccess && permissions.some(permission => {
        const [resource, action] = permission.split(':');
        return hasPermission(resource, action);
      });
    }
  }

  // Check roles
  if (roles?.length) {
    if (requireAll) {
      hasAccess = hasAccess && hasAllRoles(roles);
    } else {
      hasAccess = hasAccess && hasAnyRole(roles);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
