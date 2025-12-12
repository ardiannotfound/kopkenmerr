import { api } from './axios';

// Tipe data yang dikirim saat update profile
interface UpdateProfilePayload {
  username?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

export const authApi = {
  // Login
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; 
  },

  // Get Profile (Me)
  // Backend return: { success: true, user: { ... } }
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data; // Kita return full wrapper dulu
  },

  // Update Profile
  // Payload: { username, phone, address, avatar_url }
  updateProfile: async (data: UpdateProfilePayload) => {
    const response = await api.put('/auth/me', data);
    return response.data; // Biasanya return { success: true, user: { ...updated } }
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }
};