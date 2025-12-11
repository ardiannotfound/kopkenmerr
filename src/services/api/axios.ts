import axios from 'axios';
import { useAuthStore } from '../../store/authStore'; 

// URL Backend Asli Anda
export const API_URL = 'https://manpro-473802.et.r.appspot.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// INTERCEPTOR REQUEST (Versi Baru: Ambil dari AuthStore)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR RESPONSE (Versi Baru: Auto Logout via AuthStore)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Session Expired, melakukan logout...');
      // Langsung panggil action logout dari store
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);