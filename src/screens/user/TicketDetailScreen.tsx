import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TICKETS } from '../../data/mockData';

export default function TicketDetailScreen() {
  const route = useRoute<any>();
  // Tambahkan type generic <any> agar tidak error di TypeScript saat navigate
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { ticketId } = route.params;

  // Cari data tiket berdasarkan ID yang dikirim
  const ticket = MOCK_TICKETS.find(t => t.id === ticketId);

  if (!ticket) return <View style={styles.container}><Text>Tiket tidak ditemukan</Text></View>;

  const handleReopen = () => {
    Alert.alert(
      "Reopen Tiket",
      "Apakah masalah ini muncul kembali? Tiket akan dibuka ulang.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Reopen", onPress: () => Alert.alert("Sukses", "Status tiket berubah menjadi OPEN.") }
      ]
    );
  };

  const handleChat = () => {
    // Navigasi ke ChatScreen sambil bawa ID Tiket
    navigation.navigate('Chat', { 
      ticketId: ticket.id, 
      ticketTitle: ticket.title 
    });
  };

  const handleSurvey = () => {
    navigation.navigate('SatisfactionSurvey', { ticketId: ticket.id });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header Status */}
        <View style={styles.headerBanner}>
          <Text style={styles.ticketId}>{ticket.ticketNumber}</Text>
          <Text style={styles.statusLabel}>{ticket.status.toUpperCase().replace('_', ' ')}</Text>
        </View>

        {/* INDIKATOR SCAN QR (JIKA ADA) */}
        {ticket.title.includes('Laporan Aset:') && (
          <View style={styles.qrBadgeContainer}>
            <Ionicons name="qr-code-outline" size={20} color="#2e7d32" />
            <Text style={styles.qrBadgeText}>Tiket dibuat melalui Scan QR Aset</Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Judul & Deskripsi */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detail Laporan</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Judul:</Text>
              <Text style={styles.value}>{ticket.title}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Kategori:</Text>
              <Text style={styles.value}>{ticket.type === 'incident' ? 'Insiden' : 'Permintaan'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>OPD:</Text>
              <Text style={styles.value}>{ticket.opd}</Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.label}>Deskripsi:</Text>
              <Text style={styles.descText}>{ticket.description}</Text>
            </View>
          </View>

          {/* Timeline / Riwayat (Dummy Visual) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Riwayat Status</Text>
            
            <View style={styles.timelineItem}>
              <View style={styles.dotActive} />
              <View>
                <Text style={styles.timelineTitle}>Tiket Dibuat</Text>
                <Text style={styles.timelineDate}>03 Des 2025, 08:00</Text>
              </View>
            </View>

            <View style={styles.timelineLine} />

            <View style={styles.timelineItem}>
              <View style={[styles.dotActive, {backgroundColor: ticket.status !== 'pending' ? '#007AFF' : '#ddd'}]} />
              <View>
                <Text style={styles.timelineTitle}>Ditugaskan ke Teknisi</Text>
                <Text style={styles.timelineDate}>{ticket.status !== 'pending' ? '03 Des 2025, 09:30' : '-'}</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Bottom Actions (YANG BENAR HANYA SATU INI) */}
      <View style={styles.bottomBar}>
          {/* Tombol Chat (Kecil - Ikon Saja) */}
          <TouchableOpacity style={styles.chatBtn} onPress={handleChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#007AFF" />
          </TouchableOpacity>

          {/* Logic Tombol Utama (Survey / Reopen / Menunggu) */}
          {ticket.status === 'closed' ? (
            <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
              {/* Tombol Reopen (Kecil/Warning) */}
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#d32f2f', flex: 0.4 }]} onPress={handleReopen}>
                <Text style={styles.actionText}>Reopen</Text>
              </TouchableOpacity>

              {/* Tombol Survey (Besar/Utama) */}
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFD700', flex: 1 }]} onPress={handleSurvey}>
                <Text style={[styles.actionText, { color: '#333' }]}>★ Beri Ulasan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#ccc'}]} disabled>
              <Text style={styles.actionText}>Menunggu Proses</Text>
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerBanner: { backgroundColor: '#007AFF', padding: 20, paddingTop: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  ticketId: { color: '#fff', fontSize: 14, opacity: 0.8 },
  statusLabel: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { width: 80, color: '#666', fontSize: 14 },
  value: { flex: 1, color: '#333', fontWeight: '500', fontSize: 14 },
  descText: { color: '#333', lineHeight: 20, marginTop: 5, backgroundColor: '#fafafa', padding: 10, borderRadius: 8 },

  // Timeline Styles
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  timelineLine: { height: 20, width: 2, backgroundColor: '#ddd', marginLeft: 6, marginVertical: 2 },
  dotActive: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#28a745', marginRight: 10 },
  timelineTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  timelineDate: { fontSize: 12, color: '#999' },

  // Bottom Bar Styles
  bottomBar: { backgroundColor: '#fff', padding: 15, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  chatBtn: { marginRight: 15, padding: 10, borderRadius: 8, backgroundColor: '#f0f7ff' }, // Style chat ikon saja
  // chatText: { color: '#007AFF', marginLeft: 5, fontWeight: '600' }, // (Tidak dipakai lagi di desain baru)
  
  actionBtn: { flex: 1, backgroundColor: '#d32f2f', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold' },

  // QR Badge
  qrBadgeContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#e8f5e9', padding: 10, marginHorizontal: 20, marginTop: -20,
    borderRadius: 8, borderWidth: 1, borderColor: '#c8e6c9', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1
  },
  qrBadgeText: { marginLeft: 10, color: '#2e7d32', fontWeight: '600' },
});