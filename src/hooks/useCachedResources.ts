import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset'; 

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // 1. CACHE GAMBAR
        const imageAssets = [
          require('../../assets/siladan.png'),      
          require('../../assets/auth-header.png'),  
          require('../../assets/onboarding/o1.png'),
          require('../../assets/onboarding/o2.png'),
          require('../../assets/onboarding/o3.png'),
          require('../../assets/email-sent.png'),
          require('../../assets/password.png'),
          require('../../assets/role-selection.png'),
        ];

        const cacheImages = imageAssets.map(image => {
          return Asset.fromModule(image).downloadAsync();
        });

        // 2. LOAD FONT LOKAL (Dari folder assets/fonts)
        // Kunci di sebelah kiri ('Poppins-Bold') harus SAMA PERSIS dengan yang ada di typography.ts
        await Promise.all([
          Font.loadAsync({
            ...Ionicons.font,
            
            // --- POPPINS ---
            'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
            'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
            'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
            'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
            'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),

            // --- KHMER (Untuk Logo/Splash) ---
            'KhmerSleokchher-Regular': require('../../assets/fonts/KonkhmerSleokchher-Regular.ttf'),
          }),
          
          ...cacheImages,
        ]);

      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // Sembunyikan Splash Screen setelah selesai load
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}