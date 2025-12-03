import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider> {/* <--- BUNGKUS DISINI */}
      <SafeAreaProvider>
        <RootNavigator />
        {/* StatusBar style "auto" akan ikut berubah hitam/putih otomatis */}
        <StatusBar style="auto" /> 
      </SafeAreaProvider>
    </ThemeProvider>
  );
}