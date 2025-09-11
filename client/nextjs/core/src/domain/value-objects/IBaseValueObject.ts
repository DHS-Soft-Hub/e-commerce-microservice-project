import { IValueObject } from '../../shared/types/IDomainTypes';
import { IValidationResult } from '../../shared/types/IValidationTypes';

/**
 * Base Value Object Interface
 * Extends basic value object with validation capabilities
 */
export interface IBaseValueObject<T> extends IValueObject<T> {
  /**
   * Validate the value object
   * Returns validation result with any errors
   */
  validate(): IValidationResult;

  /**
   * Check if value object is valid
   */
  isValid(): boolean;

  /**
   * Get string representation of the value object
   */
  toString(): string;

  /**
   * Create a copy of this value object
   */
  clone(): IBaseValueObject<T>;
}
