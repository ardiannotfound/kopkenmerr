import { api } from './axios';

export const authApi = {
  // Login
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get Profile (Me)
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update Profile
  updateProfile: async (data: any) => {
    const response = await api.put('/auth/me', data);
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }
};