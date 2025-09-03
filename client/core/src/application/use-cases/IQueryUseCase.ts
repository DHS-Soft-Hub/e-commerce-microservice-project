import { IQuery, IQueryResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Query Use Case Interface
 * For use cases that read data (Get, Search, List operations)
 */
export interface IQueryUseCase<TQuery extends IQuery, TResult> extends IUseCase<TQuery, IQueryResult<TResult>> {
  /**
   * Execute query
   */
  execute(query: TQuery): Promise<IQueryResult<TResult>>;

  /**
   * Validate query
   */
  validate(query: TQuery): Promise<IValidationResult>;
}
