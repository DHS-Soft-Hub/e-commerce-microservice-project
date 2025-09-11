import { IEntity } from '../../shared/types/IDomainTypes';
import { IDomainEvent } from '../../shared/types/IEventTypes';

/**
 * Base Entity Interface for Domain Entities
 * Extends basic entity with domain event capabilities
 */
export interface IBaseEntity<TId = string> extends IEntity<TId> {
  /**
   * Domain events that occurred on this entity
   */
  domainEvents: IDomainEvent[];

  /**
   * Add a domain event to this entity
   */
  addDomainEvent(event: IDomainEvent): void;

  /**
   * Clear all domain events from this entity
   */
  clearDomainEvents(): void;

  /**
   * Get all domain events and clear them
   */
  pullDomainEvents(): IDomainEvent[];
}
