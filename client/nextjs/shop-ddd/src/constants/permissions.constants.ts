/**
 * Permission and role constants
 * RBAC permissions, roles, and hierarchies
 */

/**
 * Permission constants
 */
export const permissions = {
  // User management permissions
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    LIST: 'users:list',
    SEARCH: 'users:search',
    EXPORT: 'users:export',
    IMPERSONATE: 'users:impersonate',
  },

  // Role management permissions
  ROLES: {
    CREATE: 'roles:create',
    READ: 'roles:read',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
    LIST: 'roles:list',
    ASSIGN: 'roles:assign',
    REVOKE: 'roles:revoke',
  },

  // Permission management permissions
  PERMISSIONS: {
    CREATE: 'permissions:create',
    READ: 'permissions:read',
    UPDATE: 'permissions:update',
    DELETE: 'permissions:delete',
    LIST: 'permissions:list',
    ASSIGN: 'permissions:assign',
    REVOKE: 'permissions:revoke',
  },

  // Content management permissions
  CONTENT: {
    CREATE: 'content:create',
    READ: 'content:read',
    UPDATE: 'content:update',
    DELETE: 'content:delete',
    PUBLISH: 'content:publish',
    ARCHIVE: 'content:archive',
    MODERATE: 'content:moderate',
  },

  // System administration permissions
  SYSTEM: {
    ADMIN: 'system:admin',
    CONFIG: 'system:config',
    LOGS: 'system:logs',
    BACKUP: 'system:backup',
    MAINTENANCE: 'system:maintenance',
    MONITORING: 'system:monitoring',
  },

  // Security permissions
  SECURITY: {
    AUDIT: 'security:audit',
    LOGS: 'security:logs',
    SETTINGS: 'security:settings',
    INCIDENTS: 'security:incidents',
    POLICIES: 'security:policies',
  },

  // Analytics permissions
  ANALYTICS: {
    VIEW: 'analytics:view',
    EXPORT: 'analytics:export',
    ADVANCED: 'analytics:advanced',
    REPORTS: 'analytics:reports',
  },

  // Billing permissions
  BILLING: {
    VIEW: 'billing:view',
    MANAGE: 'billing:manage',
    EXPORT: 'billing:export',
    REFUND: 'billing:refund',
  },

  // Integration permissions
  INTEGRATIONS: {
    CREATE: 'integrations:create',
    READ: 'integrations:read',
    UPDATE: 'integrations:update',
    DELETE: 'integrations:delete',
    CONFIGURE: 'integrations:configure',
  },
} as const;

/**
 * Role constants
 */
export const roles = {
  // System roles
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MANAGER: 'manager',
  STAFF: 'staff',
  USER: 'user',
  GUEST: 'guest',
  READONLY: 'readonly',

  // Role hierarchy (higher number = more permissions)
  HIERARCHY: {
    guest: 1,
    readonly: 2,
    user: 3,
    staff: 4,
    manager: 5,
    moderator: 6,
    admin: 7,
    super_admin: 8,
  },

  // Role descriptions
  DESCRIPTIONS: {
    super_admin: 'Full system access with all permissions',
    admin: 'Administrative access with most permissions',
    moderator: 'Content moderation and user management',
    manager: 'Team and project management capabilities',
    staff: 'Staff-level access with limited admin features',
    user: 'Standard user with basic permissions',
    guest: 'Limited access for unauthenticated users',
    readonly: 'Read-only access to permitted resources',
  },

  // Default permissions for each role
  DEFAULT_PERMISSIONS: {
    super_admin: Object.values(permissions).flatMap(category => Object.values(category)),
    admin: [
      ...Object.values(permissions.USERS),
      ...Object.values(permissions.ROLES),
      ...Object.values(permissions.CONTENT),
      ...Object.values(permissions.ANALYTICS),
      permissions.SYSTEM.CONFIG,
      permissions.SYSTEM.LOGS,
      permissions.SECURITY.AUDIT,
      permissions.SECURITY.LOGS,
    ],
    moderator: [
      permissions.USERS.READ,
      permissions.USERS.LIST,
      permissions.USERS.UPDATE,
      ...Object.values(permissions.CONTENT),
      permissions.ANALYTICS.VIEW,
    ],
    manager: [
      permissions.USERS.READ,
      permissions.USERS.LIST,
      permissions.CONTENT.CREATE,
      permissions.CONTENT.READ,
      permissions.CONTENT.UPDATE,
      permissions.ANALYTICS.VIEW,
    ],
    staff: [
      permissions.USERS.READ,
      permissions.CONTENT.CREATE,
      permissions.CONTENT.READ,
      permissions.CONTENT.UPDATE,
    ],
    user: [
      permissions.CONTENT.READ,
    ],
    guest: [
      permissions.CONTENT.READ,
    ],
    readonly: [
      permissions.CONTENT.READ,
      permissions.ANALYTICS.VIEW,
    ],
  },
} as const;
