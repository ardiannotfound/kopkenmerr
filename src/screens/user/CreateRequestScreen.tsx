import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, KeyboardAvoidingView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { wp, hp, Spacing, BorderRadius, InputHeight, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

export default function CreateRequestScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Theme & Auth
  const { colors, isDark } = useTheme();
  const { user, isGuest } = useAuthStore(); 

  // --- STATE DATA PEMOHON ---
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState(''); 
  const [opdName, setOpdName] = useState('');   
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // 2. Auto-Fill Data
  useEffect(() => {
    if (!isGuest && user) {
      setName(user.full_name || user.username || '');
      // Asumsi NIP ada di user object (gunakan 'as any' jika type belum diupdate)
      setIdNumber((user as any).nip || '');
      
      // ✅ PERBAIKAN ERROR TS: Gunakan casting (user as any) untuk akses properti dinamis
      // Cek opd_name atau opd atau opd_id
      const userOpd = (user as any).opd_name || (user as any).opd || (user as any).unit || '';
      setOpdName(userOpd);
      
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress((user as any).address || '');
    }
  }, [isGuest, user]);

  const handleNext = () => {
    // Validasi input
    if (!name || !idNumber || !opdName || !phone) {
      Alert.alert('Mohon Lengkapi', 'Data diri wajib diisi sebelum lanjut.');
      return;
    }

    // Lanjut ke Step 2
    navigation.navigate('DetailRequest', {
      userData: { name, idNumber, opd: opdName, email, phone, address }
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
    // Logic ReadOnly: Pegawai tidak bisa edit Nama, NIP, OPD (Kecuali alamat/hp mungkin berubah)
    const isReadOnly = !isGuest && (label.includes('Nama') || label.includes('NIP') || label.includes('Nama OPD'));

    // Warna Input Responsif
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
        title="Permintaan"
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        // Hapus offset jika mengganggu, atau sesuaikan
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ flexGrow: 1}}
        >
          
          {/* CARD KONTEN */}
          <View style={[
            styles.contentCard, 
            { backgroundColor: colors.background.primary }
          ]}>
            
            {/* STEPPER */}
            <View style={styles.stepContainer}>
              <View style={styles.stepWrapper}>
                <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepTextActive}>1</Text>
                </View>
                <Text style={[styles.stepLabel, { color: colors.text.secondary }]}>Data Pemohon</Text>
              </View>
              <View style={[styles.stepLine, { backgroundColor: colors.border.light }]} />
              <View style={styles.stepWrapper}>
                <View style={[styles.stepCircle, { backgroundColor: colors.border.light }]}>
                  <Text style={styles.stepTextInactive}>2</Text>
                </View>
                <Text style={[styles.stepLabel, { color: colors.text.tertiary }]}>Detail Layanan</Text>
              </View>
            </View>

            {/* HEADER TEXT */}
            <View style={styles.headerTextContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Formulir Permintaan
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                Silahkan isi detail permintaan Anda pada form ini, kami akan segera menindaklanjuti.
              </Text>
            </View>

            {/* DIVIDER BOX */}
            <View style={[styles.sectionHeaderBox, { backgroundColor: colors.accent }]}>
              <Text style={[styles.sectionDividerText, { color: '#FFF' }]}>Data Diri Pemohon</Text>
            </View>
            
            {/* FORM INPUTS */}
            <View style={styles.formGroup}>
                {renderInput('Nama Lengkap', name, setName, 'Contoh: Budi Santoso')}
                {renderInput(!isGuest ? 'NIP' : 'NIK', idNumber, setIdNumber, 'Nomor Induk...', false, 'numeric')}
                {renderInput('Nama OPD', opdName, setOpdName, 'Dinas Kominfo')}
                {renderInput('Email', email, setEmail, 'email@contoh.com', false, 'email-address')}
                {renderInput('No. Telepon (WhatsApp)', phone, setPhone, '0812...', false, 'phone-pad')}
                {renderInput('Alamat Lengkap', address, setAddress, 'Jalan...', true)}
            </View>

            {/* FOOTER BUTTON */}
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
                  color={colors.background.primary} 
                />
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  contentCard: {
    flex: 1,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
    marginTop: -hp(2), 
    minHeight: hp(80),
  },

  // --- STEPPER ---
  stepContainer: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp(3) 
  },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { 
    width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 
  },
  stepTextActive: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  stepTextInactive: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  stepLabel: { fontSize: 10, fontFamily: FontFamily.poppins.medium },
  stepLine: { width: 50, height: 2, marginBottom: 15 },

  // --- HEADERS ---
  headerTextContainer: { alignItems: 'center', marginBottom: hp(3) },
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

  // --- FORM ---
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
    height: InputHeight.lg, 
  },
  textAreaWrapper: { height: hp(15) },
  textAreaInput: { height: '100%', paddingTop: 12 },

  // --- FOOTER ---
  footerButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', 
    marginTop: hp(4), marginBottom: hp(2) 
  },
  btnNextText: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.md, marginRight: 10 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});