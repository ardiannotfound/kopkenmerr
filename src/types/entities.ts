// --- 1. INCIDENT (PENGADUAN) ---
export interface Incident {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  status: string; // 'open', 'assigned', 'resolved'
  stage: string | null; // 'verification', etc
  priority: string;
  created_at: string;
  
  // Relasi
  reporter?: any;
  technician?: any;
  opd?: any;
  
  // Detail only
  logs?: any[]; 
}

// --- 2. SERVICE REQUEST (PERMINTAAN) ---
export interface CatalogItem {
  id: number;
  name: string;
  icon?: string;
  children?: CatalogItem[]; // Rekursif untuk menu bersarang
}

export interface ServiceRequest {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  status: string;
  stage: string | null;
  
  // Detail field
  service_catalog_id?: number;
  service_item_id?: number;
  // PENTING: Backend kirim ini sebagai STRING JSON "{\"permintaan\":\"...\"}"
  service_detail?: string; 
  
  created_at: string;
}

// --- 3. KNOWLEDGE BASE ---
export interface KnowledgeBase {
  id_kb: number; // PENTING: Backend pakai id_kb, bukan id
  judul_kb: string;
  kategori_kb: string;
  deskripsi_kb: string;
  created_at: string;
}

// --- 4. SEARCH RESULTS ---
export interface SearchResult {
  tickets: {
    data: {
      id: number;
      ticket_number: string;
      title: string;
      type: string;
      status: string;
      created_at: string;
    }[];
    count: number;
  };
  kb: {
    data: KnowledgeBase[] | null; // Bisa null
    count: number | null;
  };
}