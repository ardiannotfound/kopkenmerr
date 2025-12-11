import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Menggunakan library icon dari package.json baru

// --- IMPORTS DARI STRUKTUR BARU ---
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { incidentApi } from '../../services/api/incidents';
import { Ticket } from '../../types/incident.types';
import { wp, hp, Spacing, BorderRadius } from '../../styles/spacing';
import { FontSize } from '../../styles/typography';

export default function TechnicianHomeScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Hook Theme (Dark Mode & Styling)
  const { theme, colors, isDark } = useTheme();
  
  // 2. Hook Auth (Data User Login)
  const { user } = useAuthStore();

  // 3. State Management
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- FETCH DATA API ---
  const loadData = useCallback(async () => {
    try {
      // Panggil API incident list
      // Nanti backend idealnya otomatis filter "My Tickets" berdasarkan Token
      const response = await incidentApi.getAll();
      
      // Jika response.data array langsung: setTickets(response)
      // Jika response.data.data (pagination): setTickets(response.data)
      // Kita assumsikan response.data (berdasarkan incidentApi yg kita buat)
      
      // Safety check: Pastikan array
      const list = Array.isArray(response) ? response : (response as any).data || [];
      setTickets(list);

    } catch (error) {
      console.error("Gagal memuat tiket:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // --- LOGIC STATISTIK (Disesuaikan dengan Status API Baru) ---
  // Status API: 'open' | 'verification' | 'triase' | 'assigned' | 'in_progress' | 'resolved'
  
  const stats = {
    // Tugas Baru (Belum diapa-apain / baru assign)
    new: tickets.filter(t => t.status === 'assigned' || t.status === 'open').length, 
    
    // Menunggu Verifikasi (Seksi/Bidang)
    waitApproval: tickets.filter(t => t.status === 'verification' || t.status === 'triase').length,
    
    // Siap Dikerjakan (Sudah assigned ke saya)
    ready: tickets.filter(t => t.status === 'assigned').length, 
    
    // Sedang Dikerjakan
    working: tickets.filter(t => t.status === 'in_progress').length,
  };

  // Data Chart
  const pieData = {
    waiting: stats.waitApproval,
    working: stats.working,
    new: stats.new, 
  };
  const totalPie = pieData.waiting + pieData.working + pieData.new || 1; 

  // List "Menunggu Tindakan" (3 Teratas)
  const actionList = tickets
    .filter(t => ['assigned', 'in_progress', 'open'].includes(t.status))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);


  // --- DYNAMIC STYLES ---
  // Kita bungkus style dalam fungsi agar bisa baca 'colors' saat theme berubah
  const styles = getStyles(theme, colors, isDark);

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

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text.secondary }}>Memuat Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dashboard Kerja</Text>
          {/* Menggunakan user?.full_name dari AuthStore */}
          <Text style={styles.name}>{user?.full_name || 'Teknisi'}</Text>
        </View>
        <Ionicons name="construct-outline" size={wp(7)} color={colors.white} />
      </View>

      <View style={styles.content}>
        
        {/* 1. AREA PENGERJAAN (GRID) */}
        <Text style={styles.sectionTitle}>Ringkasan Tugas</Text>
        <View style={styles.gridContainer}>
          {renderCard('Tugas Baru', stats.new, colors.warning, 'alert-circle')}
          {renderCard('Verifikasi', stats.waitApproval, colors.secondary, 'time')}
          {renderCard('Siap Kerja', stats.ready, colors.info, 'play')}
          {renderCard('Dikerjakan', stats.working, colors.success, 'hammer')}
        </View>

        {/* 2. PROGRESS BAR CHART (RESPONSIVE) */}
        <Text style={styles.sectionTitle}>Komposisi Tugas</Text>
        <View style={styles.chartCard}>
          {/* Bar Visual */}
          <View style={styles.chartRow}>
            <View style={{ flex: pieData.waiting, backgroundColor: colors.secondary, height: '100%' }} />
            <View style={{ flex: pieData.working, backgroundColor: colors.success, height: '100%' }} />
            <View style={{ flex: pieData.new, backgroundColor: colors.info, height: '100%' }} />
          </View>
          
          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, {backgroundColor: colors.secondary}]} />
              <Text style={styles.legendText}>Apprv ({Math.round((pieData.waiting/totalPie)*100)}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, {backgroundColor: colors.success}]} />
              <Text style={styles.legendText}>Aktif ({Math.round((pieData.working/totalPie)*100)}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, {backgroundColor: colors.info}]} />
              <Text style={styles.legendText}>Baru ({Math.round((pieData.new/totalPie)*100)}%)</Text>
            </View>
          </View>
        </View>

        {/* 3. TABLE LIST (Menunggu Tindakan) */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Menunggu Tindakan</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TechnicianApp', { screen: 'Tugas' })}>
            <Text style={styles.linkText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableCard}>
          {actionList.length > 0 ? actionList.map((ticket, index) => {
             // Logic warna status badge
             let badgeColor = colors.warning;
             let badgeBg = colors.ticket.pengaduan.background;
             if (ticket.status === 'in_progress') {
                badgeColor = colors.success;
                badgeBg = 'rgba(79, 234, 23, 0.2)';
             } else if (ticket.status === 'assigned') {
                badgeColor = colors.info;
                badgeBg = colors.ticket.permintaan.background;
             }

             return (
              <TouchableOpacity 
                key={ticket.id} 
                style={[
                  styles.tableRow, 
                  index === actionList.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => navigation.navigate('TicketDetail', { ticketId: ticket.id })}
              >
                <View style={{flex: 1, paddingRight: 10}}>
                  <Text style={styles.tableId}>{ticket.ticket_number}</Text>
                  <Text style={styles.tableTitle} numberOfLines={1}>{ticket.title}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <View style={[styles.statusPill, { backgroundColor: badgeBg, borderColor: badgeColor }]}>
                      <Text style={[styles.statusText, {color: badgeColor}]}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Text>
                  </View>
                  <Text style={styles.tableDate}>
                    {/* Simple Date Formatter */}
                    {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }) : (
            <Text style={{padding: Spacing.lg, textAlign: 'center', color: colors.text.secondary}}>
              Tidak ada tugas mendesak.
            </Text>
          )}
        </View>

      </View>
      <View style={{height: hp(5)}} />
    </ScrollView>
  );
}

// --- STYLES GENERATOR ---
const getStyles = (theme: any, colors: any, isDark: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.secondary 
  },
  header: { 
    backgroundColor: colors.primary, // Dark Mode friendly
    padding: Spacing.lg, 
    paddingTop: hp(6), // Responsive Notch
    borderBottomLeftRadius: BorderRadius.xl, 
    borderBottomRightRadius: BorderRadius.xl, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  greeting: { 
    color: colors.primaryLight, 
    fontSize: FontSize.sm, 
    fontFamily: theme.fontFamily.poppins.medium 
  },
  name: { 
    color: colors.white, 
    fontSize: FontSize.xl, 
    fontFamily: theme.fontFamily.poppins.bold 
  },
  content: { 
    padding: Spacing.lg 
  },
  
  sectionTitle: { 
    fontSize: FontSize.md, 
    fontFamily: theme.fontFamily.poppins.semibold, 
    color: colors.text.primary, 
    marginBottom: Spacing.sm, 
    marginTop: Spacing.md 
  },
  
  // Grid Cards
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: Spacing.sm 
  },
  card: { 
    width: '48%', 
    backgroundColor: colors.background.card, // Card color dynamic
    borderRadius: BorderRadius.md, 
    padding: Spacing.md, 
    marginBottom: Spacing.md, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderLeftWidth: 4, 
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  iconContainer: { 
    width: wp(8), 
    height: wp(8), 
    borderRadius: wp(4), 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: Spacing.sm 
  },
  cardCount: { 
    fontSize: FontSize.lg, 
    fontFamily: theme.fontFamily.poppins.bold, 
    color: colors.text.primary 
  },
  cardTitle: { 
    fontSize: FontSize.xs, 
    color: colors.text.secondary,
    fontFamily: theme.fontFamily.poppins.regular
  },

  // Chart
  chartCard: { 
    backgroundColor: colors.background.card, 
    padding: Spacing.md, 
    borderRadius: BorderRadius.lg, 
    marginBottom: Spacing.lg, 
    elevation: 2 
  },
  chartRow: { 
    flexDirection: 'row', 
    height: hp(2.5), 
    width: '100%', 
    marginBottom: Spacing.md, 
    borderRadius: BorderRadius.full, 
    overflow: 'hidden' 
  },
  legendContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
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
    fontSize: FontSize.xs, 
    color: colors.text.secondary,
    fontFamily: theme.fontFamily.poppins.regular
  },

  // Table
  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: Spacing.xs 
  },
  linkText: { 
    color: colors.link, 
    fontSize: FontSize.xs, 
    fontFamily: theme.fontFamily.poppins.semibold 
  },
  tableCard: { 
    backgroundColor: colors.background.card, 
    borderRadius: BorderRadius.lg, 
    elevation: 2 
  },
  tableRow: { 
    flexDirection: 'row', 
    padding: Spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border.light, 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  tableId: { 
    fontSize: FontSize.xs, 
    color: colors.text.secondary, 
    fontFamily: theme.fontFamily.poppins.medium 
  },
  tableTitle: { 
    fontSize: FontSize.sm, 
    color: colors.text.primary, 
    fontFamily: theme.fontFamily.poppins.semibold 
  },
  tableDate: { 
    fontSize: 10, 
    color: colors.text.secondary, 
    marginTop: 2,
    textAlign: 'right'
  },
  statusPill: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4, 
    borderWidth: 1, 
    marginBottom: 2 
  },
  statusText: { 
    fontSize: 8, 
    fontFamily: theme.fontFamily.poppins.bold 
  },
});