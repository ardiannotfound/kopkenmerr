import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TICKETS, Ticket } from '../../data/mockData';
import { CurrentUser } from '../../data/Session'; // Cek Role User

export default function TicketListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const userRole = CurrentUser.role;

  // --- STATE UNTUK MASYARAKAT (GUEST) ---
  const [searchId, setSearchId] = useState('');
  const [guestSearchResult, setGuestSearchResult] = useState<Ticket[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // --- STATE UNTUK PEGAWAI (EMPLOYEE) ---
  const [activeTab, setActiveTab] = useState<'incident' | 'request'>('incident'); // Filter Tipe
  const [statusFilter, setStatusFilter] = useState('All'); // Filter Status
  const [showStatusDropdown, setShowStatusDropdown] = useState(false); // Toggle Dropdown

  // === LOGIC MASYARAKAT: SEARCH BY ID ===
  const handleGuestSearch = () => {
    if (!searchId.trim()) {
      Alert.alert("Error", "Mohon masukkan Nomor Tiket.");
      return;
    }
    
    setHasSearched(true);
    // Filter Exact Match (Harus sama persis dengan ticketNumber)
    const result = MOCK_TICKETS.filter(
      t => t.ticketNumber.toLowerCase() === searchId.toLowerCase().trim()
    );
    setGuestSearchResult(result);
  };

  // === LOGIC PEGAWAI: FILTER LIST ===
  const getEmployeeData = () => {
    let data = MOCK_TICKETS;

    // 1. Filter User (Tampilkan tiket milik user ini saja)
    // Di real app: data = data.filter(t => t.requesterId === CurrentUser.userId);
    // Tapi untuk MVP Mock kita tampilkan semua biar kelihatan datanya

    // 2. Filter Tipe (Pengaduan vs Permintaan)
    data = data.filter(t => t.type === activeTab);

    // 3. Filter Status (Dropdown)
    if (statusFilter !== 'All') {
      data = data.filter(t => t.status === statusFilter);
    }

    return data;
  };

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800'; 
      case 'in_progress': return '#2196f3'; 
      case 'resolved': return '#4caf50'; 
      case 'closed': return '#9e9e9e'; 
      default: return '#333';
    }
  };

  // --- RENDER ITEM TIKET ---
  const renderItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{item.type === 'incident' ? 'INSIDEN' : 'REQUEST'}</Text>
        </View>
        <Text style={styles.date}>ID: {item.ticketNumber}</Text>
      </View>
      
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.footer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase().replace('_', ' ')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* === TAMPILAN MASYARAKAT (GUEST) === */}
      {userRole === 'guest' ? (
        <View style={styles.guestContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchLabel}>Lacak Status Tiket</Text>
            <Text style={styles.searchSubLabel}>Masukkan Nomor ID Tiket Anda untuk melihat status terkini.</Text>
            
            <TextInput 
              style={styles.input}
              placeholder="Contoh: INC-202312-001"
              value={searchId}
              onChangeText={setSearchId}
              autoCapitalize="characters"
            />
            
            <TouchableOpacity style={styles.searchBtn} onPress={handleGuestSearch}>
              <Ionicons name="search" size={20} color="#fff" style={{marginRight: 10}} />
              <Text style={styles.searchBtnText}>Cari Tiket</Text>
            </TouchableOpacity>
          </View>

          {/* HASIL PENCARIAN GUEST */}
          <FlatList
            data={guestSearchResult}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              hasSearched ? (
                <View style={styles.emptyState}>
                  <Ionicons name="close-circle-outline" size={50} color="#d32f2f" />
                  <Text style={styles.emptyText}>Tiket tidak ditemukan.</Text>
                  <Text style={styles.emptySub}>Pastikan ID Tiket yang Anda masukkan benar.</Text>
                </View>
              ) : null
            }
          />
        </View>
      ) : (
        // === TAMPILAN PEGAWAI (EMPLOYEE) ===
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Daftar Tiket Saya</Text>
          </View>

          {/* 1. FILTER TIPE (TABS) */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'incident' && styles.tabBtnActive]} 
              onPress={() => setActiveTab('incident')}
            >
              <Text style={[styles.tabText, activeTab === 'incident' && styles.tabTextActive]}>Pengaduan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'request' && styles.tabBtnActive]} 
              onPress={() => setActiveTab('request')}
            >
              <Text style={[styles.tabText, activeTab === 'request' && styles.tabTextActive]}>Permintaan</Text>
            </TouchableOpacity>
          </View>

          {/* 2. FILTER STATUS (CUSTOM DROPDOWN) */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <TouchableOpacity 
              style={styles.dropdownTrigger} 
              onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Text style={styles.dropdownText}>
                {statusFilter === 'All' ? 'Semua Status' : statusFilter.toUpperCase().replace('_', ' ')}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#333" />
            </TouchableOpacity>
          </View>

          {/* DROPDOWN MENU (Muncul jika ditoggle) */}
          {showStatusDropdown && (
            <View style={styles.dropdownMenu}>
              {['All', 'pending', 'in_progress', 'resolved', 'closed'].map((status) => (
                <TouchableOpacity 
                  key={status} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                  }}
                >
                  <Text style={{color: statusFilter === status ? '#007AFF' : '#333'}}>
                    {status === 'All' ? 'Semua Status' : status.toUpperCase().replace('_', ' ')}
                  </Text>
                  {statusFilter === status && <Ionicons name="checkmark" size={16} color="#007AFF" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* LIST PEGAWAI */}
          <FlatList
            data={getEmployeeData()}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="file-tray-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Belum ada tiket.</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  
  // Styles Shared (Card)
  listContent: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeTag: { backgroundColor: '#e3f2fd', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 10, fontWeight: 'bold', color: '#1976d2' },
  date: { fontSize: 12, color: '#888' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  desc: { fontSize: 14, color: '#666', marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  // Styles Guest (Search)
  guestContainer: { flex: 1 },
  searchBox: { backgroundColor: '#007AFF', padding: 25, paddingTop: 60, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, marginBottom: 10 },
  searchLabel: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  searchSubLabel: { fontSize: 14, color: '#e3f2fd', marginBottom: 20 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 15, fontSize: 16, marginBottom: 15 },
  searchBtn: { backgroundColor: '#004ba0', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 8 },
  searchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  // Empty State
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#333', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  emptySub: { color: '#666', fontSize: 14, marginTop: 5 },

  // Styles Pegawai
  header: { padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  
  // Tabs
  tabContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#007AFF' },
  tabText: { fontSize: 16, color: '#999', fontWeight: '600' },
  tabTextActive: { color: '#007AFF' },

  // Dropdown Filter
  filterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#f0f2f5' },
  filterLabel: { marginRight: 10, color: '#666' },
  dropdownTrigger: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  dropdownText: { marginRight: 5, fontSize: 14, color: '#333', fontWeight: '500' },
  
  dropdownMenu: { position: 'absolute', top: 155, left: 70, backgroundColor: '#fff', width: 200, borderRadius: 8, elevation: 5, zIndex: 10, padding: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between' },
});