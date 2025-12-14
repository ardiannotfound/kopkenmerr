import { api } from './axios';
import { SearchResult } from '../../types/entities';

export const generalApi = {
  // GET /search?query=...
  search: async (query: string) => {
    const response = await api.get<{ success: boolean, results: SearchResult }>('/search', { 
      params: { query } 
    });
    return response.data.results;
  }
};