import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ Fix import

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
}

export default function CustomHeader({ 
  type, 
  userName, 
  userUnit, 
  title, 
  onNotificationPress,
  showNotificationButton = false 
}: CustomHeaderProps) {
  
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // 1. Ambil Theme & Auth dari Store Baru
  const { isDark, toggleTheme, theme, colors } = useTheme();
  const { isGuest } = useAuthStore();

  // 2. Logic Notifikasi: Sembunyikan jika Guest
  const shouldShowNotification = (type === 'home' || showNotificationButton) && !isGuest;

  return (
    <ImageBackground 
      source={require('../../assets/all-header.png')} 
      style={[styles.headerContainer, { paddingTop: insets.top + 10 }]} 
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* === BAGIAN ATAS (Top Row) === */}
      <View style={styles.topRow}>
        
        {/* KIRI ATAS */}
        <View style={styles.topLeftContainer}>
          {type === 'home' ? (
            <View>
              <Text style={styles.greetingText}>Selamat Datang,</Text>
              <Text style={styles.userNameText} numberOfLines={1}>{userName || 'Pengguna'}</Text>
              {userUnit && (
                <Text style={styles.userUnitText} numberOfLines={1}>{userUnit}</Text> 
              )}
            </View>
          ) : (
            <View /> 
          )}
        </View>

        {/* KANAN ATAS */}
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

      {/* === BAGIAN BAWAH === */}
      {type === 'page' ? (
        <View style={styles.bottomRow}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButtonCircle}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.pageTitle} numberOfLines={1}>
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
    minHeight: hp(18), // Sedikit lebih pendek agar rapi
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    justifyContent: 'space-between', 
    flexDirection: 'column',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    width: '100%',
  },
  
  topLeftContainer: {
    flex: 1, 
    justifyContent: 'center',
    paddingRight: 10,
  },
  
  // GUNAKAN FONT FAMILY STRING LANGSUNG (Pastikan nama ini sama dengan di useCachedResources)
  greetingText: {
    fontFamily: 'Poppins-Medium', // Ganti Inter ke Poppins biar konsisten
    fontSize: 12,
    color: '#E0E0E0', 
  },
  userNameText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: -2,
  },
  userUnitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11, 
    color: '#81C3D7', 
    marginTop: -2,
  },

  topRightContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5, 
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
    flex: 1, 
  },
});