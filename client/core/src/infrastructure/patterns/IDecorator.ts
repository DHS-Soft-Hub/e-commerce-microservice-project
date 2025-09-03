/**
 * Decorator Pattern Interface
 * For adding new functionality to objects dynamically
 */
export interface IComponent<T> {
  operation(): T;
}

export interface IDecorator<T> extends IComponent<T> {
  component: IComponent<T>;
}

/**
 * Decorator Base Interface
 * For implementing concrete decorators
 */
export interface IDecoratorBase<T> {
  decorate(component: IComponent<T>): IComponent<T>;
}
