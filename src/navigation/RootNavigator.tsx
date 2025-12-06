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
const CustomScanButton = ({ onPress }: any) => (
  <TouchableOpacity
    style={styles.customBtnContainer}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.customBtnCircle}>
      <Ionicons name="qr-code" size={30} color="#FFFFFF" />
    </View>
  </TouchableOpacity>
);

// --- CONFIG STYLE TAB BAR ---
const screenOptionsTab = ({ route }: any) => ({
  headerShown: false,
  tabBarShowLabel: true,
  tabBarActiveTintColor: '#053F5C',
  tabBarInactiveTintColor: '#B0BEC5',

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

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', top: focused ? -2 : 0 }}>
        <Ionicons name={iconName} size={24} color={color} />
      </View>
    );
  },
});

// A. Tab untuk Masyarakat/Pegawai
function UserTabs() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator screenOptions={screenOptionsTab}>
        <Tab.Screen name="Beranda" component={HomeScreen} />
        <Tab.Screen name="Info" component={InformationScreen} />
        <Tab.Screen
          name="Scan QR"
          component={ScanQRScreen}
          options={{
            tabBarButton: (props) => <CustomScanButton {...props} />,
            tabBarLabel: () => null,
            tabBarStyle: { display: 'none' }
          }}
        />
        <Tab.Screen name="Lacak" component={TicketListScreen} />
        <Tab.Screen name="Akun" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
}

// B. Tab untuk Teknisi
function TechnicianTabs() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator screenOptions={screenOptionsTab}>
        <Tab.Screen name="Beranda" component={TechnicianHomeScreen} />
        <Tab.Screen name="Tugas" component={TechnicianTaskScreen} />
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
    </View>
  );
}

export default function RootNavigator() {
  const { isDarkMode, colors } = useTheme(); // Ambil colors dari context

  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
  });

  if (!fontsLoaded) return null;

  // --- THEME CONFIGURATION (ANTI FLICKER) ---
  // Kita paksa warna background navigasi sama dengan warna background aplikasi kita
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background, // Sinkronkan dengan ThemeContext
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background, // Sinkronkan dengan ThemeContext
    },
  };

  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          // --- ANIMASI HALUS ---
          animation: 'slide_from_right',
          // --- ANTI WHITE FLASH ---
          // Ini memastikan layer paling belakang warnanya sesuai tema (bukan putih default)
          contentStyle: { backgroundColor: colors.background },
        }}
      >

        {/* --- AUTH FLOW --- */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="EmailSent" component={EmailSentScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="PasswordChanged" component={PasswordChangedScreen} />

        {/* --- MAIN APPS --- */}
        <Stack.Screen name="UserApp" component={UserTabs} />
        <Stack.Screen name="TechnicianApp" component={TechnicianTabs} />

        {/* --- COMMON SCREENS --- */}
        <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />

        <Stack.Screen name="Info" component={InformationScreen} />
        <Stack.Screen name="InformationDetail" component={InformationDetailScreen} />
        <Stack.Screen name="SatisfactionSurvey" component={SatisfactionSurveyScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} />
        <Stack.Screen name="AssetHistory" component={AssetHistoryScreen} />
        <Stack.Screen name="TechPerformance" component={TechnicianPerformanceScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  customBtnContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customBtnCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#053F5C',
    borderWidth: 4,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#053F5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});