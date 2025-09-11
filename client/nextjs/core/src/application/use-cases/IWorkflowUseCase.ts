import { ICommandResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Workflow Use Case Interface
 * For complex business workflows
 */
export interface IWorkflowUseCase<TWorkflowInput, TWorkflowResult> extends IUseCase<TWorkflowInput, ICommandResult<TWorkflowResult>> {
  execute(input: TWorkflowInput): Promise<ICommandResult<TWorkflowResult>>;
  validate(input: TWorkflowInput): Promise<IValidationResult>;
  getSteps(): string[];
  executeStep(stepName: string, input: any): Promise<any>;
  rollback?(input: TWorkflowInput, failedStep?: string): Promise<void>;
}
