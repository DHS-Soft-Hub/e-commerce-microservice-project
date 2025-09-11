import { ICommand } from '../../shared/types/ICQRSTypes';
import { ICommandResult } from '../../shared/types/IResponseTypes';
import { IValidationResult } from '../../shared/types/IValidationTypes';

/**
 * Command Handler Interface
 * For handling command operations in CQRS pattern
 */
export interface ICommandHandler<TCommand extends ICommand, TResult> {
  /**
   * Handle the command and return result
   */
  handle(command: TCommand): Promise<ICommandResult<TResult>>;

  /**
   * Validate the command before handling
   */
  validate(command: TCommand): Promise<IValidationResult>;

  /**
   * Check if this handler can handle the command
   */
  canHandle(command: TCommand): boolean;

  /**
   * Get the command type this handler supports
   */
  getCommandType(): string;
}
