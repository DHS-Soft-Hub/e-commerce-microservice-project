/**
 * Session-related TypeScript definitions
 * Comprehensive session management types
 */

import { DeviceInfo, Session } from '../../domain/entities/Session';

/**
 * Extended session interface with additional client features
 */
export interface ExtendedSession extends Session {
  name?: string; // User-friendly session name
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  isCurrent?: boolean;
  lastIpAddress?: string;
  riskScore?: number; // Security risk assessment score (0-100)
  flags?: SessionFlag[];
}

/**
 * Session security flags
 */
export enum SessionFlag {
  SUSPICIOUS_LOCATION = 'suspicious_location',
  NEW_DEVICE = 'new_device',
  UNUSUAL_TIME = 'unusual_time',
  HIGH_RISK_IP = 'high_risk_ip',
  VPN_DETECTED = 'vpn_detected',
  TOR_DETECTED = 'tor_detected',
  MULTIPLE_FAILED_ATTEMPTS = 'multiple_failed_attempts'
}

/**
 * Session creation request
 */
export interface CreateSessionRequest {
  userId: string;
  deviceInfo: DeviceInfo;
  rememberMe?: boolean;
  expiresIn?: number; // Session duration in seconds
}

/**
 * Session update request
 */
export interface UpdateSessionRequest {
  sessionId: string;
  name?: string;
  lastActivityAt?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Session termination request
 */
export interface TerminateSessionRequest {
  sessionId: string;
  reason?: SessionTerminationReason;
}

/**
 * Session termination reasons
 */
export enum SessionTerminationReason {
  USER_LOGOUT = 'user_logout',
  MANUAL_TERMINATION = 'manual_termination',
  SECURITY_BREACH = 'security_breach',
  EXPIRED = 'expired',
  INACTIVITY = 'inactivity',
  ADMIN_ACTION = 'admin_action',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity'
}

/**
 * Session analytics
 */
export interface SessionAnalytics {
  totalSessions: number;
  activeSessions: number;
  averageSessionDuration: number; // in minutes
  mostUsedDevices: DeviceUsage[];
  mostUsedLocations: LocationUsage[];
  sessionsByHour: HourlyUsage[];
  securityEvents: SecurityEvent[];
}

export interface DeviceUsage {
  deviceType: string;
  count: number;
  percentage: number;
}

export interface LocationUsage {
  country: string;
  city?: string;
  count: number;
  percentage: number;
}

export interface HourlyUsage {
  hour: number; // 0-23
  count: number;
}

/**
 * Security events related to sessions
 */
export interface SecurityEvent {
  id: string;
  sessionId: string;
  userId: string;
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  description: string;
  metadata?: Record<string, unknown>;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  timestamp: Date;
}

export enum SecurityEventType {
  SUSPICIOUS_LOGIN = 'suspicious_login',
  MULTIPLE_FAILED_ATTEMPTS = 'multiple_failed_attempts',
  UNUSUAL_LOCATION = 'unusual_location',
  NEW_DEVICE_LOGIN = 'new_device_login',
  CONCURRENT_SESSIONS = 'concurrent_sessions',
  SESSION_HIJACK_ATTEMPT = 'session_hijack_attempt',
  BRUTE_FORCE_ATTEMPT = 'brute_force_attempt',
  ACCOUNT_TAKEOVER_ATTEMPT = 'account_takeover_attempt'
}

export enum SecurityEventSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Session management operations
 */
export interface SessionManagement {
  maxConcurrentSessions: number;
  sessionTimeout: number; // in seconds
  inactivityTimeout: number; // in seconds
  rememberMeDuration: number; // in seconds
  requireReauthForSensitive: boolean;
  enableSessionAnalytics: boolean;
  enableSecurityMonitoring: boolean;
}

/**
 * Session search and filtering
 */
export interface SessionFilter {
  userId?: string;
  isActive?: boolean;
  deviceType?: string;
  browser?: string;
  os?: string;
  country?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  lastActivityAfter?: Date;
  lastActivityBefore?: Date;
  hasSecurityFlags?: boolean;
  riskScoreMin?: number;
  riskScoreMax?: number;
}

export interface SessionSearchResult {
  sessions: ExtendedSession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Session state for Redux store
 */
export interface SessionState {
  currentSession: ExtendedSession | null;
  activeSessions: ExtendedSession[];
  sessionAnalytics: SessionAnalytics | null;
  securityEvents: SecurityEvent[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Session notifications
 */
export interface SessionNotification {
  id: string;
  userId: string;
  type: SessionNotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  read: boolean;
  actionRequired: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

export enum SessionNotificationType {
  NEW_LOGIN = 'new_login',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  SESSION_EXPIRED = 'session_expired',
  MULTIPLE_SESSIONS = 'multiple_sessions',
  SECURITY_ALERT = 'security_alert',
  DEVICE_VERIFICATION = 'device_verification'
}

/**
 * Remember me token
 */
export interface RememberMeToken {
  id: string;
  userId: string;
  token: string;
  selector: string;
  hashedValidator: string;
  expiresAt: Date;
  createdAt: Date;
  deviceInfo: DeviceInfo;
  lastUsedAt?: Date;
}

/**
 * Session backup and recovery
 */
export interface SessionBackup {
  sessionId: string;
  userId: string;
  sessionData: Record<string, unknown>;
  deviceInfo: DeviceInfo;
  createdAt: Date;
  expiresAt: Date;
}
