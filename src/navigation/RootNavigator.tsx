import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ✅ Import Insets

// --- STATE & THEME ---
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';

// --- ICONS (SVG) ---
import BerandaIcon from '../../assets/icons/beranda.svg';
import InfoIcon from '../../assets/icons/informasi.svg';
import LacakIcon from '../../assets/icons/lacaktiket.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import ScanIcon from '../../assets/icons/scan.svg';
import TugasIcon from '../../assets/icons/tugasteknisi.svg';
import JadwalIcon from '../../assets/icons/kalenderteknisi.svg';

// --- SCREENS ---
// Auth
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import EmailSentScreen from '../screens/auth/EmailSentScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import PasswordChangedScreen from '../screens/auth/PasswordChangedScreen';

// User
import HomeScreen from '../screens/user/HomeScreen';
import CreateIncidentScreen from '../screens/user/CreateIncidentScreen';
import DetailIncidentScreen from '../screens/user/DetailIncidentScreen';
import CreateRequestScreen from '../screens/user/CreateRequestScreen';
import DetailRequestScreen from '../screens/user/DetailRequestScreen';
import TicketListScreen from '../screens/user/TicketListScreen';
import TicketDetailScreen from '../screens/user/TicketDetailScreen';
import InformationScreen from '../screens/user/InformationScreen';
import InformationDetailScreen from '../screens/user/InformationDetailScreen';
import SatisfactionSurveyScreen from '../screens/user/SatisfactionSurveyScreen';

// Technician
import TechnicianHomeScreen from '../screens/technician/TechnicianHomeScreen';
import TechnicianTaskScreen from '../screens/technician/TechnicianTaskScreen';
import TechnicianScheduleScreen from '../screens/technician/TechnicianScheduleScreen';
import AssetHistoryScreen from '../screens/technician/AssetHistoryScreen';
import TechnicianPerformanceScreen from '../screens/technician/TechnicianPerformanceScreen';
import TechnicianTicketDetail from '../screens/technician/TechnicianTicketDetail';


// Common
import ScanQRScreen from '../screens/common/ScanQRScreen';
import ChatScreen from '../screens/common/ChatScreen';
import NotificationScreen from '../screens/common/NotificationScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import EditProfileScreen from '../screens/common/EditProfileScreen';
import ChangePasswordScreen from '../screens/common/ChangePasswordScreen';
import AboutAppScreen from '../screens/common/AboutAppScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- COMPONENTS ---

// 1. Custom Button Scan QR
const CustomScanButton = ({ onPress }: any) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={{
        top: -25, // Naikkan sedikit agar terlihat menonjol
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary, 
        borderWidth: 4,
        borderColor: theme.colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
      }}>
        <ScanIcon width={28} height={28} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

