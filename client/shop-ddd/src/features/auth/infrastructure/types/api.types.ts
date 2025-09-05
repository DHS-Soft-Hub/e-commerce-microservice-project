// Types matching backend auth schemas
export interface TokenData {
  access_token: string;
  token_type: string;
  user_id: number;
  expires_in: number;
  roles: string[];
  permissions: string[];
  profile_info: Record<string, unknown>;
  two_factor_enabled: boolean;
  is_email_verified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  totp_code?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_email_verified: boolean;
  is_active: boolean;
  two_factor_enabled: boolean;
  last_login?: string;
}

export interface ClientRegistrationRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export interface DeveloperRegistrationRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  taxId?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
}

export interface RegistrationResponse {
  message: string;
  success: boolean;
  user_id: number;
  verification_sent: boolean;
  totp_enabled: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  totp_code?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qr_code_url: string;
  backup_codes: string[];
}

export interface TwoFactorVerify {
  totp_code: string;
}

export interface TwoFactorDisable {
  password: string;
  totp_code: string;
}

export interface BackupCodeUse {
  backup_code: string;
}

export interface TwoFactorStatus {
  two_factor_enabled: boolean;
  backup_codes_remaining: number;
  success: boolean;
}

export interface TwoFactorRegenerateResponse {
  backup_codes: string[];
  message: string;
  success: boolean;
}

export interface SessionInfo {
  session_key: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_activity: string;
  is_active: boolean;
}

export interface GenericResponse {
  message: string;
  success: boolean;
}

export interface OAuthCallbackRequest {
  provider: string;
  code: string;
  state: string;
}