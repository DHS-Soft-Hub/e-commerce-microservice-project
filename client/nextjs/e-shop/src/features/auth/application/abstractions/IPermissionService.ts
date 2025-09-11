import { IResult } from '@dhs-hub/core';

/**
 * Permission Service Interface
 * Operations for checking permissions and roles
 */
export interface IPermissionService {
  /**
   * Check if user has specific permission
   */
  hasPermission(userId: string, permission: string): Promise<boolean>;

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(userId: string, permissions: string[]): Promise<boolean>;

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(userId: string, permissions: string[]): Promise<boolean>;

  /**
   * Check if user has specific role
   */
  hasRole(userId: string, role: string): Promise<boolean>;

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(userId: string, roles: string[]): Promise<boolean>;

  /**
   * Get user permissions
   */
  getUserPermissions(userId: string): Promise<IResult<string[]>>;

  /**
   * Get user roles
   */
  getUserRoles(userId: string): Promise<IResult<string[]>>;

  /**
   * Assign permission to user
   */
  assignPermission(userId: string, permission: string): Promise<IResult<void>>;

  /**
   * Revoke permission from user
   */
  revokePermission(userId: string, permission: string): Promise<IResult<void>>;

  /**
   * Assign role to user
   */
  assignRole(userId: string, role: string): Promise<IResult<void>>;

  /**
   * Revoke role from user
   */
  revokeRole(userId: string, role: string): Promise<IResult<void>>;

  /**
   * Check if user can access resource
   */
  canAccessResource(userId: string, resource: string, action: string): Promise<boolean>;

  /**
   * Get all available permissions
   */
  getAvailablePermissions(): Promise<IResult<string[]>>;

  /**
   * Get all available roles
   */
  getAvailableRoles(): Promise<IResult<string[]>>;
}
