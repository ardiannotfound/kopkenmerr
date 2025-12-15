import { api } from './axios'; // Sesuaikan path import axios instance Anda

export const surveyApi = {
  // POST Submit Survey
  submitSurvey: async (data: {
    ticket_id: number;
    rating: number;
    feedback: string;
    category: 'incidents' | 'requests'; // Sesuaikan tipe dengan backend
  }) => {
    try {
      // Endpoint sesuai request Anda: POST /api/v1/surveys
      const response = await api.post('/surveys', data);
      return response.data;
    } catch (error: any) {
      console.error("Submit Survey Error:", error.response?.data || error.message);
      throw error; // Lempar error agar bisa ditangkap di screen
    }
  },
};