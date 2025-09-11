/**
 * State Pattern Interfaces
 * For allowing an object to alter its behavior when its internal state changes
 */
export interface IState<T> {
  handle(context: T): void;
}

export interface IStateMachine<T> {
  currentState: IState<T>;
  changeState(state: IState<T>): void;
  handleRequest(): void;
}
