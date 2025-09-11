/**
 * Adapter Pattern Interface
 * For allowing incompatible interfaces to work together
 */
export interface IAdapter<TSource, TTarget> {
  adapt(source: TSource): TTarget;
}

/**
 * Target Interface
 * The interface that clients expect
 */
export interface ITarget<T> {
  request(): T;
}

/**
 * Adaptee Interface
 * The interface that needs adapting
 */
export interface IAdaptee<T> {
  specificRequest(): T;
}
