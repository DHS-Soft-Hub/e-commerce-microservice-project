import { IQueryResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Search Use Case Interface
 * For complex search operations
 */
export interface ISearchUseCase<TSearchCriteria, TEntity> extends IUseCase<TSearchCriteria, IQueryResult<TEntity[]>> {
  execute(criteria: TSearchCriteria): Promise<IQueryResult<TEntity[]>>;
  validate(criteria: TSearchCriteria): Promise<IValidationResult>;
}
