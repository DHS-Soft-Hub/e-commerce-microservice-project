import { ICommandResult, IValidationResult } from '../../shared/types';
import { IUseCase } from './IUseCase';

/**
 * Login Use Case Interface
 */
export interface ILoginUseCase extends IUseCase<{ email: string; password: string }, ICommandResult<{ token: string; user: any }>> {
  execute(credentials: { email: string; password: string }): Promise<ICommandResult<{ token: string; user: any }>>;
  validate(credentials: { email: string; password: string }): Promise<IValidationResult>;
}

/**
 * Register Use Case Interface
 */
export interface IRegisterUseCase extends IUseCase<any, ICommandResult<{ token: string; user: any }>> {
  execute(userData: any): Promise<ICommandResult<{ token: string; user: any }>>;
  validate(userData: any): Promise<IValidationResult>;
}

/**
 * Logout Use Case Interface
 */
export interface ILogoutUseCase extends IUseCase<string, ICommandResult<void>> {
  execute(token: string): Promise<ICommandResult<void>>;
  validate(token: string): Promise<IValidationResult>;
}

/**
 * Refresh Token Use Case Interface
 */
export interface IRefreshTokenUseCase extends IUseCase<string, ICommandResult<{ token: string }>> {
  execute(refreshToken: string): Promise<ICommandResult<{ token: string }>>;
  validate(refreshToken: string): Promise<IValidationResult>;
}
