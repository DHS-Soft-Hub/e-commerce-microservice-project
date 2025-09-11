import { IQueryResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Get Many Use Case Interface
 * For retrieving multiple entities with filtering
 */
export interface IGetManyUseCase<TEntity, TFilter> extends IUseCase<TFilter, IQueryResult<TEntity[]>> {
  execute(filter: TFilter): Promise<IQueryResult<TEntity[]>>;
  validate(filter: TFilter): Promise<IValidationResult>;
}
