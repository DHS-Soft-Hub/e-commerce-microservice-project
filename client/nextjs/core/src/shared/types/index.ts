/**
 * Core shared types and interfaces
 */

// Domain Types
export type { IEntity, IValueObject } from './IDomainTypes';

// Result Pattern
export type { IResult } from './IResult';

// Pagination Types
export type { IPaginationParams, IPaginatedResult } from './IPaginationTypes';

// Query Types
export type { IFilter, IQueryOptions } from './IQueryTypes';

// Event Types
export type { IDomainEvent } from './IEventTypes';

// CQRS Types
export type { ICommand, IQuery } from './ICQRSTypes';

// Response Types
export type { ICommandResult, IQueryResult } from './IResponseTypes';

// Validation Types
export type { IValidationError, IValidationResult } from './IValidationTypes';

// API Types
export type { 
  IApiResponse, 
  IApiMeta, 
  IPaginationMeta, 
  IApiError, 
  IApiListResponse, 
  IApiRequestOptions 
} from './IApiTypes';

// HTTP Types
export type { 
  IHttpClient, 
  IHttpRequestConfig, 
  IHttpResponse, 
  IHttpRequestInterceptor, 
  IHttpResponseInterceptor, 
  IHttpError 
} from './IHttpTypes';


