import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, KeyboardAvoidingView 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { wp, hp, Spacing, BorderRadius, InputHeight, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

export default function CreateIncidentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // 1. Theme & Auth
  const { colors, isDark } = useTheme();
  const { user, isGuest, getUserName } = useAuthStore();

  // Params opsional (misal dari Scan QR)
  const { assetId, isQrScan } = route.params || {};

  // --- STATE FORM ---
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState(''); 
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // 2. Auto-Fill Data jika Login
  useEffect(() => {
    if (!isGuest && user) {
      setName(user.full_name || user.username || '');
      setIdNumber(user.nip || ''); // Asumsi field NIP ada
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || ''); // Asumsi field address ada
    }
  }, [isGuest, user]);

  const handleNext = () => {
    // Validasi Tamu
    if (isGuest) {
      if (!name || !idNumber || !phone) {
        Alert.alert('Mohon Lengkapi', 'Data diri wajib diisi untuk pelapor tamu.');
        return;
      }
    }

    // Lanjut ke Step 2 (Detail Insiden)
    // Kita kirim data yang sudah diisi ke layar berikutnya
    navigation.navigate('DetailIncident', {
      userData: { name, idNumber, email, phone, address },
      assetId,
      isQrScan
    });
  };

  // --- COMPONENT INPUT HELPER ---
  const renderInput = (
    label: string, 
    value: string, 
    setValue: (text: string) => void, 
    placeholder: string, 
    isMultiline: boolean = false,
    keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' = 'default'
  ) => {
    // Pegawai tidak bisa edit Nama & NIP (Read Only)
    const isReadOnly = !isGuest && (label.includes('Nama') || label.includes('NIP'));

    // Warna Input:
    // Dark Mode -> Card Background (Abu Gelap)
    // Light Mode -> White (Kalau edit), Abu (Kalau Readonly)
    const inputBg = isDark 
      ? colors.background.card 
      : (isReadOnly ? '#F3F4F6' : '#FFFFFF');
    
    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {label}
        </Text>
        <View style={[
          styles.inputWrapper, 
          isMultiline && styles.textAreaWrapper,
          { 
            backgroundColor: inputBg,
            borderColor: colors.border.default 
          }
        ]}>
          <TextInput
            style={[
              styles.input, 
              isMultiline && styles.textAreaInput,
              { color: isReadOnly ? colors.text.secondary : colors.text.primary }
            ]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.text.tertiary}
            multiline={isMultiline}
            keyboardType={keyboardType}
            editable={!isReadOnly}
            textAlignVertical={isMultiline ? 'top' : 'center'}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      
      {/* HEADER */}
      <CustomHeader 
        type="page"
        title="Pengaduan"
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* CARD KONTEN (Putih/Hitam Melengkung) */}
      <View style={[styles.contentCard, { backgroundColor: colors.background.primary }]}>
        
        {/* STEPPER INDICATOR */}
        <View style={styles.stepContainer}>
          {/* Step 1 (Active) */}
          <View style={styles.stepWrapper}>
            <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepTextActive}>1</Text>
            </View>
            <Text style={[styles.stepLabel, { color: colors.text.secondary }]}>Data Pelapor</Text>
          </View>
          
          {/* Garis Penghubung */}
          <View style={[styles.stepLine, { backgroundColor: colors.border.light }]} />
          
          {/* Step 2 (Inactive) */}
          <View style={styles.stepWrapper}>
            <View style={[styles.stepCircle, { backgroundColor: colors.border.light }]}>
              <Text style={styles.stepTextInactive}>2</Text>
            </View>
            <Text style={[styles.stepLabel, { color: colors.text.tertiary }]}>Detail Insiden</Text>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
            
            {/* JUDUL FORM */}
            <View style={styles.headerTextContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Formulir Pengaduan
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                Silahkan isi detail pengaduan Anda pada form ini, kami akan segera menindaklanjuti.
              </Text>
            </View>

            {/* SECTION DIVIDER */}
            <View style={[styles.sectionHeaderBox, { backgroundColor: colors.accent }]}>
              <Text style={[styles.sectionDividerText, { color: '#FFF' }]}>Data Diri Pelapor</Text>
            </View>
            
            {/* INPUT FIELDS */}
            <View style={styles.formGroup}>
              {renderInput('Nama Lengkap', name, setName, 'Contoh: Budi Santoso')}
              {renderInput(!isGuest ? 'NIP' : 'NIK (KTP)', idNumber, setIdNumber, 'Nomor Identitas', false, 'numeric')}
              {renderInput('Email', email, setEmail, 'email@contoh.com', false, 'email-address')}
              {renderInput('No. Telepon (WhatsApp)', phone, setPhone, '0812...', false, 'phone-pad')}
              {renderInput('Alamat Lengkap', address, setAddress, 'Jalan...', true)}
            </View>

            {/* FOOTER BUTTON NEXT */}
            <TouchableOpacity 
              style={styles.footerButton} 
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnNextText, { color: colors.text.primary }]}>
                Lanjut
              </Text>
              <View style={[styles.arrowCircle, { backgroundColor: colors.text.primary }]}>
                <Ionicons 
                  name="arrow-forward" 
                  size={16} 
                  color={colors.background.primary} // Panah warna background (kontras)
                />
              </View>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Card Melengkung
  contentCard: {
    flex: 1,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
    marginTop: -hp(2), 
  },

  // --- STEPPER ---
  stepContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: hp(3) 
  },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  stepTextActive: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#FFF' 
  },
  stepTextInactive: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#666' 
  },
  stepLabel: { 
    fontSize: 10, 
    fontFamily: FontFamily.poppins.medium 
  },
  stepLine: { 
    width: 50, 
    height: 2, 
    marginBottom: 15 
  },

  // --- HEADERS ---
  headerTextContainer: { 
    alignItems: 'center', 
    marginBottom: hp(3) 
  },
  sectionTitle: { 
    fontFamily: FontFamily.poppins.semibold, 
    fontSize: FontSize.xl, 
    textAlign: 'center', 
    marginBottom: 5 
  },
  sectionSubtitle: { 
    fontFamily: FontFamily.poppins.regular, 
    fontSize: FontSize.sm, 
    textAlign: 'center', 
    lineHeight: 20, 
    paddingHorizontal: 10 
  },

  // --- DIVIDER BOX ---
  sectionHeaderBox: { 
    borderRadius: BorderRadius.md, 
    paddingVertical: 10, 
    alignItems: 'center', 
    marginBottom: hp(3) 
  },
  sectionDividerText: { 
    fontFamily: FontFamily.poppins.semibold, 
    fontSize: FontSize.md 
  },

  // --- FORM INPUTS ---
  formGroup: { gap: hp(1.5) },
  inputContainer: { marginBottom: 5 },
  label: { 
    fontFamily: FontFamily.poppins.medium, 
    fontSize: FontSize.sm, 
    marginBottom: 6, 
    marginLeft: 4 
  },
  inputWrapper: {
    borderRadius: BorderRadius.md, 
    borderWidth: 1, 
    ...Shadow.sm
  },
  input: { 
    fontFamily: FontFamily.poppins.regular, 
    fontSize: FontSize.md, 
    paddingHorizontal: 15, 
    height: InputHeight.lg, // Responsive Height
  },
  textAreaWrapper: { 
    height: hp(15) 
  },
  textAreaInput: { 
    height: '100%', 
    paddingTop: 12 
  },

  // --- FOOTER ---
  footerButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    marginTop: hp(3) 
  },
  btnNextText: { 
    fontFamily: FontFamily.poppins.semibold, 
    fontSize: FontSize.md, 
    marginRight: 10 
  },
  arrowCircle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});