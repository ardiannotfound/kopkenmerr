import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar 
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold 
} from '@expo-google-fonts/poppins';

export default function PasswordChangedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const handleFinish = () => {
    // Reset navigasi agar user tidak bisa tekan 'Back' ke form ganti password
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. AREA GAMBAR (50% Layar) */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../assets/password.png')} 
          style={styles.image}
        />
      </View>

      {/* 2. AREA KONTEN */}
      <View style={styles.contentContainer}>
        
        {/* Teks Informasi */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Kata Sandi Berhasil Diubah</Text>
          <Text style={styles.subtitle}>
            Kata sandi Anda telah berhasil diperbarui. 
            Silakan masuk kembali menggunakan kredensial baru Anda untuk melanjutkan akses ke aplikasi.
          </Text>
        </View>

        {/* Tombol Aksi */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={styles.btnPrimary} 
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>LOGIN SEKARANG</Text>
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
    height: hp('50%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('5%'),
  },
  image: {
    width: wp('80%'),
    height: hp('40%'), // Gambar proporsional
    resizeMode: 'contain',
  },

  // --- CONTENT SECTION ---
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp('7%'),
    justifyContent: 'flex-start',
  },

  // Typography
  textWrapper: {
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(22), // Sedikit dikecilkan agar muat jika layarnya sempit
    color: '#263238', 
    marginBottom: hp('1.5%'),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins_500Medium', 
    fontSize: RFValue(13), 
    color: '#555657', 
    textAlign: 'center',
    lineHeight: RFValue(20), 
  },

  // Button
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
    elevation: 3, 
    shadowColor: '#053F5C', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnText: {
    fontFamily: 'Poppins_500Medium', 
    fontSize: RFValue(16),
    color: '#FFFFFF',
    letterSpacing: 0.5, // Sedikit spacing agar terlihat tegas
  },
});