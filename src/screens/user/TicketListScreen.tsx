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

// --- IMPORTS ICONS SVG ---
import KananIcon from '../../../assets/icons/kanan.svg'; 

export default function TicketListScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const { isGuest } = useAuthStore(); 

  // --- STATE ---
  const [searchId, setSearchId] = useState('');
  const [guestSearchResult, setGuestSearchResult] = useState<Ticket[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'incident' | 'request'>('incident');

  // Helper Warna Teks Dinamis (Biru di Light, Putih di Dark)
  // Gunakan ini untuk teks yang ingin berwarna "Primary" tapi harus Putih di Dark Mode
  const dynamicPrimaryTextColor = isDark ? colors.white : colors.primary;

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
        bg: isDark ? 'rgba(255, 149, 0, 0.2)' : 'rgba(255, 149, 0, 0.15)' 
      }; 
    }
    return { 
      label: 'Permintaan', 
      color: '#337CAD', 
      bg: isDark ? 'rgba(51, 124, 173, 0.3)' : 'rgba(51, 124, 173, 0.15)' 
    }; 
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'closed': return { label: 'Closed', color: '#D32F2F', icon: 'close-circle' };
      case 'resolved': return { label: 'Selesai', color: '#4FEA17', icon: 'checkmark-circle' };
      case 'pending': return { label: 'Pending', color: isDark ? '#AAA' : '#555657', icon: 'time' };
      case 'in_progress': 
      case 'assigned': return { label: 'Dikerjakan', color: isDark ? '#4FC3F7' : '#053F5C', icon: 'hammer' };
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
            {/* Badge Tipe */}
            <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
              <Text style={[styles.typeText, { color: typeInfo.color }]}>
                {typeInfo.label}
              </Text>
            </View>
            {/* Judul: Pakai text.primary agar Putih di Dark Mode */}
            <Text style={[styles.ticketTitle, { color: colors.text.primary }]} numberOfLines={2}>
              {item.title}
            </Text>
          </View>

          {/* Nomor Tiket */}
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Nomor Tiket</Text>
            {/* Nomor: Pakai text.primary agar Putih di Dark Mode */}
            <Text style={[styles.ticketNumber, { color: colors.text.primary }]}>{item.ticketNumber}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

        {/* BAGIAN BAWAH (3 ZONA) */}
        <View style={styles.cardBottom}>
          
          {/* 1. START: Status */}
          <View style={styles.colStart}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Status Terkini</Text>
            <View style={styles.statusRow}>
              <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} style={{ marginRight: 4 }} />
              <Text style={[styles.statusValue, { color: statusInfo.color }]} numberOfLines={1}>
                {statusInfo.label}
              </Text>
            </View>
          </View>

          {/* 2. CENTER: Diperbarui */}
          <View style={styles.colCenter}>
            <Text style={[styles.labelSmall, { color: colors.text.secondary }]}>Diperbarui</Text>
            <Text style={[styles.dateText, { color: colors.text.primary }]}>
              25 Okt, 18:00
            </Text>
          </View>

          {/* 3. END: Icon Panah */}
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
        // === GUEST VIEW ===
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.searchBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.searchTitle}>Cari Tiket Anda</Text>
            <Text style={styles.searchDesc}>Masukkan ID Tiket lengkap.</Text>
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
                <View style={styles.emptyStateContainer}>
                  <Text style={{ color: colors.text.secondary }}>Tiket tidak ditemukan.</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

      ) : (
        // === PEGAWAI VIEW ===
        <View style={styles.contentPegawai}>
          {/* TAB BUTTONS */}
          <View style={[styles.tabContainer, { backgroundColor: colors.background.card }]}>
            
            {/* Tab Pengaduan */}
            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'incident' && { borderBottomColor: dynamicPrimaryTextColor } 
              ]} 
              onPress={() => setActiveTab('incident')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'incident' ? dynamicPrimaryTextColor : colors.text.secondary }
              ]}>Pengaduan</Text>
            </TouchableOpacity>
            
            {/* Tab Permintaan */}
            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeTab === 'request' && { borderBottomColor: dynamicPrimaryTextColor } 
              ]} 
              onPress={() => setActiveTab('request')}
            >
              <Text style={[
                styles.tabText, 
                { color: activeTab === 'request' ? dynamicPrimaryTextColor : colors.text.secondary }
              ]}>Permintaan</Text>
            </TouchableOpacity>

          </View>

          <FlatList
            data={getEmployeeData()}
            keyExtractor={item => item.id}
            renderItem={renderTicketCard}
            contentContainerStyle={{ padding: Spacing.lg, paddingBottom: hp(10) }}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
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

  // --- BOTTOM LAYOUT ---
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  colStart: {
    flex: 2,
    alignItems: 'flex-start',
  },
  colCenter: {
    flex: 2,
    alignItems: 'center',
  },
  colEnd: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 2,
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
  dateText: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.xs,
    marginTop: 2,
  },

  // --- SEARCH & TABS ---
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
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl * 2,
    width: '100%',
  },
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