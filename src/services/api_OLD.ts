import axios from 'axios';
import { storage } from '../utils/storage'; // Panggil utility storage kita tadi

// Ganti dengan URL Backend aslimu
export const API_URL = 'https://manpro-473802.et.r.appspot.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // Timeout 10 detik biar gak loading selamanya
});

// INTERCEPTOR: Otomatis tempel Token setiap request
api.interceptors.request.use(
  async (config) => {
    const token = await storage.get('userToken'); // Ambil dari storage kita
    if (token && token !== 'GUEST_SESSION') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR: Handle Error Global (Misal Token Expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Bisa tambahkan logic auto-logout disini nanti
      console.log('Token Expired atau Tidak Valid');
    }
    return Promise.reject(error);
  }
);

export default api;