import { IResult } from './IResult';

/**
 * Command Result
 * Response type for command operations
 */
export interface ICommandResult<T = void> extends IResult<T> {
  commandId: string;
}

/**
 * Query Result
 * Response type for query operations
 */
export interface IQueryResult<T> extends IResult<T> {
  queryId: string;
}
