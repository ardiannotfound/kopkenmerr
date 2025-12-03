// src/screens/auth/OnboardingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleFinishOnboarding = () => {
    // Pindah ke halaman Pilih Peran
    navigation.replace('RoleSelection');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.description}>
          Aplikasi Service Desk & Incident Management Terpadu.
          Lapor masalah dan ajukan permintaan layanan dengan mudah.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleFinishOnboarding}>
          <Text style={styles.buttonText}>Mulai Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between', // Atas dan Bawah terpisah
    paddingVertical: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF', // Warna Biru Standar
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});