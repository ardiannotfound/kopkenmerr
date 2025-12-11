// import { api } from './axios';

// export const incidentApi = {
//   // Ambil daftar tiket (bisa tambah query params untuk filter status)
//   getAll: async (params?: any) => {
//     const response = await api.get('/incidents', { params });
//     return response.data;
//   },

//   // Buat Pengaduan Baru
//   create: async (data: FormData | any) => {
//     // Gunakan FormData jika ada upload gambar
//     const response = await api.post('/incidents', data, {
//       headers: { 'Content-Type': 'multipart/form-data' } // Penting buat upload
//     });
//     return response.data;
//   },

//   // Detail Tiket
//   getDetail: async (id: string | number) => {
//     const response = await api.get(`/incidents/${id}`);
//     return response.data;
//   },

//   // Update Data Tiket (Edit)
//   update: async (id: string | number, data: any) => {
//     const response = await api.put(`/incidents/${id}`, data);
//     return response.data;
//   },

//   // Update Progress / Worklog (Khusus Teknisi)
//   updateProgress: async (id: string | number, data: any) => {
//     const response = await api.post(`/incidents/${id}/progress`, data);
//     return response.data;
//   },

//   // Merge Tiket (Parent-Child)
//   merge: async (data: { parentId: string; childIds: string[] }) => {
//     const response = await api.post('/incidents/merge', data);
//     return response.data;
//   }
// };

import { api } from './axios';
import { Ticket, ApiResponse } from '../../types/incident.types';

// Payload untuk Create Incident (Pegawai)
// Pegawai tidak perlu kirim reporter_name/email/hp karena sudah login
export interface CreateIncidentPayload {
  title: string;
  description: string;
  category: string;
  incident_location: string;
  incident_date: string; // YYYY-MM-DD
  opd_id?: number;       // Opsional (biasanya auto dari user profile)
  asset_identifier?: string;
  urgency?: number;      // Pegawai mungkin bisa set urgency
  impact?: number;
}

export const incidentApi = {
  // 1. GET ALL (Daftar Tiket)
  // params bisa berisi: { status: 'open', page: 1, limit: 10 }
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<Ticket>>('/incidents', { params });
    // Note: Sesuaikan return ini nanti dengan bentuk JSON List dari backend
    // Apakah response.data.data atau response.data saja
    return response.data;
  },

  // 2. GET DETAIL
  getDetail: async (id: number | string) => {
    const response = await api.get<ApiResponse<Ticket>>(`/incidents/${id}`);
    return response.data;
  },

  // 3. CREATE (Pegawai Lapor Insiden) - Support Upload Gambar
  create: async (data: CreateIncidentPayload, imageUri?: string) => {
    const formData = new FormData();

    // Append text fields
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof CreateIncidentPayload];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Append Image (Jika ada)
    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('attachment', {
        uri: imageUri,
        name: filename || 'evidence.jpg',
        type,
      } as any);
    }

    const response = await api.post<ApiResponse<Ticket>>('/incidents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 4. UPDATE PROGRESS (Khusus Teknisi)
  // Misal: Update status, tambah worklog, upload foto perbaikan
  updateProgress: async (id: number | string, data: { 
    status?: string; 
    note?: string; 
    attachment_uri?: string 
  }) => {
    const formData = new FormData();
    
    if (data.status) formData.append('status', data.status);
    if (data.note) formData.append('note', data.note);

    if (data.attachment_uri) {
      const filename = data.attachment_uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('worklog_attachment', {
        uri: data.attachment_uri,
        name: filename || 'repair.jpg',
        type,
      } as any);
    }

    const response = await api.post(`/incidents/${id}/progress`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 5. MERGE TICKET (Sesuai list API Anda)
  merge: async (parentId: number, childIds: number[]) => {
    const response = await api.post('/incidents/merge', {
      parent_id: parentId,
      child_ids: childIds
    });
    return response.data;
  }
};