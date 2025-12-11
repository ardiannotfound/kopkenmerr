export type TicketStatus = 'open' | 'verification' | 'triase' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  id: number;
  ticket_number: string;
  type: 'incident' | 'request';
  title: string;
  description: string;
  
  // Metrics
  urgency: number;
  impact: number;
  priority_score: number;
  priority: TicketPriority;
  
  // Categorization
  category: string;
  incident_location: string;
  incident_date: string; // YYYY-MM-DD
  opd_id: number;
  
  // Reporter Info (Bisa dari User ID atau Manual input masyarakat)
  reporter_id: number | null;
  reporter_nip?: string;
  reporter_name?: string | null;
  reporter_email?: string | null;
  reporter_phone?: string | null;
  
  // Workflow / Assignment
  verifier_id: number | null;
  assigned_to: number | null; // ID Teknisi
  status: TicketStatus;
  stage: string | null; // e.g., 'triase'
  
  // SLA
  sla_target_date: string;
  sla_due: string; // ISO String
  sla_breached: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  closed_at?: string | null;
  
  // Assets & Evidence
  asset_name_reported?: string;
  reporter_attachment_url?: string; // URL Foto Bukti
}

// Response Wrapper standar dari API Anda
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  ticket?: T;  // Untuk Single Data
  data?: T[];  // Untuk List Data (jika nanti ada pagination)
}