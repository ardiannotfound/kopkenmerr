import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 1. PALET WARNA (Bisa diganti nanti sesuai brand identity)
export const COLORS = {
  primary: '#0061F2',    // Biru Utama (Professional Blue)
  primaryDark: '#0049B5', // Biru Gelap (untuk tombol tekan)
  secondary: '#6900F2',  // Ungu (Aksen)
  accent: '#00CC96',     // Hijau (Sukses/Aman)
  warning: '#F2994A',    // Orange (Pending/Warning)
  danger: '#EB5757',     // Merah (Error/Danger)

  brandColor: '#053F5C',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray100: '#F8F9FA', // Background Terang
  gray200: '#E9ECEF', // Border/Divider
  gray300: '#DEE2E6', // Disabled
  gray500: '#ADB5BD', // Placeholder Text
  gray700: '#495057', // Body Text
  gray900: '#212529', // Heading Text
  
  // Transparan
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
};

// 2. UKURAN & SPACING (Responsive)
export const SIZES = {
  // Global
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font Sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // App Dimensions
  width,
  height,
};

// 3. FONT STYLE (Bisa disesuaikan jika install font custom)
export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: 'bold' as 'bold', color: COLORS.black },
  h2: { fontSize: SIZES.h2, fontWeight: 'bold' as 'bold', color: COLORS.black },
  h3: { fontSize: SIZES.h3, fontWeight: '600' as '600', color: COLORS.black },
  h4: { fontSize: SIZES.h4, fontWeight: '600' as '600', color: COLORS.black },
  body3: { fontSize: SIZES.body3, color: COLORS.gray700 },
  body4: { fontSize: SIZES.body4, color: COLORS.gray700 },
  body5: { fontSize: SIZES.body5, color: COLORS.gray500 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;