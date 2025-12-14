import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; 

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS API & SERVICES ---
import { authApi } from '../../services/api/auth';
import { uploadToCloudinary } from '../../services/uploadService';
import { CLOUDINARY_FOLDER_AVATAR } from '../../config/cloudinary';

// --- IMPORTS SVG ---
import EditIcon from '../../../assets/icons/edit.svg'; 
import SaveIcon from '../../../assets/icons/simpan.svg'; 

// ============================================================================
// KOMPONEN INPUT (DILUAR AGAR KEYBOARD TIDAK FLICKER)
// ============================================================================
const ProfileField = ({ 
  label, value, onChangeText, isEditable = false, multiline = false, theme, 
  keyboardType = 'default' // Default value
}: any) => {
  const { colors, isDark } = theme;
  
  return (
    <View style={[styles.fieldContainer, { marginTop: 15 }]}>
      <View style={[
        styles.inputBorder, 
        { 
          borderColor: isDark ? colors.border.default : '#E0E0E0',
          height: multiline ? 100 : 50,
          // ❌ JANGAN TARUH keyboardType DISINI (INI STYLE VIEW)
        }
      ]}>
        <TextInput
          style={[
            styles.input, 
            { 
              color: colors.text.primary, 
              textAlignVertical: multiline ? 'top' : 'center',
              paddingRight: isEditable ? 40 : 15,
              fontSize: 13 
            }
          ]}
          value={value}
          onChangeText={onChangeText}
          editable={isEditable}
          multiline={multiline}
          
          // ✅ TARUH DISINI (PROPERTI TEXTINPUT)
          keyboardType={keyboardType} 
        />
        
        {isEditable && (
          <View style={styles.editIconWrapper}>
            <EditIcon width={18} height={18} color={isDark ? '#FFF' : colors.primary} />
          </View>
        )}
      </View>
      
      {/* ... Label ... */}
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
export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  // Pass theme object ke child component
  const theme = { colors, isDark }; 
  
  const { user, userRole, refreshUserProfile } = useAuthStore(); 

  // --- STATE FORM ---
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // State Foto
  const [avatarUri, setAvatarUri] = useState<string | null>(null); 
  const [isUploading, setIsUploading] = useState(false);

  // --- INIT DATA ---
  useEffect(() => {
    if (user) {
      console.log("👤 Profile Loaded in Edit Screen:", user); // DEBUG LOG
      setUsername(user.username || '');
      setPhone(user.phone || '');
      setAddress((user as any).address || ''); 
      
      // Pastikan avatarUri mengambil dari user.avatar_url
      setAvatarUri(user.avatar_url || null);
    }
  }, [user]);

  // --- IMAGE PICKER ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Mohon izinkan akses galeri untuk mengganti foto.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri); 
    }
  };

  // --- LOGIC SAVE ---
