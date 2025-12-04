import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFonts, KonkhmerSleokchher_400Regular } from '@expo-google-fonts/konkhmer-sleokchher';

export default function AuthHeader() {
  let [fontsLoaded] = useFonts({
    KonkhmerSleokchher_400Regular,
  });

  if (!fontsLoaded) return <View style={styles.headerContainer} />;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.contentRow}>
        {/* LOGO */}
        <Image 
          source={require('../../assets/siladan.png')} 
          style={styles.logo}
        />

        {/* TEKS CONTAINER */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            SILADAN
          </Text>
          <Text 
            style={styles.subtitle} 
            numberOfLines={2} // Izinkan 2 baris jika layar sangat sempit
            adjustsFontSizeToFit 
            minimumFontScale={0.5}
          >
            Sistem Informasi Layanan dan Aduan
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: hp('30%'), // Sedikit dipertinggi agar logo besar muat lega
    width: wp('100%'),
    backgroundColor: '#053F5C',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: hp('2%'),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // KUNCI: Center Horizontal
    width: wp('85%'), // Membatasi lebar konten agar tidak terlalu mepet pinggir
  },
  logo: {
    width: wp('25%'), // DIPERBESAR: Dari 18% ke 25%
    height: wp('25%'), // Tetap kotak
    resizeMode: 'contain',
  },
  textContainer: {
    marginLeft: wp('3%'), // Jarak antara logo dan teks
    flex: 1, // Mengisi sisa ruang agar teks bisa panjang
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'KonkhmerSleokchher_400Regular',
    fontSize: RFValue(30), // Sedikit diperbesar menyesuaikan logo
    color: '#FFFFFF',
    marginBottom: -hp('0.5%'),
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'KonkhmerSleokchher_400Regular',
    fontSize: RFValue(11),
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: -0.5,
    textAlign: 'left',
  },
});