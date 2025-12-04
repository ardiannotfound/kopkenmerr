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
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold 
} from '@expo-google-fonts/poppins';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { setCurrentUser } from '../../data/Session';

export default function RoleSelectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

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

  if (!fontsLoaded) return null;

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
    height: hp('55%'), // Mengambil 55% tinggi layar
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('4%'), // Padding aman dari status bar
  },
  image: {
    width: wp('85%'), // Lebar gambar 85% layar
    height: hp('40%'), // Tinggi gambar proporsional
    resizeMode: 'contain',
  },

  // --- CONTENT SECTION ---
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp('7%'), // Kanan kiri 7%
    justifyContent: 'flex-start',
  },

  // Teks
  textWrapper: {
    alignItems: 'center',
    marginBottom: hp('5%'), // Jarak antara teks dan tombol
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(24), // Font size responsif
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
    gap: hp('2%'), // Jarak antar tombol (Gap vertikal)
  },
  
  // Button Primary (Pegawai)
  btnPrimary: {
    backgroundColor: '#053F5C', 
    borderRadius: 12, 
    paddingVertical: hp('2%'), // Padding atas bawah responsif
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