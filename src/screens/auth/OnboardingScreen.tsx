import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

// Pastikan Font sudah diload di App.tsx (useCachedResources), jadi disini tidak perlu useFonts lagi.

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

  // --- LOGIC UPDATE INDEX (ANTI-LAG) ---
  const handleScroll = (event: any) => {
    // Hitung index berdasarkan offset X dibagi lebar layar
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

  const handleSkip = () => navigation.replace('RoleSelection');
  const handleFinish = () => navigation.replace('RoleSelection');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* SLIDER */}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id}
          // GANTI viewabilityConfig DENGAN INI:
          onMomentumScrollEnd={handleScroll} 
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
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
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        {currentIndex === SLIDES.length - 1 ? (
          <View style={styles.finishButtonContainer}>
            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <Text style={styles.finishText}>Lanjutkan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navigationButtons}>
            <TouchableOpacity onPress={handleSkip} style={styles.touchArea}>
              <Text style={styles.navText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.touchArea}>
              <Text style={styles.navText}>Next</Text>
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
    backgroundColor: '#FFFFFF',
  },

  slide: {
    width: width, // Lebar layar penuh (Dimensions)
    alignItems: 'center',
  },

  imageContainer: {
    height: hp('50%'), 
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('4%'),
  },

  image: {
    width: wp('75%'),
    height: hp('35%'),
    resizeMode: 'contain',
  },

  textContainer: {
    width: wp('100%'),
    paddingHorizontal: wp('8%'), 
    alignItems: 'center',
    marginTop: hp('1%'),
    justifyContent: 'flex-start',
    paddingBottom: hp('5%'), 
  },

  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(22), 
    color: '#263238',
    textAlign: 'center',
    marginBottom: hp('1.5%'), 
  },

  subtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(13),
    color: '#555657',
    textAlign: 'center',
    lineHeight: RFValue(20), 
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: hp('14%'), 
    width: '100%',
  },

  dot: {
    height: hp('0.9%'),
    borderRadius: 50,
    marginHorizontal: wp('1%'),
  },

  dotActive: {
    width: wp('5.2%'),
    backgroundColor: '#FFA629',
  },

  dotInactive: {
    width: wp('1.8%'),
    backgroundColor: '#D9D9D9',
  },

  footer: {
    height: hp('12%'),
    paddingHorizontal: wp('7%'),
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

  navText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(14),
    color: '#555657',
  },

  finishButtonContainer: {
    alignItems: 'flex-end',
    width: '100%',
  },

  finishButton: {
    backgroundColor: '#053F5C',
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('7%'),
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  finishText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(14),
    color: '#FFFFFF',
  },
});