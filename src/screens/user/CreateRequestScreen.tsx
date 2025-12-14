import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { wp, hp } from '../../styles/spacing';

// --- API ---
// ✅ PENTING: Kita butuh ini untuk mencari Nama OPD jika di user cuma ada ID-nya
import { catalogApi } from '../../services/api/catalogs'; 

export default function CreateRequestScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  // 1. Ambil Theme & Auth Store
  const { theme, colors, typography, isDark } = useTheme();
  const { user, isGuest, userOpdName } = useAuthStore(); 

  // --- STATE FORM ---
  const [name, setName] = useState('');
  const [nip, setNip] = useState(''); 
  const [opdName, setOpdName] = useState('');
  const [opdId, setOpdId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // 2. Validasi & Auto-Fill (DENGAN FETCH OPD NAME)
  useEffect(() => {
    const initData = async () => {
      console.log('=== CREATE REQUEST SCREEN MOUNTED ===');
      
      if (isGuest) {
        Alert.alert("Akses Ditolak", "Fitur Permintaan hanya untuk Pegawai.", [
          { text: "Kembali", onPress: () => navigation.goBack() }
        ]);
        return;
      }

      if (user) {
        console.log('👤 USER DATA FOUND');
        
        setName(user.full_name || user.username || '');
        setNip(user.nip || ''); 
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setAddress((user as any).address || '');

        // --- LOGIC PENCARIAN NAMA OPD ---
        let detectedName = userOpdName(); // Coba ambil dari store dulu
        // Ambil ID dari object nested ATAU dari field flat opd_id (sesuai log console kamu)
        let detectedId = user.opd?.id || (user as any).opd_id || null;

        console.log(`🔍 DEBUG OPD: Name="${detectedName}", ID=${detectedId}`);

        // KASUS: Kita punya ID (1), tapi Nama masih kosong ("")
        if (!detectedName && detectedId) {
          console.log('⚠️ Nama OPD kosong, mencoba fetch dari Catalog API...');
          try {
            // Ambil daftar semua OPD
            const allOpds = await catalogApi.getOpds(); 
            // Cari yang ID-nya cocok
            const foundOpd = allOpds.find((o: any) => o.id === detectedId);
            
            if (foundOpd) {
              console.log('✅ OPD FOUND IN CATALOG:', foundOpd.name);
              detectedName = foundOpd.name;
            } else {
              console.warn('❌ OPD ID not found in catalog');
            }
          } catch (error) {
            console.error('❌ Failed to fetch OPD list:', error);
          }
        }

        // Set State Akhir
        setOpdName(detectedName);
        setOpdId(detectedId);
      }
    };

    initData();
  }, [isGuest, user, navigation]);

  const handleNext = () => {
    // Validasi
    // Kita cek opdName. Jika opdId ada tapi opdName kosong, user tetap harus isi/sistem gagal load.
    if (!name || !nip || !opdName) {
      Alert.alert('Data Belum Lengkap', 'Nama, NIP, dan Nama OPD wajib terisi. Pastikan data profil Anda lengkap.');
      return;
    }
    
    const userData = {
      name,
      nip,
      opdName,
      opdId,
      email,
      phone,
      address
    };
    
    navigation.navigate('DetailRequest', { userData });
  };

  // --- HELPER STYLES ---
  const styles = getStyles(theme, colors, typography);

  // --- COMPONENT INPUT HELPER ---
  const renderInput = (
    label: string, 
    value: string, 
    setValue: (text: string) => void, 
    placeholder: string, 
    isMultiline: boolean = false,
    keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' = 'default'
  ) => {
    let isReadOnly = false;

    // Nama & NIP selalu Read Only
    if (label === 'Nama Lengkap' || label === 'NIP') {
      isReadOnly = true;
    }
    // OPD Read Only JIKA datanya berhasil ditemukan/di-fetch
    else if (label === 'Nama OPD') {
        if (value && value.trim().length > 0) {
            isReadOnly = true;
        }
    }

    const inputBg = isDark 
      ? colors.background.card 
      : (isReadOnly ? colors.gray[100] : colors.background.primary); 
    
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
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
              { 
                color: isReadOnly ? colors.text.secondary : colors.text.primary,
                fontSize: theme.fontSize.sm, 
              }
            ]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.text.secondary} 
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
    <View style={styles.container}>
      <CustomHeader 
        type="page"
        title="Permintaan Layanan"
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <View style={styles.contentCard}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={Platform.OS === 'ios' ? 50 : 100}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* STEPPER */}
          <View style={styles.stepContainer}>
            <View style={styles.stepWrapper}>
              <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepTextActive}>1</Text>
              </View>
              <Text style={[styles.stepLabel, { color: colors.text.primary }]}>Data Pemohon</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: colors.border.default }]} />
            <View style={styles.stepWrapper}>
              <View style={[styles.stepCircle, { backgroundColor: colors.border.default }]}>
                <Text style={styles.stepTextInactive}>2</Text>
              </View>
              <Text style={[styles.stepLabel, { color: colors.text.secondary }]}>Detail Layanan</Text>
            </View>
          </View>

          {/* HEADER TEXT */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.sectionTitleMain}>Formulir Permintaan</Text>
            <Text style={styles.sectionSubtitle}>
              Data Nama, NIP, dan OPD diambil otomatis dari akun Anda.
            </Text>
          </View>

          {/* DIVIDER BOX */}
          <View style={styles.sectionHeaderBox}>
            <Text style={styles.sectionDividerText}>Data Diri Pemohon</Text>
          </View>
          
          {/* FORM INPUTS */}
          <View style={styles.formGroup}>
            {renderInput('Nama Lengkap', name, setName, 'Nama Pegawai')}
            {renderInput('NIP', nip, setNip, 'Nomor Induk Pegawai', false, 'numeric')}
            
            {/* Field ini akan otomatis terisi jika fetch ID berhasil, atau bisa diketik jika gagal */}
            {renderInput('Nama OPD', opdName, setOpdName, 'Sedang memuat data instansi...')}
            
            {renderInput('Email', email, setEmail, 'email@surabaya.go.id', false, 'email-address')}
            {renderInput('No. Telepon (WhatsApp)', phone, setPhone, '0812...', false, 'phone-pad')}
            {renderInput('Alamat Lengkap', address, setAddress, 'Gedung A Lantai 2...', true)}
          </View>

          {/* FOOTER BUTTON */}
          <TouchableOpacity 
            style={styles.footerButton} 
            onPress={handleNext}
            activeOpacity={0.7}
          >
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

