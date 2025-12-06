import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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
        // Tahan Splash Screen Native agar tidak hilang
        SplashScreen.preventAutoHideAsync();

        // Load Font & Icon
        await Font.loadAsync({
          KonkhmerSleokchher_400Regular,
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_600SemiBold,
          Poppins_700Bold,
          Inter_400Regular,
          Inter_600SemiBold,
          Inter_700Bold,
          ...Ionicons.font,
        });

        // (Opsional) Disini bisa tambah load gambar background jika mau di-cache juga
        // await Asset.loadAsync([require('../../assets/auth-header.png')]);

      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // Jangan hideAsync disini, biarkan SplashScreen.tsx yang menghandle animasinya
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}