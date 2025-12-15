import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

// 🔧 Extended Ticket Type dengan SLA fields
interface TicketWithSLA {
  id: number;
  ticket_number?: string;
  type: string;
  title: string;
  status: string;
  stage?: string;
  sla_due?: string;
  sla_breached?: boolean;
  sla_target_date?: string;
  sla_target_time?: string;
}

export default function TechnicianHomeScreen() {
  const navigation = useNavigation<any>();
  const { theme, colors, isDark } = useTheme();
  
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

  // --- 🔥 HELPER: CEK APAKAH TIKET MENDESAK ---
  const isTicketUrgent = useCallback((ticket: TicketWithSLA) => {
    // Jika sudah selesai/closed, tidak mendesak
    const status = (ticket.status || '').toLowerCase();
    if (status === 'resolved' || status === 'closed') {
      return false;
    }

    // Cek SLA
    const slaDue = ticket.sla_due;
    if (!slaDue) return false; // Tidak ada SLA, tidak bisa ditentukan

    const now = new Date();
    const dueDate = new Date(slaDue);
    
    // Hitung selisih waktu dalam jam
    const diffMs = dueDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Mendesak jika:
    // 1. SLA sudah lewat (breached)
    // 2. SLA akan habis dalam 24 jam ke depan
    return ticket.sla_breached || diffHours <= 24;
  }, []);

  // --- 🔥 FILTER TIKET MENDESAK ---
  const urgentTasks = useMemo(() => {
    const taskList = (data?.my_assigned_tickets || []) as TicketWithSLA[];
    return taskList.filter(ticket => isTicketUrgent(ticket));
  }, [data, isTicketUrgent]);

  // --- HELPER: HITUNG WAKTU SLA TERSISA ---
  const getSlaTimeRemaining = useCallback((slaDue: string) => {
    const now = new Date();
    const dueDate = new Date(slaDue);
    const diffMs = dueDate.getTime() - now.getTime();
    
    if (diffMs < 0) {
      const overdue = Math.abs(diffMs);
      const hours = Math.floor(overdue / (1000 * 60 * 60));
      const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
      return {
        text: `Terlambat ${hours}j ${minutes}m`,
        color: colors.error,
        isOverdue: true
      };
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      text: `${hours}j ${minutes}m lagi`,
      color: hours < 12 ? colors.error : colors.warning,
      isOverdue: false
    };
  }, [colors]);

  // --- HELPER STATUS COLOR & TEXT ---
  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'resolved' || s === 'closed') 
      return { bg: isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7', text: '#166534', label: 'SELESAI' };
    if (s === 'in_progress') 
      return { bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#DBEAFE', text: '#1E40AF', label: 'DIPROSES' };
    if (s === 'assigned') 
      return { bg: isDark ? 'rgba(14, 165, 233, 0.15)' : '#E0F2FE', text: '#0284C7', label: 'DITUGASKAN' };
    if (s === 'open') 
      return { bg: isDark ? 'rgba(234, 179, 8, 0.15)' : '#FEF9C3', text: '#854D0E', label: 'BARU' };
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
          
          {/* RINGKASAN TUGAS (GRID) */}
          <Text style={styles.sectionTitle}>Ringkasan Pekerjaan</Text>
          <View style={styles.gridContainer}>
            {renderCard('Tugas Baru', stats.open, colors.warning, 'alert-circle')}
            {renderCard('Ditugaskan', stats.assigned, colors.info, 'briefcase')}
            {renderCard('Dikerjakan', stats.in_progress, colors.primary, 'hammer')}
            {renderCard('Selesai', stats.resolved + (data?.by_status.closed || 0), colors.success, 'checkmark-circle')}
          </View>

          {/* KOMPOSISI TUGAS (BAR CHART) */}
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

          {/* 🔥 LIST TUGAS MENDESAK (FILTERED) */}
          <View style={styles.listHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="alert-circle" size={20} color={colors.error} style={{marginRight: 6}} />
              <Text style={styles.sectionTitle}>Tugas Mendesak</Text>
              {urgentTasks.length > 0 && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>{urgentTasks.length}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Tugas')}>
              <Text style={styles.linkText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableCard}>
            {urgentTasks.length > 0 ? urgentTasks.map((ticket: TicketWithSLA, index) => {
              const statusStyle = getStatusStyle(ticket.status);
              const slaInfo = ticket.sla_due ? getSlaTimeRemaining(ticket.sla_due) : null;
              
              // Tentukan tipe tiket
              const rawType = (ticket.type || '').toLowerCase();
              let normalizedType = 'incident';
              if (rawType.includes('permintaan') || rawType.includes('request')) {
                normalizedType = 'request';
              }

              return (
                <TouchableOpacity 
                  key={ticket.id} 
                  style={[
                    styles.tableRow, 
                    index === urgentTasks.length - 1 && { borderBottomWidth: 0 },
                    slaInfo?.isOverdue && styles.overdueRow
                  ]}
                  onPress={() => {
                    navigation.navigate('TechnicianTicketDetail', {
                      ticketId: ticket.id,
                      ticketType: normalizedType,
                    });
                  }}
                >
                  <View style={{flex: 1, paddingRight: 10}}>
                    <View style={{flexDirection:'row', alignItems:'center', marginBottom: 4}}>
                      <Text style={styles.tableId}>
                        #{ticket.ticket_number || ticket.id}
                      </Text>
                      <View style={styles.dotSeparator} />
                      <Text style={styles.tableType}>
                        {normalizedType === 'request' ? 'PERMINTAAN' : 'PENGADUAN'}
                      </Text>
                    </View>
                    
                    <Text style={styles.tableTitle} numberOfLines={2}>{ticket.title}</Text>
                    
                    {/* 🔥 SLA WARNING */}
                    {slaInfo && (
                      <View style={[styles.slaWarning, { backgroundColor: slaInfo.isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)' }]}>
                        <Ionicons 
                          name={slaInfo.isOverdue ? "time" : "timer"} 
                          size={12} 
                          color={slaInfo.color} 
                          style={{marginRight: 4}}
                        />
                        <Text style={[styles.slaText, { color: slaInfo.color }]}>
                          {slaInfo.text}
                        </Text>
                      </View>
                    )}
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
                 <Text style={{color: colors.text.secondary, marginTop: 5, textAlign: 'center'}}>
                   Tidak ada tugas mendesak saat ini.{'\n'}
                   Semua tiket dalam batas SLA yang aman.
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
  urgentBadge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8
  },
  urgentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: theme.fontFamily.poppins.bold
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
  overdueRow: {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.5)',
  },
  tableId: { 
    fontSize: 11, 
    color: colors.primary, 
    fontFamily: theme.fontFamily.poppins.bold 
  },
  dotSeparator: {
    width: 3, 
    height: 3, 
    borderRadius: 1.5, 
    backgroundColor: colors.text.tertiary, 
    marginHorizontal: 6
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
    marginTop: 2,
    marginBottom: 6
  },
  slaWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  slaText: {
    fontSize: 10,
    fontFamily: theme.fontFamily.poppins.bold
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