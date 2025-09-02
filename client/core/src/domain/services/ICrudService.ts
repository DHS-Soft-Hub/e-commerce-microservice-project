import { IEntity, IQueryOptions, IResult } from '../../shared/types';

/**
 * CRUD Service Interface
 * Simple CRUD operations without complex business logic
 */
export interface ICrudService<TEntity extends IEntity, TCreateDto, TUpdateDto, TId = string> {
  create(data: TCreateDto): Promise<IResult<TEntity>>;
  getById(id: TId): Promise<IResult<TEntity>>;
  getAll(options?: IQueryOptions): Promise<IResult<TEntity[]>>;
  update(id: TId, data: TUpdateDto): Promise<IResult<TEntity>>;
  delete(id: TId): Promise<IResult<void>>;
}
