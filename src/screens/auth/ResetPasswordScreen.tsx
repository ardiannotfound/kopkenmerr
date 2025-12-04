import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView 
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

// Import Component
import AuthHeader from '../../components/AuthHeader';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  // State Inputs
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State Toggle Mata (Visibility)
  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);

  // Load Fonts
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_700Bold,
  });

  const handleSave = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Mohon isi semua kolom.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }
    
    // Sukses -> Pindah ke Halaman Sukses
    navigation.replace('PasswordChanged');
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      
      {/* 1. HEADER */}
      <AuthHeader />

      {/* 2. FORM CONTAINER */}
      <View style={styles.formContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ flexGrow: 1 }}
        >
          
          {/* HEADER TEXTS */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.titlePage}>Atur Ulang Password</Text>
            <Text style={styles.subtitlePage}>Silahkan buat password baru untuk melanjutkan</Text>
          </View>

          {/* INPUT 1: PASSWORD BARU */}
          <Text style={styles.label}>Password Baru</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#555657" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Masukkan Password Baru"
              placeholderTextColor="#ADB5BD"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={secureText1}
            />
            <TouchableOpacity onPress={() => setSecureText1(!secureText1)}>
              <Ionicons name={secureText1 ? "eye-off-outline" : "eye-outline"} size={20} color="#555657" />
            </TouchableOpacity>
          </View>

          {/* INPUT 2: KONFIRMASI PASSWORD */}
          <Text style={styles.label}>Konfirmasi Password Baru</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#555657" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Ulangi Password Baru"
              placeholderTextColor="#ADB5BD"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureText2}
            />
            <TouchableOpacity onPress={() => setSecureText2(!secureText2)}>
              <Ionicons name={secureText2 ? "eye-off-outline" : "eye-outline"} size={20} color="#555657" />
            </TouchableOpacity>
          </View>

          {/* TOMBOL SIMPAN */}
          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 'auto' }]} 
            onPress={handleSave}
          >
            <Text style={styles.actionButtonText}>SIMPAN</Text>
          </TouchableOpacity>

          {/* Spacer Bawah */}
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
  
  // Style Card Putih
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: wp('8%'),
    paddingTop: hp('4%'),
    marginTop: -hp('4%'), // Overlap Header
  },
  
  // Typography Header Page
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  titlePage: {
    fontFamily: 'Poppins_700Bold',
    fontSize: RFValue(24), // Ukuran disesuaikan agar muat jika judul panjang
    color: '#053F5C',
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  subtitlePage: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(12),
    color: '#053F5C',
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  // Input Styles
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(14),
    color: '#053F5C',
    marginBottom: hp('1%'),
    textAlign: 'left',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9, // Radius 9
    borderWidth: 1,
    borderColor: '#E5E2E2', // Stroke E5E2E2
    paddingHorizontal: 15,
    height: hp('6.5%'), 
    marginBottom: hp('3%'),
  },
  iconLeft: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(14),
    color: '#333',
    marginRight: 10,
  },

  // Main Button (SIMPAN)
  actionButton: {
    backgroundColor: '#053F5C',
    borderRadius: 20, // Radius 20
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#053F5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: hp('3%'),
  },
  actionButtonText: {
    fontFamily: 'Inter_700Bold', // Inter Bold
    fontSize: RFValue(16),
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});