// --- STYLES GENERATOR ---
const getStyles = (theme: any, colors: any, typography: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.primary 
  },
  contentCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: theme.borderRadius['2xl'],
    borderTopRightRadius: theme.borderRadius['2xl'],
    paddingHorizontal: wp(6),
    paddingTop: hp(3),
    marginTop: -hp(2), 
  },
  
  // Stepper
  stepContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp(3) },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepTextActive: { ...typography.caption, fontWeight: 'bold', color: colors.white },
  stepTextInactive: { ...typography.caption, fontWeight: 'bold', color: colors.text.secondary },
  stepLabel: { ...typography.caption, textAlign: 'center' },
  stepLine: { width: 50, height: 2, marginBottom: 15 },

  // Headers
  headerTextContainer: { alignItems: 'center', marginBottom: hp(3) },
  sectionTitleMain: { ...typography.h4, color: colors.text.primary, textAlign: 'center', marginBottom: 5 },
  sectionSubtitle: { ...typography.bodySmall, color: colors.text.secondary, textAlign: 'center', paddingHorizontal: 10 },

  // Section Divider
  sectionHeaderBox: { 
    backgroundColor: colors.sectionTitle.background, 
    borderRadius: theme.borderRadius.md, 
    paddingVertical: 8, 
    alignItems: 'center', 
    marginBottom: hp(2) 
  },
  sectionDividerText: { 
    ...typography.sectionTitle, 
    color: colors.sectionTitle.text 
  },

  // Form
  formGroup: { gap: hp(1.2) },
  inputContainer: { marginBottom: 2 },
  label: { 
    ...typography.label, 
    fontSize: theme.fontSize.xs, 
    color: colors.text.secondary, 
    marginBottom: 4, 
    marginLeft: 4 
  },
  inputWrapper: { 
    borderRadius: theme.borderRadius.md, 
    borderWidth: 1, 
    justifyContent: 'center', 
    height: theme.inputHeight.md, 
    ...theme.shadow.sm 
  },
  input: { 
    fontFamily: theme.fontFamily.poppins.regular,
    fontSize: theme.fontSize.sm, 
    paddingHorizontal: 12, 
    height: '100%',
    includeFontPadding: false, 
    paddingVertical: 0, 
  },
  textAreaWrapper: { 
    height: 100, 
    justifyContent: 'flex-start' 
  },
  textAreaInput: { 
    height: '100%', 
    paddingTop: 10, 
    paddingBottom: 10,
    textAlignVertical: 'top'
  },

  // Footer
  footerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: hp(3) },
  btnNextText: { ...typography.button, color: colors.text.primary, marginRight: 10 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});