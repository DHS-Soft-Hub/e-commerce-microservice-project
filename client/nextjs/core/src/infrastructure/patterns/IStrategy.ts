/**
 * Strategy Pattern Interface
 * For defining a family of algorithms and making them interchangeable
 */
export interface IStrategy<TInput, TOutput> {
  execute(input: TInput): TOutput;
}

/**
 * Strategy Context Interface
 * For managing strategy implementations
 */
export interface IStrategyContext<TInput, TOutput> {
  setStrategy(strategy: IStrategy<TInput, TOutput>): void;
  executeStrategy(input: TInput): TOutput;
}
