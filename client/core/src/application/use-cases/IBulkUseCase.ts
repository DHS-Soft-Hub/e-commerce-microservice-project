import { ICommandResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Bulk Operation Use Case Interface
 * For operations that affect multiple entities
 */
export interface IBulkUseCase<TBulkOperation, TResult> extends IUseCase<TBulkOperation, ICommandResult<TResult>> {
  execute(operation: TBulkOperation): Promise<ICommandResult<TResult>>;
  validate(operation: TBulkOperation): Promise<IValidationResult>;
  rollback?(operation: TBulkOperation): Promise<void>;
}
