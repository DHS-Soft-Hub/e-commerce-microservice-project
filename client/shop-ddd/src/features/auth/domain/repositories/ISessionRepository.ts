import { IResult } from '@dhs-hub/core';
import { IBaseRepository } from '@dhs-hub/core';
import { SessionEntity, DeviceInfo } from '../entities/Session';

/**
 * Session Repository Interface
 * Data access operations for session management
 */
export interface ISessionRepository extends IBaseRepository<SessionEntity, string> {
  /**
   * Get sessions by user ID
   */
  getByUserId(userId: string): Promise<IResult<SessionEntity[]>>;

  /**
   * Get active sessions by user ID
   */
  getActiveByUserId(userId: string): Promise<IResult<SessionEntity[]>>;

  /**
   * Create new session
   */
  createSession(userId: string, deviceInfo: DeviceInfo): Promise<IResult<SessionEntity>>;

  /**
   * Update session activity
   */
  updateActivity(sessionId: string): Promise<IResult<void>>;

  /**
   * Terminate session
   */
  terminate(sessionId: string): Promise<IResult<void>>;

  /**
   * Terminate all sessions for user
   */
  terminateAllForUser(userId: string): Promise<IResult<void>>;

  /**
   * Terminate all sessions except current
   */
  terminateAllExcept(userId: string, currentSessionId: string): Promise<IResult<void>>;

  /**
   * Check if session is valid
   */
  isValid(sessionId: string): Promise<boolean>;

  /**
   * Get session by ID
   */
  getBySessionId(sessionId: string): Promise<IResult<SessionEntity>>;

  /**
   * Clean up expired sessions
   */
  cleanupExpired(): Promise<IResult<number>>;

  /**
   * Get session count for user
   */
  getCountByUserId(userId: string): Promise<number>;

  /**
   * Get active session count for user
   */
  getActiveCountByUserId(userId: string): Promise<number>;

  /**
   * Extend session expiration
   */
  extendExpiration(sessionId: string, expiresAt: Date): Promise<IResult<void>>;

  /**
   * Get sessions by device
   */
  getByDevice(userId: string, deviceInfo: Partial<DeviceInfo>): Promise<IResult<SessionEntity[]>>;
}
