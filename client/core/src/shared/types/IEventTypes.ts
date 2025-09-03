/**
 * Domain Event Interface
 * For implementing event-driven architecture
 */
export interface IDomainEvent {
  eventId: string;
  aggregateId: string;
  eventType: string;
  occurredOn: Date;
  eventVersion: number;
}
