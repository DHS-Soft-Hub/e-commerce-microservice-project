/**
 * Singleton Pattern Interface
 * For ensuring a class has only one instance
 */
export interface ISingleton<T> {
  getInstance(): T;
}

/**
 * Prototype Pattern Interface
 * For creating objects by cloning existing instances
 */
export interface IPrototype<T> {
  clone(): T;
}

/**
 * Proxy Pattern Interface
 * For providing a placeholder or surrogate for another object
 */
export interface IProxy<T> {
  request(): T;
}

/**
 * Facade Pattern Interface
 * For providing a simplified interface to a complex subsystem
 */
export interface IFacade<T> {
  operation(): T;
}
