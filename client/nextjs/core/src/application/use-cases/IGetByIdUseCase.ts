import { IQueryResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Get By Id Use Case Interface
 * For retrieving single entities by ID
 */
export interface IGetByIdUseCase<TEntity> extends IUseCase<string, IQueryResult<TEntity>> {
  execute(id: string): Promise<IQueryResult<TEntity>>;
  validate(id: string): Promise<IValidationResult>;
}
