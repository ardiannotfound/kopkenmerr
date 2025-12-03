// src/screens/auth/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    // Logic: Tunggu 3 detik (3000ms), lalu pindah ke 'Onboarding'
    const timer = setTimeout(() => {
      // .replace berarti user tidak bisa tombol 'back' ke splash screen
      navigation.replace('Onboarding'); 
    }, 3000);

    return () => clearTimeout(timer); // Bersihkan timer jika keluar paksa
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Desk</Text>
      <Text style={styles.subtitle}>Pemerintahan Kota</Text>
      <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
});