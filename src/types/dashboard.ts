// src/types/dashboard.ts

export interface DashboardTicketItem {
  id: number | string; 
  ticket_number?: string; 
  title: string;
  type: 'incident' | 'request' | string; 
  status: string;
  stage: string;
}

export interface TaskCompositionItem {
  status: string;
  stage: string;
  value: number;
}

export interface DashboardData {
  total_tickets: number;
  by_status: {
    open: number;
    assigned: number;
    in_progress: number;
    resolved: number;
    closed: number;
    pending_approval: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    major: number;
  };
  task_composition: TaskCompositionItem[];
  my_assigned_tickets: DashboardTicketItem[];
  role: string;
  scope: string;
}

export interface DashboardResponse {
  success: boolean;
  dashboard: DashboardData;
}