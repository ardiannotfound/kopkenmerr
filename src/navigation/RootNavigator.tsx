import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { useTheme } from '../context/ThemeContext';

// --- IMPORT SCREENS ---
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
import CreateTicketScreen from '../screens/user/CreateTicketScreen';
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

// --- CUSTOM BUTTON KHUSUS SCAN QR (FLOAT) ---
// Perbaikan: Render Icon langsung disini, jangan pakai {children} biar center
const CustomScanButton = ({ onPress }: any) => (
  <TouchableOpacity
    style={styles.customBtnContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.customBtnCircle}>
      {/* Icon Manual disini agar CENTER sempurna */}
      <Ionicons name="qr-code" size={30} color="#FFFFFF" />
    </View>
  </TouchableOpacity>
);

// --- CONFIG STYLE TAB BAR ---
const screenOptionsTab = ({ route }: any) => ({
  headerShown: false,
  tabBarShowLabel: true,
  tabBarActiveTintColor: '#053F5C',
  tabBarInactiveTintColor: '#B0BEC5', // Warna abu untuk yang tidak aktif
  
  tabBarLabelStyle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    marginTop: -5,
    marginBottom: 5,
  },
  
  tabBarStyle: {
    height: Platform.OS === 'ios' ? 90 : 70, 
    backgroundColor: '#E9ECEF', 
    borderTopWidth: 0, 
    elevation: 0, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    position: 'absolute', 
    bottom: 0,
  } as any,

  tabBarIcon: ({ focused, color, size }: any) => {
    let iconName: any;

    if (route.name === 'Beranda') iconName = focused ? 'home' : 'home-outline';
    else if (route.name === 'Info') iconName = focused ? 'book' : 'book-outline';
    else if (route.name === 'Lacak' || route.name === 'Tugas') iconName = focused ? 'list' : 'list-outline';
    else if (route.name === 'Akun') iconName = focused ? 'person' : 'person-outline';
    else if (route.name === 'Jadwal') iconName = focused ? 'calendar' : 'calendar-outline';
    
    // Scan QR tidak perlu dihandle disini lagi karena sudah di CustomButton
    
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', top: focused ? -2 : 0 }}>
        <Ionicons name={iconName} size={24} color={color} />
        {/* {focused && <View style={styles.activeDot} />} */}
      </View>
    );
  },
});

// A. Tab untuk Masyarakat/Pegawai
function UserTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptionsTab}>
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Info" component={InformationScreen} />
      
      {/* SCAN QR FLOAT */}
      <Tab.Screen 
        name="Scan QR" 
        component={ScanQRScreen} 
        options={{
          tabBarButton: (props) => <CustomScanButton {...props} />, // Panggil Button Custom
          tabBarLabel: () => null, // Hilangkan label
          tabBarStyle: { display: 'none' }
        }}
      />
      
      <Tab.Screen name="Lacak" component={TicketListScreen} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// B. Tab untuk Teknisi
function TechnicianTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptionsTab}>
      <Tab.Screen name="Beranda" component={TechnicianHomeScreen} />
      <Tab.Screen name="Tugas" component={TechnicianTaskScreen} />
      
      {/* SCAN QR FLOAT */}
      <Tab.Screen 
        name="Scan QR" 
        component={ScanQRScreen} 
        options={{
          tabBarButton: (props) => <CustomScanButton {...props} />,
          tabBarLabel: () => null,
          tabBarStyle: { display: 'none' }
        }}
      />
      
      <Tab.Screen name="Jadwal" component={TechnicianScheduleScreen} />
      <Tab.Screen name="Akun" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isDarkMode } = useTheme();
  
  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Splash">
        
        {/* --- AUTH FLOW --- */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailSent" component={EmailSentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordChanged" component={PasswordChangedScreen} options={{ headerShown: false }} />

        {/* --- MAIN APPS --- */}
        <Stack.Screen name="UserApp" component={UserTabs} options={{ headerShown: false }} />
        <Stack.Screen name="TechnicianApp" component={TechnicianTabs} options={{ headerShown: false }} />
        
        {/* --- COMMON SCREENS --- */}
        <Stack.Screen name="CreateTicket" component={CreateTicketScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        
        <Stack.Screen name="Info" component={InformationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InformationDetail" component={InformationDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SatisfactionSurvey" component={SatisfactionSurveyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AssetHistory" component={AssetHistoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TechPerformance" component={TechnicianPerformanceScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Container Button Float
  customBtnContainer: {
    top: -30, // Dorong ke atas (Nimbul)
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Lingkaran Tombol
  customBtnCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#053F5C',
    // Border putih/abu agar terlihat terpisah dari tab bar
    borderWidth: 4, 
    borderColor: '#E9ECEF', // Sesuaikan dengan warna background TabBar
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#053F5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#053F5C',
    marginTop: 4,
  }
});