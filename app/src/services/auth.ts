import api from './api';
import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  GoogleAuthRequest,
  AuthResponse,
  MessageResponse,
} from '../types/auth';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<MessageResponse>('/auth/register', data).then((r) => r.data),

  verifyEmail: (data: VerifyEmailRequest) =>
    api.post<AuthResponse>('/auth/verify-email', data).then((r) => r.data),

  resendCode: (email: string) =>
    api.post<MessageResponse>('/auth/resend-code', { email }).then((r) => r.data),

  googleLogin: (data: GoogleAuthRequest) =>
    api.post<AuthResponse>('/auth/google', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email: string) =>
    api.post<MessageResponse>('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    api.post<MessageResponse>('/auth/reset-password', data).then((r) => r.data),
};
