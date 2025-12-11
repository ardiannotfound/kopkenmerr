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

// --- IMPORTS DESIGN SYSTEM ---
import AuthHeader from '../../components/AuthHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, InputHeight, ButtonHeight } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS LOGIC ---
import { authApi } from '../../services/api/auth';
import { useAuthStore } from '../../store/authStore';

// --- IMPORTS SVG ICONS ---
import ProfileIcon from '../../../assets/icons/profile.svg';
import EyeOpenIcon from '../../../assets/icons/matabuka.svg';   
import EyeClosedIcon from '../../../assets/icons/matatutup.svg'; 

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { colors, theme } = useTheme();
  
  // Ambil action login dari store
  const { login } = useAuthStore(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validasi Input Kosong
    if (!username || !password) {
      Alert.alert('Gagal', 'Mohon isi username dan password');
      return;
    }

    setLoading(true);
    try {
      // 2. Tembak API Login
      const response = await authApi.login({ username, password });
      
      // ============================================================
      // 🔒 SECURITY GATE: CEK ROLE SEBELUM MENYIMPAN SESI
      // ============================================================
      
      // Daftar role yang DIPERBOLEHKAN masuk ke Mobile App
      const ALLOWED_ROLES = ['teknisi', 'pegawai_opd', 'masyarakat']; 
      
      // Ambil role ID dari response (antisipasi jika object atau string)
      // Pastikan backend mengembalikan structure user.role.id atau user.role
      const userRoleId = typeof response.user.role === 'object' 
        ? response.user.role.id 
        : response.user.role; 

      if (!ALLOWED_ROLES.includes(userRoleId)) {
        Alert.alert(
          'Akses Ditolak', 
          'Aplikasi Mobile hanya untuk Pegawai OPD dan Teknisi. Admin/Kabid silakan gunakan Web Dashboard.'
        );
        setLoading(false);
        return; // BERHENTI DI SINI
      }
      // ============================================================

      // 3. Simpan ke Store (Otomatis navigasi karena RootNavigator mendeteksi perubahan auth)
      login(response.token, response.user);
      
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Gagal terhubung ke server atau username/password salah.';
      Alert.alert('Login Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword'); 
  };

  const handleBack = () => {
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
          
          <View style={styles.formHeaderTextContainer}>
            {/* FIXED: Gunakan colors.text.primary agar berubah Putih saat Dark Mode */}
            <Text style={[styles.titleLogin, { color: colors.text.primary }]}>
              Login
            </Text>
            {/* FIXED: Subtitle menggunakan secondary text color */}
            <Text style={[styles.subtitleLogin, { color: colors.text.secondary }]}>
              Silahkan login untuk melanjutkan
            </Text>
          </View>

          {/* INPUT USERNAME */}
          {/* FIXED: Label input menyesuaikan tema */}
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Email / Username
          </Text>
          <View style={[
            styles.inputBox, 
            { 
              borderColor: colors.border.default,
              backgroundColor: colors.background.card // Input background juga dinamis
            }
          ]}>
            <TextInput
              style={[styles.input, { color: colors.text.primary }]}
              placeholder="Masukkan Email/Username"
              placeholderTextColor={colors.text.secondary} // Placeholder jangan terlalu gelap di dark mode
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View style={styles.iconWrapper}>
              <ProfileIcon width={22} height={22} color={colors.text.secondary} />
            </View>
          </View>

          {/* INPUT PASSWORD */}
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Password
          </Text>
          <View style={[
            styles.inputBox, 
            { 
              borderColor: colors.border.default,
              backgroundColor: colors.background.card 
            }
          ]}>
            <TextInput
              style={[styles.input, { color: colors.text.primary }]}
              placeholder="Masukkan Password"
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.iconWrapper}>
              {secureText ? (
                 <EyeClosedIcon width={22} height={22} color={colors.text.secondary} />
              ) : (
                 <EyeOpenIcon width={22} height={22} color={colors.text.secondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* LUPA PASSWORD */}
          <TouchableOpacity 
            style={styles.forgotPassContainer}
            onPress={handleForgotPassword}
          >
            <Text style={[styles.forgotPassText, { color: colors.link }]}>Lupa Password?</Text>
          </TouchableOpacity>

          {/* TOMBOL LOGIN */}
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: colors.primary }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.loginButtonText, { color: colors.white }]}>LOGIN</Text>
            )}
          </TouchableOpacity>

          {/* TOMBOL KEMBALI */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={[styles.backButtonText, { color: colors.text.secondary }]}>Kembali</Text>
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
    marginTop: -hp(4),
    zIndex: 999
  },
  
  formHeaderTextContainer: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  titleLogin: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize['3xl'],
    marginBottom: Spacing.xs,
  },
  subtitleLogin: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
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
    height: InputHeight.lg, 
    marginBottom: Spacing.lg,
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
  
  forgotPassContainer: {
    alignItems: 'flex-end',
    marginBottom: hp(2),
  },
  forgotPassText: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
  },
  
  loginButton: {
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
  loginButtonText: {
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