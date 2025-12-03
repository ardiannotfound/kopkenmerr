import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

export default function EmailSentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <Ionicons name="mail-open-outline" size={80} color="#007AFF" />
      <Text style={styles.title}>Email Terkirim!</Text>
      <Text style={styles.subtitle}>
        Silakan periksa kotak masuk email Anda. Klik tautan di dalamnya untuk membuat kata sandi baru.
      </Text>

      {/* Tombol Simulasi untuk keperluan testing */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('ResetPassword')}
      >
        <Text style={styles.buttonText}>[Simulasi] Klik Link di Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.secondaryButtonText}>Kembali ke Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { padding: 15, width: '100%', alignItems: 'center' },
  secondaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
});