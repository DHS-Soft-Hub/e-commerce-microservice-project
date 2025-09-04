import { ISessionService } from '../abstractions/ISessionService';
import { SessionEntity, DeviceInfo } from '../../domain/entities/Session';
import { IResult } from '@dhs-hub/core';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';

/**
 * Concrete implementation of the Session Service
 * Handles session management operations according to ISessionService interface
 */
export class SessionService implements ISessionService {
  private currentSessionId: string | null = null;

  constructor(
    private readonly sessionRepository: ISessionRepository
  ) {}

  async createSession(userId: string, deviceInfo: DeviceInfo): Promise<IResult<SessionEntity>> {
    try {
      return await this.sessionRepository.createSession(userId, deviceInfo);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to create session')
      };
    }
  }

  async getCurrentSession(): Promise<IResult<SessionEntity | null>> {
    try {
      if (!this.currentSessionId) {
        return {
          isSuccess: true,
          isFailure: false,
          value: null
        };
      }
      
      return await this.sessionRepository.getBySessionId(this.currentSessionId);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to get current session')
      };
    }
  }

  async getUserSessions(userId: string): Promise<IResult<SessionEntity[]>> {
    try {
      return await this.sessionRepository.getByUserId(userId);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to get user sessions')
      };
    }
  }

  async refreshSession(sessionId: string): Promise<IResult<SessionEntity>> {
    try {
      // Update session activity
      const updateResult = await this.sessionRepository.updateActivity(sessionId);
      
      if (!updateResult.isSuccess) {
        return {
          isSuccess: false,
          isFailure: true,
          error: updateResult.error
        };
      }

      // Extend expiration (24 hours from now)
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const extendResult = await this.sessionRepository.extendExpiration(sessionId, newExpiresAt);
      
      if (!extendResult.isSuccess) {
        return {
          isSuccess: false,
          isFailure: true,
          error: extendResult.error
        };
      }

      // Get the updated session
      const sessionResult = await this.sessionRepository.getBySessionId(sessionId);
      
      if (!sessionResult.isSuccess || !sessionResult.value) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('Session not found after refresh')
        };
      }

      return {
        isSuccess: true,
        isFailure: false,
        value: sessionResult.value
      };
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to refresh session')
      };
    }
  }

  async terminateSession(sessionId: string): Promise<IResult<void>> {
    try {
      return await this.sessionRepository.terminate(sessionId);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to terminate session')
      };
    }
  }

  async terminateAllSessions(userId: string): Promise<IResult<void>> {
    try {
      return await this.sessionRepository.terminateAllForUser(userId);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to terminate all sessions')
      };
    }
  }

  async terminateOtherSessions(currentSessionId: string): Promise<IResult<void>> {
    try {
      // First, get the current session to find the user ID
      const sessionResult = await this.sessionRepository.getBySessionId(currentSessionId);
      
      if (!sessionResult.isSuccess || !sessionResult.value) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('Current session not found')
        };
      }

      const userId = sessionResult.value.userId;
      return await this.sessionRepository.terminateAllExcept(userId, currentSessionId);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to terminate other sessions')
      };
    }
  }

  async isSessionValid(sessionId: string): Promise<boolean> {
    try {
      return await this.sessionRepository.isValid(sessionId);
    } catch {
      return false;
    }
  }

  async updateActivity(sessionId: string): Promise<IResult<void>> {
    try {
      return await this.sessionRepository.updateActivity(sessionId);
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to update session activity')
      };
    }
  }

  async getSessionById(sessionId: string): Promise<IResult<SessionEntity>> {
    try {
      const result = await this.sessionRepository.getBySessionId(sessionId);
      
      // Convert null result to error for the specific method signature
      if (result.isSuccess && !result.value) {
        return {
          isSuccess: false,
          isFailure: true,
          error: new Error('Session not found')
        };
      }

      return result as IResult<SessionEntity>;
    } catch (error) {
      return {
        isSuccess: false,
        isFailure: true,
        error: error instanceof Error ? error : new Error('Failed to get session by ID')
      };
    }
  }

  // Helper method to set current session (for internal use)
  setCurrentSession(sessionId: string): void {
    this.currentSessionId = sessionId;
  }

  // Helper method to clear current session (for internal use)
  clearCurrentSession(): void {
    this.currentSessionId = null;
  }
}
