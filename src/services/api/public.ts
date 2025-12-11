import { api } from './axios';

export const publicApi = {
  // Buat Pengaduan Masyarakat (Tanpa Token)
  createIncident: async (data: FormData | any) => {
    const response = await api.post('/public/incidents', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Ambil list OPD
  getOpdList: async () => {
    const response = await api.get('/public/opd');
    return response.data;
  },

  // Tracking Tiket via Nomor Tiket
  trackTicket: async (ticketNumber: string) => {
    const response = await api.get(`/public/tickets/${ticketNumber}`);
    return response.data;
  }
};