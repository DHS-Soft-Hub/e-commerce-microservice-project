/**
 * Base Entity Interface
 * All domain entities should implement this interface
 */
export interface IEntity<TId = string> {
  id: TId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base Value Object Interface
 * For immutable domain value objects
 */
export interface IValueObject<T> {
  value: T;
  equals(other: IValueObject<T>): boolean;
}
