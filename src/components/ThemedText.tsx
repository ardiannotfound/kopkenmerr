import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext_OLD';
import { RFValue } from 'react-native-responsive-fontsize';

interface ThemedTextProps extends TextProps {
  variant?: 'heading' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  fontType?: 'poppins' | 'konkhmer'; // Opsi manual jika ingin ganti font
}

export default function ThemedText({ 
  style, 
  variant = 'body', 
  color, 
  align = 'left', 
  fontType, 
  ...props 
}: ThemedTextProps) {
  const { colors } = useTheme();

  // Mapping Gaya Font Berdasarkan Varian
  const getStyle = () => {
    switch (variant) {
      // 1. Heading Besar (Misal: Judul di Splash/Login)
      case 'heading': 
        return { 
          fontSize: RFValue(24), 
          // Kita panggil nama alias yang sudah kita set di useCachedResources
          fontFamily: fontType === 'poppins' ? 'Poppins-Bold' : 'Konkhmer-Bold',
          lineHeight: RFValue(36)
        };

      // 2. Judul Halaman (Misal: "Buat Pengaduan")
      case 'title': 
        return { 
          fontSize: RFValue(18), 
          fontFamily: 'Poppins-Bold',
          marginBottom: 4 
        };
      
      // 3. Subjudul (Misal: Judul Section)
      case 'subtitle': 
        return { 
          fontSize: RFValue(16), 
          fontFamily: 'Poppins-SemiBold',
          marginBottom: 2
        };
      
      // 4. Label Form (Tulisan di atas Input)
      case 'label': 
        return { 
          fontSize: RFValue(12), 
          fontFamily: 'Poppins-Medium',
          marginBottom: 4
        };
      
      // 5. Teks Kecil (Misal: Copyright, Timestamp)
      case 'caption': 
        return { 
          fontSize: RFValue(10), 
          fontFamily: 'Poppins-Regular' 
        };
      
      // 6. Isi Paragraf Normal (Default)
      case 'body': 
      default: 
        return { 
          fontSize: RFValue(14), 
          fontFamily: 'Poppins-Regular' 
        };
    }
  };

  // Tentukan warna default: 
  // Caption & Label warnanya abu (subText), sisanya warna utama (text)
  const defaultColor = (variant === 'caption' || variant === 'label') ? colors.subText : colors.text;

  return (
    <Text 
      style={[
        getStyle(), 
        { 
          color: color || defaultColor, 
          textAlign: align 
        },
        style // Style tambahan dari luar akan menimpa default jika perlu
      ]} 
      {...props} 
    />
  );
}