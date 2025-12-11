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
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// --- IMPORTS DESIGN SYSTEM ---
import AuthHeader from '../../components/AuthHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, InputHeight, ButtonHeight } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS ICONS ---
// Kita pakai Icon Mata SVG, tapi Lock pakai Ionicons (karena belum ada SVG Lock)
import EyeOpenIcon from '../../../assets/icons/matabuka.svg';   
import EyeClosedIcon from '../../../assets/icons/matatutup.svg';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Ambil Theme
  const { colors, isDark } = useTheme();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);

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

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      
      {/* 1. HEADER */}
      <AuthHeader />

      {/* 2. FORM CONTAINER */}
      <View style={[styles.formContainer, { backgroundColor: colors.background.primary }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ flexGrow: 1 }}
        >
          
          {/* HEADER TEXTS */}
          <View style={styles.headerTextContainer}>
            {/* LOGIC WARNA: Light=Biru, Dark=Putih */}
            <Text style={[
              styles.titlePage, 
              { color: isDark ? colors.text.primary : colors.primary }
            ]}>
              Atur Ulang Password
            </Text>
            
            <Text style={[
              styles.subtitlePage, 
              { color: colors.text.secondary }
            ]}>
              Silahkan buat password baru untuk melanjutkan
            </Text>
          </View>

          {/* INPUT 1: PASSWORD BARU */}
          <Text style={[styles.label, { color: isDark ? colors.text.primary : colors.primary }]}>
            Password Baru
          </Text>
          <View style={[
            styles.inputBox, 
            { 
              borderColor: colors.border.default,
              backgroundColor: colors.background.card 
            }
          ]}>
            {/* Icon Lock (Ionicons) */}
            <View style={styles.iconWrapperLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} />
            </View>
            
            <TextInput
              style={[styles.input, { color: colors.text.primary }]}
              placeholder="Masukkan Password Baru"
              placeholderTextColor={colors.text.secondary}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={secureText1}
            />

            {/* Icon Mata (SVG) */}
            <TouchableOpacity onPress={() => setSecureText1(!secureText1)} style={styles.iconWrapperRight}>
              {secureText1 ? (
                 <EyeClosedIcon width={22} height={22} color={colors.text.secondary} />
              ) : (
                 <EyeOpenIcon width={22} height={22} color={colors.text.secondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* INPUT 2: KONFIRMASI PASSWORD */}
          <Text style={[styles.label, { color: isDark ? colors.text.primary : colors.primary }]}>
            Konfirmasi Password Baru
          </Text>
          <View style={[
            styles.inputBox, 
            { 
              borderColor: colors.border.default,
              backgroundColor: colors.background.card 
            }
          ]}>
            <View style={styles.iconWrapperLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} />
            </View>
            
            <TextInput
              style={[styles.input, { color: colors.text.primary }]}
              placeholder="Ulangi Password Baru"
              placeholderTextColor={colors.text.secondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureText2}
            />

            <TouchableOpacity onPress={() => setSecureText2(!secureText2)} style={styles.iconWrapperRight}>
              {secureText2 ? (
                 <EyeClosedIcon width={22} height={22} color={colors.text.secondary} />
              ) : (
                 <EyeOpenIcon width={22} height={22} color={colors.text.secondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* TOMBOL SIMPAN */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={handleSave}
          >
            <Text style={[styles.actionButtonText, { color: colors.white }]}>
              SIMPAN
            </Text>
          </TouchableOpacity>

          <View style={{ height: hp(5) }} />

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  formContainer: {
    flex: 1,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingHorizontal: wp(8),
    paddingTop: hp(4),
    marginTop: -hp(4),
    zIndex: 999,
  },
  
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  titlePage: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize['2xl'], // Scaled 24
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitlePage: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  label: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.base,
    marginBottom: Spacing.sm,
    textAlign: 'left',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    height: InputHeight.lg, 
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  iconWrapperLeft: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  iconWrapperRight: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  input: {
    flex: 1, 
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    height: '100%',
  },

  actionButton: {
    borderRadius: BorderRadius['2xl'],
    height: ButtonHeight.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 'auto', 
    marginBottom: hp(3),
  },
  actionButtonText: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.md,
    letterSpacing: 1,
  },
});