import { IEntity, IPaginatedResult, IQueryOptions, IResult, IValidationResult } from '../../shared/types';

/**
 * Base Service Interface
 * Provides common business logic operations
 */
export interface IBaseService<TEntity extends IEntity, TCreateDto, TUpdateDto, TId = string> {
  /**
   * Get entity by ID with business logic validation
   */
  getById(id: TId): Promise<IResult<TEntity>>;

  /**
   * Get multiple entities with business logic filtering
   */
  getMany(options?: IQueryOptions): Promise<IResult<TEntity[]>>;

  /**
   * Get entities with pagination and business logic
   */
  getManyPaginated(options?: IQueryOptions): Promise<IResult<IPaginatedResult<TEntity>>>;

  /**
   * Create entity with business validation
   */
  create(data: TCreateDto): Promise<IResult<TEntity>>;

  /**
   * Update entity with business validation
   */
  update(id: TId, data: TUpdateDto): Promise<IResult<TEntity>>;

  /**
   * Delete entity with business logic checks
   */
  delete(id: TId): Promise<IResult<void>>;

  /**
   * Validate entity data
   */
  validate(data: TCreateDto | TUpdateDto): Promise<IValidationResult>;

  /**
   * Check if entity exists
   */
  exists(id: TId): Promise<IResult<boolean>>;
}
