import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader'; // Gunakan header standar
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { incidentApi } from '../../services/api/incidents';
import { requestApi } from '../../services/api/requests';

// --- STYLES ---
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// Tipe Lokal
interface TaskItem {
  id: number | string;
  ticketNumber: string;
  title: string;
  status: string;
  opdName: string;
  type: 'incident' | 'request';
}

export default function TechnicianTaskScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  
  // Ambil state filter
  const [activeType, setActiveType] = useState<'incident' | 'request'>('incident');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // State Data
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  // --- FETCH DATA ---
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      let dataRaw: any[] = [];
      
      // 1. Ambil data sesuai Tab Active
      if (activeType === 'incident') {
        dataRaw = await incidentApi.getAll();
      } else {
        dataRaw = await requestApi.getAll();
      }

      // 2. Format Data
      const formatted: TaskItem[] = (dataRaw || []).map((item: any) => ({
        id: item.id,
        ticketNumber: item.ticket_number,
        title: item.title,
        status: item.status,
        opdName: item.opd?.name || 'Umum',
        type: activeType,
      }));

      // 3. Filter Logic (Client Side)
      // Teknisi biasanya hanya melihat tiket yang assigned, in_progress, dsb.
      // Sesuaikan filter ini dengan kebutuhan bisnis Anda.
      const myTasks = formatted.filter(t => {
        const s = t.status.toLowerCase();
        return s !== 'new' && s !== 'open'; // Contoh: Teknisi tidak lihat tiket 'new' yang belum diapprove
      });

      setTaskList(myTasks);

    } catch (error) {
      console.error("Gagal load task teknisi:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeType]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  // --- FILTER CLIENT SIDE ---
  const getFilteredTasks = () => {
    let data = taskList;

    // 1. Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.ticketNumber.toLowerCase().includes(q)
      );
    }

    // 2. Status Dropdown
    if (statusFilter !== 'All') {
      data = data.filter(t => t.status === statusFilter);
    }

    return data;
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    switch (s) {
      case 'assigned': return '#2196f3';
      case 'in_progress': return '#4caf50';
      case 'waiting': return '#9c27b0';
      case 'resolved': return '#4FEA17';
      default: return '#757575';
    }
  };

  // --- RENDER ITEM ---
  const renderItem = ({ item }: { item: TaskItem }) => (
    <View style={[styles.card, { backgroundColor: colors.background.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.ticketId, { color: colors.text.secondary }]}>{item.ticketNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={[styles.title, { color: colors.text.primary }]}>{item.title}</Text>
      <Text style={[styles.opd, { color: colors.text.secondary }]}>🏢 {item.opdName}</Text>

      <TouchableOpacity 
        style={styles.detailButton}
        // Arahkan ke detail yang benar
        onPress={() => {
           if(item.type === 'incident') navigation.navigate('TicketDetail', { ticketId: item.id });
           else navigation.navigate('DetailRequest', { ticketId: item.id }); // Sesuaikan nama screen request
        }}
      >
        <Text style={styles.detailText}>Kerjakan / Detail</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <CustomHeader 
        type="page" 
        title="Daftar Tugas"
        showNotificationButton={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* 1. TABS */}
      <View style={[styles.tabs, { backgroundColor: colors.background.card }]}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeType==='incident' && { borderBottomColor: colors.primary }]} 
          onPress={() => setActiveType('incident')}
        >
          <Text style={[styles.tabText, activeType==='incident' && { color: colors.primary }]}>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeType==='request' && { borderBottomColor: colors.primary }]} 
          onPress={() => setActiveType('request')}
        >
          <Text style={[styles.tabText, activeType==='request' && { color: colors.primary }]}>Permintaan</Text>
        </TouchableOpacity>
      </View>

      {/* 2. SEARCH & FILTER */}
      <View style={styles.filterContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.background.card }]}>
          <Ionicons name="search" size={18} color={colors.text.secondary} />
          <TextInput 
            style={[styles.input, { color: colors.text.primary }]} 
            placeholder="Cari Judul / ID..." 
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.dropdownTrigger, { backgroundColor: colors.background.card }]} 
          onPress={() => setShowStatusDropdown(!showStatusDropdown)}
        >
          <Ionicons name="filter" size={18} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* DROPDOWN MENU */}
      {showStatusDropdown && (
        <View style={[styles.dropdownMenu, { backgroundColor: colors.background.card }]}>
          {['All', 'assigned', 'in_progress', 'resolved'].map(status => (
            <TouchableOpacity 
              key={status} 
              style={[styles.dropdownItem, { borderBottomColor: colors.border.light }]} 
              onPress={() => { setStatusFilter(status); setShowStatusDropdown(false); }}
            >
              <Text style={{ color: colors.text.primary }}>
                {status === 'All' ? 'Semua Status' : status.replace('_', ' ').toUpperCase()}
              </Text>
              {statusFilter === status && <Ionicons name="checkmark" size={16} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* LIST */}
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={getFilteredTasks()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={{alignItems:'center', marginTop: 50}}>
              <Text style={{color: colors.text.secondary}}>Tidak ada tugas saat ini.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { color: '#888', fontWeight: '600' },

  filterContainer: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 10, alignItems: 'center', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', padding: 10, borderRadius: 8, alignItems: 'center', ...Shadow.sm },
  input: { flex: 1, marginLeft: 10 },
  dropdownTrigger: { padding: 12, borderRadius: 8, ...Shadow.sm },

  dropdownMenu: { position: 'absolute', top: 120, right: 20, width: 200, borderRadius: 8, ...Shadow.md, zIndex: 10, padding: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' },

  listContent: { padding: 15 },
  card: { borderRadius: 12, padding: 15, marginBottom: 15, ...Shadow.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  ticketId: { fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  opd: { fontSize: 12, marginBottom: 15 },
  detailButton: { backgroundColor: '#007AFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8 },
  detailText: { color: '#fff', fontWeight: 'bold', marginRight: 5 },
});