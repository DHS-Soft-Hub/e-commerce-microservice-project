/**
 * Auth Queries for CQRS pattern
 */

export interface GetCurrentUserQuery {
  type: 'GET_CURRENT_USER';
}

export interface GetUserByIdQuery {
  type: 'GET_USER_BY_ID';
  userId: string;
}

export interface GetUserByEmailQuery {
  type: 'GET_USER_BY_EMAIL';
  email: string;
}

export interface GetUserSessionsQuery {
  type: 'GET_USER_SESSIONS';
  userId: string;
}

export interface ValidateTokenQuery {
  type: 'VALIDATE_TOKEN';
  token: string;
}

export interface CheckEmailExistsQuery {
  type: 'CHECK_EMAIL_EXISTS';
  email: string;
}

export type AuthQuery = 
  | GetCurrentUserQuery 
  | GetUserByIdQuery 
  | GetUserByEmailQuery 
  | GetUserSessionsQuery 
  | ValidateTokenQuery 
  | CheckEmailExistsQuery;
