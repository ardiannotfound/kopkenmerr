import { create } from 'zustand';

interface IncidentFormState {
  // Data Step 1 (Pelapor - Opsional disimpan sini)
  reporterData: any | null;
  
  // Data Step 2 (Detail)
  detailData: {
    title: string;
    description: string;
    locationStr: string;
    selectedOpd: any;
    selectedCategory: any;
    selectedAsset: any;
    date: Date;
    attachment: any;
  };

  // Actions
  setReporterData: (data: any) => void;
  setDetailData: (data: Partial<IncidentFormState['detailData']>) => void;
  resetForm: () => void;
}

const initialDetailData = {
  title: '',
  description: '',
  locationStr: '',
  selectedOpd: null,
  selectedCategory: null,
  selectedAsset: null,
  date: new Date(),
  attachment: null,
};

export const useIncidentFormStore = create<IncidentFormState>((set) => ({
  reporterData: null,
  detailData: initialDetailData,

  setReporterData: (data) => set({ reporterData: data }),
  
  // Fungsi untuk update sebagian data detail (misal cuma update judul)
  setDetailData: (data) => set((state) => ({
    detailData: { ...state.detailData, ...data }
  })),

  // Reset semua data (dipanggil saat sukses kirim / cancel)
  resetForm: () => set({ 
    reporterData: null, 
    detailData: initialDetailData 
  }),
}));