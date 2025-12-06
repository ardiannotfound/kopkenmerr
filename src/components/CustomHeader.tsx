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
import { CurrentUser } from '../data/Session'; // IMPORT Session untuk cek Role

// Import Fonts
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';

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
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Ambil Role User
  const userRole = CurrentUser.role;

  let [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Poppins_600SemiBold,
  });

  // --- LOGIC NOTIFIKASI ---
  // 1. Base Logic: Muncul jika 'home' ATAU dipaksa 'showNotificationButton'
  // 2. Override Logic: Jika GUEST -> SELALU SEMBUNYIKAN
  const shouldShowNotification = (type === 'home' || showNotificationButton) && userRole !== 'guest';

  if (!fontsLoaded) return <View style={styles.placeholder} />;

  return (
    <ImageBackground 
      source={require('../../assets/all-header.png')} 
      style={styles.headerContainer} 
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
              name={isDarkMode ? "sunny" : "moon"} 
              size={RFValue(18)} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          {/* Notification Button (Dengan Logic Guest) */}
          {shouldShowNotification && (
            <TouchableOpacity 
              onPress={onNotificationPress} 
              style={styles.circleButton}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={RFValue(18)} color="#FFFFFF" />
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
            <Ionicons name="chevron-back" size={RFValue(20)} color="#053F5C" />
          </TouchableOpacity>

          <Text style={styles.pageTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : (
        <View style={{ height: hp('5%') }} /> 
      )}

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: hp('22%'),
    backgroundColor: '#053F5C',
  },
  
  headerContainer: {
    width: wp('100%'),
    height: hp('22%'), 
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
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
  
  greetingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(12),
    color: '#E0E0E0', 
  },
  userNameText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(18),
    color: '#FFFFFF',
    marginTop: -2,
  },
  userUnitText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(11), 
    color: '#81C3D7', 
    marginTop: -2,
  },

  topRightContainer: {
    flexDirection: 'row',
    gap: wp('3%'),
    marginTop: 5, 
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

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: hp('1%'), 
  },

  backButtonCircle: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'), 
  },

  pageTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(22), 
    color: '#FFFFFF', 
    flex: 1, 
  },
});