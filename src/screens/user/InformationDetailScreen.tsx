import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, StatusBar 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

import { MOCK_ARTICLES } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext_OLD';
import CustomHeader from '../../components/CustomHeader';

export default function InformationDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, isDarkMode } = useTheme();
  
  const { articleId } = route.params;
  const article = MOCK_ARTICLES.find(a => a.id === articleId);

  // Logic Share Button
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article?.title}\n\n${article?.content}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const goToNotifications = () => navigation.navigate('Notifications');

  if (!article) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: colors.text }}>Artikel tidak ditemukan</Text>
    </View>
  );

  // Warna Teks Dinamis
  const titleColor = isDarkMode ? '#FFFFFF' : '#053F5C';
  const bodyColor = isDarkMode ? '#CCCCCC' : '#053F5C'; 

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. HEADER */}
      <CustomHeader 
        type="page" 
        title="Pusat Informasi" // Judul Header Tetap "Pusat Informasi"
        showNotificationButton={true} 
        onNotificationPress={goToNotifications}
      />

      {/* 2. KONTEN (Card Putih/Gelap Melengkung) */}
      <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          
          {/* JUDUL & SHARE ICON */}
          <View style={styles.titleRow}>
            <Text style={[styles.articleTitle, { color: titleColor }]}>
              {article.title}
            </Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Ionicons name="share-social-outline" size={24} color={titleColor} />
            </TouchableOpacity>
          </View>

          {/* TANGGAL & KATEGORI (Opsional, kecil di bawah judul) */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>03 Des 2025</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{article.category}</Text>
          </View>

          <View style={styles.divider} />

          {/* ISI KONTEN */}
          <Text style={[styles.articleBody, { color: bodyColor }]}>
            {article.content}
          </Text>
          
          {/* Tambahan Dummy Text agar terlihat panjang */}
          <Text style={[styles.articleBody, { color: bodyColor, marginTop: 10 }]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentCard: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: wp('6%'),
    paddingTop: hp('4%'),
    marginTop: -hp('2%'), // Overlap Header
  },

  // TITLE SECTION
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
  },
  articleTitle: {
    flex: 1, // Agar teks tidak menabrak icon
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(18),
    textAlign: 'left',
    lineHeight: RFValue(26),
    marginRight: 10,
  },
  shareButton: {
    padding: 5,
    marginTop: -2, // Align optical dengan huruf kapital pertama
  },

  // META SECTION (Date/Category)
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  metaText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(10),
    color: '#999',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
    marginHorizontal: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: hp('3%'),
    opacity: 0.5,
  },

  // BODY
  articleBody: {
    fontFamily: 'Poppins_400Regular', // Poppins Regular sesuai request
    fontSize: RFValue(14),
    textAlign: 'left',
    lineHeight: RFValue(24), // Line height agar nyaman dibaca
  },
});