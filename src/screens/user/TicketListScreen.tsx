import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS DATA ---
import { MOCK_TICKETS, Ticket } from '../../data/mockData'; 

// --- IMPORTS ICONS SVG (Pastikan file ada) ---
import KananIcon from '../../../assets/icons/kanan.svg';
// Gunakan Ionicons sementara jika SVG status belum lengkap, atau import SVG status disini

export default function TicketListScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const { isGuest } = useAuthStore(); 

  // --- STATE ---
  const [searchId, setSearchId] = useState('');
  const [guestSearchResult, setGuestSearchResult] = useState<Ticket[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'incident' | 'request'>('incident');

  // --- LOGIC MASYARAKAT ---
  const handleGuestSearch = () => {
    if (!searchId.trim()) {
      Alert.alert("Error", "Mohon masukkan Nomor Tiket.");
      return;
    }
    setHasSearched(true);
    const result = MOCK_TICKETS.filter(
      t => t.ticketNumber.toLowerCase() === searchId.toLowerCase().trim()
    );
    setGuestSearchResult(result);
  };

  // --- LOGIC PEGAWAI ---
  const getEmployeeData = () => {
    return MOCK_TICKETS.filter(t => t.type === activeTab);
  };

  // --- HELPER STYLE ---
  const getTypeStyle = (type: string) => {
    if (type === 'incident') {
      return { 
        label: 'Pengaduan', 
        color: '#FF9500', 
        bg: 'rgba(255, 149, 0, 0.15)' // Background terang
      }; 
    }
    return { 
      label: 'Permintaan', 
      color: '#337CAD', 
      bg: 'rgba(51, 124, 173, 0.15)' 
    }; 
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'closed': return { label: 'Closed', color: '#D32F2F', icon: 'close-circle' };
      case 'resolved': return { label: 'Selesai', color: '#4FEA17', icon: 'checkmark-circle' };
      case 'pending': return { label: 'Pending', color: '#555657', icon: 'time' };
      case 'in_progress': 
      case 'assigned': return { label: 'Dikerjakan Teknisi', color: '#053F5C', icon: 'hammer' };
      default: return { label: status, color: '#333', icon: 'help-circle' };
    }
  };

  // --- RENDER TICKET CARD ---
  const renderTicketCard = ({ item }: { item: Ticket }) => {
    const typeInfo = getTypeStyle(item.type);
    const statusInfo = getStatusConfig(item.status);

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.background.card }]}
        onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
        activeOpacity={0.8}
      >
        {/* BAGIAN ATAS */}
        <View style={styles.cardTop}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            {/* 1. Label Tipe dengan Background Rounded */}
            <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
              <Text style={[styles.typeText, { color: typeInfo.color }]}>
                {typeInfo.label}
              </Text>
            </View>
            
            {/* Judul Tiket */}
            <Text style={[styles.ticketTitle, { color: colors.primary }]}>
              {item.title}
            </Text>
          </View>

          {/* Nomor Tiket (Kanan) */}
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Nomor Tiket</Text>
            <Text style={[styles.ticketNumber, { color: colors.primary }]}>{item.ticketNumber}</Text>
          </View>
        </View>

        {/* GARIS PEMBATAS */}
        <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

        {/* BAGIAN BAWAH: 3 Kolom Grid */}
        <View style={styles.cardBottom}>
          
          {/* KOLOM 1: Status Terkini */}
          <View style={styles.statusCol}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Status Terkini</Text>
            <View style={styles.statusRow}>
              <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} style={{ marginRight: 5 }} />
              <Text style={[styles.statusValue, { color: statusInfo.color }]} numberOfLines={1}>
                {statusInfo.label}
              </Text>
            </View>
          </View>

          {/* KOLOM 2: Spacer (Flexible) */}
          <View style={{ flex: 1 }} />

          {/* KOLOM 3: Diperbarui & Icon Kanan */}
          <View style={styles.dateCol}>
            <View style={styles.updatedHeader}>
              <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Diperbarui</Text>
              <View style={styles.chevronBox}>
                 <KananIcon width={12} height={12} color={colors.text.tertiary} />
              </View>
            </View>
            <Text style={[styles.dateText, { color: colors.text.primary }]}>
              25 Okt 2025, 18:00
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      
      {/* HEADER */}
      <CustomHeader 
        type="page" 
        title="Lacak Status Tiket"
        showNotificationButton={!isGuest} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* BODY CONTENT */}
      {isGuest ? (
        // VIEW GUEST
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.searchBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.searchTitle}>Cari Tiket Anda</Text>
            <Text style={styles.searchDesc}>Masukkan ID Tiket lengkap untuk melihat progres.</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Contoh: INC-2025-001"
                placeholderTextColor="#999"
                value={searchId}
                onChangeText={setSearchId}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.searchBtn} onPress={handleGuestSearch}>
                <Text style={styles.searchBtnText}>Cari Tiket</Text>
              </TouchableOpacity>
            </View>
          </View>

          {hasSearched && (
            <View style={{ marginTop: Spacing.lg }}>
              <Text style={[styles.resultTitle, { color: colors.text.primary }]}>
                Hasil Pencarian :
              </Text>
              {guestSearchResult.length > 0 ? (
                guestSearchResult.map(item => (
                  <View key={item.id} style={{ marginTop: 10 }}>
                    {renderTicketCard({ item })}
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={{ color: colors.text.secondary }}>Tiket tidak ditemukan.</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      ) : (
        // VIEW PEGAWAI
        <View style={styles.contentPegawai}>
          <View style={[styles.tabContainer, { backgroundColor: colors.background.card }]}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'incident' && { borderBottomColor: colors.primary }]} 
              onPress={() => setActiveTab('incident')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'incident' ? colors.primary : colors.text.secondary }]}>Pengaduan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'request' && { borderBottomColor: colors.primary }]} 
              onPress={() => setActiveTab('request')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'request' ? colors.primary : colors.text.secondary }]}>Permintaan</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getEmployeeData()}
            keyExtractor={item => item.id}
            renderItem={renderTicketCard}
            contentContainerStyle={{ padding: Spacing.lg, paddingBottom: hp(10) }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="file-tray-outline" size={40} color={colors.text.tertiary} />
                <Text style={{ color: colors.text.secondary, marginTop: 10 }}>Belum ada tiket.</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg },
  contentPegawai: { flex: 1 },

  // --- CARD STYLE ---
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  
  // NEW: Badge Style untuk Tipe (Kotak rounded dengan warna pudar)
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  typeText: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: 10,
  },
  
  ticketTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
  },
  labelSmall: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: 10,
  },
  ticketNumber: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.sm,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: Spacing.sm,
  },

  // NEW: Bottom Layout (3 Bagian)
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Align bawah agar rapi
  },
  statusCol: {
    flex: 2, // Kolom Kiri agak lebar
  },
  dateCol: {
    flex: 2, // Kolom Kanan agak lebar
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusValue: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.sm,
  },
  updatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  chevronBox: {
    marginLeft: 4,
    marginTop: 1,
  },
  dateText: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.xs,
  },

  // --- SEARCH & TAB STYLES (Tetap sama seperti sebelumnya) ---
  searchBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadow.md,
  },
  searchTitle: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.lg,
    color: '#FFF',
    marginBottom: 5,
  },
  searchDesc: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.md,
  },
  inputContainer: { gap: Spacing.sm },
  input: {
    backgroundColor: '#FFF',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: hp(6),
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.md,
    color: '#333',
  },
  searchBtn: {
    backgroundColor: '#004BA0',
    borderRadius: BorderRadius.md,
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.md,
    color: '#FFF',
  },
  resultTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  emptyState: { alignItems: 'center', marginTop: Spacing.xl },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: -hp(2),
    marginBottom: Spacing.sm,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    ...Shadow.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
  },
});