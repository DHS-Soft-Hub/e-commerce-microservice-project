import { ICommandResult, IQueryResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Check Permission Use Case Interface
 */
export interface ICheckPermissionUseCase extends IUseCase<{ userId: string; permission: string }, IQueryResult<boolean>> {
  execute(input: { userId: string; permission: string }): Promise<IQueryResult<boolean>>;
  validate(input: { userId: string; permission: string }): Promise<IValidationResult>;
}

/**
 * Get User Roles Use Case Interface
 */
export interface IGetUserRolesUseCase extends IUseCase<string, IQueryResult<string[]>> {
  execute(userId: string): Promise<IQueryResult<string[]>>;
  validate(userId: string): Promise<IValidationResult>;
}

/**
 * Assign Role Use Case Interface
 */
export interface IAssignRoleUseCase extends IUseCase<{ userId: string; role: string }, ICommandResult<void>> {
  execute(input: { userId: string; role: string }): Promise<ICommandResult<void>>;
  validate(input: { userId: string; role: string }): Promise<IValidationResult>;
}

/**
 * Revoke Role Use Case Interface
 */
export interface IRevokeRoleUseCase extends IUseCase<{ userId: string; role: string }, ICommandResult<void>> {
  execute(input: { userId: string; role: string }): Promise<ICommandResult<void>>;
  validate(input: { userId: string; role: string }): Promise<IValidationResult>;
}
