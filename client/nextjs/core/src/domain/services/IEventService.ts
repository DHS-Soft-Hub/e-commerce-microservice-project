import { IResult } from '../../shared/types';

/**
 * Event Service Interface
 * For handling domain events
 */
export interface IEventService<TEvent> {
  /**
   * Publish event
   */
  publish(event: TEvent): Promise<IResult<void>>;

  /**
   * Subscribe to events
   */
  subscribe(eventType: string, handler: (event: TEvent) => Promise<void>): void;

  /**
   * Unsubscribe from events
   */
  unsubscribe(eventType: string, handler: (event: TEvent) => Promise<void>): void;
}
