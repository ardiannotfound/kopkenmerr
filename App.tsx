import React, { useEffect } from 'react';
import { Platform } from 'react-native'; // Import Platform untuk cek Android
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar'; // <--- 1. IMPORT LIBRARY INI

import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {

  // --- 2. LOGIC IMMERSIVE MODE (ANDROID) ---
  useEffect(() => {
    const enableImmersiveMode = async () => {
      // Fitur ini spesifik untuk Android
      if (Platform.OS === 'android') {
        // Sembunyikan tombol navigasi bawah (Back, Home, Recent)
        await NavigationBar.setVisibilityAsync("hidden");
        
        // Atur perilaku: Muncul saat di-swipe, lalu hilang lagi otomatis
        await NavigationBar.setBehaviorAsync("overlay-swipe");

        // (Opsional) Biar bar-nya transparan saat muncul
        // await NavigationBar.setBackgroundColorAsync("transparent");
      }
    };

    enableImmersiveMode();
  }, []);
  // ------------------------------------------

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <RootNavigator />
        {/* StatusBar style "auto" menyesuaikan tema (Hitam/Putih) */}
        <StatusBar style="auto" /> 
      </SafeAreaProvider>
    </ThemeProvider>
  );
}