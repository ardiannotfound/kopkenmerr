import { api } from './axios';
import { LoginResponse, User } from '../../types/auth';

export const authApi = {
  login: async (data: any): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  getMe: async (): Promise<{ success: boolean, user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  // Dashboard Endpoint (General)
  getDashboard: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // EDIT PROFILE
  updateProfile: async (data: {
    username?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  }) => {
    // Method PUT sesuai standar REST untuk update data diri
    const response = await api.put('/auth/me', data);
    return response.data; 
  },

  changePassword: async (data: {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};