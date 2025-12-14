import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import useCachedResources from './src/hooks/useCachedResources';

// 1. IMPORT STORE BARU
import { useAuthStore } from './src/store/authStore'; 

export default function App() {
  const isLoadingComplete = useCachedResources();

  // 2. AMBIL ACTION LOAD DARI STORE
  const loadStorage = useAuthStore((state) => state.loadStorage);

  // 3. PANGGIL SAAT APLIKASI MOUNT (Pertama kali jalan)
  // Ini kunci agar Token tidak NULL saat refresh
  useEffect(() => {
    loadStorage();
  }, []);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    // 4. HAPUS ThemeProvider. Kita tidak butuh wrapper itu lagi.
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <RootNavigator />
      
      {/* StatusBar di-set 'auto' atau transparan, biarkan tiap screen mengatur warnanya */}
      <StatusBar style="auto" /> 
    </SafeAreaProvider>
  );
}