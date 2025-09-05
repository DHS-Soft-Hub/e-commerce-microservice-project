import { IResult } from '@dhs-hub/core';

/**
 * Email Value Object
 * Encapsulates email validation and operations
 */
export class Email {
  private constructor(private readonly _value: string) {}

  static create(email: string): Email {
    const validation = this.validate(email);
    if (!validation.isSuccess) {
      throw new Error(`Invalid email: ${validation.error?.message}`);
    }
    return new Email(email.toLowerCase().trim());
  }

  static validate(email: string): IResult<boolean> {
    if (!email || typeof email !== 'string') {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Email is required') 
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Invalid email format') 
      };
    }

    if (email.length > 254) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Email is too long') 
      };
    }

    return { 
      isSuccess: true, 
      isFailure: false, 
      value: true 
    };
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}