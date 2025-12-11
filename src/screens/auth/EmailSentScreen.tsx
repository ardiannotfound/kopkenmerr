import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// --- IMPORTS SYSTEM BARU ---
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, ButtonHeight } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

export default function EmailSentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // 1. Ambil Data Email dari Screen Sebelumnya
  const userEmail = route.params?.email || 'email Anda';

  // 2. Ambil Theme
  const { colors, isDark } = useTheme();

  const handleClose = () => {
    // Kembali ke Login (PopToTop agar stack bersih)
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* StatusBar menyesuaikan tema */}
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background.primary} 
      />

      {/* 1. AREA GAMBAR */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/email-sent.png')} 
          style={styles.image}
        />
      </View>

      {/* 2. AREA KONTEN */}
      <View style={styles.contentContainer}>
        
        {/* Title & Subtitle */}
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Email Reset Terkirim
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Kami telah mengirimkan instruksi reset password ke:
          </Text>
          {/* Tampilkan Email User agar lebih informatif */}
          <Text style={[styles.emailText, { color: colors.primary }]}>
            {userEmail}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary, marginTop: 5 }]}>
            Silakan periksa inbox atau folder spam Anda.
          </Text>
        </View>

        {/* Tombol Tutup */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={[styles.btnPrimary, { backgroundColor: colors.primary }]} 
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.btnText, { color: colors.white }]}>
              Kembali ke Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Simulasi (Hapus nanti saat production) */}
        <TouchableOpacity 
          style={{ marginTop: 20, alignSelf: 'center' }} 
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
            [DEV: Buka Link Reset]
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // --- IMAGE SECTION ---
  imageContainer: {
    height: hp(50),
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(5),
  },
  image: {
    width: wp(80),
    height: hp(40),
    resizeMode: 'contain',
  },

  // --- CONTENT SECTION ---
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(7),
    justifyContent: 'flex-start',
  },

  // Teks
  textWrapper: {
    alignItems: 'center',
    marginBottom: hp(5),
  },
  title: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize['2xl'], 
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.poppins.medium, 
    fontSize: FontSize.base, 
    textAlign: 'center',
    lineHeight: 24, 
  },
  emailText: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: 5,
  },

  // Tombol
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  
  btnPrimary: {
    borderRadius: BorderRadius['2xl'], 
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10), 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    height: ButtonHeight.lg,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnText: {
    fontFamily: FontFamily.poppins.medium, 
    fontSize: FontSize.md,
  },
});