'use client';

import { useMemo } from 'react';
import { useAuth } from './Auth/useAuth';

/**
 * Hook for checking user permissions and roles
 * Provides convenient methods for role-based access control
 */
export const usePermissions = () => {
  const { user, isLoading } = useAuth();

  /**
   * Check if user has a specific role
   */
  const hasRole = useMemo(() => (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }, [user]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useMemo(() => (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useMemo(() => (roles: string[]): boolean => {
    if (!user || !user.roles || roles.length === 0) return false;
    return roles.some(role => user.roles!.includes(role));
  }, [user]);

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useMemo(() => (permissions: string[]): boolean => {
    if (!user || !user.permissions || permissions.length === 0) return false;
    return permissions.some(permission => user.permissions!.includes(permission));
  }, [user]);

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = useMemo(() => (roles: string[]): boolean => {
    if (!user || !user.roles || roles.length === 0) return false;
    return roles.every(role => user.roles!.includes(role));
  }, [user]);

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useMemo(() => (permissions: string[]): boolean => {
    if (!user || !user.permissions || permissions.length === 0) return false;
    return permissions.every(permission => user.permissions!.includes(permission));
  }, [user]);

  /**
   * Check if user is admin (has admin role)
   */
  const isAdmin = useMemo(() => {
    return hasRole('admin') || hasRole('administrator');
  }, [hasRole]);

  /**
   * Check if user is moderator (has moderator role)
   */
  const isModerator = useMemo(() => {
    return hasRole('moderator') || hasRole('mod');
  }, [hasRole]);

  /**
   * Check if user is staff (has admin, moderator, or staff role)
   */
  const isStaff = useMemo(() => {
    return isAdmin || isModerator || hasRole('staff');
  }, [isAdmin, isModerator, hasRole]);

  /**
   * Get user's effective permissions (including role-based permissions)
   */
  const effectivePermissions = useMemo(() => {
    if (!user) return [];

    const permissions = new Set(user.permissions || []);

    // Add permissions based on roles
    if (user.roles) {
      user.roles.forEach(role => {
        switch (role.toLowerCase()) {
          case 'admin':
          case 'administrator':
            permissions.add('*'); // Admin has all permissions
            break;
          case 'moderator':
          case 'mod':
            permissions.add('moderate_content');
            permissions.add('manage_users');
            break;
          case 'staff':
            permissions.add('access_dashboard');
            break;
        }
      });
    }

    return Array.from(permissions);
  }, [user]);

  /**
   * Get user's roles
   */
  const userRoles = useMemo(() => {
    return user?.roles || [];
  }, [user]);

  /**
   * Get user's permissions
   */
  const userPermissions = useMemo(() => {
    return user?.permissions || [];
  }, [user]);

  return {
    // Permission check functions
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    hasAllRoles,
    hasAllPermissions,

    // Convenience checks
    isAdmin,
    isModerator,
    isStaff,

    // Data access
    userRoles,
    userPermissions,
    effectivePermissions,

    // State
    isLoading,
    user
  };
};
