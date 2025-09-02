import { IResult } from '../../shared/types';

/**
 * Cache Service Interface
 * For caching operations
 */
export interface ICacheService<T> {
  /**
   * Get cached value
   */
  get(key: string): Promise<IResult<T | null>>;

  /**
   * Set cached value
   */
  set(key: string, value: T, ttl?: number): Promise<IResult<void>>;

  /**
   * Delete cached value
   */
  delete(key: string): Promise<IResult<void>>;

  /**
   * Check if key exists
   */
  exists(key: string): Promise<IResult<boolean>>;

  /**
   * Clear all cache
   */
  clear(): Promise<IResult<void>>;
}
