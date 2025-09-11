import { ICommandResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Delete Use Case Interface
 * For deleting entities
 */
export interface IDeleteUseCase extends IUseCase<string, ICommandResult<void>> {
  execute(id: string): Promise<ICommandResult<void>>;
  validate(id: string): Promise<IValidationResult>;
}
