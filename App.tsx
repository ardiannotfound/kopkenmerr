import React from 'react';
import { LogBox } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import useCachedResources from './src/hooks/useCachedResources';

export default function App() {
  const isLoadingComplete = useCachedResources();

  // 2. Custom Metrics untuk fix space bawah navigasi Android
  const customMetrics = {
    frame: initialWindowMetrics?.frame || { x: 0, y: 0, width: 0, height: 0 },
    insets: {
      top: initialWindowMetrics?.insets.top ?? 0,
      left: initialWindowMetrics?.insets.left ?? 0,
      right: initialWindowMetrics?.insets.right ?? 0,
      bottom: 0, 
    },
  };

  // 3. Jika belum selesai load, return null (Splash Native masih tampil)
  if (!isLoadingComplete) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={customMetrics} style={{ flex: 1, backgroundColor: '#053F5C' }}>
        <RootNavigator />
        <StatusBar style="auto" /> 
      </SafeAreaProvider>
    </ThemeProvider>
  );
}