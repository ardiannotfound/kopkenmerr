import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Mohon isi semua kolom.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }
    // Sukses
    navigation.replace('PasswordChanged');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Kata Sandi Baru</Text>
      <Text style={styles.subtitle}>Password baru harus berbeda dari yang sebelumnya.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Kata Sandi Baru</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Ubah Kata Sandi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { marginBottom: 8, fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});