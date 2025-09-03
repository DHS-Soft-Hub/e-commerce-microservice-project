import { IQuery } from '../../shared/types/ICQRSTypes';
import { IQueryResult } from '../../shared/types/IResponseTypes';
import { IValidationResult } from '../../shared/types/IValidationTypes';

/**
 * Query Handler Interface
 * For handling query operations in CQRS pattern
 */
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  /**
   * Handle the query and return result
   */
  handle(query: TQuery): Promise<IQueryResult<TResult>>;

  /**
   * Validate the query before handling
   */
  validate(query: TQuery): Promise<IValidationResult>;

  /**
   * Check if this handler can handle the query
   */
  canHandle(query: TQuery): boolean;

  /**
   * Get the query type this handler supports
   */
  getQueryType(): string;

  /**
   * Check if query result should be cached
   */
  shouldCache?(query: TQuery): boolean;

  /**
   * Get cache key for the query
   */
  getCacheKey?(query: TQuery): string;
}
