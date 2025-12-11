import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Default: Ikuti settingan HP (System) saat pertama kali install
      isDark: Appearance.getColorScheme() === 'dark',
      
      // Action: Tukar status (Dark -> Light, Light -> Dark)
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      
      // Action: Set manual (jika butuh)
      setTheme: (isDark) => set({ isDark }),
    }),
    {
      name: 'theme-storage', // Nama key di AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);