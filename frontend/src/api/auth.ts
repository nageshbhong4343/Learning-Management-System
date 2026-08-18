import { apiClient } from './axios';
import { AuthResponse, User } from '../types/auth';

export const authApi = {
  login: async (email: string, password: string, loginMode?: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login/', {
      email,
      password,
      login_mode: loginMode,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me/');
    return response.data;
  },

  requestOTP: async (email: string, purpose = 'LOGIN') => {
    const response = await apiClient.post('/auth/request-otp/', { email, purpose });
    return response.data;
  },

  verifyOTP: async (email: string, otpCode: string, purpose = 'LOGIN') => {
    const response = await apiClient.post('/auth/verify-otp/', {
      email,
      otp_code: otpCode,
      purpose,
    });
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  getLoginHistory: async () => {
    const response = await apiClient.get('/auth/login-history/');
    return response.data;
  },
};
