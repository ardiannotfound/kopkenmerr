import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- IMPORTS DARI DESIGN SYSTEM BARU ---
import { useTheme } from '../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow, moderateScale } from '../styles/spacing';
import { FontFamily } from '../styles/typography';

export default function AuthHeader() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // Supaya aman di HP berponi

  return (
    <View style={[
      styles.headerContainer, 
      { 
        backgroundColor: colors.primary, 
        paddingTop: insets.top + Spacing.md, // Responsif terhadap status bar
      }
    ]}>
      
      <View style={styles.contentRow}>
        {/* LOGO (Load dari lokal asset via require karena Assets.ts belum tentu ada) */}
        <Image 
          source={require('../../assets/siladan.png')} 
          style={styles.logo}
        />

        {/* TEKS CONTAINER */}
        <View style={styles.textContainer}>
          <Text 
            style={[styles.title, { color: colors.white }]} 
            numberOfLines={1} 
            adjustsFontSizeToFit
          >
            SILADAN
          </Text>
          <Text 
            style={[styles.subtitle, { color: colors.white }]} 
            numberOfLines={2} 
            adjustsFontSizeToFit 
            minimumFontScale={0.5}
          >
            Sistem Informasi Layanan dan Aduan
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: hp(30), // 30% tinggi layar
    width: wp(100), // 100% lebar layar
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius['2xl'],
    borderBottomRightRadius: BorderRadius['2xl'],
    ...Shadow.lg, // Pakai shadow preset
    paddingBottom: hp(2),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(85),
  },
  logo: {
    width: wp(25), // Responsive Width
    height: wp(25),
    resizeMode: 'contain',
  },
  textContainer: {
    marginLeft: Spacing.md, // Jarak responsive
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.khmer, // Ambil nama font dari typography.ts
    fontSize: moderateScale(30),  // Font size responsive
    marginBottom: -hp(0.5),
    textAlign: 'left',
    includeFontPadding: false,    // Fix Android text clipping
  },
  subtitle: {
    fontFamily: FontFamily.khmer,
    fontSize: moderateScale(11),
    opacity: 0.9,
    letterSpacing: -0.5,
    textAlign: 'left',
    includeFontPadding: false,
  },
});