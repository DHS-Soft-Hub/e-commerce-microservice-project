import { IEntity, IPaginatedResult, IResult } from '../../shared/types';

/**
 * Query Service Interface
 * For read-only operations with complex querying capabilities
 */
export interface IQueryService<TEntity extends IEntity, TQuery> {
  /**
   * Execute query
   */
  query(query: TQuery): Promise<IResult<TEntity[]>>;

  /**
   * Execute paginated query
   */
  queryPaginated(query: TQuery): Promise<IResult<IPaginatedResult<TEntity>>>;

  /**
   * Get single result from query
   */
  queryFirst(query: TQuery): Promise<IResult<TEntity | null>>;

  /**
   * Count results for query
   */
  count(query: TQuery): Promise<IResult<number>>;
}
