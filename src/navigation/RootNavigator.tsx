import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import TechnicianScheduleScreen from '../screens/technician/TechnicianScheduleScreen';
import { useTheme } from '../context/ThemeContext';

// --- IMPORT COMPONENT ASLI (YANG SUDAH DIBUAT) ---
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import EmailSentScreen from '../screens/auth/EmailSentScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import PasswordChangedScreen from '../screens/auth/PasswordChangedScreen';

// USER
import HomeScreen from '../screens/user/HomeScreen';
import CreateTicketScreen from '../screens/user/CreateTicketScreen';
import TicketListScreen from '../screens/user/TicketListScreen';
import TicketDetailScreen from '../screens/user/TicketDetailScreen';
import InformationScreen from '../screens/user/InformationScreen';
import InformationDetailScreen from '../screens/user/InformationDetailScreen';
import SatisfactionSurveyScreen from '../screens/user/SatisfactionSurveyScreen';

// COMMONS
import ProfileScreen from '../screens/common/ProfileScreen'; 
import ChatScreen from '../screens/common/ChatScreen';
import ScanQRScreen from '../screens/common/ScanQRScreen';
import NotificationScreen from '../screens/common/NotificationScreen';
import EditProfileScreen from '../screens/common/EditProfileScreen';
import ChangePasswordScreen from '../screens/common/ChangePasswordScreen';
import AboutAppScreen from '../screens/common/AboutAppScreen';

// TECHNICIAN
import TechnicianHomeScreen from '../screens/technician/TechnicianHomeScreen';
import TechnicianTaskScreen from '../screens/technician/TechnicianTaskScreen';
import AssetHistoryScreen from '../screens/technician/AssetHistoryScreen';
import TechnicianPerformanceScreen from '../screens/technician/TechnicianPerformanceScreen';

// --- Placeholder Screens (Untuk halaman yang BELUM dibuat) ---
const DummyScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name}</Text>
  </View>
);

// --- 1. Tab Navigator (Menu Bawah) ---
const Tab = createBottomTabNavigator();

// Tab untuk Masyarakat/Pegawai
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Beranda') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Info') iconName = focused ? 'information-circle' : 'information-circle-outline';
          else if (route.name === 'Scan QR') iconName = focused ? 'qr-code' : 'qr-code-outline';
          else if (route.name === 'Lacak') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Akun') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Informasi" component={InformationScreen} />
      <Tab.Screen name="Scan QR" component={ScanQRScreen} options={{ tabBarStyle: { display: 'none' }}} />
      <Tab.Screen name="Lacak" component={TicketListScreen} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Tab untuk Teknisi (Beda Menu)
function TechnicianTabs() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Beranda') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Tugas') iconName = focused ? 'briefcase' : 'briefcase-outline';
          else if (route.name === 'Scan QR') iconName = focused ? 'qr-code' : 'qr-code-outline';
          else if (route.name === 'Jadwal') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Akun') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Beranda" component={TechnicianHomeScreen} />
      <Tab.Screen name="Tugas" component={TechnicianTaskScreen} />
      <Tab.Screen name="Scan QR" component={ScanQRScreen} />
      <Tab.Screen name="Jadwal" component={TechnicianScheduleScreen} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 2. Stack Navigator (Alur Utama) ---
const Stack = createNativeStackNavigator();

export default function RootNavigator() {

  const { isDarkMode } = useTheme();

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Splash">
        {/* Auth Flow - MENGGUNAKAN COMPONENT ASLI */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RoleSelection" 
          component={RoleSelectionScreen} 
          options={{ headerShown: false }} 
        />
        {/* Login masih Dummy dulu karena belum kita buat */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ headerShown: false }} 
           // Header akan muncul default (bisa di hide kalau mau)
        />
        <Stack.Screen 
          name="EmailSent" 
          component={EmailSentScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="PasswordChanged" 
          component={PasswordChangedScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="CreateTicket" 
          component={CreateTicketScreen} 
          options={{ headerShown: false }}  // Header default muncul
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationScreen} 
          options={{ headerShown: false }}  // Judul Header
        />
        
        {/* Main App Flows */}
        <Stack.Screen name="UserApp" component={UserTabs} options={{ headerShown: false }} />
        <Stack.Screen name="TechnicianApp" component={TechnicianTabs} options={{ headerShown: false }} />
        
        {/* Detail Screens (Global) */}
        <Stack.Screen 
          name="TicketDetail" 
         component={TicketDetailScreen} // Gantikan DummyScreen dengan ini
         options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="InformationDetail" 
          component={InformationDetailScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SatisfactionSurvey" 
          component={SatisfactionSurveyScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen} 
         options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePasswordScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AboutApp" 
          component={AboutAppScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AssetHistory" 
          component={AssetHistoryScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
        name="TechPerformance" 
          component={TechnicianPerformanceScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Info" 
          component={InformationScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}