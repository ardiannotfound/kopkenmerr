import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TICKETS } from '../../data/mockData';

export default function AssetHistoryScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { assetId } = route.params;

  // Cari riwayat tiket yang berhubungan dengan aset ini (Matching Nama/ID)
  // Logic: Cari tiket yang assetName-nya mengandung ID yang discan
  const history = MOCK_TICKETS.filter(t => 
    t.assetName && t.assetName.toLowerCase().includes(assetId.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Info Aset */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="hardware-chip-outline" size={40} color="#007AFF" />
        </View>
        <Text style={styles.assetId}>{assetId}</Text>
        <Text style={styles.assetStatus}>Status: Layak Pakai</Text>
      </View>

      <View style={styles.content}>
        {/* Detail Spesifikasi (Dummy) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spesifikasi Aset</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Lokasi:</Text>
            <Text style={styles.value}>Gudang / Ruang Server</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tahun:</Text>
            <Text style={styles.value}>2023</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Serial:</Text>
            <Text style={styles.value}>SN-{Math.floor(Math.random() * 100000)}</Text>
          </View>
        </View>

        {/* Riwayat Penanganan */}
        <Text style={styles.sectionTitle}>Riwayat Kerusakan</Text>
        
        {history.length > 0 ? history.map((ticket) => (
          <TouchableOpacity 
            key={ticket.id} 
            style={styles.historyCard}
            onPress={() => navigation.navigate('TicketDetail', { ticketId: ticket.id })}
          >
            <View style={styles.historyHeader}>
              <Text style={styles.date}>{new Date(ticket.createdAt).toLocaleDateString()}</Text>
              <View style={[styles.badge, ticket.status === 'closed' ? styles.bgGreen : styles.bgOrange]}>
                <Text style={styles.badgeText}>{ticket.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.historyTitle}>{ticket.title}</Text>
            <Text style={styles.historyTech}>Teknisi: {ticket.technicianId || '-'}</Text>
          </TouchableOpacity>
        )) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada riwayat kerusakan.</Text>
            <Text style={styles.emptySub}>Aset ini dalam kondisi prima.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  iconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e3f2fd', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  assetId: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  assetStatus: { fontSize: 14, color: '#2e7d32', fontWeight: '600', marginTop: 5 },
  
  content: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 5 },
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { width: 80, color: '#666' },
  value: { flex: 1, fontWeight: '500', color: '#333' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  
  historyCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#ccc' },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  date: { fontSize: 12, color: '#999' },
  historyTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  historyTech: { fontSize: 12, color: '#666', marginTop: 5 },
  
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  bgGreen: { backgroundColor: '#4caf50' },
  bgOrange: { backgroundColor: '#ff9800' },

  emptyState: { padding: 20, alignItems: 'center', backgroundColor: '#fff', borderRadius: 10 },
  emptyText: { fontWeight: 'bold', color: '#333' },
  emptySub: { fontSize: 12, color: '#999', marginTop: 5 }
});