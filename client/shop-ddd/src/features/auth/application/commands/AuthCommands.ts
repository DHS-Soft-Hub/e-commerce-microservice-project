/**
 * Auth Commands for CQRS pattern
 */

export interface LoginCommand {
  type: 'LOGIN';
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCommand {
  type: 'REGISTER';
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  agreeToTerms: boolean;
}

export interface LogoutCommand {
  type: 'LOGOUT';
  sessionId?: string;
}

export interface VerifyEmailCommand {
  type: 'VERIFY_EMAIL';
  token: string;
}

export interface ForgotPasswordCommand {
  type: 'FORGOT_PASSWORD';
  email: string;
}

export interface ResetPasswordCommand {
  type: 'RESET_PASSWORD';
  token: string;
  newPassword: string;
}

export interface RefreshTokenCommand {
  type: 'REFRESH_TOKEN';
  refreshToken: string;
}

export interface UpdateProfileCommand {
  type: 'UPDATE_PROFILE';
  userId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export type AuthCommand = 
  | LoginCommand 
  | RegisterCommand 
  | LogoutCommand 
  | VerifyEmailCommand 
  | ForgotPasswordCommand 
  | ResetPasswordCommand 
  | RefreshTokenCommand 
  | UpdateProfileCommand;
