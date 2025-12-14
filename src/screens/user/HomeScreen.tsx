import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { incidentApi } from '../../services/api/incidents'; // ✅ API BARU
import { requestApi } from '../../services/api/requests';   // ✅ API BARU

// --- STYLES ---
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- ICONS (SVG) ---
import PengaduanIcon from '../../../assets/icons/pengaduan.svg';
import PermintaanIcon from '../../../assets/icons/permintaan.svg';
import FAQIcon from '../../../assets/icons/faq.svg';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Hook Theme & Auth
  const { colors, isDark } = useTheme();
  // Ambil helper userOpdName dari store baru
  const { user, isGuest, getUserName, logout, userOpdName } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State Statistik Real
  const [stats, setStats] = useState({
    waiting: 0,
    process: 0,
    done: 0
  });

  // --- LOGIC FETCH DATA (Khusus Pegawai) ---
  const loadData = useCallback(async () => {
    // 🛑 JIKA TAMU: Stop, jangan panggil API
    if (isGuest) {
      setRefreshing(false);
      return;
    }

    try {
      // Panggil API Insiden & Request secara paralel
      const [incidents, requests] = await Promise.all([
        incidentApi.getAll(),
        requestApi.getAll()
      ]);

      // Gabungkan data untuk hitung statistik
      // Backend mengembalikan array di response.data.data (sudah dihandle di service)
      const allTickets = [...(incidents || []), ...(requests || [])];

      // Hitung Statistik Client-Side
      let wait = 0;
      let proc = 0;
      let fin = 0;

      allTickets.forEach((t: any) => {
        const s = t.status?.toLowerCase() || '';
        
        // Logika pengelompokan status
        if (s === 'open' || s === 'pending_approval' || s === 'assigned' || s === 'new') {
          wait++;
        } else if (s === 'in_progress' || s === 'on_hold') {
          proc++;
        } else if (s === 'resolved' || s === 'closed' || s === 'completed') {
          fin++;
        }
      });

      setStats({ waiting: wait, process: proc, done: fin });

    } catch (error) {
      console.error("Gagal memuat data home:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [isGuest]);

  // Load saat pertama kali buka
  useEffect(() => {
    if (!isGuest) {
      setLoading(true);
      loadData();
    }
  }, [loadData, isGuest]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // --- LOGIC WARNA ICON & BACKGROUND ---
  const getGridStyles = () => {
    if (isDark) {
      return {
        iconColor: '#FFFFFF',
        bgPengaduan: 'rgba(255, 255, 255, 0.1)',
        bgPermintaan: 'rgba(255, 255, 255, 0.1)',
      };
    } else {
      return {
        iconColor: colors.primary, 
        bgPengaduan: '#E3F2FD',
        bgPermintaan: '#E0F7FA',
      };
    }
  };

  const gridStyle = getGridStyles();

  // --- RENDER SECTION: PEGAWAI (Grid + Stats) ---
  const renderPegawaiView = () => (
    <>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Menu Layanan
      </Text>

      {/* GRID MENU */}
      <View style={styles.gridContainer}>
        
        {/* Tombol Pengaduan */}
        <TouchableOpacity 
          style={styles.gridItem} 
          onPress={() => navigation.navigate('CreateIncident')}
        >
          <View style={[
            styles.gridIconBox, 
            { backgroundColor: gridStyle.bgPengaduan }
          ]}>
            <PengaduanIcon width={32} height={32} color={gridStyle.iconColor} />
          </View>
          <Text style={[styles.gridLabel, { color: colors.text.primary }]}>Pengaduan</Text>
        </TouchableOpacity>

        {/* Tombol Permintaan */}
        <TouchableOpacity 
          style={styles.gridItem} 
          onPress={() => navigation.navigate('CreateRequest')}
        >
          <View style={[
            styles.gridIconBox, 
            { backgroundColor: gridStyle.bgPermintaan }
          ]}>
            <PermintaanIcon width={32} height={32} color={gridStyle.iconColor} />
          </View>
          <Text style={[styles.gridLabel, { color: colors.text.primary }]}>Permintaan</Text>
        </TouchableOpacity>

      </View>

      {/* STATISTIK TIKET */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: Spacing.xl }]}>
        Ringkasan Layanan
      </Text>
      
      {loading && !refreshing ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.statsContainer}>
          {/* Card Menunggu */}
          <TouchableOpacity 
             style={[styles.statCard, { backgroundColor: colors.background.card }]}
             onPress={() => navigation.navigate('Lacak')} // Bisa di-klik ke list tiket
          >
            <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : colors.primary }]}>{stats.waiting}</Text>
            <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Menunggu & Baru</Text>
          </TouchableOpacity>

          {/* Card Diproses */}
          <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : colors.primary }]}>{stats.process}</Text>
            <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Diproses</Text>
          </View>

          {/* Card Selesai */}
          <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : colors.primary }]}>{stats.done}</Text>
            <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Selesai</Text>
          </View>
        </View>
      )}
    </>
  );

  // --- RENDER SECTION: MASYARAKAT (List Card Full Width) ---
  const renderMasyarakatView = () => (
    <>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Pusat Bantuan
      </Text>

      <View style={styles.listContainer}>
        
        {/* Card Pengaduan */}
        <TouchableOpacity 
          style={[styles.listCard, { backgroundColor: colors.background.card }]}
          onPress={() => navigation.navigate('CreateIncident')}
        >
          <View style={[
            styles.listIconBox, 
            { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E3F2FD' }
          ]}>
            <PengaduanIcon width={28} height={28} color={isDark ? '#FFF' : colors.primary} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: colors.text.primary }]}>Buat Pengaduan</Text>
            <Text style={[styles.listDesc, { color: colors.text.secondary }]}>
              Laporkan kendala fasilitas atau jaringan
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Card FAQ */}
        <TouchableOpacity 
          style={[styles.listCard, { backgroundColor: colors.background.card }]}
          onPress={() => navigation.navigate('Info')} 
        >
          <View style={[
            styles.listIconBox, 
            { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E0F7FA' }
          ]}>
            <FAQIcon width={28} height={28} color={isDark ? '#FFF' : colors.primary} />
          </View>
          <View style={styles.listTextContainer}>
            <Text style={[styles.listTitle, { color: colors.text.primary }]}>Pertanyaan Umum (FAQ)</Text>
            <Text style={[styles.listDesc, { color: colors.text.secondary }]}>
              Cari solusi cepat untuk masalah Anda
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

      </View>

      {/* Banner Tamu */}
      {isGuest && (
          <View style={[
            styles.guestBanner, 
            { 
              backgroundColor: colors.background.card,
              borderColor: colors.primary 
            }
          ]}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            
            <View style={{flex: 1, marginLeft: 10}}> 
              <Text style={[styles.guestText, { color: colors.text.secondary }]}>
                Login sebagai Pegawai untuk fitur lengkap.
              </Text>
              
              <TouchableOpacity onPress={() => logout()}> 
                <Text style={[
                  styles.guestLink, 
                  { 
                    color: isDark ? colors.white : colors.primary 
                  }
                ]}>
                  Login Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />

      {/* HEADER */}
      <CustomHeader 
        type="home"
        userName={getUserName()} 
        // ✅ FIX: Gunakan userOpdName() biar aman
        userUnit={isGuest ? 'Umum' : (userOpdName() || 'Instansi User')}
        showNotificationButton={!isGuest}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {isGuest ? renderMasyarakatView() : renderPegawaiView()}
        </View>
        
        <View style={{ height: hp(10) }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: wp(6),
    paddingTop: hp(2),
  },
  sectionTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.lg,
    marginBottom: Spacing.md,
  },

  // --- STYLES PEGAWAI (GRID) ---
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    gap: wp(10), 
  },
  gridItem: {
    alignItems: 'center',
    width: wp(28),
  },
  gridIconBox: {
    width: wp(18),
    height: wp(18),
    borderRadius: BorderRadius.xl, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    ...Shadow.sm,
  },
  gridLabel: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },

  // --- STYLES STATS (CARD) ---
  statsContainer: {
    gap: Spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  statNumber: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.xl,
    width: wp(10),
    textAlign: 'center',
  },
  statDivider: {
    width: 2,
    height: '80%',
    marginHorizontal: Spacing.md,
  },
  statLabel: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.md,
    flex: 1,
  },

  // --- STYLES MASYARAKAT (LIST CARD) ---
  listContainer: {
    gap: Spacing.md,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  listIconBox: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
    marginBottom: 2,
  },
  listDesc: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.xs,
  },

  // --- GUEST BANNER ---
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: Spacing.xl,
    gap: 8,
  },
  guestText: {
    flex: 1,
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.xs,
  },
  guestLink: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.xs,
    textDecorationLine: 'underline',
  },
});