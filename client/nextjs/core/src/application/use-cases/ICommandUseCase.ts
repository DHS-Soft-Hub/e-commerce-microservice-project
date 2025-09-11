import { ICommand, ICommandResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Command Use Case Interface
 * For use cases that modify state (Create, Update, Delete operations)
 */
export interface ICommandUseCase<TCommand extends ICommand, TResult> extends IUseCase<TCommand, ICommandResult<TResult>> {
  /**
   * Execute command
   */
  execute(command: TCommand): Promise<ICommandResult<TResult>>;

  /**
   * Validate command
   */
  validate(command: TCommand): Promise<IValidationResult>;

  /**
   * Handle command rollback if needed
   */
  rollback?(command: TCommand): Promise<void>;
}
