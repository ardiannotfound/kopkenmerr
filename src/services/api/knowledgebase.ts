import { api } from './axios';

export const kbApi = {
  // GET /knowledge-base -> Struktur { status: true, data: [...] }
  getAll: async () => {
    const response = await api.get('/knowledge-base');
    return response.data.data;
  },

  // GET /knowledge-base/{id} -> Struktur { status: true, data: {...} }
  getDetail: async (id: number | string) => {
    const response = await api.get(`/knowledge-base/${id}`);
    return response.data.data; // Backend KB membungkus detail dalam 'data'
  }
};