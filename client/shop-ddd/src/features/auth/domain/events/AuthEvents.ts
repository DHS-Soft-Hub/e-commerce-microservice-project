import { IDomainEvent } from '@dhs-hub/core';

/**
 * Base Auth Event
 */
abstract class BaseAuthEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;
  public readonly eventVersion: number = 1;

  protected constructor(
    public readonly eventType: string,
    public readonly aggregateId: string
  ) {
    this.occurredOn = new Date();
    this.eventId = crypto.randomUUID();
  }
}

/**
 * User Registered Event
 * Fired when a new user registers
 */
export class UserRegisteredEvent extends BaseAuthEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    super('UserRegistered', userId);
  }
}

/**
 * User Logged In Event
 * Fired when a user successfully logs in
 */
export class UserLoggedInEvent extends BaseAuthEvent {
  constructor(
    public readonly userId: string,
    public readonly loginTime: Date
  ) {
    super('UserLoggedIn', userId);
  }
}

/**
 * User Logged Out Event
 * Fired when a user logs out
 */
export class UserLoggedOutEvent extends BaseAuthEvent {
  constructor(
    public readonly userId: string,
    public readonly logoutTime: Date
  ) {
    super('UserLoggedOut', userId);
  }
}

/**
 * Email Verified Event
 * Fired when a user verifies their email
 */
export class EmailVerifiedEvent extends BaseAuthEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    super('EmailVerified', userId);
  }
}

/**
 * Password Reset Requested Event
 * Fired when a user requests a password reset
 */
export class PasswordResetRequestedEvent extends BaseAuthEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    super('PasswordResetRequested', userId);
  }
}

/**
 * Password Reset Completed Event
 * Fired when a user successfully resets their password
 */
export class PasswordResetCompletedEvent extends BaseAuthEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    super('PasswordResetCompleted', userId);
  }
}

/**
 * Session Created Event
 * Fired when a new session is created
 */
export class SessionCreatedEvent extends BaseAuthEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string
  ) {
    super('SessionCreated', sessionId);
  }
}

/**
 * Session Expired Event
 * Fired when a session expires
 */
export class SessionExpiredEvent extends BaseAuthEvent {
  constructor(
    public readonly sessionId: string,
    public readonly userId: string
  ) {
    super('SessionExpired', sessionId);
  }
}
