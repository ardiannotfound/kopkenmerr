import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- IMPORTS DARI DESIGN SYSTEM BARU ---
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

export default function RoleSelectionScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Ambil colors DAN isDark
  const { colors, isDark } = useTheme(); 
  const { guestLogin } = useAuthStore();

  const handleGuest = () => {
    guestLogin(); 
  };

  const handleLogin = () => {
    navigation.navigate('Login'); 
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background.primary} 
      />

      {/* 1. AREA GAMBAR */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/role-selection.png')} 
          style={styles.image}
        />
      </View>

      {/* 2. AREA KONTEN */}
      <View style={styles.contentContainer}>
        
        {/* Title & Subtitle */}
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Pilih Peran Anda
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Silahkan Masuk Sesuai Peran Anda
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonWrapper}>
          
          {/* Button 1: Login Pegawai (Primary) */}
          <TouchableOpacity 
            style={[styles.btnPrimary, { backgroundColor: colors.primary }]} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={[styles.btnPrimaryText, { color: colors.white }]}>
              Login sebagai Pegawai
            </Text>
          </TouchableOpacity>

          {/* Button 2: Masuk Tamu (Secondary) */}
          <TouchableOpacity 
            style={[
              styles.btnSecondary, 
              { 
                // PERBAIKAN DISINI:
                // Jika Dark Mode -> Paksa Putih agar kontras
                // Jika Light Mode -> Pakai warna secondary default (abu muda)
                backgroundColor: isDark ? colors.white : colors.button.secondary 
              }
            ]} 
            onPress={handleGuest}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.btnSecondaryText, 
              { 
                // Teks tetap Primary (Biru Gelap) agar terbaca di atas putih/abu muda
                color: colors.primary 
              }
            ]}>
              Masuk sebagai Tamu
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
    height: hp(55), 
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(4), 
  },
  image: {
    width: wp(85), 
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
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.poppins.medium, 
    fontSize: FontSize.base, 
    textAlign: 'center',
  },

  // Tombol
  buttonWrapper: {
    width: '100%',
    gap: hp(2), 
  },
  
  // Button Primary
  btnPrimary: {
    borderRadius: BorderRadius.lg, 
    paddingVertical: hp(2), 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...Shadow.sm, 
  },
  btnPrimaryText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
  },

  // Button Secondary
  btnSecondary: {
    borderRadius: BorderRadius.lg, 
    paddingVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnSecondaryText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
  },
});