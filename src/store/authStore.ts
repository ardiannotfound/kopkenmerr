import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- 1. DEFINISI TIPE SESUAI JSON BACKEND ---

// OPD Object (Sesuai response JSON)
export interface Opd {
  id: number;
  code: string;
  name: string;
}

// User Object (Update sesuai response GET /me)
export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  nip: string;
  phone: string;
  address: string;
  role: string; // Backend mengembalikan string "pegawai_opd", bukan object
  avatar_url?: string;
  created_at?: string;
  
  // Relasi
  opd?: Opd | null; // Bisa null jika masyarakat
  bidang?: any;     // Sesuaikan jika nanti ada datanya
  seksi?: any;
  
  // Permissions (Opsional, jika backend belum kirim, bikin optional dulu)
  permissions?: string[]; 
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  loginAsGuest: () => void;
  logout: () => void;
  
  // Update Partial Data (Ganti nama jadi updateUserData biar konsisten)
  updateUserData: (userData: Partial<User>) => void;
  
  // Helpers
  userRole: () => string;
  getUserName: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isGuest: false,

      // --- LOGIN ---
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isGuest: false 
      }),

      // --- GUEST ---
      loginAsGuest: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false,
        isGuest: true 
      }),

      // --- LOGOUT ---
      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false,
        isGuest: false,
      }),

      // --- UPDATE DATA USER ---
      // Fungsi ini menggabungkan data lama dengan data baru
      updateUserData: (updatedFields) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedFields } : null
      })),

      // --- HELPERS ---
      userRole: () => {
        const { user, isGuest } = get();
        if (isGuest) return 'masyarakat';
        // Karena di backend role adalah string "pegawai_opd"
        return user?.role || 'masyarakat';
      },

      getUserName: () => {
        const { user, isGuest } = get();
        if (isGuest) return 'Tamu Masyarakat';
        return user?.full_name || user?.username || 'Pengguna';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);