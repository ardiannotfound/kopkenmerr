import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';
import { authApi } from '../services/api/auth';
import { api } from '../services/api/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;

  login: (token: string, user: User) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => Promise<void>;
  loadStorage: () => Promise<void>;
  
  // ✅ UPDATE 1: Tambahkan refreshUserProfile
  refreshUserProfile: () => Promise<void>;

  // ✅ UPDATE 2: Tambahkan updateUserData (Manual Update)
  updateUserData: (updatedFields: Partial<User>) => Promise<void>;
  
  // Helpers
  userRole: () => string; 
  getUserName: () => string;
  userOpdName: () => string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,

  // 1. LOGIN
  login: async (token, user) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isGuest: false, isLoading: false });
      
      // Auto refresh data
      get().refreshUserProfile();
    } catch (e) { console.error(e); }
  },

  // 2. GUEST LOGIN
  guestLogin: async () => {
    set({ user: null, token: null, isAuthenticated: false, isGuest: true, isLoading: false });
  },

  // 3. LOGOUT
  logout: async () => {
    const { isGuest } = get(); 
    if (!isGuest) {
      try { await api.post('/auth/logout'); } catch (error) {}
    }
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
    } catch (e) {}
    set({ user: null, token: null, isAuthenticated: false, isGuest: false, isLoading: false });
  },

  // 4. REFRESH USER PROFILE (Sync Server -> HP)
  refreshUserProfile: async () => {
    try {
      console.log("🔄 Syncing User Profile...");
      const response = await authApi.getMe();
      if (response && response.user) {
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.user));
        set({ user: response.user });
        console.log("✅ User Profile Synced:", response.user.username);
      }
    } catch (error) {
      console.error("❌ Failed to sync profile:", error);
    }
  },

  // 5. UPDATE USER DATA (Manual Update Local)
  // Ini penting agar EditProfileScreen bisa langsung update UI tanpa nunggu fetch
  updateUserData: async (updatedFields) => {
    const { user } = get();
    if (!user) return;

    // Merge data lama dengan data baru
    const newUser = { ...user, ...updatedFields };

    try {
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
      set({ user: newUser });
      console.log("✅ Local User Data Updated");
    } catch (e) {
      console.error("Failed to update local user data", e);
    }
  },

  // 6. LOAD STORAGE
  loadStorage: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('auth_user');
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isAuthenticated: true, isGuest: false });
        get().refreshUserProfile();
      } else {
        set({ isAuthenticated: false, isGuest: false });
      }
    } catch (e) { 
      set({ isAuthenticated: false, isGuest: false });
    } finally { 
      set({ isLoading: false }); 
    }
  },

  // HELPERS
  userRole: () => {
    const { user } = get();
    if (!user) return 'guest';
    const role = user.role;
    if (typeof role === 'object' && role !== null && 'id' in role) return (role as any).id.toLowerCase();
    if (typeof role === 'string') return role.toLowerCase();
    return 'guest';
  },

  getUserName: () => {
    const { user, isGuest } = get();
    if (isGuest) return 'Masyarakat';
    return user?.full_name || 'Pengguna';
  },

  userOpdName: () => {
    const { user } = get();
    if (!user) return '';
    if (user.opd && user.opd.name) return user.opd.name;
    return '';
  }
}));