// import axios from 'axios';
// import { useAuthStore } from '../../store/authStore'; 

// // URL Backend Asli Anda
// export const API_URL = 'https://manpro-473802.et.r.appspot.com/api/v1';

// export const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   timeout: 15000,
// });

// // INTERCEPTOR REQUEST (Versi Baru: Ambil dari AuthStore)
// api.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().token;
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // INTERCEPTOR RESPONSE (Versi Baru: Auto Logout via AuthStore)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log('Session Expired, melakukan logout...');
//       // Langsung panggil action logout dari store
//       useAuthStore.getState().logout();
//     }
//     return Promise.reject(error);
//   }
// );

import axios from 'axios';
import { useAuthStore } from '../../store/authStore'; 

// URL Backend
export const API_URL = 'https://manpro-473802.et.r.appspot.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// --- INTERCEPTOR REQUEST (DEBUG VERSION) ---
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    
    // DEBUG LOG: Cek apakah token ada saat request dikirim
    console.log(`[🚀 REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    
    if (token) {
      console.log(`[🔑 TOKEN] Ada (Panjang: ${token.length} chars)`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[⚠️ TOKEN] WARNING: Token KOSONG / NULL saat request!');
    }

    // DEBUG LOG: Cek data yang dikirim
    if (config.data) {
        console.log('[📦 DATA]', JSON.stringify(config.data, null, 2));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR RESPONSE ---
api.interceptors.response.use(
  (response) => {
    console.log(`[✅ SUCCESS] ${response.config.url} (${response.status})`);
    return response;
  },
  (error) => {
    console.error(`[❌ ERROR] ${error.config?.url} (${error.response?.status})`);
    console.error('[❌ MESSAGE]', error.response?.data?.message || error.message);

    if (error.response?.status === 401) {
      console.log('Session Expired, melakukan logout...');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;