import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CurrentUser, logoutUser } from '../../data/Session';
import { MOCK_USERS } from '../../data/mockData';

export default function ProfileScreen() {
  // Tambahkan type generic <any> agar navigasi tidak error
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Cek Data User saat ini
  const userRole = CurrentUser.role;
  const userId = CurrentUser.userId;
  
  // Jika pegawai/teknisi, ambil data detailnya dari Mock
  const userData = userRole !== 'guest' ? MOCK_USERS.find(u => u.id === userId) : null;

  // Nama & Label Tampilan
  const displayName = userData ? userData.name : 'Tamu (Masyarakat)';
  const displayRole = userRole === 'employee' ? 'Pegawai Pemerintah' : userRole === 'technician' ? 'Teknisi IT' : 'Pengunjung Umum';
  const displayInitials = userData ? userData.name.charAt(0) : 'G';

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya, Keluar", 
          style: 'destructive',
          onPress: () => {
            logoutUser();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'RoleSelection' }],
              })
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER PROFILE */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayInitials}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.role}>{displayRole}</Text>
        {userData?.nip && <Text style={styles.nip}>NIP: {userData.nip}</Text>}
      </View>

      {/* MENU CONTAINER */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Akun</Text>

        {/* MENU KHUSUS PEGAWAI / TEKNISI (Hide jika Guest) */}
        {userRole !== 'guest' && (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
              <View style={[styles.iconBox, {backgroundColor: '#e3f2fd'}]}>
                <Ionicons name="person-outline" size={20} color="#007AFF" />
              </View>
              <Text style={styles.menuText}>Edit Profil</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
              <View style={[styles.iconBox, {backgroundColor: '#fff3cd'}]}>
                <Ionicons name="key-outline" size={20} color="#856404" />
              </View>
              <Text style={styles.menuText}>Ganti Kata Sandi</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            {/* --- TAMBAHAN KHUSUS TEKNISI --- */}
            {userRole === 'technician' && (
              <>
                {/* 1. Menu FAQ (Mengarah ke Info Screen yg sama dgn Pegawai) */}
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Info')}> 
                  <View style={[styles.iconBox, {backgroundColor: '#e0f2f1'}]}>
                    <Ionicons name="book-outline" size={20} color="#009688" />
                  </View>
                  <Text style={styles.menuText}>FAQ & Panduan</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* 2. Menu Laporan Kinerja (Baru) */}
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TechPerformance')}>
                  <View style={[styles.iconBox, {backgroundColor: '#f3e5f5'}]}>
                    <Ionicons name="stats-chart-outline" size={20} color="#9c27b0" />
                  </View>
                  <Text style={styles.menuText}>Laporan Kinerja</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {/* MENU UMUM (Muncul untuk Semua) */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AboutApp')}>
          <View style={[styles.iconBox, {backgroundColor: '#e8f5e9'}]}>
            <Ionicons name="information-circle-outline" size={20} color="#2e7d32" />
          </View>
          <Text style={styles.menuText}>Tentang Aplikasi</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* TOMBOL LOGOUT */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#d32f2f" style={{marginRight: 10}} />
          <Text style={styles.logoutText}>Keluar Aplikasi</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  role: { fontSize: 14, color: '#666', marginTop: 2 },
  nip: { fontSize: 12, color: '#999', marginTop: 5 },

  menuContainer: { marginTop: 20, backgroundColor: '#fff', paddingVertical: 10 },
  sectionTitle: { paddingHorizontal: 20, marginBottom: 10, fontSize: 14, fontWeight: 'bold', color: '#999', textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f8f9fa' },
  iconBox: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: '#333' },

  footer: { padding: 20, marginTop: 20 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffebee', padding: 15, borderRadius: 10 },
  logoutText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 16 },
  versionText: { textAlign: 'center', marginTop: 15, color: '#ccc', fontSize: 12 },
});