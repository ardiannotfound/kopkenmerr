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


const { width, height } = Dimensions.get('window');

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

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  // Viewability yang jauh lebih stabil
  const viewabilityConfigCallbackPairs = useRef([
    {
      onViewableItemsChanged: ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
          setCurrentIndex(viewableItems[0].index);
        }
      },
      viewabilityConfig: {
        viewAreaCoveragePercentThreshold: 50,
      },
    },
  ]).current;

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

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }

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
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
          removeClippedSubviews={false}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
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
            <TouchableOpacity onPress={handleSkip} style={{ padding: 10 }}>
              <Text style={styles.navText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={{ padding: 10 }}>
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
    width: wp('100%'),
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
    // paddingHorizontal ditingkatkan sedikit agar teks tidak terlalu mepet layar
    paddingHorizontal: wp('8%'), 
    alignItems: 'center',
    marginTop: hp('1%'),
    // HAPUS minHeight agar container bisa memanjang kebawah mengikuti teks
    // minHeight: hp('18%'), 
    justifyContent: 'flex-start',
    // Tambah padding bawah agar tidak nabrak area dots jika teks panjang
    paddingBottom: hp('5%'), 
  },

  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(22), 
    color: '#263238',
    textAlign: 'center',
    marginBottom: hp('1.5%'), // Jarak title ke subtitle diperlega sedikit
  },

  subtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(13),
    color: '#555657',
    textAlign: 'center',
    lineHeight: RFValue(20), // Line height sedikit dilonggarkan
    // HAPUS maxWidth. Biarkan paddingHorizontal parent yang mengatur lebar.
    // maxWidth: wp('85%'), 
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: hp('14%'), // Tetap di posisi fix
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