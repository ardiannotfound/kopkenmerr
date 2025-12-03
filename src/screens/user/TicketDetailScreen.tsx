import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Linking, Platform 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TICKETS } from '../../data/mockData';
import { CurrentUser } from '../../data/Session';

export default function TicketDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { ticketId } = route.params;
  
  // Ambil Role User saat ini
  const userRole = CurrentUser.role;

  // Cari data tiket
  const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
  const [workNotes, setWorkNotes] = useState('');

  if (!ticket) return <View style={styles.container}><Text>Tiket tidak ditemukan</Text></View>;

  // --- LOGIC MAPS (NAVIGASI) ---
  const openMap = () => {
    if (!ticket.location) {
      Alert.alert("Info", "Lokasi peta belum diset untuk tiket ini.");
      return;
    }
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${ticket.location.lat},${ticket.location.lng}`;
    const label = ticket.opd;
    
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Tidak dapat membuka aplikasi peta.");
    }
  };

  // --- HANDLERS UNTUK TEKNISI ---
  const handleStartWork = () => {
    Alert.alert("Mulai Pengerjaan", "Waktu SLA akan mulai dihitung. Lanjutkan?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Mulai", onPress: () => {
        Alert.alert("Sukses", "Status berubah menjadi 'Sedang Dikerjakan'.");
        navigation.goBack(); 
      }}
    ]);
  };

  const handleFinishWork = () => {
    if(!workNotes) { Alert.alert("Error", "Mohon isi catatan aktivitas/solusi."); return; }
    
    Alert.alert("Selesaikan Tiket", "Pastikan solusi sudah teruji. Tiket akan ditutup.", [
      { text: "Batal", style: "cancel" },
      { text: "Selesai", onPress: () => {
        Alert.alert("Sukses", "Tiket diselesaikan (Resolved).");
        navigation.goBack();
      }}
    ]);
  };

  // --- HANDLERS UNTUK USER/GUEST ---
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
        {/* 1. HEADER STATUS */}
        <View style={styles.headerBanner}>
          <Text style={styles.ticketId}>{ticket.ticketNumber}</Text>
          <Text style={styles.statusLabel}>{ticket.status.toUpperCase().replace('_', ' ')}</Text>
        </View>

        {/* 2. INDIKATOR SCAN QR (JIKA ADA) */}
        {ticket.title.includes('Laporan Aset:') && (
          <View style={styles.qrBadgeContainer}>
            <Ionicons name="qr-code-outline" size={20} color="#2e7d32" />
            <Text style={styles.qrBadgeText}>Tiket dibuat melalui Scan QR Aset</Text>
          </View>
        )}

        <View style={styles.content}>
          
          {/* 3. TOMBOL NAVIGASI PETA (MUNCUL JIKA ADA LOKASI) */}
          {ticket.location && (
            <TouchableOpacity style={styles.mapButton} onPress={openMap}>
              <View style={{flex: 1}}>
                <Text style={styles.mapTitle}>LOKASI INSIDEN</Text>
                <Text style={styles.mapAddress}>{ticket.location.address}</Text>
              </View>
              <View style={styles.mapIconBox}>
                <Ionicons name="navigate" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          )}

          {/* 4. CARD DETAIL UTAMA */}
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
            {/* Tampilkan Alamat Text juga di sini agar lengkap */}
            {ticket.location && (
               <View style={styles.row}>
                 <Text style={styles.label}>Alamat:</Text>
                 <Text style={styles.value}>{ticket.location.address}</Text>
               </View>
            )}
            <View style={{marginTop: 10}}>
              <Text style={styles.label}>Deskripsi:</Text>
              <Text style={styles.descText}>{ticket.description}</Text>
            </View>
          </View>

          {/* 5. AREA KHUSUS TEKNISI (SLA & WORK LOG) */}
          {userRole === 'technician' && (
             <View style={styles.card}>
               <Text style={styles.cardTitle}>Informasi SLA</Text>
               <View style={styles.row}>
                 <Text style={styles.label}>Target Respon:</Text>
                 <Text style={styles.value}>2 Jam</Text>
               </View>
               <View style={styles.row}>
                 <Text style={styles.label}>Target Selesai:</Text>
                 <Text style={styles.value}>8 Jam (Medium)</Text>
               </View>
               {ticket.slaStart && (
                 <View style={[styles.row, {marginTop: 5}]}>
                    <Text style={[styles.label, {color: '#2e7d32'}]}>Mulai Kerja:</Text>
                    <Text style={[styles.value, {color: '#2e7d32'}]}>03 Des 2025, 09:00</Text>
                 </View>
               )}
             </View>
           )}

           {userRole === 'technician' && ticket.status === 'in_progress' && (
             <View style={styles.card}>
               <Text style={styles.cardTitle}>Aktivitas Pengerjaan</Text>
               <Text style={styles.label}>Catatan Solusi / Aktivitas:</Text>
               <TextInput 
                 style={styles.inputArea} 
                 multiline 
                 placeholder="Jelaskan langkah perbaikan..." 
                 value={workNotes}
                 onChangeText={setWorkNotes}
               />
               <TouchableOpacity style={styles.uploadBtn}>
                 <Ionicons name="camera" size={20} color="#007AFF" />
                 <Text style={{color: '#007AFF', marginLeft: 10}}>Upload Bukti Perbaikan</Text>
               </TouchableOpacity>
             </View>
           )}

          {/* 6. TIMELINE STATUS */}
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

      {/* 7. BOTTOM ACTION BAR (Dynamic based on Role) */}
      <View style={styles.bottomBar}>
        
        {/* A. TOMBOL UNTUK TEKNISI */}
        {userRole === 'technician' ? (
          <>
            <TouchableOpacity style={styles.chatBtn} onPress={handleChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#007AFF" />
            </TouchableOpacity>

            {ticket.status === 'ready' && (
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#2196f3'}]} onPress={handleStartWork}>
                <Text style={styles.actionText}>▶ Mulai Kerjakan</Text>
              </TouchableOpacity>
            )}
            
            {ticket.status === 'in_progress' && (
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#4caf50'}]} onPress={handleFinishWork}>
                <Text style={styles.actionText}>✓ Selesaikan Tiket</Text>
              </TouchableOpacity>
            )}

            {(ticket.status === 'resolved' || ticket.status === 'closed') && (
              <View style={[styles.actionBtn, {backgroundColor: '#ccc'}]}>
                 <Text style={styles.actionText}>Tiket Selesai</Text>
              </View>
            )}
            
            {ticket.status === 'pending' && (
              <View style={[styles.actionBtn, {backgroundColor: '#ff9800'}]}>
                 <Text style={styles.actionText}>Menunggu Approval</Text>
              </View>
            )}
          </>
        ) : (
          // B. TOMBOL UNTUK PEGAWAI / MASYARAKAT
          <>
            <TouchableOpacity style={styles.chatBtn} onPress={handleChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#007AFF" />
            </TouchableOpacity>

            {ticket.status === 'closed' || ticket.status === 'resolved' ? (
              <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#d32f2f', flex: 0.4 }]} onPress={handleReopen}>
                  <Text style={styles.actionText}>Reopen</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FFD700', flex: 1 }]} onPress={handleSurvey}>
                  <Text style={[styles.actionText, { color: '#333' }]}>★ Beri Ulasan</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#ccc'}]} disabled>
                <Text style={styles.actionText}>Menunggu Proses</Text>
              </TouchableOpacity>
            )}
          </>
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
  label: { width: 100, color: '#666', fontSize: 14 },
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
  chatBtn: { marginRight: 15, padding: 10, borderRadius: 8, backgroundColor: '#f0f7ff' }, 
  actionBtn: { flex: 1, backgroundColor: '#d32f2f', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold' },

  // QR Badge
  qrBadgeContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#e8f5e9', padding: 10, marginHorizontal: 20, marginTop: -20,
    borderRadius: 8, borderWidth: 1, borderColor: '#c8e6c9', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1
  },
  qrBadgeText: { marginLeft: 10, color: '#2e7d32', fontWeight: '600' },

  // Map Button
  mapButton: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15,
    elevation: 2, borderLeftWidth: 5, borderLeftColor: '#f57c00'
  },
  mapTitle: { fontSize: 12, color: '#f57c00', fontWeight: 'bold', textTransform: 'uppercase' },
  mapAddress: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 2 },
  mapIconBox: { backgroundColor: '#f57c00', padding: 8, borderRadius: 8 },

  // Technician Form
  inputArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, minHeight: 80, textAlignVertical: 'top', backgroundColor: '#fafafa', marginBottom: 10 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderWidth: 1, borderColor: '#007AFF', borderStyle: 'dashed', borderRadius: 8 }
});