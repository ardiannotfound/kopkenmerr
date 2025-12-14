import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { incidentApi } from '../../services/api/incidents';
import { requestApi } from '../../services/api/requests';

// --- IMPORTS STYLES ---
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS ICONS SVG ---
import KananIcon from '../../../assets/icons/kanan.svg'; 

interface TicketItem {
  id: number | string;
  ticketNumber: string;
  title: string;
  status: string;
  type: 'incident' | 'request';
  updatedAt: string;
}

export default function TicketListScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const { isGuest } = useAuthStore(); 

  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketList, setTicketList] = useState<TicketItem[]>([]);
  
  // State Tamu
  const [searchId, setSearchId] = useState('');
  const [guestSearchResult, setGuestSearchResult] = useState<TicketItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // State Pegawai
  const [activeTab, setActiveTab] = useState<'incident' | 'request'>('incident');

  // --- 1. FETCH DATA (PEGAWAI) ---
  const loadEmployeeData = useCallback(async () => {
    if (isGuest) return;
    setLoading(true);
    try {
      let dataRaw: any[] = [];
      if (activeTab === 'incident') {
        dataRaw = await incidentApi.getAll();
      } else {
        dataRaw = await requestApi.getAll();
      }

      const formatted: TicketItem[] = (dataRaw || []).map((item: any) => ({
        id: item.id,
        ticketNumber: item.ticket_number,
        title: item.title,
        status: item.status,
        type: activeTab,
        updatedAt: item.updated_at || item.created_at,
      }));

      setTicketList(formatted);
    } catch (error) {
      console.error("Gagal load tiket:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, isGuest]);

  useEffect(() => {
    loadEmployeeData();
  }, [loadEmployeeData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEmployeeData();
  };

  // --- 2. SEARCH DATA (TAMU) ---
  const handleGuestSearch = async () => {
    if (!searchId.trim()) {
      Alert.alert("Error", "Mohon masukkan Nomor Tiket.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setGuestSearchResult(null);

    try {
      const response: any = await incidentApi.trackPublic(searchId.trim());
      const ticketData = response?.data?.ticket_info;

      if (ticketData) {
        setGuestSearchResult({
          id: ticketData.ticket_number, 
          ticketNumber: ticketData.ticket_number,
          title: ticketData.title,
          status: ticketData.status,
          type: 'incident', 
          updatedAt: ticketData.last_updated || ticketData.created_at 
        });
      } else {
        Alert.alert("Info", "Tiket tidak ditemukan.");
      }

    } catch (error: any) {
      console.error("Search Error:", error);
      if (error.response?.status === 404) {
        Alert.alert("Tidak Ditemukan", "Nomor tiket salah atau tidak terdaftar.");
      } else {
        Alert.alert("Error", "Gagal menghubungi server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER STYLE ---
  const getTypeStyle = (type: string) => {
    if (type === 'incident') return { label: 'Pengaduan', color: '#FF9500', bg: isDark ? 'rgba(255, 149, 0, 0.2)' : 'rgba(255, 149, 0, 0.15)' }; 
    return { label: 'Permintaan', color: '#337CAD', bg: isDark ? 'rgba(51, 124, 173, 0.3)' : 'rgba(51, 124, 173, 0.15)' }; 
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'closed': return { label: 'Closed', color: '#D32F2F', icon: 'close-circle' };
      case 'resolved': return { label: 'Selesai', color: '#4FEA17', icon: 'checkmark-circle' };
      case 'pending': case 'pending_approval': return { label: 'Pending', color: isDark ? '#AAA' : '#555657', icon: 'time' };
      case 'in_progress': case 'assigned': return { label: 'Dikerjakan', color: isDark ? '#4FC3F7' : '#053F5C', icon: 'hammer' };
      case 'open': case 'new': return { label: 'Baru', color: '#FFA629', icon: 'alert-circle' };
      default: return { label: status, color: '#333', icon: 'help-circle' };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // --- RENDER CARD (HASIL SEARCH / LIST PEGAWAI) ---
  const renderTicketCard = ({ item }: { item: TicketItem }) => {
    const typeInfo = getTypeStyle(item.type);
    const statusInfo = getStatusConfig(item.status);

    return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.background.card }]}
      onPress={() => {
         // ✅ FIX: Kirim ticketType agar Detail Screen tau harus panggil API mana
         navigation.navigate('TicketDetail', { 
           ticketId: item.id,
           ticketType: item.type // <--- PENTING! (incident / request)
         });
      }}
      activeOpacity={0.8}
    >
        <View style={styles.cardTop}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
              <Text style={[styles.typeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
            </View>
            <Text style={[styles.ticketTitle, { color: colors.text.primary }]} numberOfLines={2}>{item.title}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Nomor Tiket</Text>
            <Text style={[styles.ticketNumber, { color: colors.text.primary }]}>{item.ticketNumber}</Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]} />
        <View style={styles.cardBottom}>
          <View style={styles.colStart}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Status</Text>
            <View style={styles.statusRow}>
              <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} style={{ marginRight: 4 }} />
              <Text style={[styles.statusValue, { color: statusInfo.color }]} numberOfLines={1}>{statusInfo.label}</Text>
            </View>
          </View>
          <View style={styles.colCenter}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Diperbarui</Text>
            <Text style={[styles.dateText, { color: colors.text.primary }]}>{formatDate(item.updatedAt)}</Text>
          </View>
          <View style={styles.colEnd}>
             <KananIcon width={24} height={24} color={colors.text.tertiary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      
      <CustomHeader 
        type="page" 
        title="Lacak Status Tiket"
        showNotificationButton={!isGuest} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {isGuest ? (
        // === GUEST VIEW (DESAIN BARU) ===
        <ScrollView contentContainerStyle={styles.guestContainer}>
          
          <Text style={[styles.guestHeaderTitle, { color: colors.primary }]}>
            Lacak Tiket Anda
          </Text>
          <Text style={[styles.guestHeaderSubtitle, { color: colors.primary }]}>
            Masukkan nomor tiket dan email Anda untuk melihat status tiket terbaru.
          </Text>

          {/* CARD SEARCH */}
          <View style={[styles.guestCard, { backgroundColor: isDark ? colors.background.card : '#FFFFFF', borderColor: isDark ? '#444' : '#E0E0E0' }]}>
            
            {/* Label Kanan Atas - UKURAN LEBIH BESAR (13) */}
            <Text style={styles.inputLabelRight}>Nomor Tiket</Text>

            {/* Input Field - PLACEHOLDER LEBIH TIPIS/ABU */}
            <View style={[styles.inputWrapper, { borderColor: isDark ? '#555' : '#E0E0E0' }]}>
              <TextInput 
                style={[styles.input, { color: colors.text.primary }]} 
                placeholder="CONTOH : INC-2025-0047"
                placeholderTextColor="#BDBDBD" // ✅ Abu muda (Tipis)
                value={searchId}
                onChangeText={setSearchId}
                autoCapitalize="characters"
              />
            </View>

            {/* Tombol Lacak - LEBIH PENDEK (Height 45) */}
            <TouchableOpacity 
              style={[styles.searchBtn, { backgroundColor: colors.primary }]} 
              onPress={handleGuestSearch} 
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.searchBtnText}>Lacak Tiket</Text>
                </>
              )}
            </TouchableOpacity>

          </View>

          {/* Search Result */}
          {hasSearched && (
            <View style={{ marginTop: Spacing.xl, width: '100%' }}>
              <Text style={[styles.resultTitle, { color: colors.text.primary, textAlign: 'center' }]}>
                Hasil Pencarian :
              </Text>
              
              {guestSearchResult ? (
                <View style={{ marginTop: 10 }}>
                  {renderTicketCard({ item: guestSearchResult })}
                </View>
              ) : (
                !loading && (
                  <View style={styles.emptyStateContainer}>
                     <Ionicons name="search-outline" size={40} color={colors.text.tertiary} />
                     <Text style={{ color: colors.text.secondary, marginTop: 10 }}>Tiket tidak ditemukan.</Text>
                  </View>
                )
              )}
            </View>
          )}

        </ScrollView>

      ) : (
        // === PEGAWAI VIEW ===
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

          {loading && !refreshing ? (
             <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={ticketList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTicketCard}
              contentContainerStyle={{ padding: Spacing.lg, paddingBottom: hp(10) }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListEmptyComponent={
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="file-tray-outline" size={40} color={colors.text.tertiary} />
                  <Text style={{ color: colors.text.secondary, marginTop: 10 }}>Belum ada tiket.</Text>
                </View>
              }
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentPegawai: { flex: 1 },

  // === GUEST STYLES ===
  guestContainer: {
    padding: Spacing.lg,
    alignItems: 'center', 
    paddingBottom: hp(15), 
  },
  guestHeaderTitle: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 4,
  },
  guestHeaderSubtitle: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 25, 
    lineHeight: 20,
  },
  guestCard: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputLabelRight: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: 15,
    color: '#9E9E9E',
    alignSelf: 'flex-start', 
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    backgroundColor: 'transparent',
    marginBottom: Spacing.md,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: 14,
    paddingHorizontal: 15,
    height: '100%',
  },
  searchBtn: {
    flexDirection: 'row',
    height: 45, // ✅ TURUN JADI 45 (BIAR GAK PANJANG/BULKY)
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8, // Sedikit jarak
  },
  searchBtnText: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: 14,
    color: '#FFF',
  },

  // === COMMON CARD STYLES ===
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 6 },
  typeText: { fontFamily: FontFamily.poppins.bold, fontSize: 10 },
  ticketTitle: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.md },
  labelSmall: { fontFamily: FontFamily.poppins.regular, fontSize: 10 },
  ticketNumber: { fontFamily: FontFamily.poppins.bold, fontSize: FontSize.sm },
  divider: { height: 1, width: '100%', marginVertical: Spacing.sm },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end' },
  colStart: { flex: 2, alignItems: 'flex-start' },
  colCenter: { flex: 2, alignItems: 'center' },
  colEnd: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusValue: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.sm },
  dateText: { fontFamily: FontFamily.poppins.medium, fontSize: FontSize.xs, marginTop: 2 },
  
  resultTitle: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.md, marginBottom: Spacing.sm },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl * 2, width: '100%' },
  
  // === TABS ===
  tabContainer: { flexDirection: 'row', paddingHorizontal: Spacing.lg, marginTop: -hp(2), marginBottom: Spacing.sm, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, ...Shadow.sm },
  tabBtn: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.md },
});