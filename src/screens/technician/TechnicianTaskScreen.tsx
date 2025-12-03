import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_TICKETS } from '../../data/mockData';
import { CurrentUser } from '../../data/Session';

export default function TechnicianTaskScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const techId = CurrentUser.userId;

  // Filter States
  const [activeType, setActiveType] = useState<'incident' | 'request'>('incident');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // FILTER LOGIC
  const getTasks = () => {
    let data = MOCK_TICKETS.filter(t => t.technicianId === techId);

    // 1. Filter Type
    data = data.filter(t => t.type === activeType);

    // 2. Search (Judul atau No Tiket)
    if (searchQuery) {
      data = data.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Status Dropdown
    if (statusFilter !== 'All') {
      data = data.filter(t => t.status === statusFilter);
    }

    return data;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#2196f3';
      case 'in_progress': return '#4caf50';
      case 'waiting_seksi': return '#9c27b0';
      default: return '#757575';
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.ticketId}>{item.ticketNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.opd}>🏢 {item.opd}</Text>

      <TouchableOpacity 
        style={styles.detailButton}
        onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
      >
        <Text style={styles.detailText}>Lihat Detail</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengerjaan Tiket</Text>
      </View>

      {/* 1. TABS PENGADUAN / PERMINTAAN */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tabBtn, activeType==='incident' && styles.tabActive]} onPress={() => setActiveType('incident')}>
          <Text style={[styles.tabText, activeType==='incident' && styles.tabTextActive]}>Pengaduan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeType==='request' && styles.tabActive]} onPress={() => setActiveType('request')}>
          <Text style={[styles.tabText, activeType==='request' && styles.tabTextActive]}>Permintaan</Text>
        </TouchableOpacity>
      </View>

      {/* 2. SEARCH & DROPDOWN */}
      <View style={styles.filterContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput 
            style={styles.input} 
            placeholder="Cari Judul / ID..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Dropdown Trigger */}
        <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowStatusDropdown(!showStatusDropdown)}>
          <Ionicons name="filter" size={18} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Content */}
      {showStatusDropdown && (
        <View style={styles.dropdownMenu}>
          {['All', 'ready', 'in_progress', 'waiting_seksi', 'resolved'].map(status => (
            <TouchableOpacity key={status} style={styles.dropdownItem} onPress={() => { setStatusFilter(status); setShowStatusDropdown(false); }}>
              <Text>{status === 'All' ? 'Semua Status' : status.replace('_', ' ').toUpperCase()}</Text>
              {statusFilter === status && <Ionicons name="checkmark" size={16} color="blue" />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={getTasks()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{alignItems:'center', marginTop: 50}}>
            <Text style={{color: '#999'}}>Tidak ada tiket ditemukan.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },

  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20 },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#007AFF' },
  tabText: { color: '#888', fontWeight: '600' },
  tabTextActive: { color: '#007AFF' },

  filterContainer: { flexDirection: 'row', padding: 15, alignItems: 'center', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 8, alignItems: 'center', elevation: 1 },
  input: { flex: 1, marginLeft: 10 },
  dropdownTrigger: { backgroundColor: '#fff', padding: 12, borderRadius: 8, elevation: 1 },

  dropdownMenu: { position: 'absolute', top: 125, right: 20, width: 200, backgroundColor: '#fff', borderRadius: 8, elevation: 5, zIndex: 10, padding: 5 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between' },

  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  ticketId: { fontWeight: 'bold', color: '#555' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  opd: { fontSize: 12, color: '#666', marginBottom: 15 },
  detailButton: { backgroundColor: '#007AFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8 },
  detailText: { color: '#fff', fontWeight: 'bold', marginRight: 5 },
});