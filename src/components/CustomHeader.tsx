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
  userName?: string; // Untuk Home
  userUnit?: string;
  title?: string;    // Untuk Page
  onNotificationPress?: () => void;
}

export default function CustomHeader({ 
  type, 
  userName, 
  title, 
  onNotificationPress 
}: CustomHeaderProps) {
  
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  // Load Fonts
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
              // Icon mengikuti tema (Hitam/Putih) atau Putih fix sesuai selera? 
              // Request awal: "putih/hitam mengikuti darkmode", tapi karena background header fix gambar,
              // biasanya icon tetap Putih atau warna kontras gambar. 
              // Disini saya set Putih agar aman di atas background D9D9D9 39%.
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
          
          {/* Back Button (Putih Transparan) */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButtonCircle}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={RFValue(20)} color="#053F5C" />
          </TouchableOpacity>

          {/* Page Title */}
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
    // Tinggi default untuk Home (Cukup 1 baris)
    height: hp('15%'), 
    paddingTop: hp('6%'), // Kompensasi StatusBar
    paddingHorizontal: wp('5%'),
    justifyContent: 'flex-start', // Mulai dari atas
  },
  
  // Jika tipe Page, header lebih tinggi untuk memuat 2 baris
  headerPageHeight: {
    height: hp('18%'), 
  },

  // --- STYLE BARIS 1 ---
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: hp('1.5%'), // Jarak ke baris bawah
  },
  
  greetingContainer: {
    flex: 1, // Mengambil ruang kiri
    justifyContent: 'center',
  },
  greetingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(14),
    color: '#F5F5F5', // Sesuai Request
  },

  rightContainer: {
    flexDirection: 'row',
    gap: wp('3%'),
  },

  // Tombol Bundar Kanan (Dark Mode & Notif)
  circleButton: {
    width: wp('9%'),  // Responsif ~34px
    height: wp('9%'), // Responsif ~34px
    borderRadius: wp('4.5%'), // Setengah width = Bundar
    backgroundColor: 'rgba(217, 217, 217, 0.39)', // D9D9D9 39%
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
  },

  // Tombol Back (Putih Transparan)
  backButtonCircle: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.63)', // FFFFFF 63%
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'), // Jarak ke Judul
  },

  pageTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(18),
    color: '#FFFFFF', // 100% White
    flex: 1, // Agar teks tidak nabrak kanan jika panjang
  },
});