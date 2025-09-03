import { IEntity, IQueryOptions, IResult } from '../../shared/types';

/**
 * Write-only Repository Interface
 * For repositories that only provide write operations
 */
export interface IWriteOnlyRepository<TEntity extends IEntity, TId = string> {
  create(entity: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<IResult<TEntity>>;
  createMany(entities: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<IResult<TEntity[]>>;
  update(id: TId, updates: Partial<TEntity>): Promise<IResult<TEntity>>;
  updateMany(options: IQueryOptions, updates: Partial<TEntity>): Promise<IResult<number>>;
  delete(id: TId): Promise<IResult<void>>;
  deleteMany(options?: IQueryOptions): Promise<IResult<number>>;
}
