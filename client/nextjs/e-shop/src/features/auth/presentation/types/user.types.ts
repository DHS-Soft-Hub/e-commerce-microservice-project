/**
 * User-related TypeScript definitions
 * Comprehensive user management types
 */

import { UserEntity } from '../../domain/entities/User';

/**
 * User Profile Information
 */
export interface UserProfile extends UserEntity {
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
  statistics?: UserStatistics;
}

/**
 * Social media links
 */
export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email: {
    enabled: boolean;
    loginAlerts: boolean;
    passwordChanges: boolean;
    accountUpdates: boolean;
    marketing: boolean;
    newsletter: boolean;
  };
  push: {
    enabled: boolean;
    mentions: boolean;
    comments: boolean;
    followers: boolean;
    directMessages: boolean;
  };
  sms: {
    enabled: boolean;
    securityAlerts: boolean;
    twoFactorAuth: boolean;
  };
}

/**
 * Privacy preferences
 */
export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showLastSeen: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  allowFriendRequests: boolean;
  indexBySearchEngines: boolean;
}

/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

/**
 * User statistics
 */
export interface UserStatistics {
  loginCount: number;
  lastLoginAt?: Date;
  accountAge: number; // in days
  sessionCount: number;
  averageSessionDuration: number; // in minutes
  totalTimeSpent: number; // in minutes
}

/**
 * User activity log entry
 */
export interface UserActivity {
  id: string;
  userId: string;
  action: UserActivityAction;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  timestamp: Date;
}

/**
 * User activity actions
 */
export enum UserActivityAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  PROFILE_UPDATE = 'profile_update',
  EMAIL_CHANGE = 'email_change',
  TWO_FACTOR_ENABLE = 'two_factor_enable',
  TWO_FACTOR_DISABLE = 'two_factor_disable',
  SECURITY_EVENT = 'security_event',
  DATA_EXPORT = 'data_export',
  ACCOUNT_DELETION = 'account_deletion'
}

/**
 * User management interfaces
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  roles?: string[];
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
  socialLinks?: Partial<SocialLinks>;
}

export interface UpdateUserPreferencesRequest {
  preferences: Partial<UserPreferences>;
}

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export interface DeactivateAccountRequest {
  password: string;
  reason?: string;
  feedback?: string;
}

/**
 * User search and filtering
 */
export interface UserSearchFilter {
  query?: string;
  roles?: string[];
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
}

export interface UserSearchResult {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification'
}

/**
 * User onboarding
 */
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
}

export interface UserOnboarding {
  userId: string;
  steps: OnboardingStep[];
  currentStep: number;
  completedAt?: Date;
  skippedAt?: Date;
}
