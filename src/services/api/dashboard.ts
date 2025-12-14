// src/services/api/dashboard.ts
import { api } from './axios';
import { DashboardResponse } from '../../types/dashboard';

export const dashboardApi = {
  getTechnicianDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};