/**
 * API Response Interface
 * Standard response format for API calls
 */
export interface IApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: IApiMeta;
}

/**
 * API Meta Information
 */
export interface IApiMeta {
  timestamp: string;
  version: string;
  requestId: string;
  pagination?: IPaginationMeta;
}

/**
 * Pagination Meta Information
 */
export interface IPaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * API Error Response
 */
export interface IApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

/**
 * API List Response
 */
export interface IApiListResponse<T> extends IApiResponse<T[]> {
  pagination: IPaginationMeta;
}

/**
 * API Request Options
 */
export interface IApiRequestOptions {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}
