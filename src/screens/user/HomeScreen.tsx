import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS ICONS SVG ---
import PengaduanIcon from '../../../assets/icons/pengaduan.svg';
import PermintaanIcon from '../../../assets/icons/permintaan.svg';
import FAQIcon from '../../../assets/icons/faq.svg';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Hook Theme & Auth
  const { colors, isDark } = useTheme();
  const { user, isGuest, getUserName, logout } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  
  // Simulasi Data Statistik (Nanti diganti API)
  const [stats, setStats] = useState({
    waiting: 5,
    process: 2,
    done: 10
  });

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Panggil API Refresh Data disini
    setTimeout(() => setRefreshing(false), 1500);
  };

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
          <View style={[styles.gridIconBox, { backgroundColor: colors.ticket.pengaduan.background }]}>
            <PengaduanIcon width={32} height={32} color={colors.ticket.pengaduan.text} />
          </View>
          <Text style={[styles.gridLabel, { color: colors.text.primary }]}>Pengaduan</Text>
        </TouchableOpacity>

        {/* Tombol Permintaan */}
        <TouchableOpacity 
          style={styles.gridItem} 
          onPress={() => navigation.navigate('CreateRequest')}
        >
          <View style={[styles.gridIconBox, { backgroundColor: colors.ticket.permintaan.background }]}>
            <PermintaanIcon width={32} height={32} color={colors.ticket.permintaan.text} />
          </View>
          <Text style={[styles.gridLabel, { color: colors.text.primary }]}>Permintaan</Text>
        </TouchableOpacity>
      </View>

      {/* STATISTIK TIKET */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: Spacing.xl }]}>
        Ringkasan Layanan
      </Text>
      
      <View style={styles.statsContainer}>
        {/* Card Menunggu */}
        <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.waiting}</Text>
          <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Menunggu Persetujuan</Text>
        </View>

        {/* Card Diproses */}
        <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.process}</Text>
          <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Diproses</Text>
        </View>

        {/* Card Selesai */}
        <View style={[styles.statCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.done}</Text>
          <View style={[styles.statDivider, { backgroundColor: colors.primary }]} />
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Selesai</Text>
        </View>
      </View>
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
          <View style={[styles.listIconBox, { backgroundColor: colors.ticket.pengaduan.background }]}>
            <PengaduanIcon width={28} height={28} color={colors.ticket.pengaduan.text} />
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
          onPress={() => navigation.navigate('Info')} // Asumsi InfoScreen adalah FAQ
        >
          <View style={[styles.listIconBox, { backgroundColor: colors.ticket.permintaan.background }]}>
            <FAQIcon width={28} height={28} color={colors.ticket.permintaan.text} />
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

      {/* Banner Tamu (Jika login sebagai tamu) */}
      {isGuest && (
          <View style={[
            styles.guestBanner, 
            { 
              // Background card menyesuaikan dark mode
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
                {/* ^^^ GANTI navigation.replace JADI logout() */}
                
                <Text style={[
                  styles.guestLink, 
                  { 
                    // LOGIC WARNA:
                    // Dark Mode -> Putih (biar kelihatan di background gelap)
                    // Light Mode -> Biru Primary
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
        userName={getUserName()} // Nama User / "Tamu Masyarakat"
        userUnit={!isGuest && user?.opd_id ? `Unit ID: ${user.opd_id}` : 'Umum'}
        showNotificationButton={!isGuest} // Tamu gak butuh notif
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
          {/* LOGIC TAMPILAN: GUEST = MASYARAKAT VIEW */}
          {isGuest ? renderMasyarakatView() : renderPegawaiView()}
        </View>
        
        {/* Spacer */}
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
    justifyContent: 'center', // Center align
    gap: wp(10), // Jarak antar tombol
  },
  gridItem: {
    alignItems: 'center',
    width: wp(28),
  },
  gridIconBox: {
    width: wp(18),
    height: wp(18),
    borderRadius: BorderRadius.xl, // Lebih kotak tapi rounded
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    // Shadow tipis
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