import { ICommandResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Create Use Case Interface
 * For creating new entities
 */
export interface ICreateUseCase<TCreateDto, TEntity> extends IUseCase<TCreateDto, ICommandResult<TEntity>> {
  execute(data: TCreateDto): Promise<ICommandResult<TEntity>>;
  validate(data: TCreateDto): Promise<IValidationResult>;
}
