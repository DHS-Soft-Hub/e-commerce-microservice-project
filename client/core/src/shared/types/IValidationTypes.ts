/**
 * Validation Error
 * Represents a single validation error
 */
export interface IValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Validation Result
 * Contains validation status and any errors
 */
export interface IValidationResult {
  isValid: boolean;
  errors: IValidationError[];
}
