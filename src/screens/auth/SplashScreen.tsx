import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenUtil from 'expo-splash-screen'; 

// IMPORT LIBRARY RESPONSIVE
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

// IMPORT ANIMASI
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';
import { useFonts, KonkhmerSleokchher_400Regular } from '@expo-google-fonts/konkhmer-sleokchher';

const { width } = Dimensions.get('window');

// Tahan Splash Screen Native
SplashScreenUtil.preventAutoHideAsync();

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // Load Font
  let [fontsLoaded] = useFonts({
    KonkhmerSleokchher_400Regular,
  });

  // ANIMASI VALUES
  const logoTranslateX = useSharedValue(0); 
  const textOpacity = useSharedValue(0);
  const textTranslateX = useSharedValue(20);

  // STYLE ANIMASI
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: logoTranslateX.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateX: textTranslateX.value }] 
    };
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreenUtil.hideAsync();

      setTimeout(() => {
        // PERBAIKAN 1: Geser Logo tidak terlalu jauh (Cukup 23% layar)
        // Sebelumnya 0.32 (terlalu pinggir), sekarang 0.23 (lebih tengah)
        logoTranslateX.value = withTiming(-width * 0.23, {
          duration: 1800, 
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), 
        });

        // Munculkan Teks
        textOpacity.value = withDelay(600, withTiming(1, { 
          duration: 1500,
          easing: Easing.out(Easing.quad)
        }));

        // Animasi translateX teks
        textTranslateX.value = withDelay(600, withTiming(0, { 
          duration: 1500,
          easing: Easing.out(Easing.quad)
        }));

      }, 500);

      const timer = setTimeout(() => {
        navigation.replace('Onboarding');
      }, 5500); 

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, navigation]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.contentContainer}>
        
        {/* LOGO - Bungkus dalam container absolut */}
        <View style={styles.logoContainer}>
          <Animated.View style={animatedLogoStyle}>
            <Image 
              source={require('../../../assets/siladan.png')}
              style={styles.logoImage}
            />
          </Animated.View>
        </View>

        {/* TEXT CONTAINER - Bungkus dalam container absolut */}
        <View style={styles.textContainerWrapper}>
          <Animated.View style={[styles.textContainer, animatedTextStyle]}>
            <Text 
              style={styles.title} 
              numberOfLines={1} 
              adjustsFontSizeToFit
            >
              SILADAN
            </Text>
            
            <Text 
              style={styles.subtitle} 
              numberOfLines={1} 
              adjustsFontSizeToFit
              minimumFontScale={0.4} 
            >
              Sistem Informasi Layanan dan Aduan
            </Text>
          </Animated.View>
        </View>

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© Pemerintah Kota</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#053F5C', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    width: wp('100%'), 
    height: hp('25%'), 
    position: 'relative', 
  },
  
  // Container absolut untuk logo
  logoContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -wp('15%'), // Titik tengah awal logo (karena width 30%)
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: wp('30%'), 
    height: wp('30%'), 
    resizeMode: 'contain',
  },

  // Container absolut untuk teks
  textContainerWrapper: {
    position: 'absolute',
    left: '50%', 
    // PERBAIKAN 2: Margin disesuaikan agar nempel pas di kanan logo baru
    // Tadinya -17% (terlalu kiri), sekarang -5% (pas di tengah kanan)
    marginLeft: -wp('5%'), 
    width: wp('65%'), 
  },

  textContainer: {
    justifyContent: 'center',
  },

  title: {
    fontFamily: 'KonkhmerSleokchher_400Regular', 
    fontSize: RFValue(40), 
    color: '#FFFFFF',
    lineHeight: RFValue(50), 
    // PERBAIKAN 3: Jarak vertikal title-subtitle dirapatkan
    marginBottom: -hp('1.5%'), 
    textAlign: 'left',
    letterSpacing: -2.5,
  },
  
  subtitle: {
    fontFamily: 'KonkhmerSleokchher_400Regular', 
    fontSize: RFValue(11), 
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: -1, 
    textAlign: 'left',
  },

  footer: {
    position: 'absolute',
    bottom: hp('5%'), 
  },
  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: RFValue(10), 
  },
});