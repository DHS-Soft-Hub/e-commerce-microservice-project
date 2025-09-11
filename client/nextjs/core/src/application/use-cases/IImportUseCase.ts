import { ICommandResult, IQueryResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Import Use Case Interface
 * For importing data from external sources
 */
export interface IImportUseCase<TImportData, TResult> extends IUseCase<TImportData, ICommandResult<TResult>> {
  execute(data: TImportData): Promise<ICommandResult<TResult>>;
  validate(data: TImportData): Promise<IValidationResult>;
  preview?(data: TImportData): Promise<IQueryResult<any>>;
}
