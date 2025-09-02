/**
 * Result Pattern for Error Handling
 * Provides a consistent way to handle success and error states
 */
export interface IResult<T, E = Error> {
  isSuccess: boolean;
  isFailure: boolean;
  value?: T;
  error?: E;
}
