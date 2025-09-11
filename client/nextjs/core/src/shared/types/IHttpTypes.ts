import { IResult } from './IResult';

/**
 * HTTP Client Interface
 * For making HTTP requests
 */
export interface IHttpClient {
  /**
   * GET request
   */
  get<T>(url: string, config?: IHttpRequestConfig): Promise<IResult<T>>;

  /**
   * POST request
   */
  post<T>(url: string, data?: any, config?: IHttpRequestConfig): Promise<IResult<T>>;

  /**
   * PUT request
   */
  put<T>(url: string, data?: any, config?: IHttpRequestConfig): Promise<IResult<T>>;

  /**
   * PATCH request
   */
  patch<T>(url: string, data?: any, config?: IHttpRequestConfig): Promise<IResult<T>>;

  /**
   * DELETE request
   */
  delete<T>(url: string, config?: IHttpRequestConfig): Promise<IResult<T>>;

  /**
   * HEAD request
   */
  head<T>(url: string, config?: IHttpRequestConfig): Promise<IResult<T>>;

  /**
   * OPTIONS request
   */
  options<T>(url: string, config?: IHttpRequestConfig): Promise<IResult<T>>;

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void;

  /**
   * Set base URL
   */
  setBaseUrl(baseUrl: string): void;

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: IHttpRequestInterceptor): void;

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: IHttpResponseInterceptor): void;
}

/**
 * HTTP Request Configuration
 */
export interface IHttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}

/**
 * HTTP Response Interface
 */
export interface IHttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: IHttpRequestConfig;
}

/**
 * HTTP Request Interceptor
 */
export interface IHttpRequestInterceptor {
  onRequest?(config: IHttpRequestConfig): IHttpRequestConfig | Promise<IHttpRequestConfig>;
  onRequestError?(error: any): any;
}

/**
 * HTTP Response Interceptor
 */
export interface IHttpResponseInterceptor {
  onResponse?<T>(response: IHttpResponse<T>): IHttpResponse<T> | Promise<IHttpResponse<T>>;
  onResponseError?(error: any): any;
}

/**
 * HTTP Error Interface
 */
export interface IHttpError extends Error {
  status?: number;
  statusText?: string;
  response?: IHttpResponse;
  config?: IHttpRequestConfig;
}
