import { api } from './axios';

export const kbApi = {
  // Ambil semua artikel (bisa filter faq/artikel)
  getAll: async (params?: any) => {
    const response = await api.get('/knowledge-base', { params });
    return response.data;
  },

  // Detail Artikel
  getDetail: async (id: string | number) => {
    const response = await api.get(`/knowledge-base/${id}`);
    return response.data;
  },

  // Buat Artikel (Teknisi)
  create: async (data: any) => {
    const response = await api.post('/knowledge-base', data);
    return response.data;
  }
};