import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset'; // <--- IMPORT PENTING

// Import Font Google
import { 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import { 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { KonkhmerSleokchher_400Regular } from '@expo-google-fonts/konkhmer-sleokchher';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // 1. DAFTAR GAMBAR YANG MAU DI-CACHE
        // Masukkan semua gambar yang muncul di Auth/Onboarding/Common
        const imageAssets = [
          require('../../assets/siladan.png'),      // Logo
          require('../../assets/auth-header.png'),  // Header
          require('../../assets/onboarding/o1.png'),
          require('../../assets/onboarding/o2.png'),
          require('../../assets/onboarding/o3.png'),
          require('../../assets/email-sent.png'),
          require('../../assets/password.png'),
          require('../../assets/role-selection.png'),
          // Gambar lain jika ada (misal empty state notif jika itu gambar png)
        ];

        // Fungsi helper untuk cache gambar
        const cacheImages = imageAssets.map(image => {
          return Asset.fromModule(image).downloadAsync();
        });

        // 2. EKSEKUSI LOAD (Parallel: Font & Gambar barengan)
        await Promise.all([
          // Load Font
          Font.loadAsync({
            KonkhmerSleokchher_400Regular,
            Poppins_400Regular,
            Poppins_500Medium,
            Poppins_600SemiBold,
            Poppins_700Bold,
            Inter_400Regular,
            Inter_600SemiBold,
            Inter_700Bold,
            ...Ionicons.font,
          }),
          
          // Load Images
          ...cacheImages,
        ]);

      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // SplashScreen.hideAsync() dilakukan di SplashScreen.tsx setelah animasi selesai
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}