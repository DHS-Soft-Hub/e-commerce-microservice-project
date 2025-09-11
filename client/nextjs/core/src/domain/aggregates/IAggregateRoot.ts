import { IBaseEntity } from '../entities/IBaseEntity';

/**
 * Aggregate Root Interface
 * Defines the root entity of an aggregate with business invariants
 */
export interface IAggregateRoot<TId = string> extends IBaseEntity<TId> {
  /**
   * Version for optimistic concurrency control
   */
  version: number;

  /**
   * Business invariant validation
   * Returns true if all business rules are satisfied
   */
  invariant(): boolean;

  /**
   * Apply business rule validation
   * Throws error if invariants are violated
   */
  checkInvariants(): void;

  /**
   * Mark aggregate as modified
   */
  markAsModified(): void;

  /**
   * Check if aggregate has been modified
   */
  isModified(): boolean;
}
