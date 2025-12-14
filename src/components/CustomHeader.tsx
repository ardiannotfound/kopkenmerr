import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS DARI SYSTEM BARU ---
import { useTheme } from '../hooks/useTheme';
import { wp, hp, Spacing } from '../styles/spacing';
import { FontSize } from '../styles/typography';
import { useAuthStore } from '../store/authStore';

interface CustomHeaderProps {
  type: 'home' | 'page';
  userName?: string; 
  userUnit?: string; 
  title?: string;    
  onNotificationPress?: () => void;
  showNotificationButton?: boolean;
  onBackPress?: () => void; // ✅ TAMBAHAN: Custom Back Action
}

export default function CustomHeader({ 
  type, 
  userName, 
  userUnit, 
  title, 
  onNotificationPress,
  showNotificationButton = false,
  onBackPress // ✅ Destructure prop baru
}: CustomHeaderProps) {
  
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // 1. Ambil Theme & Auth dari Store Baru
  const { isDark, toggleTheme, theme, colors } = useTheme();
  const { isGuest } = useAuthStore();

  // 2. Logic Notifikasi: Sembunyikan jika Guest
  const shouldShowNotification = (type === 'home' || showNotificationButton) && !isGuest;

  // 3. ✅ Logic Tombol Kembali (Custom vs Default)
  const handleBack = () => {
    if (onBackPress) {
      onBackPress(); // Jalankan logic custom (misal: reset form)
    } else {
      navigation.goBack(); // Default navigasi mundur
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/all-header.png')} 
      style={[styles.headerContainer, { paddingTop: insets.top + 10 }]} 
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* === BAGIAN ATAS (Top Row) === */}
      <View style={styles.topRow}>
        
        {/* KIRI ATAS: DATA USER */}
        <View style={styles.topLeftContainer}>
          {type === 'home' ? (
            <View>
              <Text style={styles.greetingText}>Selamat Datang,</Text>
              
              {/* ✅ FIX: Nama User Boleh 2 Baris agar tidak terpotong */}
              <Text style={styles.userNameText} numberOfLines={2} adjustsFontSizeToFit>
                {userName || 'Pengguna'}
              </Text>
              
              {userUnit && (
                <Text style={styles.userUnitText} numberOfLines={2}>
                  {userUnit}
                </Text> 
              )}
            </View>
          ) : (
            <View /> 
          )}
        </View>

        {/* KANAN ATAS: TOMBOL AKSI */}
        <View style={styles.topRightContainer}>
          {/* Dark Mode Button */}
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={styles.circleButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDark ? "sunny" : "moon"} 
              size={18} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          {/* Notification Button */}
          {shouldShowNotification && (
            <TouchableOpacity 
              onPress={onNotificationPress} 
              style={styles.circleButton}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* === BAGIAN BAWAH: JUDUL HALAMAN === */}
      {type === 'page' ? (
        <View style={styles.bottomRow}>
          <TouchableOpacity 
            onPress={handleBack} // ✅ Gunakan handleBack yg sudah diperbaiki
            style={styles.backButtonCircle}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.pageTitle} numberOfLines={1} adjustsFontSizeToFit>
            {title}
          </Text>
        </View>
      ) : (
        <View style={{ height: hp(5) }} /> 
      )}

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: wp(100),
    // Gunakan minHeight agar background bisa memanjang jika nama user 2 baris
    minHeight: hp(18), 
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    justifyContent: 'space-between', 
    flexDirection: 'column',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align start penting agar tombol kanan tetap di atas meski nama panjang
    width: '100%',
  },
  
  topLeftContainer: {
    flex: 1, // ✅ Flex 1 agar mengambil sisa ruang yang ada
    justifyContent: 'center',
    paddingRight: 15, // Jarak aman agar teks tidak menabrak tombol kanan
  },
  
  greetingText: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 12,
    color: '#E0E0E0', 
    marginBottom: 2,
  },
  userNameText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18, // Ukuran font tetap terbaca jelas
    color: '#FFFFFF',
    lineHeight: 24, // Spasi baris agar tidak dempet jika 2 baris
  },
  userUnitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11, 
    color: '#81C3D7', 
    marginTop: 2,
    lineHeight: 14,
  },

  topRightContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 0, // Reset margin top agar sejajar dengan baris pertama teks
  },

  circleButton: {
    width: 36,  
    height: 36, 
    borderRadius: 18, 
    backgroundColor: 'rgba(217, 217, 217, 0.39)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5252',
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },

  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12, 
  },

  pageTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20, 
    color: '#FFFFFF', 
    flex: 1, // Agar judul tidak nabrak jika sangat panjang
  },
});