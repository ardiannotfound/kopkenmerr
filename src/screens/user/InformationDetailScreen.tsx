import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Share, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- API ---
import { kbApi } from '../../services/api/kb';

export default function InformationDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  
  // 1. Ambil Theme
  const { colors, isDark } = useTheme();
  
  // Ambil ID dari params
  const { articleId } = route.params;

  // State Data
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 2. Load Data (Simulasi API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // UNCOMMENT JIKA API SUDAH READY:
        // const response = await kbApi.getDetail(articleId);
        // setArticle(response.data);

        // MOCK DATA SEMENTARA (Agar tidak blank saat dijalankan)
        setTimeout(() => {
          setArticle({
            id: articleId,
            title: 'Cara Membuat Pengaduan Baru',
            category: 'Panduan Pengguna',
            date: '10 Des 2025',
            content: `Untuk membuat pengaduan baru, ikuti langkah-langkah berikut:\n\n1. Buka halaman Beranda.\n2. Pilih menu "Lapor Insiden".\n3. Isi formulir dengan detail masalah yang Anda alami.\n4. Lampirkan foto bukti jika ada.\n5. Tekan tombol Kirim.\n\nTim kami akan segera memverifikasi laporan Anda.`
          });
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  // Logic Share
  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        message: `${article.title}\n\n${article.content}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Loading View
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Not Found View
  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text.secondary }}>Artikel tidak ditemukan</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* 1. HEADER */}
      <CustomHeader 
        type="page" 
        title="Detail Informasi" 
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* 2. KONTEN (Card Melengkung) */}
      <View style={[styles.contentCard, { backgroundColor: colors.background.card }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          
          {/* JUDUL & SHARE ICON */}
          <View style={styles.titleRow}>
            <Text style={[styles.articleTitle, { color: colors.text.primary }]}>
              {article.title}
            </Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Ionicons 
                name="share-social-outline" 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {/* META SECTION (Tanggal & Kategori) */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
              {article.date}
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.text.tertiary }]} />
            <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
              {article.category}
            </Text>
          </View>

          {/* Divider Tipis */}
          <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

          {/* ISI KONTEN */}
          <Text style={[styles.articleBody, { color: colors.text.secondary }]}>
            {article.content}
          </Text>
          
          {/* Dummy Text Tambahan (Biar kelihatan panjang scrollnya) */}
          <Text style={[styles.articleBody, { color: colors.text.secondary, marginTop: 15 }]}>
            Jika masalah berlanjut, Anda dapat menghubungi tim support kami melalui fitur Chat Helpdesk atau WhatsApp yang tersedia di halaman Pusat Informasi.
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
  
  // Card Putih Melengkung yang menimpa Header
  contentCard: {
    flex: 1,
    borderTopLeftRadius: BorderRadius['2xl'], // 30
    borderTopRightRadius: BorderRadius['2xl'],
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    marginTop: -hp(2), // Efek Overlap
  },

  // TITLE SECTION
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  articleTitle: {
    flex: 1, 
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.xl, // Scaled 20
    textAlign: 'left',
    lineHeight: 28,
    marginRight: 10,
  },
  shareButton: {
    padding: 5,
    marginTop: -2, 
  },

  // META SECTION
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  metaText: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.xs,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
    opacity: 0.5
  },

  divider: {
    height: 1,
    marginBottom: hp(3),
    opacity: 0.6,
  },

  // BODY TEXT
  articleBody: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm, // Scaled 14/15
    textAlign: 'left',
    lineHeight: 26, // Jarak antar baris nyaman dibaca
  },
});