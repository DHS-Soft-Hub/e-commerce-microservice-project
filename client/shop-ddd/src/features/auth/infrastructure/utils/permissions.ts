/**
 * Permission checking utilities
 * Role-based access control and permission validation
 */

import { UserEntity } from '../../domain/entities/User';
import { AssignmentContext, Permission, Role } from '../../domain/types/permission.types';

/**
 * Permission utilities
 */
export class PermissionUtils {
  /**
   * Check if user has permission
   */
  static hasPermission(
    user: UserEntity,
    _resource: string,
    _action: string,
    _context?: AssignmentContext
  ): boolean {
    if (!user.roles?.length) return false;

    // In IUser, roles are strings (role IDs), so we need to handle this differently
    // This would typically require fetching the full role objects from the store/API
    // For now, we'll implement a simplified version
    return user.roles.includes('admin') || user.roles.includes('super_admin');
  }

  /**
   * Check if role has permission (requires full Role object)
   */
  static roleHasPermission(
    role: Role,
    _resource: string,
    _action: string,
    _context?: AssignmentContext
  ): boolean {
    if (!role.permissions?.length) return false;

    // Role.permissions are permission IDs, so we'd need to resolve them
    // This is a simplified implementation
    return role.permissions.length > 0;
  }

  /**
   * Check individual permission
   */
  static checkPermission(
    permission: Permission,
    resource: string,
    action: string,
    _context?: AssignmentContext
  ): boolean {
    // Check resource match
    if (permission.resource !== '*' && permission.resource !== resource) {
      return false;
    }

    // Check action match - handle enum comparison
    const permissionAction = permission.action as string;
    if (permissionAction !== '*' && permissionAction !== action) {
      return false;
    }

    // Note: Permission interface doesn't have conditions property
    // This would need to be implemented through the metadata field
    // or extended in the Permission interface

    return true;
  }

  /**
   * Evaluate permission conditions
   */
  static evaluateConditions(
    conditions: Record<string, unknown>,
    context: AssignmentContext
  ): boolean {
    for (const [key, expectedValue] of Object.entries(conditions)) {
      const contextValue = this.getNestedValue(context, key);

      if (Array.isArray(expectedValue)) {
        if (!expectedValue.includes(contextValue)) {
          return false;
        }
      } else if (contextValue !== expectedValue) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get nested value from object
   */
  static getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current: unknown, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  /**
   * Get user's all permissions (simplified version)
   */
  static getUserPermissions(user: UserEntity): string[] {
    if (!user.roles?.length) return [];

    // Since user.roles are strings, we return them as-is
    // In a real implementation, you'd resolve these to actual Permission objects
    return [...user.roles];
  }

  /**
   * Check multiple permissions
   */
  static hasAnyPermission(
    user: UserEntity,
    permissions: Array<{ resource: string; action: string; context?: AssignmentContext }>
  ): boolean {
    return permissions.some(({ resource, action, context }) =>
      this.hasPermission(user, resource, action, context)
    );
  }

  /**
   * Check if user has all permissions
   */
  static hasAllPermissions(
    user: UserEntity,
    permissions: Array<{ resource: string; action: string; context?: AssignmentContext }>
  ): boolean {
    return permissions.every(({ resource, action, context }) =>
      this.hasPermission(user, resource, action, context)
    );
  }

  /**
   * Check if user has role
   */
  static hasRole(user: UserEntity, role: string): boolean {
    return user.roles?.includes(role) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(user: UserEntity, roles: string[]): boolean {
    if (!user.roles?.length) return false;
    return roles.some(role => user.roles!.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  static hasAllRoles(user: UserEntity, roles: string[]): boolean {
    if (!user.roles?.length) return false;
    return roles.every(role => user.roles!.includes(role));
  }

  /**
   * Check if user can access based on required permissions and roles
   */
  static canAccess(
    user: UserEntity,
    requiredPermissions?: string[],
    requiredRoles?: string[]
  ): boolean {
    // If no requirements specified, allow access
    if (!requiredPermissions?.length && !requiredRoles?.length) {
      return true;
    }

    // Check roles first (faster)
    if (requiredRoles?.length) {
      const hasRequiredRole = this.hasAnyRole(user, requiredRoles);
      if (!hasRequiredRole) return false;
    }

    // Check permissions
    if (requiredPermissions?.length) {
      const permissionChecks = requiredPermissions.map(permission => {
        const [resource, action] = permission.split(':');
        return { resource, action };
      });

      const hasRequiredPermission = this.hasAnyPermission(user, permissionChecks);
      if (!hasRequiredPermission) return false;
    }

    return true;
  }

  /**
   * Check if user can modify a resource (owns it or has admin rights)
   */
  static canModify(user: UserEntity, resource: string, ownerId?: string): boolean {
    // Admin users can modify anything
    if (this.hasRole(user, 'admin') || this.hasRole(user, 'super_admin')) {
      return true;
    }

    // Check if user owns the resource
    if (ownerId && user.id === ownerId) {
      return true;
    }

    // Check specific update permission for the resource
    return this.hasPermission(user, resource, 'update');
  }

  /**
   * Check if user can administrate
   */
  static canAdministrate(user: UserEntity): boolean {
    return this.hasAnyRole(user, ['admin', 'super_admin']);
  }

  /**
   * Get highest role priority for user
   */
  static getHighestRolePriority(user: UserEntity, roleHierarchy: Record<string, number> = {}): number {
    if (!user.roles?.length) return 0;

    return Math.max(...user.roles.map(role => roleHierarchy[role] || 0));
  }

  /**
   * Check if user has minimum role level
   */
  static hasMinimumRoleLevel(
    user: UserEntity,
    minimumRole: string,
    roleHierarchy: Record<string, number> = {}
  ): boolean {
    const userLevel = this.getHighestRolePriority(user, roleHierarchy);
    const minimumLevel = roleHierarchy[minimumRole] || 0;

    return userLevel >= minimumLevel;
  }
}
