/**
 * Chain of Responsibility Pattern Interfaces
 * For passing requests along a chain of handlers
 */
export interface IHandler<T> {
  setNext(handler: IHandler<T>): IHandler<T>;
  handle(request: T): T | null;
}

/**
 * Mediator Pattern Interfaces
 * For defining how objects interact with each other
 */
export interface IMediator {
  notify(sender: object, event: string, data?: any): void;
}

export interface IMediatorComponent {
  setMediator(mediator: IMediator): void;
}

/**
 * Template Method Pattern Interface
 * For defining the skeleton of an algorithm
 */
export interface ITemplateMethod<TInput, TOutput> {
  execute(input: TInput): TOutput;
}

/**
 * Visitor Pattern Interfaces
 * For representing operations to be performed on elements
 */
export interface IVisitor<T = any> {
  visit(element: IElement<T>): void;
}

export interface IElement<T = any> {
  accept(visitor: IVisitor<T>): void;
}
