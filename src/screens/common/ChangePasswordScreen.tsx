import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = () => {
    if (!oldPass || !newPass || !confirmPass) {
      Alert.alert("Error", "Mohon isi semua kolom.");
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert("Error", "Konfirmasi password baru tidak cocok.");
      return;
    }
    Alert.alert("Sukses", "Kata sandi berhasil diubah.", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kata Sandi Lama</Text>
      <TextInput style={styles.input} secureTextEntry value={oldPass} onChangeText={setOldPass} />

      <Text style={styles.label}>Kata Sandi Baru</Text>
      <TextInput style={styles.input} secureTextEntry value={newPass} onChangeText={setNewPass} />

      <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
      <TextInput style={styles.input} secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Ubah Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20 },
  btn: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});