import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setCurrentUser } from '../../data/Session';

export default function RoleSelectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Aksi jika memilih Masyarakat (Guest)
  const handleGuest = () => {
    // --- TAMBAHKAN BARIS INI ---
    setCurrentUser('guest', '');
    // ---------------------------

    navigation.replace('UserApp', { 
      screen: 'Beranda', 
      params: { userRole: 'guest' } 
    });
  };

  // Aksi jika memilih Pegawai atau Teknisi
  const handleLogin = () => {
    // Arahkan ke halaman Login Form
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pilih Akses Masuk</Text>
        <Text style={styles.subtitle}>Silakan pilih tipe akun Anda</Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* Tombol Masyarakat / Guest */}
        <TouchableOpacity style={[styles.card, styles.guestCard]} onPress={handleGuest}>
          <Text style={styles.cardTitle}>Masyarakat Umum</Text>
          <Text style={styles.cardDesc}>Lapor insiden tanpa perlu akun login.</Text>
        </TouchableOpacity>

        {/* Tombol Pegawai / Teknisi */}
        <TouchableOpacity style={[styles.card, styles.loginCard]} onPress={handleLogin}>
          <Text style={styles.cardTitle}>Pegawai & Teknisi</Text>
          <Text style={styles.cardDesc}>Masuk menggunakan NIP/Akun Pegawai.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    gap: 20, // Jarak antar kartu
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 2, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guestCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#28a745', // Hijau untuk guest
  },
  loginCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF', // Biru untuk pegawai
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
  },
});