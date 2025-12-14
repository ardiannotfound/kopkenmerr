import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL =
  'https://siladan-rest-api-711057748791.asia-southeast2.run.app/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');

    console.log('🔑 Token exists:', !!token);
    console.log('📍 Request URL:', config.url);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');

      Alert.alert(
        'Session Expired',
        'Silakan login ulang'
      );

      // TODO: navigation.reset(...) ke Login
    }

    return Promise.reject(error);
  }
);
