/**
 * Authentication utilities for auth state management and user type checking
 * 
 * This module provides client, developer, and user functionality checking:
 * 
 * USER TYPE CHECKING FUNCTIONS:
 * - isClient(): Check if current user is a client
 * - isDeveloper(): Check if current user is a developer
 * - isAdmin(): Check if current user is an admin
 * - isProjectLead(): Check if current user is a project lead
 * 
 * AUTH STATE FUNCTIONS:
 * - isAuthenticated(): Check if user has valid session (uses TokenStorageUtils)
 * - getCurrentUserId(): Get current user's ID from stored token
 * - getCurrentUserRoles(): Get current user's all roles
 * - getCurrentClientId(): Get current client ID
 * - getCurrentDeveloperId(): Get current developer ID
 * 
 * PERMISSION CHECKING FUNCTIONS:
 * - hasRole(role): Check if current user has specific role
 * - hasPermission(permission): Check if current user has specific permission
 * - hasRouteAccess(requiredRoles): Check route access by roles
 * 
 * API HELPER FUNCTIONS:
 * - getAuthHeaders(): Get Authorization headers for API calls
 * 
 * NOTE: All token storage operations are handled by TokenStorageUtils
 * This utility focuses on auth state logic and user type checking only
 */

import { TokenStorageUtils } from '@/utils/tokenStorage';

// ==================== USER TYPE CHECKING FUNCTIONS ====================

/**
 * Check if current user is a client
 */
export function isClient(): boolean {
    return hasRole('client');
}

/**
 * Check if current user is a developer
 */
export function isDeveloper(): boolean {
    return hasRole('developer');
}

/**
 * Check if current user is an admin
 */
export function isAdmin(): boolean {
    return hasRole('admin');
}

/**
 * Check if current user is a project lead
 */
export function isProjectLead(): boolean {
    return hasRole('project_lead');
}

/**
 * Check if user has valid session
 * @param permission 
 * @returns 
 */
export function isPermissionGranted(permission: string): boolean {
    return hasPermission(permission);
}

// ==================== AUTH STATE FUNCTIONS ====================

/**
 * Extract user ID from token
 */
export function getUserIdFromToken(token?: string): number | null {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return null;

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        return payload?.user_id || null;
    } catch {
        return null;
    }
}

/**
 * Extract user roles from token
 */
export function getUserRolesFromToken(token?: string): string[] {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return [];

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        return payload?.roles || [];
    } catch {
        return [];
    }
}

/**
 * Extract user permissions from token
 */
export function getUserPermissionsFromToken(token?: string): string[] {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return [];

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        return payload?.permissions || [];
    } catch {
        return [];
    }
}

/**
 * Extract client ID from token
 */
export function getClientIdFromToken(token?: string): number | null {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return null;

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        return payload?.profile_info?.client_id || null;
    } catch {
        return null;
    }
}

/**
 * Extract developer ID from token
 */
export function getDeveloperIdFromToken(token?: string): number | null {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return null;

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        return payload?.profile_info?.developer_id || null;
    } catch {
        return null;
    }
}

/**
 * Extract profile info from token
 */
export function getProfileInfoFromToken(token?: string): Record<string, unknown> {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return {};

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        if (!payload) return {};

        // Extract profile-related fields (using underscore prefix for unused variables)
        const profileInfo: Record<string, unknown> = {
            client_id: payload.profile_info?.client_id,
            developer_id: payload.profile_info?.developer_id
        };
        return profileInfo;
    } catch {
        return {};
    }
}

/**
 * Extract email verification status from token
 */
export function getEmailVerificationFromToken(token?: string): boolean {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return false;

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        return payload?.is_email_verified ?? false;
    } catch {
        return false;
    }
}

/**
 * Extract two-factor authentication status from token
 */
export function getTwoFactorEnabledFromToken(token?: string): boolean {
    const targetToken = token || TokenStorageUtils.getAccessToken();
    if (!targetToken) return false;

    try {
        const payload = TokenStorageUtils.decodeJWT(targetToken);
        return payload?.two_factor_enabled ?? false;
    } catch {
        return false;
    }
}

/**
 * Check if token has specific role
 */
const hasRole = (role: string, token?: string): boolean => {
    const roles = getUserRolesFromToken(token);
    return roles.includes(role);
}

/**
 * Check if token has specific permission
 */
const hasPermission = (permission: string, token?: string): boolean => {
    const permissions = getUserPermissionsFromToken(token);
    return permissions.includes(permission);
}
