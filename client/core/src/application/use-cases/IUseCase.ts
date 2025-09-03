import { IValidationResult } from '../../shared/types';

/**
 * Base Use Case Interface
 * All use cases must implement this interface
 */
export interface IUseCase<TInput, TOutput> {
  /**
   * Execute the use case
   */
  execute(input: TInput): Promise<TOutput>;

  /**
   * Validate use case input
   */
  validate(input: TInput): Promise<IValidationResult>;
}
