import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CurrentUser } from '../../data/Session';
import { MOCK_USERS } from '../../data/mockData';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const userId = CurrentUser.userId;
  
  // Cari data user saat ini
  const userData = MOCK_USERS.find(u => u.id === userId);

  // State Form
  const [phone, setPhone] = useState(userData?.phone || '');
  const [address, setAddress] = useState(userData?.address || '');

  const handleSave = () => {
    // Simulasi Simpan ke API
    console.log('Update Profile:', { phone, address });
    Alert.alert("Sukses", "Profil berhasil diperbarui.", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        {/* Read Only Fields */}
        <Text style={styles.label}>Nama Lengkap (Tidak dapat diubah)</Text>
        <TextInput style={[styles.input, styles.readOnly]} value={userData?.name} editable={false} />

        <Text style={styles.label}>NIP / Username</Text>
        <TextInput style={[styles.input, styles.readOnly]} value={userData?.nip || userData?.username} editable={false} />

        {/* Editable Fields */}
        <Text style={styles.label}>Nomor Telepon / WA</Text>
        <TextInput 
          style={styles.input} 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad"
          placeholder="08..."
        />

        <Text style={styles.label}>Alamat</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]} 
          value={address} 
          onChangeText={setAddress} 
          multiline 
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { padding: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20, backgroundColor: '#fafafa' },
  readOnly: { backgroundColor: '#e9ecef', color: '#888' },
  saveBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});