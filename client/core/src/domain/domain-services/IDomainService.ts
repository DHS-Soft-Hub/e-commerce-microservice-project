import { IResult } from '../../shared/types/IResult';
import { IValidationResult } from '../../shared/types/IValidationTypes';

/**
 * Domain Service Interface
 * For complex business operations that don't belong to a single entity
 */
export interface IDomainService<TInput, TOutput> {
  /**
   * Execute domain logic
   */
  execute(input: TInput): Promise<IResult<TOutput>>;

  /**
   * Validate domain operation input
   */
  validate(input: TInput): Promise<IValidationResult>;

  /**
   * Check if the service can handle the input
   */
  canHandle(input: TInput): boolean;
}
