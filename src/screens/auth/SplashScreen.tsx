import React, { useEffect, useCallback } from 'react';
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
  Easing,
  runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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

  // Logic Pindah Halaman
  const navigateNext = () => {
    navigation.replace('Onboarding');
  };

  // Gunakan useCallback agar fungsi tidak direcreate
  const onLayoutRootView = useCallback(async () => {
    await SplashScreenUtil.hideAsync();

    // 1. Geser Logo (Target: -23% Lebar Layar)
    // Angka 0.23 ini pas agar logo bergeser ke kiri tapi tidak mepet pinggir
    logoTranslateX.value = withTiming(-width * 0.30, {
      duration: 1800, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), 
    });

    // 2. Munculkan Teks
    textOpacity.value = withDelay(600, withTiming(1, { 
      duration: 1500,
      easing: Easing.out(Easing.quad)
    }));

    textTranslateX.value = withDelay(600, withTiming(0, { 
      duration: 1500,
      easing: Easing.out(Easing.quad)
    }, (finished) => {
      if (finished) {
        runOnJS(navigateNext)();
      }
    }));
  }, []);

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      
      <View style={styles.contentContainer}>
        
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Animated.View style={animatedLogoStyle}>
            <Image 
              source={require('../../../assets/siladan.png')}
              style={styles.logoImage}
            />
          </Animated.View>
        </View>

        {/* TEXT CONTAINER */}
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
  
  // LOGO: Mulai di tengah absolut
  logoContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -wp('15%'), // Setengah dari lebar logo (30% / 2)
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: wp('30%'), 
    height: wp('30%'), 
    resizeMode: 'contain',
  },

  // TEKS: Diatur agar menempel pas di kanan logo setelah logo bergeser
  textContainerWrapper: {
    position: 'absolute',
    left: '50%', 
    // PERBAIKAN UTAMA DISINI:
    // marginLeft -5% membuat teks mulai sedikit di kiri titik tengah.
    // Saat logo geser ke kiri (-23%), dan teks di posisi ini (-5%),
    // celah di antaranya akan pas dan terlihat center secara optik.
    marginLeft: -wp('15%'), 
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