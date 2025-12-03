import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_NOTIFICATIONS, NotificationItem } from '../../data/mockData';
import { CurrentUser } from '../../data/Session'; // Ambil role user saat ini

export default function NotificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const userRole = CurrentUser.role;

  // State
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Permintaan' | 'Pengaduan'>('Semua');
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Logic Filter
  const getFilteredData = () => {
    // Jika Masyarakat (Guest), selalu tampilkan semua (abaikan filter state)
    if (userRole === 'guest') return notifications;

    // Filter Pegawai/Teknisi
    if (activeFilter === 'Semua') return notifications;
    if (activeFilter === 'Pengaduan') return notifications.filter(n => n.type === 'incident');
    if (activeFilter === 'Permintaan') return notifications.filter(n => n.type === 'request');
    return notifications;
  };

  // Logic Klik Notifikasi (Tandai sudah dibaca + Navigasi)
  const handlePress = (item: NotificationItem) => {
    // 1. Update State jadi Read
    const updatedList = notifications.map(n => 
      n.id === item.id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedList);

    // 2. Navigasi ke Detail Tiket (jika ada ticketId)
    if (item.ticketId) {
      navigation.navigate('TicketDetail', { ticketId: item.ticketId });
    }
  };

  // Render Item
  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        !item.isRead && styles.unreadCard // Style khusus belum baca
      ]}
      onPress={() => handlePress(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
            <Text style={styles.date}>{item.createdAt}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        </View>
        
        {/* Titik Biru jika belum dibaca */}
        {!item.isRead && <View style={styles.blueDot} />}
      </View>
    </TouchableOpacity>
  );

  // Empty State Component
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Belum Ada Notifikasi</Text>
      <Text style={styles.emptySubtitle}>
        Saat ini belum ada notifikasi. Semua notifikasi yang kami kirimi tampil di sini!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FILTER BUBBLES (Hanya muncul jika BUKAN Guest) */}
      {userRole !== 'guest' && (
        <View style={styles.filterContainer}>
          {['Semua', 'Permintaan', 'Pengaduan'].map((f) => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f as any)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f === 'Semua' ? 'Semua Notifikasi' : f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* LIST NOTIFIKASI */}
      <FlatList
        data={getFilteredData()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  // Filter Styles
  filterContainer: { 
    flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff' 
  },
  filterPill: { 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, 
    borderWidth: 1, borderColor: '#ddd', marginRight: 10, backgroundColor: '#fff' 
  },
  filterPillActive: { 
    backgroundColor: '#e3f2fd', borderColor: '#007AFF' 
  },
  filterText: { fontSize: 13, color: '#666' },
  filterTextActive: { color: '#007AFF', fontWeight: 'bold' },

  // List Styles
  listContent: { padding: 0 },
  card: {
    padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff'
  },
  unreadCard: {
    backgroundColor: '#f0f7ff' // Biru Muda untuk belum dibaca
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textContainer: { flex: 1, paddingRight: 10 },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  unreadText: { fontWeight: 'bold', color: '#000' },
  date: { fontSize: 12, color: '#999' },
  message: { fontSize: 14, color: '#666', lineHeight: 20 },

  // Dot Indikator
  blueDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#007AFF', marginTop: 5
  },

  // Empty State
  emptyContainer: { 
    flex: 1, alignItems: 'center', justifyContent: 'center', 
    marginTop: 100, paddingHorizontal: 40 
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 22 },
});