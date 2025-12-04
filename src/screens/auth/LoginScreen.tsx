import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { 
  useFonts, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { Inter_700Bold } from '@expo-google-fonts/inter';

import AuthHeader from '../../components/AuthHeader';
import { MOCK_USERS } from '../../data/mockData';
import { setCurrentUser } from '../../data/Session';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_700Bold,
  });

  const handleLogin = () => {
    const user = MOCK_USERS.find(u => u.username === username);
    if (user) {
      setCurrentUser(user.role, user.id); 
      if (user.role === 'employee') {
        navigation.replace('UserApp', { screen: 'Beranda', params: { userRole: 'employee', userId: user.id } });
      } else if (user.role === 'technician') {
        navigation.replace('TechnicianApp', { screen: 'Beranda', params: { userRole: 'technician', userId: user.id } });
      }
    } else {
      Alert.alert('Gagal Masuk', 'Username tidak ditemukan.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword'); 
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <AuthHeader />

      {/* FORM CONTAINER */}
      {/* Tambahkan zIndex agar form tampil di atas bayangan header */}
      <View style={[styles.formContainer, { zIndex: 999 }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }} 
        >
          
          <View style={styles.formHeaderTextContainer}>
            <Text style={styles.titleLogin}>Login</Text>
            <Text style={styles.subtitleLogin}>Silahkan login untuk melanjutkan</Text>
          </View>

          {/* --- INPUT USERNAME --- */}
          <Text style={styles.label}>Email / Username</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input} // flex: 1 ada disini
              placeholder="Masukkan Email Anda"
              placeholderTextColor="#ADB5BD"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            {/* WRAPPER ICON: Memberi ruang pasti untuk ikon */}
            <View style={styles.iconWrapper}>
              <Ionicons name="person-outline" size={22} color="#555657" />
            </View>
          </View>

          {/* --- INPUT PASSWORD --- */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Password"
              placeholderTextColor="#ADB5BD"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.iconWrapper}>
              <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={22} color="#555657" />
            </TouchableOpacity>
          </View>

          {/* LUPA PASSWORD */}
          <TouchableOpacity 
            style={styles.forgotPassContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPassText}>Lupa Password?</Text>
          </TouchableOpacity>

          {/* TOMBOL LOGIN */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View style={{ height: hp('5%') }} />

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#053F5C', 
  },
  
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: wp('8%'),
    paddingTop: hp('4%'),
    marginTop: -hp('4%'), 
  },
  
  formHeaderTextContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  titleLogin: {
    fontFamily: 'Poppins_700Bold',
    fontSize: RFValue(28),
    color: '#053F5C',
    marginBottom: hp('0.5%'),
  },
  subtitleLogin: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(12),
    color: '#053F5C',
  },
  
  // LABEL
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(14),
    color: '#053F5C',
    marginBottom: hp('1%'),
    textAlign: 'left',
  },

  // BOX INPUT (Row)
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E5E2E2',
    paddingLeft: 15, // Padding kiri untuk teks
    paddingRight: 0, // Padding kanan untuk icon
    height: hp('6.5%'), 
    marginBottom: hp('2.5%'),
    overflow: 'hidden',
  },

  // TEXT INPUT
  input: {
    flex: 1, // Mengambil sisa ruang
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(14),
    color: '#333',
    height: '100%', // Pastikan tinggi penuh agar mudah diklik
  },

  // ICON WRAPPER (PENTING AGAR TIDAK HILANG)
  iconWrapper: {
    width: 30, // Lebar pasti untuk area ikon
    alignItems: 'center',
    justifyContent: 'center',
  },

  forgotPassContainer: {
    alignItems: 'flex-end',
    marginBottom: hp('2%'),
  },
  forgotPassText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(12),
    color: '#429EBD',
  },
  
  loginButton: {
    backgroundColor: '#053F5C',
    borderRadius: 20,
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#053F5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 'auto', 
  },
  loginButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(16),
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});