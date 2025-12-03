import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CurrentUser } from '../../data/Session';
import { MOCK_USERS, MOCK_TICKETS } from '../../data/mockData';

export default function TechnicianHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const techId = CurrentUser.userId;
  const techData = MOCK_USERS.find(u => u.id === techId);

  // --- LOGIC DATA ---
  const myTickets = MOCK_TICKETS.filter(t => t.technicianId === techId);

  // 1. Hitung Data untuk 5 Card
  const stats = {
    new: myTickets.filter(t => t.status === 'pending').length,
    waitSeksi: myTickets.filter(t => t.status === 'waiting_seksi').length,
    waitBidang: myTickets.filter(t => t.status === 'waiting_bidang').length,
    ready: myTickets.filter(t => t.status === 'ready').length,
    working: myTickets.filter(t => t.status === 'in_progress').length,
  };

  // 2. Data untuk Pie Chart (Tugas Baru, Menunggu Approval, Sedang Dikerjakan)
  const pieData = {
    waiting: stats.waitSeksi + stats.waitBidang,
    working: stats.working,
    new: stats.new + stats.ready, // Kita gabung 'new' dan 'ready' sebagai tugas baru masuk
  };
  const totalPie = pieData.waiting + pieData.working + pieData.new || 1; // Avoid division by zero

  // 3. Table List (3 Terbaru yg butuh tindakan)
  const actionList = myTickets
    .filter(t => ['pending', 'waiting_seksi', 'ready', 'in_progress'].includes(t.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // --- RENDER COMPONENTS ---

  const renderCard = (title: string, count: number, color: string, icon: any) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View>
        <Text style={styles.cardCount}>{count}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dashboard Kerja</Text>
          <Text style={styles.name}>{techData?.name || 'Teknisi'}</Text>
        </View>
        <Ionicons name="construct" size={30} color="#fff" />
      </View>

      <View style={styles.content}>
        
        {/* 1. AREA PENGERJAAN (5 CARDS GRID) */}
        <Text style={styles.sectionTitle}>Ringkasan Tugas</Text>
        <View style={styles.gridContainer}>
          {renderCard('Tugas Baru', stats.new, '#ff9800', 'alert')}
          {renderCard('Apprv Seksi', stats.waitSeksi, '#9c27b0', 'time')}
          {renderCard('Apprv Bidang', stats.waitBidang, '#673ab7', 'hourglass')}
          {renderCard('Siap Kerja', stats.ready, '#2196f3', 'play')}
          {renderCard('Dikerjakan', stats.working, '#4caf50', 'hammer')}
        </View>

        {/* 2. PIE CHART KOMPOSISI (SIMULASI CSS) */}
        <Text style={styles.sectionTitle}>Komposisi Tugas</Text>
        <View style={styles.chartCard}>
          {/* Visual Bar Chart sederhana sebagai ganti Pie Chart (biar tanpa library berat) */}
          <View style={styles.chartRow}>
            <View style={{ flex: pieData.waiting, backgroundColor: '#9c27b0', height: 20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} />
            <View style={{ flex: pieData.working, backgroundColor: '#4caf50', height: 20 }} />
            <View style={{ flex: pieData.new, backgroundColor: '#2196f3', height: 20, borderTopRightRadius: 10, borderBottomRightRadius: 10 }} />
          </View>
          
          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, {backgroundColor: '#9c27b0'}]} />
              <Text style={styles.legendText}>Approval ({Math.round((pieData.waiting/totalPie)*100)}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, {backgroundColor: '#4caf50'}]} />
              <Text style={styles.legendText}>Dikerjakan ({Math.round((pieData.working/totalPie)*100)}%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, {backgroundColor: '#2196f3'}]} />
              <Text style={styles.legendText}>Baru ({Math.round((pieData.new/totalPie)*100)}%)</Text>
            </View>
          </View>
        </View>

        {/* 3. TABLE LIST TUGAS MENUNGGU TINDAKAN */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Menunggu Tindakan</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TechnicianApp', { screen: 'Tugas' })}>
            <Text style={styles.linkText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableCard}>
          {actionList.length > 0 ? actionList.map((ticket, index) => (
            <TouchableOpacity 
              key={ticket.id} 
              style={[styles.tableRow, index === actionList.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => navigation.navigate('TicketDetail', { ticketId: ticket.id })}
            >
              <View style={{flex: 1}}>
                <Text style={styles.tableId}>{ticket.ticketNumber}</Text>
                <Text style={styles.tableTitle} numberOfLines={1}>{ticket.title}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                 <View style={[styles.statusPill, 
                    ticket.status === 'ready' ? {backgroundColor: '#e3f2fd', borderColor: '#2196f3'} :
                    ticket.status === 'in_progress' ? {backgroundColor: '#e8f5e9', borderColor: '#4caf50'} :
                    {backgroundColor: '#fff3e0', borderColor: '#ff9800'}
                 ]}>
                    <Text style={[styles.statusText,
                      ticket.status === 'ready' ? {color: '#1565c0'} :
                      ticket.status === 'in_progress' ? {color: '#2e7d32'} :
                      {color: '#ef6c00'}
                    ]}>{ticket.status.replace('_', ' ').toUpperCase()}</Text>
                 </View>
                 <Text style={styles.tableDate}>2 jam lalu</Text>
              </View>
            </TouchableOpacity>
          )) : (
            <Text style={{padding: 20, textAlign: 'center', color: '#999'}}>Tidak ada tugas mendesak.</Text>
          )}
        </View>

      </View>
      <View style={{height: 30}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#263238', padding: 25, paddingTop: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#b0bec5', fontSize: 14, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  
  // Grid Cards
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, elevation: 2 },
  iconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  cardCount: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardTitle: { fontSize: 11, color: '#666' },

  // Chart
  chartCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  chartRow: { flexDirection: 'row', height: 20, width: '100%', marginBottom: 15, borderRadius: 10, overflow: 'hidden' },
  legendContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: { fontSize: 12, color: '#555' },

  // Table
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  linkText: { color: '#007AFF', fontSize: 12, fontWeight: 'bold' },
  tableCard: { backgroundColor: '#fff', borderRadius: 10, elevation: 2 },
  tableRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', justifyContent: 'space-between', alignItems: 'center' },
  tableId: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  tableTitle: { fontSize: 14, color: '#333', fontWeight: '600' },
  tableDate: { fontSize: 10, color: '#ccc', marginTop: 2 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1, marginBottom: 2 },
  statusText: { fontSize: 8, fontWeight: 'bold' },
});