const handleSave = async () => {
    setIsUploading(true);
    try {
      // 1. Tentukan URL Avatar
      let finalAvatarUrl = user?.avatar_url;

      // Cek apakah ada gambar baru yang dipilih dari galeri
      if (avatarUri && avatarUri !== user?.avatar_url) {
        console.log("🚀 Uploading image to Cloudinary...");
        
        // Upload & Tunggu URL barunya
        finalAvatarUrl = await uploadToCloudinary(avatarUri, CLOUDINARY_FOLDER_AVATAR);
        
        console.log("✅ Upload Done. URL:", finalAvatarUrl);
      }

      // 2. Siapkan Payload (Kirim data yang benar-benar mau diupdate)
      const updatedData = {
        username: username, 
        phone: phone,
        address: address,
        avatar_url: finalAvatarUrl // Pastikan ini string URL valid atau string kosong, jangan null/undefined jika backend sensitif
      };

      console.log("📤 Sending Payload:", updatedData);

      // 3. Kirim ke Backend
      await authApi.updateProfile(updatedData);

      // 4. ✅ CRITICAL FIX: Refresh Data dari Server
      // Jangan update manual, minta server kasih data terbaru
      await refreshUserProfile();

      Alert.alert("Sukses", "Profil berhasil diperbarui.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (error: any) {
      console.error("Save Profile Error:", error);
      const msg = error.response?.data?.message || "Gagal menyimpan profil.";
      Alert.alert("Gagal", msg);
    } finally {
      setIsUploading(false);
    }
  };

  // --- HELPER: FORMAT ROLE (FIX CRASH) ---
  const getRoleLabel = () => {
    const role = userRole();
    
    // PERBAIKAN: Cek apakah role valid string sebelum toLowerCase
    if (!role || typeof role !== 'string') return 'Pengguna Umum';

    const roleLower = role.toLowerCase();
    if (roleLower.includes('teknisi')) return 'Teknisi';
    if (roleLower.includes('pegawai')) return 'Pegawai';
    return 'Pengguna Umum';
  };

  const displayInitials = user?.full_name?.charAt(0).toUpperCase() || 'U';
  const nameColor = isDark ? colors.text.primary : colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      
      {/* 1. HEADER */}
      <CustomHeader 
        type="page" 
        title="Profil Pengguna" 
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* 2. KEYBOARD AVOIDING VIEW */}
      {/* Gunakan behavior padding untuk iOS dan height untuk Android agar keyboard tidak menutupi input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        // Offset disesuaikan dengan tinggi Header (sekitar 80-100) agar pas
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} 
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          // Penting: Agar bisa scroll saat keyboard muncul dan input diklik
          keyboardShouldPersistTaps="handled"
        >
          
          {/* AVATAR & INFO SECTION */}
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarWrapper}>
              <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>{displayInitials}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.avatarEditBadge, { backgroundColor: colors.background.card }]}>
                <EditIcon width={14} height={14} color={colors.primary} />
              </View>
            </TouchableOpacity>
            
            <Text style={[styles.userName, { color: nameColor }]}>
              {user?.full_name || 'User'}
            </Text>
            <Text style={[styles.userRole, { color: colors.text.secondary }]}>
              {getRoleLabel()}
            </Text>
          </View>

          {/* FORM FIELDS */}
          <View style={styles.formSection}>
            
            <ProfileField 
              label="Username" 
              value={username} 
              onChangeText={setUsername}
              isEditable={true} 
              theme={theme}
            />

            <ProfileField 
              label="Email" 
              value={user?.email || '-'} 
              isEditable={false} 
              theme={theme}
            />

            <ProfileField 
              label="No. Telepon" 
              value={phone} 
              onChangeText={setPhone} 
              isEditable={true} 
              theme={theme}
              keyboardType="phone-pad"
            />
            
            {/* Logic NIP aman dengan optional chaining */}
            <ProfileField 
              label={userRole()?.includes('pegawai') ? 'NIP' : 'NIK'} 
              value={(user as any)?.nip || '-'} 
              isEditable={false} 
              theme={theme}
            />

            <ProfileField 
              label="Nama OPD" 
              value={(user as any)?.opd?.name || 'Dinas Kominfo'} 
              isEditable={false} 
              theme={theme}
            />

            <ProfileField 
              label="Alamat" 
              value={address} 
              onChangeText={setAddress} 
              isEditable={true} 
              multiline={true}
              theme={theme}
            />

            {/* BUTTON SIMPAN */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: '#429EBD' }]} 
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <SaveIcon width={20} height={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.saveText}>Simpan Perubahan</Text>
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
    flexGrow: 1, // Agar bisa discroll meskipun konten sedikit
  },

  // --- PROFILE HEADER ---
  profileHeader: {
    alignItems: 'center',
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  avatarWrapper: {
    position: 'relative', 
    marginBottom: Spacing.sm,
    width: 110, 
    height: 110,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarContainer: {
    borderRadius: 60,
    borderWidth: 2, 
    padding: 3, 
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  
  avatarEditBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee'
  },

  userName: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.lg, 
    marginBottom: 2,
    textAlign: 'center',
  },
  userRole: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },

  // --- FORM SECTION ---
  formSection: {
    paddingHorizontal: wp(6),
  },
  fieldContainer: {
    position: 'relative', 
    marginTop: 15,
    marginBottom: 10,
  },
  inputBorder: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  input: {
    fontFamily: FontFamily.poppins.regular,
    height: '100%',
  },
  
  // LABEL STYLE
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

  editIconWrapper: {
    position: 'absolute',
    right: 15,
    top: 16, 
  },

  // --- BUTTON ---
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: Spacing.lg,
    marginBottom: hp(5),
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