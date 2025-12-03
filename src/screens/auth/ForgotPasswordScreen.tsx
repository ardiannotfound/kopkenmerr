import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Error', 'Mohon masukkan email Anda.');
      return;
    }
    // Logic kirim email (mock)
    // Langsung pindah ke halaman notifikasi terkirim
    navigation.navigate('EmailSent');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lupa Kata Sandi?</Text>
      <Text style={styles.subtitle}>
        Masukkan email yang terdaftar. Kami akan mengirimkan instruksi untuk mengatur ulang kata sandi.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="contoh@jatim.gov.id"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Kirim Instruksi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Kembali ke Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, lineHeight: 22 },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: { alignItems: 'center', padding: 10 },
  backButtonText: { color: '#666', fontSize: 16 },
});