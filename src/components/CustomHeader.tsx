import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '../context/ThemeContext';

// Import Fonts
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';

interface CustomHeaderProps {
  type: 'home' | 'page';
  userName?: string; 
  userUnit?: string;
  title?: string;    
  onNotificationPress?: () => void;
}

export default function CustomHeader({ 
  type, 
  userName, 
  title, 
  onNotificationPress 
}: CustomHeaderProps) {
  
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();

  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return <View style={styles.placeholder} />;

  return (
    <ImageBackground 
      source={require('../../assets/all-header.png')} 
      style={[styles.headerContainer, type === 'page' && styles.headerPageHeight]}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* --- BARIS 1: Greeting & Right Buttons --- */}
      <View style={styles.topRow}>
        
        {/* KIRI: Greeting (Hanya di Home) */}
        <View style={styles.greetingContainer}>
          {type === 'home' && (
            <Text style={styles.greetingText} numberOfLines={1}>
              Selamat Datang, {userName || 'Pengguna'}
            </Text>
          )}
        </View>

        {/* KANAN: Action Buttons (Selalu Ada) */}
        <View style={styles.rightContainer}>
          
          {/* Button Dark Mode */}
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={styles.circleButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={RFValue(18)} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          {/* Button Notifikasi */}
          <TouchableOpacity 
            onPress={onNotificationPress} 
            style={styles.circleButton}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={RFValue(18)} color="#FFFFFF" />
            <View style={styles.notifDot} />
          </TouchableOpacity>

        </View>
      </View>

      {/* --- BARIS 2: Back Button & Title (Hanya di Page) --- */}
      {type === 'page' && (
        <View style={styles.bottomRow}>
          
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButtonCircle}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={RFValue(20)} color="#053F5C" />
          </TouchableOpacity>

          <Text style={styles.pageTitle} numberOfLines={1}>
            {title}
          </Text>

        </View>
      )}

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: hp('15%'),
    backgroundColor: '#053F5C',
  },
  
  // Container Utama
  headerContainer: {
    width: wp('100%'),
    // Tinggi default untuk Home
    height: hp('15%'), 
    paddingTop: hp('3%'), 
    paddingHorizontal: wp('5%'),
    justifyContent: 'flex-start', 
  },
  
  // PERBAIKAN: Tinggi header Page ditambah sedikit agar muat
  headerPageHeight: {
    height: hp('20%'), // Naik dari 18% ke 20%
  },

  // --- STYLE BARIS 1 ---
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp('1.5%'),
  },
  
  greetingContainer: {
    flex: 1, 
    justifyContent: 'center',
  },
  greetingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(14),
    color: '#F5F5F5', 
  },

  rightContainer: {
    flexDirection: 'row',
    gap: wp('3%'),
  },

  circleButton: {
    width: wp('9%'),  
    height: wp('9%'), 
    borderRadius: wp('4.5%'), 
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

  // --- STYLE BARIS 2 (Page Mode) ---
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // PERBAIKAN: Menambahkan margin top agar turun ke bawah
    marginTop: hp('2%'), 
  },

  backButtonCircle: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.63)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'), 
  },

  pageTitle: {
    fontFamily: 'Poppins_600SemiBold',
    // PERBAIKAN: Font Size diperbesar
    fontSize: RFValue(25), // Naik dari 18 ke 22
    color: '#FFFFFF', 
    flex: 1, 
  },
});