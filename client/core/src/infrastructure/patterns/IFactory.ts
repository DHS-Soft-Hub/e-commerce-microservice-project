/**
 * Factory Pattern Interface
 * For creating objects without specifying their concrete classes
 */
export interface IFactory<T, TParams = any> {
  create(params: TParams): T;
}

/**
 * Abstract Factory Pattern Interface
 * For creating families of related objects
 */
export interface IAbstractFactory<T> {
  createProduct(): T;
}

/**
 * Factory Method Pattern Interface
 * For creating objects through inheritance
 */
export interface IFactoryMethod<T> {
  factoryMethod(): T;
}
