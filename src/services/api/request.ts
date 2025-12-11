import { api } from './axios';

export const requestApi = {
  // Ambil Katalog Layanan
  getCatalog: async () => {
    const response = await api.get('/catalog');
    return response.data;
  },

  // List Request (Teknisi)
  getAll: async (params?: any) => {
    const response = await api.get('/request', { params });
    return response.data;
  },

  // Detail Request
  getDetail: async (id: string | number) => {
    const response = await api.get(`/request/${id}`);
    return response.data;
  },

  // Submit Request Baru
  create: async (data: any) => {
    const response = await api.post('/request', data);
    return response.data;
  },

  // Edit Request (Teknisi)
  update: async (id: string | number, data: any) => {
    const response = await api.put(`/request/${id}`, data);
    return response.data;
  },

  // Update Progress Request (Teknisi)
  updateProgress: async (id: string | number, data: any) => {
    const response = await api.post(`/request/${id}/progress`, data);
    return response.data;
  }
};