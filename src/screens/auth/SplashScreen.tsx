import React, { useEffect } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import Animated, { 
  FadeInLeft,
  FadeInRight 
} from 'react-native-reanimated';

// --- IMPORTS DESIGN SYSTEM ---
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing } from '../../styles/spacing';
import { FontFamily } from '../../styles/typography';

// ✅ Tambahkan Interface Props
interface SplashScreenProps {
  onFinish: () => void;
}

// ✅ Terima props onFinish
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors } = useTheme();
  
  // ❌ HAPUS: const navigation = useNavigation<any>();
  // Kita tidak butuh navigation di sini

  const BG_COLOR = colors.primary; 
  const TEXT_COLOR = '#FFFFFF'; 

  useEffect(() => {
    const prepareApp = async () => {
      // Tunggu 3 detik, lalu panggil onFinish
      setTimeout(() => {
        onFinish(); // ✅ Kabari RootNavigator bahwa animasi selesai
      }, 3000);
    };

    prepareApp();
  }, []); // Hapus dependency navigation

  return (
    <View style={[styles.container, { backgroundColor: BG_COLOR }]}>
      <View style={styles.contentWrapper}>
        
        {/* LOGO ANIMATION */}
        <Animated.View
          entering={FadeInLeft
            .duration(1400)
            .springify()
            .damping(15)
            .stiffness(60)
          }
        >
          <Image 
            // Pastikan path ini benar (gunakan ../../../ jika perlu)
            source={require('../../../assets/siladan.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </Animated.View>

        {/* TEXT ANIMATION */}
        <Animated.View
          entering={FadeInRight
            .delay(300)
            .duration(1400)
            .springify()
            .damping(15)
            .stiffness(60)
          }
          style={styles.textContainer}
        >
          <Text 
            style={[styles.title, { color: TEXT_COLOR }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            SILADAN
          </Text>

          <Text 
            style={[styles.subtitle, { color: TEXT_COLOR }]}
            numberOfLines={2}
            adjustsFontSizeToFit
          >
            Sistem Informasi Layanan dan Aduan
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: 'rgba(255,255,255,0.5)' }]}>
          © 2025 Pemerintah Kota
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg, 
    width: wp(90), 
  },
  logoImage: {
    width: wp(28), 
    height: wp(28), 
    marginRight: Spacing.sm, 
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center',
    marginLeft: 5,
  },
  title: {
    fontFamily: FontFamily.khmer, 
    fontSize: wp(11), 
    lineHeight: wp(13),
    marginBottom: -5, 
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: FontFamily.khmer, 
    fontSize: wp(3), 
    lineHeight: wp(4),
    marginTop: 0,
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: hp(5),
  },
  footerText: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: 10,
  }
});