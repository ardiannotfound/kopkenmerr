import { api } from './axios'; 

export const catalogApi = {
  getOpds: async () => {
    try {
      const response = await api.get('/public/opd');
      return response.data.data || []; 
    } catch (error) {
      console.error('Failed fetch OPDs', error);
      return [];
    }
  },

  // 2. Ambil Katalog Layanan (Hierarki) berdasarkan OPD ID
  getServiceCatalog: async (opdId: number) => {
    try {
      const response = await api.get('/catalog', {
        params: { opd_id: opdId }
      });
      
      return response.data.data || []; 
    } catch (error) {
      console.error('Failed fetch Service Catalog', error);
      return []; 
    }
  }
};