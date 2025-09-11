import { IDomainEvent } from '../../shared/types/IEventTypes';

/**
 * Event Handler Interface
 * For handling domain events
 */
export interface IEventHandler<TEvent extends IDomainEvent> {
  /**
   * Handle the domain event
   */
  handle(event: TEvent): Promise<void>;

  /**
   * Check if this handler can handle the event
   */
  canHandle(event: TEvent): boolean;

  /**
   * Get the event type this handler supports
   */
  getEventType(): string;

  /**
   * Get handler priority (lower number = higher priority)
   */
  getPriority?(): number;

  /**
   * Specify if handler should run in transaction
   */
  requiresTransaction?(): boolean;
}
