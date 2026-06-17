import { User } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
  consents?: {
    notificationsPush?: boolean;
    locationDiscovery?: boolean;
    marketingEmail?: boolean;
  };
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TwoFactorRequiredResponse {
  twoFactorRequired: true;
  temporaryToken: string;
  userId: string;
}

export interface VerifyLogin2faRequest {
  temporaryToken: string;
  code: string;
}

export interface MessageResponse {
  message: string;
}

export interface ApiError {
  statusCode: number;
  code?: string;
  message: string;
}
