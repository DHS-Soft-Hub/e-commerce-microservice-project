'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';
import { ReactNode } from 'react';
import { usePermissionContext } from '../../providers/PermissionProvider';

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAll?: boolean; // If true, user must have ALL roles/permissions. If false, ANY will suffice
  fallback?: ReactNode;
  showError?: boolean;
}

/**
 * RoleGuard Component
 * Implements role-based access control
 * Protects content based on user roles and permissions
 */
export const RoleGuard = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback,
  showError = true
}: RoleGuardProps) => {
  const {
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    isLoading
  } = usePermissionContext();

  // Show loading state while checking permissions
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Checking permissions...</span>
        </div>
      </div>
    );
  }

  // Check role requirements
  let hasRequiredRoles = true;
  if (requiredRoles.length > 0) {
    if (requireAll) {
      hasRequiredRoles = requiredRoles.every(role => hasRole(role));
    } else {
      hasRequiredRoles = hasAnyRole(requiredRoles);
    }
  }

  // Check permission requirements
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasRequiredPermissions = requiredPermissions.every(permission => {
        const [resource, action] = permission.split(':');
        return hasPermission(resource || permission, action || 'read');
      });
    } else {
      const permissionChecks = requiredPermissions.map(permission => {
        const [resource, action] = permission.split(':');
        return { resource: resource || permission, action: action || 'read' };
      });
      hasRequiredPermissions = hasAnyPermission(permissionChecks);
    }
  }

  // Check if user meets requirements
  const hasAccess = hasRequiredRoles && hasRequiredPermissions;

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showError) {
      return (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don&apos;t have permission to access this content.
            {requiredRoles.length > 0 && (
              <div className="mt-2">
                <strong>Required roles:</strong> {requiredRoles.join(', ')}
              </div>
            )}
            {requiredPermissions.length > 0 && (
              <div className="mt-2">
                <strong>Required permissions:</strong> {requiredPermissions.join(', ')}
              </div>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  }

  return <>{children}</>;
};
