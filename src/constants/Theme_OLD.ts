// src/constants/Theme.ts
const tintColorLight = '#053F5C';
const tintColorDark = '#FF9500';

export const Colors = {
  light: {
    // Canvas
    background: '#FFFFFF',
    card: '#FFFFFF',
    header: '#FFFFFF',
    
    // Text
    text: '#053F5C',        // Biru Tua Brand
    subText: '#687076',     // Abu Modern
    placeholder: '#9BA1A6',
    inverseText: '#FFFFFF', // Teks putih di atas background gelap

    // Components
    border: '#E5E7EB',
    inputBg: '#F9FAFB',
    icon: '#053F5C',

    // Branding
    primary: '#053F5C',    
    secondary: '#FF9500',  // Kuning/Oranye
    success: '#2E7D32',
    danger: '#D32F2F',
    warning: '#ED6C02',
    info: '#0288D1',
    
    // Navigation
    tint: tintColorLight,
    tabIconDefault: '#B0BEC5',
    tabIconSelected: tintColorLight,
    tabBarBackground: '#E9ECEF',
  },
  dark: {
    // Canvas
    background: '#121212', 
    card: '#1E1E1E',       
    header: '#1E1E1E',
    
    // Text
    text: '#FFFFFF',
    subText: '#A1A1AA',
    placeholder: '#555555',
    inverseText: '#000000',

    // Components
    border: '#2C2C2C',
    inputBg: '#2C2C2C',
    icon: '#FFFFFF',

    // Branding
    primary: '#053F5C',     // Tetap biru atau bisa dicerahkan '#4DA3FF'
    secondary: '#FF9500',   
    success: '#4CAF50',
    danger: '#EF5350',
    warning: '#FF9800',
    info: '#29B6F6',
    
    // Navigation
    tint: tintColorDark,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    tabBarBackground: '#1E1E1E',
  },
};

// Pengganti SIZES. Gunakan ini untuk margin/padding agar konsisten.
export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  radius: {
    s: 8,
    m: 12,
    l: 20,
    circle: 999,
  }
};

export default { Colors, SPACING };