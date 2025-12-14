import { api } from './axios';

export const requestApi = {
  // GET /catalog -> Struktur { success: true, data: [...] }
  getCatalog: async () => {
    const response = await api.get('/catalog');
    return response.data.data;
  },

  // GET /request -> Struktur { success: true, data: [...] }
  getAll: async () => {
    const response = await api.get('/requests');
    return response.data.data;
  },

  // GET /request/{id} -> Struktur { success: true, ticket: {...} }
  getDetail: async (id: number | string) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  // POST /request
  create: async (data: any) => {
    // Sesuaikan jika perlu FormData
    const response = await api.post('/requests', data);
    return response.data;
  },
  
  // Technician Update
  updateProgress: async (id: number | string, data: any) => {
    const response = await api.post(`/requests/${id}/progress`, data);
    return response.data;
  }
};