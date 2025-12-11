import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext_OLD';
import useCachedResources from './src/hooks/useCachedResources';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <ThemeProvider>
      {/* PERBAIKAN: 
        1. Hapus customMetrics yang memaksa bottom: 0. 
        2. Gunakan initialMetrics={initialWindowMetrics} bawaan.
        3. Hapus style background hardcode '#053F5C' agar tidak bentrok dengan Dark Mode.
           Warna background sekarang dikontrol penuh oleh RootNavigator/ThemeContext.
      */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <RootNavigator />
        
        {/* Status Bar style 'light' agar tulisan jam/baterai putih (karena header kita biru gelap) */}
        <StatusBar style="light" backgroundColor="#053F5C" /> 
      </SafeAreaProvider>
    </ThemeProvider>
  );
}