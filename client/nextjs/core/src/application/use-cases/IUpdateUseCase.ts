import { ICommandResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Update Use Case Interface
 * For updating existing entities
 */
export interface IUpdateUseCase<TUpdateDto, TEntity> extends IUseCase<{ id: string; data: TUpdateDto }, ICommandResult<TEntity>> {
  execute(input: { id: string; data: TUpdateDto }): Promise<ICommandResult<TEntity>>;
  validate(input: { id: string; data: TUpdateDto }): Promise<IValidationResult>;
}
