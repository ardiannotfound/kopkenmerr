import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_USERS } from '../../data/mockData';

// Definisi tipe parameter yang diterima halaman ini
type HomeScreenRouteProp = RouteProp<{ params: { userRole: string; userId?: string } }, 'params'>;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<HomeScreenRouteProp>();
  
  // Ambil role & userId dari parameter navigasi (dari Login/RoleSelection)
  const { userRole, userId } = route.params || { userRole: 'guest' };
  
  const [userName, setUserName] = useState('Masyarakat');

  // Cari nama user jika dia Pegawai
  useEffect(() => {
    if (userRole === 'employee' && userId) {
      const user = MOCK_USERS.find(u => u.id === userId);
      if (user) setUserName(user.name);
    } else {
      setUserName('Tamu (Guest)');
    }
  }, [userRole, userId]);

  // --- MENU ACTIONS ---
  const goToIncidentForm = () => {
    navigation.navigate('CreateTicket', { type: 'incident', userRole, userId });
  };

  const goToRequestForm = () => {
    navigation.navigate('CreateTicket', { type: 'request', userRole, userId });
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications'); // <--- Panggil layar tadi
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, Selamat Datang</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={goToNotifications}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* BANNER INFO (Opsional) */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Pusat Bantuan IT</Text>
          <Text style={styles.bannerDesc}>Laporkan kendala atau ajukan layanan dengan mudah.</Text>
        </View>

        <Text style={styles.sectionTitle}>Layanan Utama</Text>
        
        <View style={styles.menuGrid}>
          {/* MENU 1: PENGADUAN (Muncul untuk SEMUA user) */}
          <TouchableOpacity style={styles.menuCard} onPress={goToIncidentForm}>
            <View style={[styles.iconBox, { backgroundColor: '#ffebee' }]}>
              <Ionicons name="warning" size={32} color="#d32f2f" />
            </View>
            <Text style={styles.menuTitle}>Buat Pengaduan</Text>
            <Text style={styles.menuDesc}>Laporkan kerusakan atau insiden IT.</Text>
          </TouchableOpacity>

          {/* MENU 2: PERMINTAAN (HANYA untuk PEGAWAI) */}
          {userRole === 'employee' && (
            <TouchableOpacity style={styles.menuCard} onPress={goToRequestForm}>
              <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="desktop" size={32} color="#1976d2" />
              </View>
              <Text style={styles.menuTitle}>Permintaan Layanan</Text>
              <Text style={styles.menuDesc}>Akses VPN, Email, Perangkat Baru.</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION TAMBAHAN UNTUK PEGAWAI (Contoh) */}
        {userRole === 'employee' && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Statistik Saya</Text>
            <View style={styles.statCard}>
              <Text>2 Tiket sedang diproses</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 50 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 20,
  },
  greeting: { fontSize: 14, color: '#666' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, paddingHorizontal: 20 },
  banner: {
    backgroundColor: '#007AFF', borderRadius: 12, padding: 20, marginBottom: 25,
  },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bannerDesc: { color: '#e3f2fd', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  menuGrid: { flexDirection: 'column', gap: 15 },
  menuCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 15,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  iconBox: {
    width: 60, height: 60, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  menuDesc: { fontSize: 12, color: '#666', flex: 1 }, // Flex 1 biar teks wrap rapi
  statCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginTop: 10 },
});