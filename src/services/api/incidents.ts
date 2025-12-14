import { api } from './axios';

export const incidentApi = {
  // GET /incidents
  getAll: async () => {
    const response = await api.get('/incidents');
    return response.data.data; 
  },

  // GET /incidents/{id}
  getDetail: async (id: number | string) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data; 
  },

  // ✅ FIX: Ganti FormData menjadi 'any' (JSON Object)
  // Backend mengharapkan JSON (Content-Type: application/json)
  create: async (data: any) => {
    const response = await api.post('/incidents', data);
    return response.data;
  },

  // --- TECHNICIAN ACTIONS ---
  updateProgress: async (id: number | string, data: any) => {
    const response = await api.post(`/incidents/${id}/progress`, data);
    return response.data;
  },

  // --- PUBLIC (TAMU) ---
  getPublicOPD: async () => {
    const response = await api.get('/public/opd');
    return response.data.data;
  },

  // ✅ FIX: Ganti FormData menjadi 'any' (JSON Object)
  createPublic: async (data: any) => {
    // Axios otomatis set Content-Type ke application/json kalau data-nya object
    const response = await api.post('/public/incidents', data);
    return response.data;
  },

  trackPublic: async (ticketNumber: string) => {
    try {
      // URL sesuai Postman: /api/v1/public/tickets/{nomor}
      const response = await api.get(`/public/tickets/${ticketNumber}`);
      return response.data; 
    } catch (error) {
      console.log("Track Error:", error);
      throw error;
    }
  }
};