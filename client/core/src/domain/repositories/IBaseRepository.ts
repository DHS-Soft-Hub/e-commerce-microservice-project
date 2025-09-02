import { IEntity, IPaginatedResult, IQueryOptions, IResult } from '../../shared/types';

/**
 * Base Repository Interface
 * Provides common CRUD operations for all repositories
 */
export interface IBaseRepository<TEntity extends IEntity, TId = string> {
  /**
   * Find entity by ID
   */
  findById(id: TId): Promise<IResult<TEntity | null>>;

  /**
   * Find multiple entities with optional query options
   */
  findMany(options?: IQueryOptions): Promise<IResult<TEntity[]>>;

  /**
   * Find entities with pagination
   */
  findManyPaginated(options?: IQueryOptions): Promise<IResult<IPaginatedResult<TEntity>>>;

  /**
   * Find first entity matching criteria
   */
  findFirst(options?: IQueryOptions): Promise<IResult<TEntity | null>>;

  /**
   * Check if entity exists by ID
   */
  exists(id: TId): Promise<IResult<boolean>>;

  /**
   * Count entities matching criteria
   */
  count(options?: IQueryOptions): Promise<IResult<number>>;

  /**
   * Create new entity
   */
  create(entity: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<IResult<TEntity>>;

  /**
   * Create multiple entities
   */
  createMany(entities: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<IResult<TEntity[]>>;

  /**
   * Update entity by ID
   */
  update(id: TId, updates: Partial<TEntity>): Promise<IResult<TEntity>>;

  /**
   * Update multiple entities
   */
  updateMany(options: IQueryOptions, updates: Partial<TEntity>): Promise<IResult<number>>;

  /**
   * Delete entity by ID
   */
  delete(id: TId): Promise<IResult<void>>;

  /**
   * Delete multiple entities
   */
  deleteMany(options?: IQueryOptions): Promise<IResult<number>>;

  /**
   * Soft delete entity by ID (if supported)
   */
  softDelete?(id: TId): Promise<IResult<void>>;

  /**
   * Restore soft deleted entity (if supported)
   */
  restore?(id: TId): Promise<IResult<void>>;
}
