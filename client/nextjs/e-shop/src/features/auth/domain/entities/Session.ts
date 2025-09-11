import { IBaseEntity, IDomainEvent } from '@dhs-hub/core';

/**
 * Session Entity
 * Represents an active user session
 */
export interface Session extends IBaseEntity<string> {
  sessionId: string;
  userId: string;
  deviceInfo: DeviceInfo;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  ipAddress?: string;
  location?: string;
}

export class SessionEntity implements Session {
  public domainEvents: IDomainEvent[] = [];

  constructor(
    public id: string,
    public sessionId: string,
    public userId: string,
    public deviceInfo: DeviceInfo,
    public createdAt: Date,
    public updatedAt: Date,
    public lastActivityAt: Date,
    public expiresAt: Date,
    public isActive: boolean
  ) {}

  static create(
    userId: string,
    deviceInfo: DeviceInfo,
    duration: number = 24 * 60 * 60 * 1000 // 24 hours
  ): SessionEntity {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration);

    return new SessionEntity(
      generateId(),
      generateSessionId(),
      userId,
      deviceInfo,
      now,
      now,
      now,
      expiresAt,
      true
    );
  }

  updateActivity(): void {
    this.lastActivityAt = new Date();
    this.updatedAt = new Date();
  }

  expire(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  isExpired(): boolean {
    return !this.isActive || new Date() > this.expiresAt;
  }

  // Domain event management
  addDomainEvent(event: IDomainEvent): void {
    this.domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  pullDomainEvents(): IDomainEvent[] {
    const events = [...this.domainEvents];
    this.clearDomainEvents();
    return events;
  }
}

function generateId(): string {
  return crypto.randomUUID();
}

function generateSessionId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}
