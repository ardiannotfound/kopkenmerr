import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- IMPORTS DARI SYSTEM BARU ---
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing} from '../../styles/spacing';
import { FontSize } from '../../styles/typography';
import { FontFamily } from '../../styles/typography';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    image: require('../../../assets/onboarding/o1.png'),
    title: 'Layanan Mudah',
    subtitle: 'Laporkan kendala atau buat permintaan IT hanya lewat beberapa langkah sederhana.',
  },
  {
    id: '2',
    image: require('../../../assets/onboarding/o2.png'),
    title: 'Verifikasi Cepat',
    subtitle: 'Tim kami akan meninjau laporan Anda dan meneruskannya ke teknisi terkait.',
  },
  {
    id: '3',
    image: require('../../../assets/onboarding/o3.png'),
    title: 'Proses Transparan',
    subtitle: 'Pantau progres tiket Anda kapan saja hingga selesai semuanya tercatat dan jelas.',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 1. Hook Theme Baru
  const { colors, theme } = useTheme();

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  // Navigasi ke RoleSelection (Sesuai flow baru)
  const handleFinish = () => navigation.replace('RoleSelection');

  return (
    // 2. Ganti ScreenWrapper dengan View biasa + Background Theme
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={handleScroll} 
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
              </View>
              
              <View style={styles.textContainer}>
                {/* 3. Text dengan Typography Baru */}
                <Text style={[styles.title, { color: colors.text.primary }]}>
                  {item.title}
                </Text>
                
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          )}
        />

        {/* DOT INDICATOR */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { 
                  // Logic Warna Dot: Active = Accent/Primary, Inactive = Border
                  backgroundColor: currentIndex === index ? colors.accent : colors.border.default,
                  width: currentIndex === index ? wp(5.2) : wp(1.8) 
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        {currentIndex === SLIDES.length - 1 ? (
          <View style={styles.finishButtonContainer}>
            <TouchableOpacity 
              style={[styles.finishButton, { backgroundColor: colors.primary }]} 
              onPress={handleFinish}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>Lanjutkan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navigationButtons}>
            {/* Tombol Skip */}
            <TouchableOpacity onPress={handleFinish} style={styles.touchArea}>
              <Text style={[styles.bodyText, { color: colors.text.secondary }]}>Skip</Text>
            </TouchableOpacity>
            
            {/* Tombol Next */}
            <TouchableOpacity onPress={handleNext} style={styles.touchArea}>
              <Text style={[styles.buttonText, { color: colors.primary }]}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  slide: {
    width: width, 
    alignItems: 'center',
  },

  imageContainer: {
    height: hp(50), 
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(2), 
  },

  image: {
    width: wp(80), 
    height: hp(40),
    resizeMode: 'contain',
  },

  textContainer: {
    width: wp(100),
    paddingHorizontal: wp(8), 
    alignItems: 'center',
    marginTop: hp(2),
  },

  // Font Styles (Manual dari Typography constants)
  title: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.poppins.bold,
    marginBottom: 10,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.poppins.regular,
    textAlign: 'center',
    lineHeight: 24,
  },

  bodyText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.poppins.regular,
  },

  buttonText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppins.semibold,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: hp(15), 
    width: '100%',
  },

  dot: {
    height: hp(0.9),
    borderRadius: 50,
    marginHorizontal: wp(1),
  },

  footer: {
    height: hp(10),
    paddingHorizontal: wp(7),
    justifyContent: 'center',
  },

  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  touchArea: {
    padding: 10,
  },

  finishButtonContainer: {
    alignItems: 'flex-end',
    width: '100%',
  },

  finishButton: {
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(8),
    borderRadius: 50, 
    alignItems: 'center',
    justifyContent: 'center',
  },
});