import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_USERS, MOCK_TICKETS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

// Definisi tipe parameter yang diterima halaman ini
type HomeScreenRouteProp = RouteProp<{ params: { userRole: string; userId?: string } }, 'params'>;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<HomeScreenRouteProp>();

  const { colors, isDarkMode, toggleTheme } = useTheme();
  
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

  // --- [PERBAIKAN] LOGIC INI TADI HILANG ---
  const activeTicketCount = MOCK_TICKETS.filter(ticket => 
    ticket.requesterId === userId && ticket.status !== 'closed' && ticket.status !== 'resolved'
  ).length;
  // ------------------------------------------

  // --- MENU ACTIONS ---
  const goToIncidentForm = () => {
    navigation.navigate('CreateTicket', { type: 'incident', userRole, userId });
  };

  const goToRequestForm = () => {
    navigation.navigate('CreateTicket', { type: 'request', userRole, userId });
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, Selamat Datang</Text>
          {/* Warna Text Dinamis */}
          <Text style={[styles.name, { color: colors.text }]}>{userName}</Text>
        </View>
        
        {/* ROW UNTUK TOMBOL ACTION (THEME + NOTIF) */}
        <View style={{ flexDirection: 'row', gap: 15 }}>
          
          {/* TOMBOL DARK MODE */}
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={24} 
              color={colors.icon} 
            />
          </TouchableOpacity>

          {/* TOMBOL NOTIFIKASI */}
          <TouchableOpacity onPress={goToNotifications}>
            <Ionicons name="notifications-outline" size={24} color={colors.icon} />
          </TouchableOpacity>

        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* BANNER INFO (Opsional) */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Pusat Bantuan IT</Text>
          <Text style={styles.bannerDesc}>Laporkan kendala atau ajukan layanan dengan mudah.</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Layanan Utama</Text>
        
        <View style={styles.menuGrid}>
          {/* MENU 1: PENGADUAN (Muncul untuk SEMUA user) */}
          <TouchableOpacity style={[styles.menuCard, { backgroundColor: colors.card }]} onPress={goToIncidentForm}>
            <View style={[styles.iconBox, { backgroundColor: '#ffebee' }]}>
              <Ionicons name="warning" size={32} color="#d32f2f" />
            </View>
            {/* Flex 1 agar teks tidak nabrak */}
            <View style={{ flex: 1 }}> 
              <Text style={[styles.menuTitle, { color: colors.text }]}>Buat Pengaduan</Text>
              <Text style={styles.menuDesc}>Laporkan kerusakan atau insiden IT.</Text>
            </View>
          </TouchableOpacity>

          {/* MENU 2: PERMINTAAN (HANYA untuk PEGAWAI) */}
          {userRole === 'employee' && (
            <TouchableOpacity style={[styles.menuCard, { backgroundColor: colors.card }]} onPress={goToRequestForm}>
              <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}>
                <Ionicons name="desktop" size={32} color="#1976d2" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Permintaan Layanan</Text>
                <Text style={styles.menuDesc}>Akses VPN, Email, Perangkat Baru.</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION TAMBAHAN UNTUK PEGAWAI (Contoh) */}
        {userRole === 'employee' && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistik Saya</Text>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text }}>
                {activeTicketCount} Tiket sedang diproses
              </Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
                Pantau progresnya di menu Lacak.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 20,
  },
  greeting: { fontSize: 14, color: '#888' },
  name: { fontSize: 20, fontWeight: 'bold'},
  content: { flex: 1, paddingHorizontal: 20 },
  banner: {
    backgroundColor: '#007AFF', borderRadius: 12, padding: 20, marginBottom: 25,
  },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  bannerDesc: { color: '#e3f2fd', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
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
  menuDesc: { fontSize: 12, color: '#666', flex: 1 }, 
  statCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginTop: 10 },
});