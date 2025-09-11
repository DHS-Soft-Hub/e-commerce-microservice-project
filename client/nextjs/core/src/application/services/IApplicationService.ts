import { IResult } from '../../shared/types/IResult';
import { IValidationResult } from '../../shared/types/IValidationTypes';

/**
 * Application Service Interface
 * Orchestrates use cases and coordinates between domain services
 */
export interface IApplicationService<TCommand, TResult> {
  /**
   * Handle application command
   */
  handle(command: TCommand): Promise<IResult<TResult>>;

  /**
   * Validate command
   */
  validateCommand(command: TCommand): Promise<IValidationResult>;

  /**
   * Check if service can handle the command
   */
  canHandle(command: TCommand): boolean;

  /**
   * Get supported command types
   */
  getSupportedCommands(): string[];
}
