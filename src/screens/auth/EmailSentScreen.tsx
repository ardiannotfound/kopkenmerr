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
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

// CLEAN CODE: Tidak perlu import useFonts lagi

export default function EmailSentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // CLEAN CODE: Hapus useFonts dan pengecekan if (!fontsLoaded)
  // Font sudah dijamin siap oleh App.tsx

  // Tombol Tutup -> Kembali ke Login
  const handleClose = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. AREA GAMBAR (50% Layar) */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/email-sent.png')} 
          style={styles.image}
        />
      </View>

      {/* 2. AREA KONTEN (Teks & Tombol) */}
      <View style={styles.contentContainer}>
        
        {/* Title & Subtitle */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Email Reset Terkirim</Text>
          <Text style={styles.subtitle}>
            Kami telah mengirimkan link untuk mengatur ulang kata sandi ke email Anda. 
            Silakan periksa inbox atau folder spam.
          </Text>
        </View>

        {/* Tombol Tutup */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={styles.btnPrimary} 
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Tutup</Text>
          </TouchableOpacity>
        </View>

        {/* Tombol Simulasi (Hanya untuk Dev, nanti dihapus saat production) */}
        <TouchableOpacity 
          style={{ marginTop: 20, alignSelf: 'center' }} 
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={{ color: '#ccc', fontSize: 12 }}>[DEV: Buka Link Reset]</Text>
        </TouchableOpacity>

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
    height: hp('50%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('5%'),
  },
  image: {
    width: wp('80%'),
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
    fontFamily: 'Poppins_600SemiBold', // Font String Langsung
    fontSize: RFValue(24), 
    color: '#263238', 
    marginBottom: hp('1.5%'),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins_500Medium', 
    fontSize: RFValue(14), 
    color: '#555657', 
    textAlign: 'center',
    lineHeight: RFValue(22), 
  },

  // Tombol
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  
  btnPrimary: {
    backgroundColor: '#053F5C', 
    borderRadius: 21, 
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'), 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    elevation: 2, 
    shadowColor: '#053F5C', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnText: {
    fontFamily: 'Poppins_500Medium', 
    fontSize: RFValue(16),
    color: '#FFFFFF',
  },
});