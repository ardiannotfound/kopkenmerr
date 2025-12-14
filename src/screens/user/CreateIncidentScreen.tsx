import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, BackHandler 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useIncidentFormStore } from '../../store/incidentFormStore'; // ✅ Import Store
import { wp, hp } from '../../styles/spacing';

export default function CreateIncidentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  
  const { theme, colors, typography, isDark } = useTheme();
  const { user, isGuest } = useAuthStore();
  const { resetForm } = useIncidentFormStore(); // ✅ Ambil fungsi reset

  // Params dari Scan QR (Invisible Data)
  const { assetId, isQrScan } = route.params || {};

  const styles = getStyles(theme, colors, typography, isDark);

  // --- STATE FORM ---
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState(''); 
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // 1. Auto-Fill Data jika Login
  useEffect(() => {
    if (!isGuest && user) {
      setName(user.full_name || user.username || '');
      setIdNumber(user.nip || (user as any).nik || (user as any).idNumber || ''); 
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [isGuest, user]);

  // 2. ✅ LOGIC TOMBOL KEMBALI (Header & Fisik)
  const handleBackToHome = () => {
    resetForm(); // Bersihkan store detail
    navigation.goBack(); // Kembali ke home/scanner
  };

  // Handle tombol back fisik Android
  useEffect(() => {
    const backAction = () => {
      handleBackToHome();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleNext = () => {
    // Validasi Wajib
    if (!name || !phone) {
      Alert.alert('Mohon Lengkapi', 'Nama dan Nomor Telepon wajib diisi.');
      return;
    }
    // Validasi Tamu 
    if (isGuest && (!idNumber || !address)) {
       Alert.alert('Mohon Lengkapi', 'NIK dan Alamat wajib diisi untuk pelapor umum.');
       return;
    }

    // Lanjut ke Detail, bawa data scan
    navigation.navigate('DetailIncident', {
      userData: { name, idNumber, email, phone, address },
      assetId, // ✅ Data scan dibawa lari estafet
      isQrScan
    });
  };

  // Helper Input
  const renderInput = (label: string, value: string, setValue: (t: string) => void, placeholder: string, isMultiline = false, keyboardType: any = 'default') => {
    const isReadOnly = !isGuest && (label.includes('Nama') || label.includes('NIP'));
    const inputBg = isDark ? colors.background.card : (isReadOnly ? colors.gray[100] : colors.background.primary);
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputWrapper, isMultiline && styles.textAreaWrapper, { backgroundColor: inputBg, borderColor: colors.border.default }]}>
          <TextInput
            style={[styles.input, isMultiline && styles.textAreaInput, { color: isReadOnly ? colors.text.secondary : colors.text.primary }]}
            value={value} onChangeText={setValue} placeholder={placeholder} placeholderTextColor={colors.text.secondary}
            multiline={isMultiline} keyboardType={keyboardType} editable={!isReadOnly} textAlignVertical={isMultiline ? 'top' : 'center'}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <CustomHeader 
        type="page"
        title="Pengaduan"
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
        onBackPress={handleBackToHome} // ✅ Custom Back
      />

      <View style={styles.contentCard}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        >
          {/* STEPPER */}
          <View style={styles.stepContainer}>
            <View style={styles.stepWrapper}>
              <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepTextActive}>1</Text>
              </View>
              <Text style={[styles.stepLabel, { color: colors.text.primary }]}>Data Pelapor</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: colors.border.default }]} />
            <View style={styles.stepWrapper}>
              <View style={[styles.stepCircle, { backgroundColor: colors.border.default }]}>
                <Text style={styles.stepTextInactive}>2</Text>
              </View>
              <Text style={[styles.stepLabel, { color: colors.text.secondary }]}>Detail Insiden</Text>
            </View>
          </View>

          {/* HEADER TEKS */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitleMain}>Formulir Pengaduan</Text>
            <Text style={styles.sectionSubtitle}>
              {isQrScan 
                ? "Aset berhasil dipindai. Silakan lengkapi data diri Anda." 
                : "Silakan isi data diri Anda sebelum melanjutkan."}
            </Text>
          </View>

          {/* ALERT JIKA DARI SCAN */}
          {isQrScan && (
            <View style={[styles.scanAlert, { borderColor: colors.success, backgroundColor: isDark ? 'rgba(0,255,0,0.1)' : '#E8F5E9' }]}>
              <Ionicons name="qr-code" size={20} color={colors.success} />
              <Text style={[styles.scanAlertText, { color: colors.success }]}>
                Melapor untuk Aset ID: {assetId}
              </Text>
            </View>
          )}

          <View style={styles.sectionHeaderBox}>
            <Text style={styles.sectionDividerText}>Data Diri Pelapor</Text>
          </View>
          
          <View style={styles.formGroup}>
            {renderInput('Nama Lengkap', name, setName, 'Contoh: Budi Santoso')}
            {renderInput(!isGuest ? 'NIP' : 'NIK (KTP)', idNumber, setIdNumber, 'Nomor Identitas', false, 'numeric')}
            {renderInput('Email', email, setEmail, 'email@contoh.com', false, 'email-address')}
            {renderInput('No. Telepon (WhatsApp)', phone, setPhone, '0812...', false, 'phone-pad')}
            {renderInput('Alamat Lengkap', address, setAddress, 'Jalan...', true)}
          </View>

          <TouchableOpacity style={styles.footerButton} onPress={handleNext} activeOpacity={0.7}>
            <Text style={styles.btnNextText}>Lanjut</Text>
            <View style={[styles.arrowCircle, { backgroundColor: colors.text.primary }]}>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </View>
          </TouchableOpacity>

        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

