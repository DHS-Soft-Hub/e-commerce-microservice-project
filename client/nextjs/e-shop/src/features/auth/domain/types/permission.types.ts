/**
 * Permission-related TypeScript definitions
 * Comprehensive permission and role management types
 */

/**
 * Core permission interface
 */
export interface Permission {
    id: string;
    name: string;
    description: string;
    category: PermissionCategory;
    resource: string;
    action: PermissionAction;
    scope?: PermissionScope;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Permission categories for organization
 */
export enum PermissionCategory {
    USER_MANAGEMENT = 'user_management',
    CONTENT_MANAGEMENT = 'content_management',
    SYSTEM_ADMINISTRATION = 'system_administration',
    SECURITY = 'security',
    ANALYTICS = 'analytics',
    BILLING = 'billing',
    COMMUNICATION = 'communication',
    INTEGRATION = 'integration',
    CUSTOM = 'custom'
}

/**
 * Permission actions (CRUD + custom)
 */
export enum PermissionAction {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    EXECUTE = 'execute',
    APPROVE = 'approve',
    REJECT = 'reject',
    PUBLISH = 'publish',
    ARCHIVE = 'archive',
    EXPORT = 'export',
    IMPORT = 'import',
    SHARE = 'share',
    COMMENT = 'comment',
    MODERATE = 'moderate',
    ADMIN = 'admin'
}

/**
 * Permission scope levels
 */
export enum PermissionScope {
    GLOBAL = 'global',       // System-wide access
    ORGANIZATION = 'organization', // Organization-level access
    TEAM = 'team',          // Team-level access
    PROJECT = 'project',    // Project-level access
    RESOURCE = 'resource',  // Specific resource access
    SELF = 'self'          // Own resources only
}

/**
 * Role interface
 */
export interface Role {
    id: string;
    name: string;
    displayName: string;
    description: string;
    permissions: string[]; // Permission IDs
    inherits?: string[];   // Parent role IDs
    isSystem: boolean;     // Whether it's a system-defined role
    isActive: boolean;
    color?: string;        // UI color for role display
    priority: number;      // Role hierarchy priority
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Predefined system roles
 */
export enum SystemRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    MANAGER = 'manager',
    STAFF = 'staff',
    USER = 'user',
    GUEST = 'guest',
    READONLY = 'readonly'
}

/**
 * User role assignment
 */
export interface UserRoleAssignment {
    id: string;
    userId: string;
    roleId: string;
    assignedBy: string;
    assignedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
    context?: AssignmentContext;
    metadata?: Record<string, unknown>;
}

/**
 * Assignment context for conditional permissions
 */
export interface AssignmentContext {
    organizationId?: string;
    teamId?: string;
    projectId?: string;
    resourceId?: string;
    conditions?: PermissionCondition[];
}

/**
 * Permission conditions for dynamic access control
 */
export interface PermissionCondition {
    type: ConditionType;
    field: string;
    operator: ConditionOperator;
    value: unknown;
    metadata?: Record<string, unknown>;
}

export enum ConditionType {
    TIME_BASED = 'time_based',
    LOCATION_BASED = 'location_based',
    IP_BASED = 'ip_based',
    ATTRIBUTE_BASED = 'attribute_based',
    CUSTOM = 'custom'
}

export enum ConditionOperator {
    EQUALS = 'equals',
    NOT_EQUALS = 'not_equals',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'not_contains',
    STARTS_WITH = 'starts_with',
    ENDS_WITH = 'ends_with',
    GREATER_THAN = 'greater_than',
    LESS_THAN = 'less_than',
    IN = 'in',
    NOT_IN = 'not_in',
    BETWEEN = 'between',
    REGEX = 'regex'
}

/**
 * Permission check request
 */
export interface PermissionCheckRequest {
    userId: string;
    resource: string;
    action: PermissionAction;
    context?: CheckContext;
}

/**
 * Permission check context
 */
export interface CheckContext {
    resourceId?: string;
    organizationId?: string;
    teamId?: string;
    projectId?: string;
    additionalData?: Record<string, unknown>;
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
    granted: boolean;
    reason?: string;
    appliedRoles: string[];
    appliedPermissions: string[];
    conditions?: PermissionCondition[];
    metadata?: Record<string, unknown>;
}

/**
 * Bulk permission check
 */
export interface BulkPermissionCheckRequest {
    userId: string;
    checks: Array<{
        resource: string;
        action: PermissionAction;
        context?: CheckContext;
    }>;
}

export interface BulkPermissionCheckResult {
    results: Array<{
        resource: string;
        action: PermissionAction;
        granted: boolean;
        reason?: string;
    }>;
}

/**
 * Permission management operations
 */
export interface CreatePermissionRequest {
    name: string;
    description: string;
    category: PermissionCategory;
    resource: string;
    action: PermissionAction;
    scope?: PermissionScope;
    metadata?: Record<string, unknown>;
}

export interface UpdatePermissionRequest {
    name?: string;
    description?: string;
    category?: PermissionCategory;
    scope?: PermissionScope;
    metadata?: Record<string, unknown>;
}

export interface CreateRoleRequest {
    name: string;
    displayName: string;
    description: string;
    permissions: string[];
    inherits?: string[];
    color?: string;
    metadata?: Record<string, unknown>;
}

export interface UpdateRoleRequest {
    displayName?: string;
    description?: string;
    permissions?: string[];
    inherits?: string[];
    isActive?: boolean;
    color?: string;
    priority?: number;
    metadata?: Record<string, unknown>;
}

export interface AssignRoleRequest {
    userId: string;
    roleId: string;
    expiresAt?: Date;
    context?: AssignmentContext;
    metadata?: Record<string, unknown>;
}

/**
 * Permission state for Redux store
 */
export interface PermissionState {
    permissions: Permission[];
    roles: Role[];
    userPermissions: string[];
    userRoles: string[];
    roleAssignments: UserRoleAssignment[];
    permissionChecks: Record<string, PermissionCheckResult>;
    isLoading: boolean;
    error: string | null;
}

/**
 * Permission search and filtering
 */
export interface PermissionFilter {
    category?: PermissionCategory;
    resource?: string;
    action?: PermissionAction;
    scope?: PermissionScope;
    search?: string;
}

export interface RoleFilter {
    isSystem?: boolean;
    isActive?: boolean;
    hasPermission?: string;
    inheritsFrom?: string;
    search?: string;
}

/**
 * Permission analytics
 */
export interface PermissionAnalytics {
    totalPermissions: number;
    totalRoles: number;
    mostUsedPermissions: Array<{
        permission: string;
        usage: number;
    }>;
    mostAssignedRoles: Array<{
        role: string;
        assignments: number;
    }>;
    permissionsByCategory: Array<{
        category: PermissionCategory;
        count: number;
    }>;
    roleHierarchy: RoleHierarchyNode[];
}

export interface RoleHierarchyNode {
    role: Role;
    children: RoleHierarchyNode[];
    level: number;
}

/**
 * Permission audit log
 */
export interface PermissionAuditLog {
    id: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    userId: string;
    performedBy: string;
    changes?: Record<string, unknown>;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}

export enum AuditAction {
    PERMISSION_GRANTED = 'permission_granted',
    PERMISSION_DENIED = 'permission_denied',
    ROLE_ASSIGNED = 'role_assigned',
    ROLE_REVOKED = 'role_revoked',
    PERMISSION_CREATED = 'permission_created',
    PERMISSION_UPDATED = 'permission_updated',
    PERMISSION_DELETED = 'permission_deleted',
    ROLE_CREATED = 'role_created',
    ROLE_UPDATED = 'role_updated',
    ROLE_DELETED = 'role_deleted'
}
