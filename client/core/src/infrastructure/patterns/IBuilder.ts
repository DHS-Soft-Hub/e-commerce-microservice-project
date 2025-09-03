/**
 * Builder Pattern Interface
 * For constructing complex objects step by step
 */
export interface IBuilder<T> {
  reset(): void;
  build(): T;
}

/**
 * Director Interface
 * For managing the construction process
 */
export interface IDirector<T> {
  construct(builder: IBuilder<T>): T;
}

/**
 * Fluent Builder Interface
 * For method chaining in builder pattern
 */
export interface IFluentBuilder<T> {
  build(): T;
}