// --- STYLES ---
const getStyles = (theme: any, colors: any, typography: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  contentCard: { flex: 1, backgroundColor: colors.background.primary, borderTopLeftRadius: theme.borderRadius['2xl'], borderTopRightRadius: theme.borderRadius['2xl'], paddingHorizontal: wp(6), paddingTop: hp(3), marginTop: -hp(2) },
  stepContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp(3) },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepTextActive: { ...typography.caption, fontWeight: 'bold', color: colors.white },
  stepTextInactive: { ...typography.caption, fontWeight: 'bold', color: colors.text.secondary },
  stepLabel: { ...typography.caption, textAlign: 'center', fontSize: 10 },
  stepLine: { width: 50, height: 2, marginBottom: 15 },
  headerTextContainer: { alignItems: 'center', marginBottom: hp(2) },
  sectionTitleMain: { ...typography.h4, color: colors.text.primary, textAlign: 'center', marginBottom: 5 },
  sectionSubtitle: { ...typography.bodySmall, color: colors.text.secondary, textAlign: 'center', paddingHorizontal: 10 },
  
  // Alert Scan Kecil
  scanAlert: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 20, justifyContent: 'center' },
  scanAlertText: { marginLeft: 8, fontFamily: 'Poppins_500Medium', fontSize: 12 },

  sectionHeaderBox: { backgroundColor: colors.sectionTitle.background, borderRadius: theme.borderRadius.md, paddingVertical: 8, alignItems: 'center', marginBottom: hp(2) },
  sectionDividerText: { ...typography.sectionTitle, color: colors.sectionTitle.text },
  formGroup: { gap: hp(1.2) },
  inputContainer: { marginBottom: 2 },
  label: { ...typography.label, fontSize: theme.fontSize.xs, color: colors.text.secondary, marginBottom: 4, marginLeft: 4 },
  inputWrapper: { borderRadius: theme.borderRadius.md, borderWidth: 1, justifyContent: 'center', height: theme.inputHeight.md, ...theme.shadow.sm },
  input: { fontFamily: theme.fontFamily.poppins.regular, fontSize: theme.fontSize.sm, paddingHorizontal: 12, height: '100%', includeFontPadding: false, paddingVertical: 0 },
  textAreaWrapper: { height: 100, justifyContent: 'flex-start' },
  textAreaInput: { height: '100%', paddingTop: 10, paddingBottom: 10, textAlignVertical: 'top' },
  footerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: hp(3) },
  btnNextText: { ...typography.button, color: colors.text.primary, marginRight: 10 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});