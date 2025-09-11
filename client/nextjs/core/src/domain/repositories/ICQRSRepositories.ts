import { IEntity } from '../../shared/types';
import { IReadOnlyRepository } from './IReadOnlyRepository';
import { IWriteOnlyRepository } from './IWriteOnlyRepository';

/**
 * Command Query Responsibility Segregation (CQRS) Repository Interfaces
 */
export interface IQueryRepository<TEntity extends IEntity, TId = string> extends IReadOnlyRepository<TEntity, TId> {}

export interface ICommandRepository<TEntity extends IEntity, TId = string> extends IWriteOnlyRepository<TEntity, TId> {}
