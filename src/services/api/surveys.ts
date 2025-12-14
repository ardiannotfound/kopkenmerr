import {api} from './axios';

export const surveyApi = {
  // Submit Survey Kepuasan
  // ✅ SESUAI STRUKTUR DATABASE ASLI
  submit: async (data: {
    ticket_id: number;
    score: number;
    review: string;
  }) => {
    console.log('📡 SURVEY API - SUBMIT');
    console.log('📤 Input Data:', data);
    console.log('📤 JSON Stringified:', JSON.stringify(data, null, 2));
    
    // ✅ Validasi data sebelum kirim
    if (!data.score || isNaN(data.score)) {
      throw new Error('Score is invalid or missing');
    }
    
    try {
      // ✅ Explicit headers
      const response = await api.post('/surveys', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ SURVEY SUCCESS');
      console.log('📥 Response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ SURVEY API ERROR');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Request Data:', error.config?.data); // ✅ Cek data yang terkirim
      
      throw error;
    }
  },
};