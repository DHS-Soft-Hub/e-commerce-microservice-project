/**
 * Pagination Parameters
 * For configuring paginated queries
 */
export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Paginated Result
 * Contains paginated data with metadata
 */
export interface IPaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
