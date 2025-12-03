import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ARTICLES, Article } from '../../data/mockData';

export default function InformationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'Popular' | 'All' | string>('Popular');

  // Logic Filtering
  const getFilteredData = () => {
    let data = MOCK_ARTICLES;

    // 1. Filter by Search Text
    if (searchQuery) {
      data = data.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 2. Filter by Category Button
    if (activeFilter === 'Popular' && !searchQuery) {
      // Jika mode Popular & tidak ngetik search -> Ambil yg isPopular = true
      return data.filter(item => item.isPopular);
    } else if (activeFilter !== 'All' && activeFilter !== 'Popular') {
      // Jika filter kategori spesifik dipilih
      return data.filter(item => item.category === activeFilter);
    }
    
    // Jika 'All' atau sedang search -> Kembalikan semua hasil yg cocok
    return data;
  };

  const categories = ['Pengaduan & Permintaan', 'Proses & Tindak Lanjut', 'Informasi Layanan'];

  // Render Item List
  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('InformationDetail', { articleId: item.id })}
    >
      <View style={styles.cardContent}>
        <View style={{flex: 1}}>
          <Text style={styles.categoryLabel}>{item.category}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pusat Informasi</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" style={{marginRight: 10}} />
          <TextInput 
            placeholder="Cari kendala atau panduan..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text && activeFilter === 'Popular') setActiveFilter('All'); // Auto switch ke All saat ngetik
            }}
          />
        </View>
      </View>

      {/* Filter Buttons (Horizontal Scroll) */}
      <View style={{ height: 60 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {/* Tombol Reset / Popular */}
          <TouchableOpacity 
            style={[styles.filterPill, activeFilter === 'Popular' && styles.filterPillActive]}
            onPress={() => setActiveFilter('Popular')}
          >
            <Text style={[styles.filterText, activeFilter === 'Popular' && styles.filterTextActive]}>Populer</Text>
          </TouchableOpacity>

          {/* Tombol Kategori Loop */}
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat}
              style={[styles.filterPill, activeFilter === cat && styles.filterPillActive]}
              onPress={() => setActiveFilter(cat)}
            >
              <Text style={[styles.filterText, activeFilter === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section Title Logic */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Hasil Pencarian' : activeFilter === 'Popular' ? 'Pertanyaan Populer' : activeFilter === 'All' ? 'Semua Informasi' : activeFilter}
        </Text>
        
        {/* Button Lihat Semua (Hanya muncul jika di mode Popular & tidak sedang search) */}
        {activeFilter === 'Popular' && !searchQuery && (
          <TouchableOpacity onPress={() => setActiveFilter('All')}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List Content */}
      <FlatList
        data={getFilteredData()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{alignItems:'center', marginTop: 50}}>
            <Text style={{color:'#999'}}>Tidak ada informasi ditemukan.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  searchBox: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center' },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },

  filterContainer: { paddingHorizontal: 20, alignItems: 'center', gap: 10 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 10 },
  filterPillActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#333', fontSize: 13 },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  seeAllText: { color: '#007AFF', fontSize: 14, fontWeight: '600' },

  listContent: { padding: 20, paddingTop: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  categoryLabel: { fontSize: 10, color: '#007AFF', fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
  cardTitle: { fontSize: 15, fontWeight: '500', color: '#333', lineHeight: 22 },
});