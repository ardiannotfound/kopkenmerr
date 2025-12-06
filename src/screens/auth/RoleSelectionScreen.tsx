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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { setCurrentUser } from '../../data/Session';

// HAPUS IMPORT useFonts DARI SINI
// Font Poppins sudah siap pakai dari App.tsx

export default function RoleSelectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // --- CLEAN CODE: HAPUS useFonts DISINI ---
  // Font sudah siap.

  // --- LOGIC NAVIGASI ---

  const handleGuest = () => {
    setCurrentUser('guest', ''); 
    navigation.replace('UserApp', { 
      screen: 'Beranda', 
      params: { userRole: 'guest' } 
    });
  };

  const handleLogin = () => {
    navigation.navigate('Login'); 
  };

  // Hapus pengecekan if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. AREA GAMBAR */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/role-selection.png')} 
          style={styles.image}
        />
      </View>

      {/* 2. AREA KONTEN (Teks & Tombol) */}
      <View style={styles.contentContainer}>
        
        {/* Title & Subtitle */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Pilih Peran Anda</Text>
          <Text style={styles.subtitle}>Silahkan Masuk Sesuai Peran Anda</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonWrapper}>
          
          {/* Button 1: Login Pegawai (Primary) */}
          <TouchableOpacity 
            style={styles.btnPrimary} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryText}>Login sebagai Pegawai</Text>
          </TouchableOpacity>

          {/* Button 2: Masuk Tamu (Secondary) */}
          <TouchableOpacity 
            style={styles.btnSecondary} 
            onPress={handleGuest}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryText}>Masuk sebagai Tamu</Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // --- IMAGE SECTION ---
  imageContainer: {
    height: hp('55%'), 
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('4%'), 
  },
  image: {
    width: wp('85%'), 
    height: hp('40%'), 
    resizeMode: 'contain',
  },

  // --- CONTENT SECTION ---
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp('7%'), 
    justifyContent: 'flex-start',
  },

  // Teks
  textWrapper: {
    alignItems: 'center',
    marginBottom: hp('5%'), 
  },
  title: {
    fontFamily: 'Poppins_600SemiBold', // Langsung pakai nama font string
    fontSize: RFValue(24), 
    color: '#000000',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins_500Medium', 
    fontSize: RFValue(14), 
    color: '#888888',
    textAlign: 'center',
  },

  // Tombol
  buttonWrapper: {
    width: '100%',
    gap: hp('2%'), 
  },
  
  // Button Primary (Pegawai)
  btnPrimary: {
    backgroundColor: '#053F5C', 
    borderRadius: 12, 
    paddingVertical: hp('2%'), 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 2, 
    shadowColor: '#053F5C', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnPrimaryText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(16),
    color: '#FFFFFF',
  },

  // Button Secondary (Tamu)
  btnSecondary: {
    backgroundColor: '#E0E7EF', 
    borderRadius: 12, 
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnSecondaryText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(16),
    color: '#0A3D62', 
  },
});