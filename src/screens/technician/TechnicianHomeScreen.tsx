import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader'; 
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { dashboardApi } from '../../services/api/dashboard';
import { DashboardData } from '../../types/dashboard';
import { wp, hp, Spacing, BorderRadius } from '../../styles/spacing';
import { FontSize } from '../../styles/typography';

export default function TechnicianHomeScreen() {
  const navigation = useNavigation<any>();
  const { theme, colors, isDark } = useTheme();
  
  // ✅ 1. AMBIL HELPER NAME DARI STORE
  const { user, getUserName, userOpdName } = useAuthStore();

  // State
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- FETCH DATA API ---
  const loadDashboard = useCallback(async () => {
    try {
      const response = await dashboardApi.getTechnicianDashboard();
      if (response.success) {
        setData(response.dashboard);
      }
    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const styles = getStyles(theme, colors, isDark);

  // --- HELPER STATUS COLOR & TEXT ---
  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'resolved' || s === 'closed') return { bg: isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7', text: '#166534', label: 'SELESAI' };
    if (s === 'in_progress') return { bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE', text: '#1E40AF', label: 'DIPROSES' };
    if (s === 'assigned') return { bg: isDark ? 'rgba(14, 165, 233, 0.15)' : '#E0F2FE', text: '#0284C7', label: 'DITUGASKAN' };
    if (s === 'open') return { bg: isDark ? 'rgba(234, 179, 8, 0.15)' : '#FEF9C3', text: '#854D0E', label: 'BARU' };
    return { bg: colors.background.secondary, text: colors.text.secondary, label: s.toUpperCase() };
  };

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text.secondary }}>Memuat Data...</Text>
      </View>
    );
  }

  // --- DATA PREPARATION ---
  const stats = data?.by_status || { open: 0, assigned: 0, in_progress: 0, resolved: 0 };
  const taskList = data?.my_assigned_tickets || [];
  
  const composition = data?.task_composition || [];
  const compAssigned = composition.find(c => c.status === 'assigned')?.value || 0;
  const compOpen = composition.find(c => c.status === 'open')?.value || 0;
  const compProgress = composition.find(c => c.status === 'in_progress')?.value || 0;
  const totalComp = compAssigned + compOpen + compProgress || 1; 

  // --- RENDER HELPERS ---
  const renderCard = (title: string, count: number, accentColor: string, icon: string) => (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: accentColor }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View>
        <Text style={styles.cardCount}>{count}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <CustomHeader 
        type="home"
        // ✅ 1. PERBAIKAN NAMA: Gunakan getUserName()
        userName={getUserName()}
        userUnit="Teknisi IT"
        showNotificationButton={true}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(10) }}
      >
        <View style={styles.content}>
          
          {/* 2. RINGKASAN TUGAS (GRID) */}
          <Text style={styles.sectionTitle}>Ringkasan Pekerjaan</Text>
          <View style={styles.gridContainer}>
            {renderCard('Tugas Baru', stats.open, colors.warning, 'alert-circle')}
            {renderCard('Ditugaskan', stats.assigned, colors.info, 'briefcase')}
            {renderCard('Dikerjakan', stats.in_progress, colors.primary, 'hammer')}
            {renderCard('Selesai', stats.resolved + (data?.by_status.closed || 0), colors.success, 'checkmark-circle')}
          </View>

          {/* 3. KOMPOSISI TUGAS (BAR CHART) */}
          <Text style={styles.sectionTitle}>Komposisi Status</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartRow}>
              <View style={{ flex: compAssigned, backgroundColor: colors.info, height: '100%' }} />
              <View style={{ flex: compOpen, backgroundColor: colors.warning, height: '100%' }} />
              <View style={{ flex: compProgress, backgroundColor: colors.primary, height: '100%' }} />
              {totalComp === 0 && <View style={{ flex: 1, backgroundColor: colors.border.light, height: '100%' }} />}
            </View>
            
            <View style={styles.legendContainer}>
               <View style={styles.legendItem}>
                <View style={[styles.dot, {backgroundColor: colors.info}]} />
                <Text style={styles.legendText}>Ditugaskan ({compAssigned})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, {backgroundColor: colors.warning}]} />
                <Text style={styles.legendText}>Baru ({compOpen})</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, {backgroundColor: colors.primary}]} />
                <Text style={styles.legendText}>Proses ({compProgress})</Text>
              </View>
            </View>
          </View>

          {/* 4. LIST TUGAS SAYA */}
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Tugas Mendesak</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tugas')}>
              <Text style={styles.linkText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableCard}>
            {taskList.length > 0 ? taskList.map((ticket, index) => {
               const statusStyle = getStatusStyle(ticket.status);
               
               // ✅ FIX 1: Normalisasi Type (Jaga-jaga kalau API kirim 'Request' atau null)
               const safeType = (ticket.type || 'incident').toLowerCase(); 

               return (
                <TouchableOpacity 
                  key={ticket.id} 
                  style={[
                    styles.tableRow, 
                    index === taskList.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  // ✅ FIX 2: Kirim safeType yang sudah pasti lowercase
                  onPress={() => {
                    console.log("Navigating to:", ticket.id, safeType); // Debug Log
                    navigation.navigate('TicketDetail', { 
                      ticketId: ticket.id,
                      ticketType: safeType 
                    });
                  }}
                >
                  <View style={{flex: 1, paddingRight: 10}}>
                    <View style={{flexDirection:'row', alignItems:'center', marginBottom: 4}}>
                       <Text style={styles.tableId}>
                         #{ (ticket as any).ticket_number || ticket.id }
                       </Text>
                       <View style={styles.dotSeparator} />
                       
                       {/* ✅ FIX 3: Label UI juga pakai safeType biar konsisten */}
                       <Text style={styles.tableType}>
                         {safeType === 'request' ? 'PERMINTAAN' : 'PENGADUAN'}
                       </Text>
                    </View>
                    <Text style={styles.tableTitle} numberOfLines={2}>{ticket.title}</Text>
                  </View>

                  <View style={{alignItems: 'flex-end'}}>
                    <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                          {statusStyle.label}
                        </Text>
                    </View>
                    <Text style={styles.tableStage}>
                      {ticket.stage ? ticket.stage.replace('_', ' ') : '-'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }) : (
              <View style={{padding: 20, alignItems: 'center'}}>
                 <Ionicons name="checkmark-circle-outline" size={40} color={colors.success} />
                 <Text style={{color: colors.text.secondary, marginTop: 5}}>
                   Tidak ada tugas yang harus dikerjakan saat ini.
                 </Text>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// --- STYLES GENERATOR ---
const getStyles = (theme: any, colors: any, isDark: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.secondary 
  },
  scrollView: {
    flex: 1,
  },
  content: { 
    padding: Spacing.lg,
  },
  sectionTitle: { 
    fontSize: FontSize.md, 
    fontFamily: theme.fontFamily.poppins.semibold, 
    color: colors.text.primary, 
    marginBottom: Spacing.sm, 
    marginTop: Spacing.sm 
  },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: Spacing.md 
  },
  card: { 
    width: '48%', 
    backgroundColor: colors.background.card, 
    borderRadius: BorderRadius.md, 
    padding: Spacing.md, 
    marginBottom: Spacing.md, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderLeftWidth: 4, 
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8 
  },
  cardCount: { 
    fontSize: 18, 
    fontFamily: theme.fontFamily.poppins.bold, 
    color: colors.text.primary 
  },
  cardTitle: { 
    fontSize: 11, 
    color: colors.text.secondary,
    fontFamily: theme.fontFamily.poppins.regular
  },
  chartCard: { 
    backgroundColor: colors.background.card, 
    padding: Spacing.md, 
    borderRadius: BorderRadius.lg, 
    marginBottom: Spacing.lg, 
    elevation: 2 
  },
  chartRow: { 
    flexDirection: 'row', 
    height: 16, 
    width: '100%', 
    marginBottom: 12, 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  legendContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginRight: 6 
  },
  legendText: { 
    fontSize: 11, 
    color: colors.text.secondary,
    fontFamily: theme.fontFamily.poppins.medium
  },
  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  linkText: { 
    color: colors.primary, 
    fontSize: 12, 
    fontFamily: theme.fontFamily.poppins.semibold 
  },
  tableCard: { 
    backgroundColor: colors.background.card, 
    borderRadius: BorderRadius.lg, 
    elevation: 2,
    overflow: 'hidden'
  },
  tableRow: { 
    flexDirection: 'row', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border.light, 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  tableId: { 
    fontSize: 11, 
    color: colors.primary, 
    fontFamily: theme.fontFamily.poppins.bold 
  },
  dotSeparator: {
    width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.text.tertiary, marginHorizontal: 6
  },
  tableType: {
    fontSize: 10,
    color: colors.text.secondary,
    fontFamily: theme.fontFamily.poppins.medium
  },
  tableTitle: { 
    fontSize: 13, 
    color: colors.text.primary, 
    fontFamily: theme.fontFamily.poppins.semibold,
    marginTop: 2
  },
  statusPill: { 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 6, 
    marginBottom: 4 
  },
  statusText: { 
    fontSize: 9, 
    fontFamily: theme.fontFamily.poppins.bold 
  },
  tableStage: {
    fontSize: 10,
    color: colors.text.tertiary,
    fontFamily: theme.fontFamily.poppins.regular,
    fontStyle: 'italic'
  }
});