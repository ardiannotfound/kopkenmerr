import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Linking, Alert, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- API & DATA ---
import { kbApi } from '../../services/api/kb';

export default function InformationScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  
  // State
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null); 
  const [isViewAll, setIsViewAll] = useState(false);

  // --- LOAD DATA ---
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      // Panggil API KB
      // const response = await kbApi.getAll(); 
      // setArticles(response.data);
      
      // MOCK DATA SEMENTARA (Sampai API Ready)
      setTimeout(() => {
        setArticles([
          { id: 1, title: 'Cara Membuat Pengaduan Baru', category: 'Pengaduan & Permintaan' },
          { id: 2, title: 'Berapa lama tiket saya diproses?', category: 'Proses & Tindak Lanjut' },
          { id: 3, title: 'Lupa Password Akun', category: 'Informasi Layanan' },
          { id: 4, title: 'Menghubungi Helpdesk via WA', category: 'Informasi Layanan' },
          { id: 5, title: 'Perbedaan Insiden dan Request', category: 'Pengaduan & Permintaan' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // --- FILTER LOGIC ---
  const getFilteredData = () => {
    let data = articles;

    if (searchQuery) {
      return data.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (activeFilter) {
      return data.filter(item => item.category === activeFilter);
    }
    
    if (!isViewAll) {
      return data.slice(0, 4); // Limit 4 item di awal
    }
    return data;
  };

  const handleCategoryPress = (category: string) => {
    setActiveFilter(category);
    setSearchQuery(''); 
    setIsViewAll(true); 
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveFilter(null);
    setIsViewAll(false);
  };

  const handleWhatsApp = () => {
    const url = `whatsapp://send?phone=628123456789&text=Halo Helpdesk Siladan...`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Error', 'WhatsApp tidak terinstall.');
    });
  };

  const isFocusMode = !!searchQuery || !!activeFilter || isViewAll;

  const getListTitle = () => {
    if (searchQuery) return 'Hasil Pencarian';
    if (activeFilter) return activeFilter; 
    if (isViewAll) return 'Semua Pertanyaan';
    return 'Pertanyaan Terbaru';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <CustomHeader 
        type="page"
        title={isFocusMode ? "Pencarian" : "Pusat Informasi"}
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        
        {/* SEARCH BAR */}
        <View style={[
          styles.searchBox, 
          { backgroundColor: colors.background.card } // Adaptif Dark Mode
        ]}>
          {isFocusMode ? (
            <TouchableOpacity onPress={handleReset}>
              <Ionicons name="arrow-back" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={24} color={colors.text.secondary} />
          )}
          
          <TextInput 
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Cari Pertanyaan atau topik"
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* KATEGORI (Hanya tampil di awal) */}
        {!isFocusMode && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Bantuan dan Panduan
            </Text>
            <View style={styles.categoryContainer}>
              {/* Cat 1 */}
              <TouchableOpacity 
                style={[styles.catCard, { backgroundColor: colors.background.card }]} 
                onPress={() => handleCategoryPress('Pengaduan & Permintaan')}
              >
                <Ionicons name="ticket-outline" size={32} color="#0E638C" style={{ opacity: 0.8 }} />
                <Text style={[styles.catText, { color: colors.text.primary }]}>Pengaduan & Permintaan</Text>
              </TouchableOpacity>
              
              {/* Cat 2 */}
              <TouchableOpacity 
                style={[styles.catCard, { backgroundColor: colors.background.card }]} 
                onPress={() => handleCategoryPress('Proses & Tindak Lanjut')}
              >
                <MaterialCommunityIcons name="check-decagram-outline" size={32} color="#FF9500" />
                <Text style={[styles.catText, { color: colors.text.primary }]}>Proses & Tindak Lanjut</Text>
              </TouchableOpacity>
              
              {/* Cat 3 */}
              <TouchableOpacity 
                style={[styles.catCard, { backgroundColor: colors.background.card }]} 
                onPress={() => handleCategoryPress('Informasi Layanan')}
              >
                <Ionicons name="information-circle" size={32} color="#C64747" />
                <Text style={[styles.catText, { color: colors.text.primary }]}>Informasi Layanan</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* LIST PERTANYAAN */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: 0 }]}>
            {getListTitle()}
          </Text>
          {!isFocusMode && (
            <TouchableOpacity onPress={() => setIsViewAll(true)}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Lihat semua</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List Content */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.listContainer}>
            {getFilteredData().map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.questionItem, { backgroundColor: colors.background.card }]}
                onPress={() => navigation.navigate('InformationDetail', { articleId: item.id })}
              >
                <Text style={[styles.questionText, { color: colors.text.primary }]} numberOfLines={2}>
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
            
            {getFilteredData().length === 0 && (
              <Text style={{ textAlign: 'center', marginTop: 20, color: colors.text.secondary }}>
                Tidak ada hasil ditemukan.
              </Text>
            )}
          </View>
        )}

        {/* FOOTER */}
        {!isFocusMode && (
          <View style={styles.footerSection}>
            <Text style={[styles.footerTitle, { color: colors.text.primary }]}>
              Butuh Bantuan Lebih Lanjut?
            </Text>
            <View style={styles.helpButtonRow}>
              
              <TouchableOpacity style={[styles.helpButton, { backgroundColor: isDark ? '#333' : '#E0E7EF' }]}>
                <View style={[styles.iconCircle, { backgroundColor: '#000' }]}>
                  <Ionicons name="chatbubble-ellipses" size={14} color="#FFF" />
                </View>
                <Text style={[styles.helpButtonText, { color: isDark ? '#FFF' : '#053F5C' }]}>
                  Chat Helpdesk
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.helpButton, { backgroundColor: isDark ? '#333' : '#E0E7EF' }]} 
                onPress={handleWhatsApp}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="logo-whatsapp" size={14} color="#FFF" />
                </View>
                <Text style={[styles.helpButtonText, { color: isDark ? '#FFF' : '#053F5C' }]}>
                  Hubungi WA
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        )}

        <View style={{ height: hp(10) }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  contentContainer: {
    paddingHorizontal: wp(6),
    paddingTop: hp(2),
    paddingBottom: hp(5), 
  },
  
  // Search Box
  searchBox: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: BorderRadius.lg, 
    paddingHorizontal: Spacing.md, 
    height: hp(6.5), 
    marginBottom: Spacing.lg,
    ...Shadow.sm, // Shadow standar
  },
  searchInput: {
    flex: 1, 
    marginLeft: 10, 
    fontFamily: FontFamily.poppins.medium, 
    fontSize: FontSize.sm,
  },

  // Titles
  sectionTitle: {
    fontFamily: FontFamily.poppins.semibold, 
    fontSize: FontSize.md, 
    marginBottom: Spacing.sm, 
    textAlign: 'left',
  },
  sectionHeaderRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: Spacing.sm, 
    marginTop: Spacing.md,
  },
  seeAllText: {
    fontFamily: FontFamily.poppins.medium, 
    fontSize: FontSize.xs, 
  },

  // Categories Grid
  categoryContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  catCard: {
    width: wp(28), 
    height: wp(28), 
    borderRadius: BorderRadius.lg,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 8,
    ...Shadow.sm,
  },
  catText: {
    fontFamily: FontFamily.poppins.medium, 
    fontSize: 10, 
    textAlign: 'center', 
    marginTop: 8,
  },

  // List Items
  listContainer: {
    gap: Spacing.sm,
  },
  questionItem: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.md, 
    borderRadius: BorderRadius.md, 
  },
  questionText: {
    fontFamily: FontFamily.poppins.regular, 
    fontSize: FontSize.sm, 
    flex: 1, 
    marginRight: 10,
  },

  // Footer Buttons
  footerSection: {
    marginTop: Spacing.xl, 
    alignItems: 'center',
  },
  footerTitle: {
    fontFamily: FontFamily.poppins.semibold, 
    fontSize: FontSize.md, 
    marginBottom: Spacing.sm, 
    textAlign: 'center',
  },
  helpButtonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    gap: 10,
  },
  helpButton: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: BorderRadius.lg, 
    paddingVertical: 12, 
    paddingHorizontal: 10, 
    justifyContent: 'center',
  },
  iconCircle: {
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 8,
  },
  helpButtonText: {
    fontFamily: FontFamily.poppins.medium, 
    fontSize: FontSize.xs, 
  },
});