import { IEntity, IPaginatedResult, IQueryOptions, IResult } from '../../shared/types';

/**
 * Read-only Repository Interface
 * For repositories that only provide read operations
 */
export interface IReadOnlyRepository<TEntity extends IEntity, TId = string> {
  findById(id: TId): Promise<IResult<TEntity | null>>;
  findMany(options?: IQueryOptions): Promise<IResult<TEntity[]>>;
  findManyPaginated(options?: IQueryOptions): Promise<IResult<IPaginatedResult<TEntity>>>;
  findFirst(options?: IQueryOptions): Promise<IResult<TEntity | null>>;
  exists(id: TId): Promise<IResult<boolean>>;
  count(options?: IQueryOptions): Promise<IResult<number>>;
}
