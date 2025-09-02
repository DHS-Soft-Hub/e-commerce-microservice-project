// Base Use Cases
export { IUseCase } from './IUseCase';
export { ICommandUseCase } from './ICommandUseCase';
export { IQueryUseCase } from './IQueryUseCase';

// CRUD Use Cases
export { ICreateUseCase } from './ICreateUseCase';
export { IUpdateUseCase } from './IUpdateUseCase';
export { IDeleteUseCase } from './IDeleteUseCase';
export { IGetByIdUseCase } from './IGetByIdUseCase';
export { IGetManyUseCase } from './IGetManyUseCase';
export { ISearchUseCase } from './ISearchUseCase';

// Advanced Use Cases
export { IBulkUseCase } from './IBulkUseCase';
export { IImportUseCase } from './IImportUseCase';
export { IExportUseCase } from './IExportUseCase';
export { IWorkflowUseCase } from './IWorkflowUseCase';

// Authentication Use Cases
export {
  ILoginUseCase,
  IRegisterUseCase,
  ILogoutUseCase,
  IRefreshTokenUseCase
} from './IAuthUseCases';

// Authorization Use Cases
export {
  ICheckPermissionUseCase,
  IGetUserRolesUseCase,
  IAssignRoleUseCase,
  IRevokeRoleUseCase
} from './IAuthorizationUseCases';
