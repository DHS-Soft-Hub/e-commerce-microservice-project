import { IQueryResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Export Use Case Interface
 * For exporting data to external formats
 */
export interface IExportUseCase<TExportCriteria, TExportResult> extends IUseCase<TExportCriteria, IQueryResult<TExportResult>> {
  execute(criteria: TExportCriteria): Promise<IQueryResult<TExportResult>>;
  validate(criteria: TExportCriteria): Promise<IValidationResult>;
}
