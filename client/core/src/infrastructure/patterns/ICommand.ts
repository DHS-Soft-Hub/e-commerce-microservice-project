/**
 * Command Pattern Interfaces
 * For encapsulating a request as an object
 */
export interface ICommandPattern<T = void> {
  execute(): T | Promise<T>;
  undo?(): T | Promise<T>;
}

/**
 * Command Invoker Interface
 * For invoking commands
 */
export interface ICommandInvoker<T = void> {
  executeCommand(command: ICommandPattern<T>): T | Promise<T>;
  undoCommand?(): T | Promise<T>;
}

/**
 * Command History Interface
 * For managing command history
 */
export interface ICommandHistory<T = void> {
  addCommand(command: ICommandPattern<T>): void;
  undo(): T | Promise<T>;
  redo(): T | Promise<T>;
  canUndo(): boolean;
  canRedo(): boolean;
}
