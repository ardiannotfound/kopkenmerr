import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordChangedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleFinish = () => {
    // Kembali ke Login, dan hapus history navigasi agar user tidak bisa 'back' ke form reset
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={80} color="#28a745" />
      <Text style={styles.title}>Berhasil!</Text>
      <Text style={styles.subtitle}>
        Kata sandi Anda telah berhasil diubah. Silakan masuk menggunakan kata sandi baru.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Masuk ke Aplikasi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 30, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});