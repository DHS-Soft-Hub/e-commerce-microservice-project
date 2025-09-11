import { IPaginationParams } from './IPaginationTypes';

/**
 * Filter Interface
 * For building dynamic query filters
 */
export interface IFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

/**
 * Query Options
 * For configuring complex queries with filters, pagination, and includes
 */
export interface IQueryOptions {
  filters?: IFilter[];
  pagination?: IPaginationParams;
  includes?: string[];
}
