import { IResult } from '@dhs-hub/core';
import { SessionEntity, DeviceInfo } from '../../domain/entities/Session';

/**
 * Session Management Service Interface
 * Operations for managing user sessions
 */
export interface ISessionService {
  /**
   * Create new session
   */
  createSession(userId: string, deviceInfo: DeviceInfo): Promise<IResult<SessionEntity>>;

  /**
   * Get current session
   */
  getCurrentSession(): Promise<IResult<SessionEntity | null>>;

  /**
   * Get all user sessions
   */
  getUserSessions(userId: string): Promise<IResult<SessionEntity[]>>;

  /**
   * Refresh session
   */
  refreshSession(sessionId: string): Promise<IResult<SessionEntity>>;

  /**
   * Terminate session
   */
  terminateSession(sessionId: string): Promise<IResult<void>>;

  /**
   * Terminate all sessions for user
   */
  terminateAllSessions(userId: string): Promise<IResult<void>>;

  /**
   * Terminate all other sessions (keep current)
   */
  terminateOtherSessions(currentSessionId: string): Promise<IResult<void>>;

  /**
   * Check if session is valid
   */
  isSessionValid(sessionId: string): Promise<boolean>;

  /**
   * Update session activity
   */
  updateActivity(sessionId: string): Promise<IResult<void>>;

  /**
   * Get session by ID
   */
  getSessionById(sessionId: string): Promise<IResult<SessionEntity>>;
}
