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

// Import Component
import AuthHeader from '../../components/AuthHeader';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [email, setEmail] = useState('');

  // Load Fonts
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_700Bold,
  });

  const handleSend = () => {
    if (!email) {
      Alert.alert("Mohon Isi Email", "Masukkan alamat email Anda untuk menerima instruksi.");
      return;
    }
    // Lanjut ke layar Email Terkirim / Reset
    navigation.navigate('EmailSent'); 
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      
      {/* 1. HEADER (Sama Persis) */}
      <AuthHeader />

      {/* 2. FORM CONTAINER */}
      <View style={styles.formContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          
          {/* HEADER TEXTS */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.titlePage}>Lupa Password</Text>
            <Text style={styles.subtitlePage}>Silahkan masukkan email terdaftar</Text>
          </View>

          {/* INPUT EMAIL */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Email Anda"
              placeholderTextColor="#ADB5BD"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {/* Icon Mail di Kanan */}
            <Ionicons name="mail-outline" size={20} color="#555657" />
          </View>

          {/* TOMBOL KIRIM */}
          {/* MarginTop Auto mendorong tombol ke bawah jika layar panjang, 
              atau minimal jarak hp('4%') dari input */}
          <TouchableOpacity 
            style={[styles.actionButton, { marginTop: 'auto' }]} 
            onPress={handleSend}
          >
            <Text style={styles.actionButtonText}>KIRIM</Text>
          </TouchableOpacity>

          {/* TOMBOL KEMBALI (Opsional, agar user tidak terjebak) */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>Kembali ke Login</Text>
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
    fontSize: RFValue(28),
    color: '#053F5C',
    marginBottom: hp('0.5%'),
    textAlign: 'center',
  },
  subtitlePage: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(12),
    color: '#053F5C',
    textAlign: 'center',
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
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E5E2E2', // Stroke E5E2E2
    paddingHorizontal: 15,
    height: hp('6.5%'), 
    marginBottom: hp('4%'), // Jarak lebih lega ke tombol
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(14),
    color: '#333',
    marginRight: 10,
  },

  // Main Button (KIRIM)
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
    marginBottom: hp('2%'),
  },
  actionButtonText: {
    fontFamily: 'Inter_700Bold', // Inter Bold
    fontSize: RFValue(16),
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  // Back Button Text
  backButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(14),
    color: '#555657',
  },
});