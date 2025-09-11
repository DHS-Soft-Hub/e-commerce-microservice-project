/**
 * Command Interface
 * For CQRS command operations
 */
export interface ICommand {
  commandId: string;
  timestamp: Date;
}

/**
 * Query Interface
 * For CQRS query operations
 */
export interface IQuery {
  queryId: string;
  timestamp: Date;
}