// 2. Tab untuk Masyarakat/Pegawai (FIXED LAYOUT)
function UserTabs() {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  // ✅ LOGIC FIX: 
  // Ambil insets.bottom (iPhone X atau Android Gesture).
  // Jika 0 (Android Tombol Fisik), paksa minimal 15px agar tidak mepet bawah.
  const safeBottom = Math.max(insets.bottom, 15);
  const tabHeight = 60 + safeBottom; 

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.bottomBar.icon,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 10,
          marginTop: -5,
          paddingBottom: 5,
        },
        tabBarStyle: {
          height: tabHeight,
          backgroundColor: colors.bottomBar.background,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          position: 'absolute',
          bottom: 0,
          paddingTop: 10,
          paddingBottom: safeBottom - 5, // Padding isi tab agar naik dikit
        },
      }}
    >
      <Tab.Screen 
        name="Beranda" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <BerandaIcon width={24} height={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Info" 
        component={InformationScreen} 
        options={{
          tabBarIcon: ({ color }) => <InfoIcon width={24} height={24} color={color} />
        }}
      />
      <Tab.Screen
        name="Scan QR"
        component={ScanQRScreen}
        options={{
          tabBarButton: (props) => <CustomScanButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen 
        name="Lacak" 
        component={TicketListScreen} 
        options={{
          tabBarIcon: ({ color }) => <LacakIcon width={24} height={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Akun" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <ProfileIcon width={24} height={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

// 3. Tab untuk Teknisi (FIXED LAYOUT)
function TechnicianTabs() {
  const { theme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  // ✅ LOGIC FIX SAMA
  const safeBottom = Math.max(insets.bottom, 15);
  const tabHeight = 60 + safeBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.bottomBar.icon,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          fontFamily: 'Poppins_500Medium',
          fontSize: 10,
          marginTop: -5,
          paddingBottom: 5,
        },
        tabBarStyle: {
          height: tabHeight,
          backgroundColor: colors.bottomBar.background,
          borderTopWidth: 0,
          elevation: 10,
          position: 'absolute',
          bottom: 0,
          paddingTop: 10,
          paddingBottom: safeBottom - 5,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={TechnicianHomeScreen} 
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color }) => <BerandaIcon width={24} height={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Tugas" 
        component={TechnicianTaskScreen} 
        options={{
          tabBarIcon: ({ color }) => <TugasIcon width={24} height={24} color={color} />
        }}
      />
      <Tab.Screen
        name="Scan QR"
        component={ScanQRScreen}
        options={{
          tabBarButton: (props) => <CustomScanButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen 
        name="Jadwal" 
        component={TechnicianScheduleScreen} 
        options={{
          tabBarIcon: ({ color }) => <JadwalIcon width={24} height={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Akun" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <ProfileIcon width={24} height={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

// --- ROOT NAVIGATOR (MAIN SWITCH) ---
export default function RootNavigator() {
  const { colors } = useTheme();
  const { isAuthenticated, userRole, isGuest, user } = useAuthStore();
  
  const [isAssetReady, setAssetReady] = useState(false);
  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setAssetReady(true);
    }
  }, [fontsLoaded]);

  if (!isAssetReady) {
    return null; 
  }

  if (!isSplashAnimationFinished) {
    return (
      <SplashScreen 
        onFinish={() => setSplashAnimationFinished(true)} 
      />
    );
  }

  // --- LOGIC DETEKSI ROLE ---
  const getSafeRole = () => {
    if (isGuest) return 'guest';
    try {
      const rawRole = user?.role;
      if (typeof rawRole === 'object' && rawRole !== null) {
        return (rawRole as any).id || (rawRole as any).name || 'masyarakat';
      }
      if (typeof rawRole === 'string') {
        return rawRole;
      }
      return userRole();
    } catch (e) {
      return 'masyarakat';
    }
  };

  const roleString = getSafeRole();
  const isTechnician = roleString?.toLowerCase() === 'teknisi';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      >
        
        {!isAuthenticated && !isGuest ? (
          <Stack.Group>
             <Stack.Screen name="Onboarding" component={OnboardingScreen} />
             <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
             <Stack.Screen name="Login" component={LoginScreen} />
             <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
             <Stack.Screen name="EmailSent" component={EmailSentScreen} />
             <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
             <Stack.Screen name="PasswordChanged" component={PasswordChangedScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
  {isTechnician ? (
    <>
      <Stack.Screen
        name="TechnicianApp"
        component={TechnicianTabs}
      />
      <Stack.Screen
        name="TechnicianTicketDetail"
        component={TechnicianTicketDetail}
      />
    </>
  ) : (
    <Stack.Screen
      name="UserApp"
      component={UserTabs}
    />
  )}
</Stack.Group>

        )}

        {/* COMMON SCREENS */}
        <Stack.Group>
          <Stack.Screen name="CreateIncident" component={CreateIncidentScreen} />
          <Stack.Screen name="DetailIncident" component={DetailIncidentScreen} /> 
          <Stack.Screen name="CreateRequest" component={CreateRequestScreen} /> 
          <Stack.Screen name="DetailRequest" component={DetailRequestScreen} /> 
          <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
          <Stack.Screen name="TicketListScreen" component={TicketListScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Info" component={InformationScreen} />
          <Stack.Screen name="InformationDetail" component={InformationDetailScreen} />
          <Stack.Screen name="SatisfactionSurvey" component={SatisfactionSurveyScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="AboutApp" component={AboutAppScreen} />
          <Stack.Screen name="AssetHistory" component={AssetHistoryScreen} />
          <Stack.Screen name="TechPerformance" component={TechnicianPerformanceScreen} />
        </Stack.Group>

      </Stack.Navigator>
    </NavigationContainer>
  );
}