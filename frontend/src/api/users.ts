import { apiClient } from './axios';
import { User, UserRole } from '../types/auth';

export interface CreateUserData {
  email: string;
  username?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  password?: string;
}

export const usersApi = {
  getUsers: async (role?: string): Promise<User[]> => {
    const response = await apiClient.get<any>('/auth/users/', { params: { role } });
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await apiClient.post<User>('/auth/users/', {
      ...data,
      password: data.password || 'Password123!',
    });
    return response.data;
  },
};
