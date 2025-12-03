import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutAppScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="construct" size={80} color="#007AFF" />
        <Text style={styles.appName}>Service Desk Kota</Text>
        <Text style={styles.version}>Versi 1.0.0 (Beta)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.desc}>
          Aplikasi terpadu untuk pengelolaan insiden dan permintaan layanan TI di lingkungan Pemerintah Kota. 
          Dikembangkan untuk mendukung SPBE (Sistem Pemerintahan Berbasis Elektronik).
        </Text>
        <Text style={styles.credit}>© 2025 Dinas Kominfo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15 },
  version: { fontSize: 14, color: '#888', marginTop: 5 },
  section: { alignItems: 'center' },
  desc: { textAlign: 'center', fontSize: 16, color: '#555', lineHeight: 24 },
  credit: { marginTop: 30, fontSize: 12, color: '#999' },
});