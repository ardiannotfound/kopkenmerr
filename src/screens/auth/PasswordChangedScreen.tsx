import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar 
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

// --- IMPORTS SYSTEM BARU ---
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, ButtonHeight } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

export default function PasswordChangedScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Ambil Theme
  const { colors, isDark } = useTheme();

  const handleFinish = () => {
    // Reset navigasi agar user tidak bisa tekan 'Back' ke form
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background.primary} 
      />

      {/* 1. AREA GAMBAR (50% Layar) */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/password.png')} 
          style={styles.image}
        />
      </View>

      {/* 2. AREA KONTEN */}
      <View style={styles.contentContainer}>
        
        {/* Teks Informasi */}
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Kata Sandi Berhasil Diubah
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Kata sandi Anda telah berhasil diperbarui. 
            Silakan masuk kembali menggunakan kredensial baru Anda.
          </Text>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={[styles.btnPrimary, { backgroundColor: colors.primary }]} 
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <Text style={[styles.btnText, { color: colors.white }]}>
              LOGIN SEKARANG
            </Text>
          </TouchableOpacity>
        </View>

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

  // Typography
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
    fontSize: FontSize.sm, 
    textAlign: 'center',
    lineHeight: 22, 
  },

  // Button
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
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnText: {
    fontFamily: FontFamily.poppins.semibold, 
    fontSize: FontSize.md,
    letterSpacing: 0.5, 
  },
});