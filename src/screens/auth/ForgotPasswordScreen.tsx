import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// --- IMPORTS SYSTEM BARU ---
import AuthHeader from '../../components/AuthHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, InputHeight, ButtonHeight } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- API ---
import { authApi } from '../../services/api/auth';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Theme Hook
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      Alert.alert("Mohon Isi Email", "Masukkan alamat email Anda untuk menerima instruksi.");
      return;
    }

    setLoading(true);
    try {
      // 2. Panggil API Real
      await authApi.forgotPassword(email);
      
      // 3. Jika sukses, pindah ke layar EmailSent
      // Kita kirim param email biar bisa ditampilkan di layar sebelah
      navigation.replace('EmailSent', { email }); 

    } catch (error: any) {
      // Handle Error
      const message = error.response?.data?.message || 'Gagal mengirim email reset.';
      Alert.alert('Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      
      {/* HEADER */}
      <AuthHeader />

      {/* FORM CONTAINER */}
      <View style={[styles.formContainer, { backgroundColor: colors.background.primary }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ flexGrow: 1 }}
        >
          
          {/* HEADER TEXTS */}
          <View style={styles.headerTextContainer}>
            <Text style={[styles.titlePage, { color: colors.primary }]}>
              Lupa Password
            </Text>
            <Text style={[styles.subtitlePage, { color: colors.primary }]}>
              Silahkan masukkan email terdaftar
            </Text>
          </View>

          {/* INPUT EMAIL */}
          <Text style={[styles.label, { color: colors.primary }]}>Email</Text>
          <View style={[styles.inputBox, { borderColor: colors.border.default }]}>
            <TextInput
              style={[styles.input, { color: colors.text.primary }]}
              placeholder="Masukkan Email Anda"
              placeholderTextColor={colors.text.secondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.iconWrapper}>
              <Ionicons name="mail-outline" size={22} color={colors.text.secondary} />
            </View>
          </View>

          {/* TOMBOL KIRIM */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]} 
            onPress={handleSend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.actionButtonText, { color: colors.white }]}>
                KIRIM
              </Text>
            )}
          </TouchableOpacity>

          {/* TOMBOL KEMBALI */}
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={[styles.backButtonText, { color: colors.text.secondary }]}>
              Kembali ke Login
            </Text>
          </TouchableOpacity>

          <View style={{ height: hp(3) }} />

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
    marginTop: -hp(4), // Overlap Header style
    zIndex: 999,
  },
  
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  titlePage: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize['3xl'], // 28 scaled
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitlePage: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
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
    paddingLeft: Spacing.md,
    paddingRight: 0, 
    height: InputHeight.lg, 
    marginBottom: hp(4), 
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    height: '100%',
  },
  iconWrapper: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
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
    marginBottom: hp(2),
  },
  actionButtonText: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.md,
    letterSpacing: 1,
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: hp(1),
  },
  backButtonText: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.base,
  },
});