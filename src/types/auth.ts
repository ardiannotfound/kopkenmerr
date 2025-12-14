export interface RoleObject {
  id: string;
  name: string;
}

export interface OpdObject {
  id: number;
  code: string;
  name: string;
  address?: string;
}

export interface Permission {
  action: string;
  subject: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  nip?: string;
  phone?: string;
  address?: string;
  
  // HANDLE INKONSISTENSI: Role bisa Object (Login) atau String (/me)
  role: RoleObject | string; 
  
  // HANDLE INKONSISTENSI: OPD bisa ID (Login) atau Object (/me)
  opd_id?: number;
  opd?: OpdObject;

  permissions?: Permission[];
  avatar_url?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}