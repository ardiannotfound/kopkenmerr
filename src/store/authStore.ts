// src/store/authStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ 1. Interface Auth User (Hanya untuk Pegawai & Teknisi)
export interface Role {
  id: string;   
  name: string; 
}

export interface Permission {
  action: string;
  subject: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  nip: string;
  phone: string;
  address: string;
  role: Role;
  opd_id: number;
  permissions: Permission[];
  avatar_url?: string; 
}

interface AuthState {
  token: string | null;
  user: User | null; // User bisa NULL jika dia Guest
  isAuthenticated: boolean;
  isGuest: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  loginAsGuest: () => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  
  // Helpers
  userRole: () => string;
  getUserName: () => string; // Helper baru buat Header
  checkPermission: (action: string, subject: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isGuest: false,

      // --- LOGIN PEGAWAI / TEKNISI ---
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true, // Punya Token
        isGuest: false 
      }),

      // --- MASUK SEBAGAI TAMU ---
      loginAsGuest: () => set({ 
        token: null, // TIDAK ADA TOKEN
        user: null,  // TIDAK ADA DATA USER (ID, NIP, dll)
        isAuthenticated: false,
        isGuest: true 
      }),

      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false,
        isGuest: false,
      }),

      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),

      // --- HELPERS ---

      // Helper Role
      userRole: () => {
        const { user, isGuest } = get();
        if (isGuest) return 'masyarakat'; // Hardcode string 'masyarakat'
        if (!user) return 'masyarakat';   // Fallback
        return user.role?.id || 'masyarakat';
      },

      // Helper Nama untuk Tampilan UI/Header
      getUserName: () => {
        const { user, isGuest } = get();
        if (isGuest) return 'Tamu Masyarakat';
        return user?.full_name || 'Pengguna';
      },

      // Helper Permission (Hanya jalan kalau bukan guest)
      checkPermission: (action, subject) => {
        const { user } = get();
        if (!user) return false; // Guest gapunya permission
        return user.permissions.some(
          p => p.action === action && p.subject === subject
        );
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);