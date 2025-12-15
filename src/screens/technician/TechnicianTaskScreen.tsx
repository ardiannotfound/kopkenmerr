import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORT SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { incidentApi } from '../../services/api/incidents';
import { requestApi } from '../../services/api/requests';

// --- STYLES ---
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- TYPES ---
interface TaskItem {
  id: number | string;
  ticketNumber: string;
  title: string;
  status: string;
  stage: string | null;
  opdName: string;
  type: 'incident' | 'request';
  created_at: string;
  priority: string;
}

export default function TechnicianTaskScreen() {
  const navigation = useNavigation<any>();
  const { theme, colors, isDark } = useTheme();
  const styles = getStyles(theme, colors, isDark);

  const [activeType, setActiveType] = useState<'incident' | 'request'>('incident');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  // ================= FETCH DATA =================
  const loadTasks = useCallback(async () => {
    // Jangan set loading true jika sedang refreshing (agar tidak kedip)
    if (!refreshing) setLoading(true);
    
    try {
      let dataRaw: any[] = [];

      // 1. Fetch sesuai tab aktif
      if (activeType === 'incident') {
        dataRaw = await incidentApi.getAll();
      } else {
        dataRaw = await requestApi.getAll();
      }

      // 2. Normalisasi Data
      const formatted: TaskItem[] = (dataRaw || []).map((item: any) => ({
        id: item.id,
        ticketNumber: item.ticket_number ?? `#${item.id}`,
        title: item.title ?? 'Tanpa Judul',
        status: item.status ?? 'unknown',
        stage: item.stage,
        opdName: item.opd?.name ?? 'Umum',
        type: activeType,
        created_at: item.created_at,
        priority: item.priority ?? 'Medium',
      }));

      // 3. Filter Tiket Teknisi
      // Tampilkan tiket yang statusnya SUDAH DITUGASKAN atau SEDANG DIPROSES
      const filtered = formatted.filter(t => {
        const s = t.status.toLowerCase();
        // Logika: Tampilkan jika assigned atau in_progress (sesuaikan dengan logic bisnismu)
        return s === 'assigned' || s === 'in_progress' || s === 'resolved';
      });

      // Sort by terbaru
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTaskList(filtered);
    } catch (err) {
      console.error('Gagal load task teknisi:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeType, refreshing]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    // Kita panggil loadTasks, tapi state refreshing mentrigger logic di dalam useCallback
  };

  // ================= FILTER LOGIC =================
  const getFilteredTasks = () => {
    let data = [...taskList];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.ticketNumber.toLowerCase().includes(q)
      );
    }
    return data;
  };

  // ================= HELPERS UI =================
  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'resolved') return { bg: isDark ? 'rgba(79, 234, 23, 0.2)' : '#DCFCE7', text: '#166534', label: 'SELESAI' };
    if (s === 'in_progress') return { bg: isDark ? 'rgba(5, 63, 92, 0.2)' : '#E0F2FE', text: '#0284C7', label: 'DIPROSES' };
    if (s === 'assigned') return { bg: isDark ? 'rgba(255, 149, 0, 0.2)' : '#FEF9C3', text: '#854D0E', label: 'DITUGASKAN' };
    return { bg: colors.background.tertiary, text: colors.text.secondary, label: s.replace('_', ' ').toUpperCase() };
  };

  const getPriorityColor = (p: string) => {
    const priority = p?.toLowerCase() || 'medium';
    if (priority === 'high' || priority === 'major') return colors.error;
    if (priority === 'medium') return colors.warning;
    return colors.info;
  };

  // ================= RENDER ITEM =================
  const renderItem = ({ item }: { item: TaskItem }) => {
    const statusStyle = getStatusStyle(item.status);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('TechnicianTicketDetail', {
            ticketId: item.id,
            ticketType: item.type,
          })
        }
      >
        {/* Priority Strip */}
        <View style={[styles.priorityStrip, { backgroundColor: priorityColor }]} />

        <View style={styles.cardContent}>
          {/* Header Card: ID & Status */}
          <View style={styles.cardHeader}>
            <Text style={styles.ticketNumber}>{item.ticketNumber}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {statusStyle.label}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={14} color={colors.text.tertiary} />
              <Text style={styles.metaText} numberOfLines={1}>{item.opdName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
              <Text style={styles.metaText}>
                 {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Icon (Arrow) */}
        <View style={styles.arrowContainer}>
           <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background.primary} />
      
      <CustomHeader
        type="page"
        title="Daftar Tugas"
        showNotificationButton
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* --- SEARCH BAR --- */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari ID atau Judul..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
               <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* --- CUSTOM TABS --- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeType === 'incident' && styles.activeTab]}
          onPress={() => setActiveType('incident')}
        >
          <Text style={[styles.tabText, activeType === 'incident' && styles.activeTabText]}>Pengaduan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeType === 'request' && styles.activeTab]}
          onPress={() => setActiveType('request')}
        >
          <Text style={[styles.tabText, activeType === 'request' && styles.activeTabText]}>Permintaan</Text>
        </TouchableOpacity>
      </View>

      {/* --- LIST --- */}
      {loading && !refreshing ? (
        <View style={styles.centerEmpty}>
           <ActivityIndicator size="large" color={colors.primary} />
           <Text style={styles.emptyText}>Memuat tugas...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredTasks()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.centerEmpty}>
               <Ionicons name="file-tray-outline" size={60} color={colors.text.tertiary} />
               <Text style={[styles.emptyText, { marginTop: 10 }]}>Tidak ada tugas ditemukan.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ================= STYLES GENERATOR =================
const getStyles = (theme: any, colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary, // Background abu-abu muda
  },
  
  // Search
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: colors.background.primary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? colors.background.card : '#F3F4F6',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: isDark ? colors.border.light : 'transparent',
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    color: colors.text.primary,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.base,
    color: colors.text.tertiary,
  },
  activeTabText: {
    color: colors.primary,
    fontFamily: FontFamily.poppins.semibold,
  },

  // List
  listContent: {
    padding: Spacing.md,
    paddingBottom: hp(10),
  },
  
  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden', // Agar strip priority tidak keluar radius
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: isDark ? colors.border.light : 'transparent',
  },
  priorityStrip: {
    width: 5,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md,
  },
  arrowContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F9FAFB',
  },
  
  // Card Internal
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketNumber: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.xs,
    color: colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: 10,
  },
  title: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.base,
    color: colors.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  
  // Meta Info (Opd, Date)
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  metaText: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.xs,
    color: colors.text.secondary,
  },

  // Empty State
  centerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  emptyText: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm,
    color: colors.text.tertiary,
    marginTop: Spacing.sm,
  },
});