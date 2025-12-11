import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Linking, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

// CLEAN CODE: Hapus import useFonts karena sudah diload global
// Hapus import font files juga

import { useTheme } from '../../context/ThemeContext_OLD';
import CustomHeader from '../../components/CustomHeader';
import { MOCK_ARTICLES } from '../../data/mockData';

export default function InformationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, isDarkMode } = useTheme();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null); 
  const [isViewAll, setIsViewAll] = useState(false);

  // CLEAN CODE: Hapus useFonts hook
  // Font sudah siap dari App.tsx

  // --- LOGIC DATA ---
  const getDataToRender = () => {
    let data = MOCK_ARTICLES;

    if (searchQuery) {
      return data.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (activeFilter) {
      return data.filter(item => item.category === activeFilter);
    }
    
    if (!isViewAll) {
      return data.slice(0, 4); 
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

  // CLEAN CODE: Hapus if (!fontsLoaded) return null;

  const textColor = isDarkMode ? '#FFFFFF' : '#053F5C';
  const cardBg = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const searchBg = isDarkMode ? '#333333' : '#F5F5F5';
  const itemBg = isDarkMode ? '#2C2C2C' : '#F8F8F8';

  const isFocusMode = !!searchQuery || !!activeFilter || isViewAll;

  const getListTitle = () => {
    if (searchQuery) return 'Hasil Pencarian';
    if (activeFilter) return activeFilter; 
    if (isViewAll) return 'Semua Pertanyaan';
    return 'Pertanyaan Terbaru';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
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
        <View style={[styles.searchBox, { backgroundColor: searchBg }]}>
          {isFocusMode ? (
            <TouchableOpacity onPress={handleReset}>
              <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#AAA' : '#053F5C'} />
            </TouchableOpacity>
          ) : (
            <Ionicons name="search" size={24} color={isDarkMode ? '#AAA' : '#053F5C'} />
          )}
          
          <TextInput 
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Cari Pertanyaan atau topik"
            placeholderTextColor={isDarkMode ? '#888' : 'rgba(85, 86, 87, 0.5)'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* KATEGORI */}
        {!isFocusMode && (
          <>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Bantuan dan Panduan</Text>
            <View style={styles.categoryContainer}>
              <TouchableOpacity style={[styles.catCard, { backgroundColor: cardBg }]} onPress={() => handleCategoryPress('Pengaduan & Permintaan')}>
                <Ionicons name="ticket-outline" size={32} color="#0E638C" style={{ opacity: 0.71 }} />
                <Text style={[styles.catText, { color: textColor }]}>Pengaduan & Permintaan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.catCard, { backgroundColor: cardBg }]} onPress={() => handleCategoryPress('Proses & Tindak Lanjut')}>
                <MaterialCommunityIcons name="check-decagram-outline" size={32} color="#FF9500" />
                <Text style={[styles.catText, { color: textColor }]}>Proses & Tindak Lanjut</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.catCard, { backgroundColor: cardBg }]} onPress={() => handleCategoryPress('Informasi Layanan')}>
                <Ionicons name="information-circle" size={32} color="#C64747" />
                <Text style={[styles.catText, { color: textColor }]}>Informasi Layanan</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* LIST PERTANYAAN */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: textColor, marginBottom: 0 }]}>
            {getListTitle()}
          </Text>
          {!isFocusMode && (
            <TouchableOpacity onPress={() => setIsViewAll(true)}>
              <Text style={styles.seeAllText}>Lihat semua</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.listContainer}>
          {getDataToRender().map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.questionItem, { backgroundColor: itemBg }]}
              onPress={() => navigation.navigate('InformationDetail', { articleId: item.id })}
            >
              <Text style={[styles.questionText, { color: textColor }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={textColor} />
            </TouchableOpacity>
          ))}
          
          {getDataToRender().length === 0 && (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
              Tidak ada hasil ditemukan.
            </Text>
          )}
        </View>

        {/* FOOTER */}
        {!isFocusMode && (
          <View style={styles.footerSection}>
            <Text style={[styles.footerTitle, { color: textColor }]}>Butuh Bantuan Lebih Lanjut?</Text>
            <View style={styles.helpButtonRow}>
              <TouchableOpacity style={styles.helpButtonLeft}>
                <View style={styles.iconCircleBlack}>
                  <Ionicons name="chatbubble-ellipses" size={14} color="#FFF" />
                </View>
                <Text style={styles.helpButtonTextBlue}>Chat Helpdesk</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpButtonRight} onPress={handleWhatsApp}>
                <View style={styles.iconCircleGreen}>
                  <Ionicons name="logo-whatsapp" size={14} color="#FFF" />
                </View>
                <Text style={styles.helpButtonTextBlue}>Hubungi WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: hp('5%') }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('12%'), 
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12, 
    paddingHorizontal: 15, height: hp('6.5%'), marginBottom: hp('3%'),
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  searchInput: {
    flex: 1, marginLeft: 10, fontFamily: 'Poppins_700Bold', fontSize: RFValue(12),
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(14), marginBottom: hp('1.5%'), textAlign: 'left',
  },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: hp('1.5%'), marginTop: hp('2%'),
  },
  seeAllText: {
    fontFamily: 'Poppins_500Medium', fontSize: RFValue(12), color: 'rgba(5, 63, 92, 0.72)', 
  },
  categoryContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  catCard: {
    width: wp('28%'), height: wp('28%'), borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', padding: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  catText: {
    fontFamily: 'Poppins_500Medium', fontSize: RFValue(10), textAlign: 'center', marginTop: 8,
  },
  listContainer: {
    gap: hp('1.2%'),
  },
  questionItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 12, borderRadius: 11, 
  },
  questionText: {
    fontFamily: 'Inter_400Regular', fontSize: RFValue(12), flex: 1, marginRight: 10,
  },
  footerSection: {
    marginTop: hp('3%'), alignItems: 'center',
  },
  footerTitle: {
    fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(14), marginBottom: hp('2%'), textAlign: 'center',
  },
  helpButtonRow: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 10,
  },
  helpButtonLeft: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0E7EF',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10, justifyContent: 'center',
  },
  helpButtonRight: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0E7EF',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10, justifyContent: 'center',
  },
  iconCircleBlack: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#000000',
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  iconCircleGreen: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#25D366', 
    justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  helpButtonTextBlue: {
    fontFamily: 'Poppins_500Medium', fontSize: RFValue(11), color: '#053F5C',
  },
});