import { IResult } from '@dhs-hub/core';

/**
 * Password Value Object
 * Encapsulates password validation and security
 */
export class Password {
  private constructor(private readonly _value: string) {}

  static create(password: string): Password {
    const validation = this.validate(password);
    if (!validation.isSuccess) {
      throw new Error(`Invalid password: ${validation.error?.message}`);
    }
    return new Password(password);
  }

  static validate(password: string): IResult<boolean> {
    if (!password || typeof password !== 'string') {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Password is required') 
      };
    }

    if (password.length < 8) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Password must be at least 8 characters long') 
      };
    }

    if (password.length > 128) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Password is too long') 
      };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Password must contain at least one uppercase letter') 
      };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Password must contain at least one lowercase letter') 
      };
    }

    // Check for at least one digit
    if (!/\d/.test(password)) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Password must contain at least one number') 
      };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
      return { 
        isSuccess: false, 
        isFailure: true, 
        error: new Error('Password must contain at least one special character') 
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

  // Don't expose the actual password value for security
  toString(): string {
    return '***HIDDEN***';
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }
}