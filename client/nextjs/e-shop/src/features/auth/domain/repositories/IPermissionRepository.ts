import { IResult } from '../../../../../../core/src/shared/types/IResult';

/**
 * Permission Repository Interface
 * Data access operations for permissions and roles
 */
export interface IPermissionRepository {
  /**
   * Get user permissions
   */
  getUserPermissions(userId: string): Promise<IResult<string[]>>;

  /**
   * Get user roles
   */
  getUserRoles(userId: string): Promise<IResult<string[]>>;

  /**
   * Check if user has permission
   */
  hasPermission(userId: string, permission: string): Promise<boolean>;

  /**
   * Check if user has role
   */
  hasRole(userId: string, role: string): Promise<boolean>;

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
   * Get permissions for role
   */
  getRolePermissions(role: string): Promise<IResult<string[]>>;

  /**
   * Get all available permissions
   */
  getAvailablePermissions(): Promise<IResult<string[]>>;

  /**
   * Get all available roles
   */
  getAvailableRoles(): Promise<IResult<string[]>>;

  /**
   * Check resource access
   */
  canAccessResource(userId: string, resource: string, action: string): Promise<boolean>;

  /**
   * Get resource permissions
   */
  getResourcePermissions(resource: string): Promise<IResult<string[]>>;

  /**
   * Create new permission
   */
  createPermission(permission: string, description?: string): Promise<IResult<void>>;

  /**
   * Create new role
   */
  createRole(role: string, description?: string, permissions?: string[]): Promise<IResult<void>>;

  /**
   * Update role permissions
   */
  updateRolePermissions(role: string, permissions: string[]): Promise<IResult<void>>;
}
