import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator // ✅ Import Loading Indicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS API ---
import { authApi } from '../../services/api/auth'; // ✅ Import API

// --- IMPORTS SVG ---
import SaveIcon from '../../../assets/icons/simpan.svg'; 

// ============================================================================
// KOMPONEN INPUT PASSWORD
// ============================================================================
const PasswordField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  theme 
}: any) => {
  const { colors, isDark } = theme;
  const [isSecure, setIsSecure] = useState(true); 

  return (
    <View style={[styles.fieldContainer, { marginTop: 25 }]}> 
      
      <View style={[
        styles.inputBorder, 
        { 
          borderColor: isDark ? colors.border.default : '#E0E0E0',
          backgroundColor: 'transparent'
        }
      ]}>
        <TextInput
          style={[
            styles.input, 
            { color: colors.text.primary }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={isSecure}
        />

        <TouchableOpacity 
          onPress={() => setIsSecure(!isSecure)} 
          style={styles.eyeIconWrapper}
          activeOpacity={0.6}
        >
          <Ionicons 
            name={isSecure ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color={colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.labelWrapper, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.labelText, { color: colors.text.secondary }]}>
          {label}
        </Text>
      </View>

    </View>
  );
};

// ============================================================================
// MAIN SCREEN
// ============================================================================
export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>(); 
  const { colors, isDark } = useTheme();
  const theme = { colors, isDark };

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false); // ✅ State Loading

  const handleSubmit = async () => {
    // 1. Validasi Input
    if (!oldPass || !newPass || !confirmPass) {
      Alert.alert("Perhatian", "Mohon isi semua kolom kata sandi.");
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert("Error", "Konfirmasi kata sandi baru tidak cocok.");
      return;
    }
    if (newPass.length < 6) {
      Alert.alert("Error", "Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      // 2. Siapkan Payload (Sesuai Postman)
      const payload = {
        old_password: oldPass,
        new_password: newPass,
        confirm_new_password: confirmPass
      };

      console.log("Sending Change Password:", payload);

      // 3. Panggil API
      await authApi.changePassword(payload);

      // 4. Sukses
      Alert.alert("Sukses", "Kata sandi berhasil diubah.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (error: any) {
      console.error("Change Password Error:", error);
      
      // Ambil pesan error dari backend jika ada
      const msg = error.response?.data?.message || error.message || "Gagal mengubah kata sandi.";
      Alert.alert("Gagal", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      
      {/* 1. HEADER */}
      <CustomHeader 
        type="page" 
        title="Ganti Password" 
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* 2. DESCRIPTION TEXT */}
          <View style={styles.headerTextContainer}>
            <Text style={[styles.descriptionText, { color: colors.text.secondary }]}>
              Jangan bagikan kata sandi mu kepada siapapun demi keamanan data anda.
            </Text>
          </View>

          {/* 3. FORM FIELDS */}
          <View style={styles.formSection}>
            
            <PasswordField 
              label="Password Saat Ini" 
              value={oldPass} 
              onChangeText={setOldPass} 
              placeholder="Masukkan password lama"
              theme={theme}
            />

            <PasswordField 
              label="Password Baru" 
              value={newPass} 
              onChangeText={setNewPass} 
              placeholder="Masukkan Kata Sandi Baru"
              theme={theme}
            />

            <PasswordField 
              label="Konfirmasi Password" 
              value={confirmPass} 
              onChangeText={setConfirmPass} 
              placeholder="Masukkan Ulangi Kata Sandi"
              theme={theme}
            />

            {/* 4. BUTTON SIMPAN */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.saveButton, 
                  { backgroundColor: '#429EBD' },
                  loading && { opacity: 0.7 } // Efek visual saat loading
                ]} 
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading} // Cegah double tap
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <SaveIcon width={20} height={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.saveText}>Simpan Password</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    paddingBottom: 50,
  },

  // --- DESCRIPTION ---
  headerTextContainer: {
    paddingHorizontal: wp(6),
    marginTop: hp(3),
    marginBottom: hp(2), 
  },
  descriptionText: {
    fontFamily: FontFamily.poppins.regular, 
    fontSize: FontSize.sm,
    lineHeight: 22,
    textAlign: 'left',
  },

  // --- FORM SECTION ---
  formSection: {
    paddingHorizontal: wp(6),
  },
  
  // Custom Field Container
  fieldContainer: {
    position: 'relative', 
    marginBottom: 5,
  },
  inputBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 55,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.poppins.regular,
    fontSize: 13, 
    height: '100%',
  },
  
  eyeIconWrapper: {
    padding: 5,
  },

  // Label Style
  labelWrapper: {
    position: 'absolute',
    top: -10, 
    left: 12, 
    paddingHorizontal: 5, 
    zIndex: 1, 
  },
  labelText: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: 11, 
  },

  // --- BUTTON ---
  buttonContainer: {
    marginTop: hp(5),
    alignItems: 'flex-end', 
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  saveText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
    color: '#FFF',
  },
});