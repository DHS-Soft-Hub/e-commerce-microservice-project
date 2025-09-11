import { IBaseEntity, IDomainEvent } from '@dhs-hub/core';
import { EmailVerifiedEvent, UserLoggedInEvent, UserRegisteredEvent } from '../events/AuthEvents';
import { Email } from '../value-objects';

/**
 * User Entity
 * Core domain entity representing a user in the system
 */
export interface User extends IBaseEntity<string> {
  email: Email;
  username?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export class UserEntity implements User {
  public domainEvents: IDomainEvent[] = [];

  constructor(
    public id: string,
    public email: Email,
    public username: string | undefined,
    public firstName: string | undefined,
    public lastName: string | undefined,
    public roles: string[],
    public permissions: string[],
    public isActive: boolean,
    public isEmailVerified: boolean,
    public twoFactorEnabled: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public lastLoginAt?: Date,
    public metadata?: Record<string, unknown>
  ) { }

  static create(
    email: string,
    username?: string,
    firstName?: string,
    lastName?: string
  ): UserEntity {
    const user = new UserEntity(
      generateId(),
      Email.create(email),
      username,
      firstName,
      lastName,
      [],
      [],
      true,
      false,
      false, // twoFactorEnabled default
      new Date(),
      new Date()
    );

    user.addDomainEvent(new UserRegisteredEvent(user.id, user.email.value));
    return user;
  }

  login(): void {
    this.lastLoginAt = new Date();
    this.addDomainEvent(new UserLoggedInEvent(this.id, this.lastLoginAt));
  }

  verifyEmail(): void {
    if (!this.isEmailVerified) {
      this.isEmailVerified = true;
      this.updatedAt = new Date();
      this.addDomainEvent(new EmailVerifiedEvent(this.id, this.email.value));
    }
  }

  updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    username?: string;
  }): void {
    if (updates.firstName) this.firstName = updates.firstName;
    if (updates.lastName) this.lastName = updates.lastName;
    if (updates.username) this.username = updates.username;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  addRole(role: string): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role);
      this.updatedAt = new Date();
    }
  }

  removeRole(role: string): void {
    const index = this.roles.indexOf(role);
    if (index > -1) {
      this.roles.splice(index, 1);
      this.updatedAt = new Date();
    }
  }

  addPermission(permission: string): void {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
      this.updatedAt = new Date();
    }
  }

  removePermission(permission: string): void {
    const index = this.permissions.indexOf(permission);
    if (index > -1) {
      this.permissions.splice(index, 1);
      this.updatedAt = new Date();
    }
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
