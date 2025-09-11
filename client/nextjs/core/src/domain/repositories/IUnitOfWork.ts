import { IResult } from '../../shared/types';

/**
 * Unit of Work Pattern Interface
 */
export interface IUnitOfWork {
  /**
   * Begin transaction
   */
  begin(): Promise<void>;

  /**
   * Commit transaction
   */
  commit(): Promise<IResult<void>>;

  /**
   * Rollback transaction
   */
  rollback(): Promise<void>;

  /**
   * Execute operation within transaction
   */
  executeInTransaction<T>(operation: () => Promise<T>): Promise<IResult<T>>;
}
