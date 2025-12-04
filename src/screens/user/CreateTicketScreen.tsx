import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
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
  Poppins_600SemiBold 
} from '@expo-google-fonts/poppins';

// Imports
import { MOCK_USERS, MOCK_SERVICES } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/CustomHeader';

type CreateTicketRouteProp = RouteProp<{ 
  params: { 
    type: 'incident' | 'request'; 
    userRole: string; 
    userId?: string;
    assetId?: string;
    isQrScan?: boolean; 
  } 
}, 'params'>;

export default function CreateTicketScreen() {
  const route = useRoute<CreateTicketRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, isDarkMode } = useTheme();

  const { type, userRole, userId, assetId, isQrScan } = route.params;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  // State
  const [step, setStep] = useState(1);
  
  // Step 1 Data
  const [guestName, setGuestName] = useState('');
  const [guestNik, setGuestNik] = useState('');
  const [guestEmail, setGuestEmail] = useState(''); 
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  
  // Step 2 Data
  const [opd, setOpd] = useState(''); // Nama OPD
  const [serviceType, setServiceType] = useState(''); // Jenis Layanan / Katalog
  const [subService, setSubService] = useState(''); // Sub Layanan (Request)
  const [detailService, setDetailService] = useState(''); // Detail Layanan (Request)
  const [assetName, setAssetName] = useState(''); // Nama Aset (Incident)
  const [date, setDate] = useState(new Date().toLocaleDateString('id-ID')); // Tanggal (Auto Today)
  const [title, setTitle] = useState(''); // Judul
  const [description, setDescription] = useState(''); // Deskripsi

  const employeeData = userRole === 'employee' ? MOCK_USERS.find(u => u.id === userId) : null;

  useEffect(() => {
    if (isQrScan && assetId) {
      setAssetName(assetId);
      setTitle(`Laporan Aset: ${assetId}`);
    }
  }, [isQrScan, assetId]);

  const handleNext = () => {
    if (userRole === 'guest') {
      if (!guestName || !guestNik || !guestPhone) {
        Alert.alert('Mohon Lengkapi', 'Data diri wajib diisi.');
        return;
      }
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = () => {
    if (!description || !title) {
      Alert.alert('Mohon Lengkapi', 'Judul dan Deskripsi wajib diisi.');
      return;
    }
    Alert.alert(
      'Berhasil', 
      'Tiket berhasil dikirim! Nomor tiket akan dikirimkan ke email Anda.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  if (!fontsLoaded) return null;

  // --- HELPER RENDER INPUT ---
  const renderInput = (label: string, value: string, setValue: (t: string) => void, placeholder: string, multiline = false, keyboardType: any = 'default', editable = true) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#053F5C' }]}>{label}</Text>
      <TextInput
        style={[
          styles.inputBox, 
          multiline && styles.textArea, 
          !editable && styles.readOnlyInput,
          { 
            backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF',
            borderColor: isDarkMode ? '#444' : '#E5E2E2',
            color: isDarkMode ? '#FFFFFF' : '#333'
          }
        ]}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#666' : '#ADB5BD'}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );

  // --- SUB-COMPONENT: STEP 2 CONTENT ---
  const renderStep2Content = () => {
    return (
      <View style={styles.formSection}>
        
        {/* FORMULIR BERBEDA UNTUK INCIDENT VS REQUEST */}
        
        {type === 'incident' ? (
          // --- FORM PENGADUAN ---
          <>
            {renderInput('Nama OPD', opd, setOpd, 'Contoh: Dinas Kominfo')}
            {renderInput('Jenis Layanan', serviceType, setServiceType, 'Contoh: Jaringan Internet')}
            {renderInput('Nama Aset', assetName, setAssetName, 'Contoh: Router Lt 2', false, 'default', !isQrScan)}
            {renderInput('Tanggal Kejadian', date, setDate, '', false, 'default', false)} 
            {renderInput('Judul Pengajuan', title, setTitle, 'Contoh: Wifi Mati Total')}
            {renderInput('Deskripsi Pengaduan', description, setDescription, 'Jelaskan kronologi...', true)}
          </>
        ) : (
          // --- FORM PERMINTAAN ---
          <>
             {renderInput('Katalog Layanan', serviceType, setServiceType, 'Pilih Katalog')}
             {renderInput('Sub Layanan', subService, setSubService, 'Pilih Sub Layanan')}
             {renderInput('Detail Layanan', detailService, setDetailService, 'Contoh: Permintaan Laptop Baru')}
             {renderInput('Tanggal Permintaan', date, setDate, '', false, 'default', false)}
             {renderInput('Judul Permintaan', title, setTitle, 'Contoh: Laptop untuk Staff Baru')}
             {renderInput('Deskripsi Permintaan', description, setDescription, 'Jelaskan spesifikasi...', true)}
          </>
        )}

        {/* UPLOAD FILE (SAMA UNTUK KEDUANYA) */}
        <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#053F5C' }]}>Lampiran (Opsional)</Text>
        <TouchableOpacity style={[styles.uploadBox, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F0F9FF', borderColor: isDarkMode ? '#444' : '#053F5C' }]}>
          <Ionicons name="cloud-upload-outline" size={30} color="#555657" />
          <Text style={styles.uploadTitle}>Unggah File</Text>
          <Text style={styles.uploadSub}>PNG, JPG, PDF (Maks. 5 MB)</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <CustomHeader 
        type="page"
        title={type === 'incident' ? 'Pengaduan' : 'Permintaan'}
      />

      <View style={[styles.contentContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
        
        {/* INDIKATOR STEP */}
        <View style={styles.stepContainer}>
          <View style={styles.stepWrapper}>
            <View style={[styles.stepCircle, step >= 1 ? styles.stepActive : styles.stepInactive]}>
              <Text style={[styles.stepText, step >= 1 ? styles.stepTextActive : styles.stepTextInactive]}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Data Pelapor</Text>
          </View>
          <View style={[styles.stepLine, step >= 2 ? {backgroundColor: '#053F5C'} : {backgroundColor: '#E0E0E0'}]} />
          <View style={styles.stepWrapper}>
            <View style={[styles.stepCircle, step >= 2 ? styles.stepActive : styles.stepInactive]}>
              <Text style={[styles.stepText, step >= 2 ? styles.stepTextActive : styles.stepTextInactive]}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Detail</Text>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            
            {/* HEADER TEXT (HANYA DI STEP 1) */}
            {step === 1 && (
              <View style={styles.headerTextContainer}>
                <Text style={[styles.titleForm, { color: isDarkMode ? '#FFF' : '#053F5C' }]}>
                  {type === 'incident' ? 'Formulir Pengaduan' : 'Formulir Permintaan'}
                </Text>
                <Text style={[styles.subtitleForm, { color: isDarkMode ? '#CCC' : '#053F5C' }]}>
                  Silahkan isi detail {type === 'incident' ? 'pengaduan' : 'permintaan'} Anda pada form ini, kami akan segera menindaklanjuti
                </Text>
              </View>
            )}

            {/* SEPARATOR JUDUL SECTION */}
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionHeaderText}>
                {step === 1 
                  ? (type === 'incident' ? 'Data Diri Pelapor' : 'Data Diri Pemohon') 
                  : (type === 'incident' ? 'Detail Pengaduan' : 'Detail Permintaan')}
              </Text>
            </View>
            
            {/* KONTEN FORM */}
            {step === 1 ? (
              <View style={styles.formSection}>
                {userRole === 'guest' ? (
                  <>
                    {renderInput('Nama Lengkap', guestName, setGuestName, 'Contoh: Budi Santoso')}
                    {renderInput('NIK', guestNik, setGuestNik, '16 digit NIK', false, 'numeric')}
                    {renderInput('Email', guestEmail, setGuestEmail, 'email@contoh.com', false, 'email-address')}
                    {renderInput('No. Telepon (Whatsapp)', guestPhone, setGuestPhone, '08...', false, 'phone-pad')}
                    {renderInput('Alamat Lengkap', guestAddress, setGuestAddress, 'Jalan...', true)}
                  </>
                ) : (
                  <View style={[styles.readOnlyBox, { backgroundColor: isDarkMode ? '#2C2C2C' : '#F0F7FF', borderColor: isDarkMode ? '#444' : '#CCE5FF' }]}>
                    <View style={styles.row}>
                      <Ionicons name="person" size={18} color={isDarkMode ? '#AAA' : '#053F5C'} style={{marginRight:8}} />
                      <Text style={[styles.roText, { color: isDarkMode ? '#FFF' : '#333' }]}>{employeeData?.name}</Text>
                    </View>
                    <View style={styles.row}>
                      <Ionicons name="card" size={18} color={isDarkMode ? '#AAA' : '#053F5C'} style={{marginRight:8}} />
                      <Text style={[styles.roText, { color: isDarkMode ? '#FFF' : '#333' }]}>NIP: {employeeData?.nip}</Text>
                    </View>
                    <View style={styles.row}>
                      <Ionicons name="business" size={18} color={isDarkMode ? '#AAA' : '#053F5C'} style={{marginRight:8}} />
                      <Text style={[styles.roText, { color: isDarkMode ? '#FFF' : '#333' }]}>{employeeData?.opd}</Text>
                    </View>
                    <Text style={styles.roNote}>*Data diambil otomatis dari profil pegawai</Text>
                  </View>
                )}
              </View>
            ) : (
              // STEP 2 CONTENT (Render fungsi terpisah di atas)
              renderStep2Content()
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        {/* FOOTER BUTTONS */}
        <View style={styles.footer}>
          {/* TOMBOL KEMBALI (Bulat Panah Kiri) */}
          {step === 2 && (
            <TouchableOpacity style={styles.btnBackCircle} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#053F5C" />
            </TouchableOpacity>
          )}
          
          <View style={{ flex: 1 }} /> 

          {/* TOMBOL LANJUT / KIRIM */}
          {step === 1 ? (
            <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
              <Text style={styles.btnNextText}>Lanjut</Text>
              <View style={styles.arrowCircle}>
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>
          ) : (
            // TOMBOL KIRIM (Spesial Style Orange)
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
              <Ionicons name="paper-plane" size={20} color="#053F5C" style={{marginRight: 8}} />
              <Text style={styles.btnSubmitText}>Kirim {type === 'incident' ? 'Pengaduan' : 'Permintaan'}</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  contentContainer: {
    flex: 1,
    marginTop: -hp('2%'), // Overlap Header
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
  },

  // HEADER TEKS
  headerTextContainer: { alignItems: 'center', marginBottom: hp('3%') },
  titleForm: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(20), textAlign: 'center', marginBottom: 5 },
  subtitleForm: { fontFamily: 'Poppins_400Regular', fontSize: RFValue(12), textAlign: 'center', paddingHorizontal: 10 },
  
  // SECTION HEADER ORANGE
  sectionHeaderBox: { backgroundColor: '#FFA629', borderRadius: 9, paddingVertical: 8, alignItems: 'center', marginBottom: hp('3%') },
  sectionHeaderText: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(14), color: '#053F5C' },
  
  // FORM
  formSection: { marginBottom: 20 },
  inputContainer: { marginBottom: hp('2%') },
  label: { fontFamily: 'Poppins_500Medium', fontSize: RFValue(12), color: '#053F5C', marginBottom: 5, marginLeft: 5 },
  inputBox: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 15,
    height: hp('6%'), 
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(14),
  },
  textArea: { height: hp('12%'), paddingTop: 10 },
  readOnlyInput: { opacity: 0.7 },

  // STEP INDICATOR
  stepContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp('3%') },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepActive: { backgroundColor: '#053F5C' },
  stepInactive: { backgroundColor: '#E0E0E0' },
  stepText: { fontSize: 12, fontWeight: 'bold' },
  stepTextActive: { color: '#FFF' },
  stepTextInactive: { color: '#666' },
  stepLabel: { fontSize: 10, fontFamily: 'Poppins_500Medium', color: '#666' },
  stepLine: { width: 50, height: 2, marginBottom: 15 },

  // UPLOAD STYLE
  uploadBox: { 
    borderStyle: 'dashed', borderWidth: 1, borderColor: '#053F5C', 
    padding: 20, alignItems: 'center', borderRadius: 9, 
    backgroundColor: '#F0F9FF', marginBottom: 20 
  },
  uploadTitle: { fontFamily: 'Poppins_600SemiBold', color: '#429EBD', marginTop: 5, fontSize: RFValue(14) },
  uploadSub: { fontFamily: 'Poppins_400Regular', color: '#9A9D9F', fontSize: RFValue(10), marginTop: 2 },

  // FOOTER BUTTONS
  footer: { flexDirection: 'row', alignItems: 'center', paddingBottom: hp('2%'), paddingTop: hp('1%') },
  
  // Back Button Circle
  btnBackCircle: {
    width: 45, height: 45, borderRadius: 22.5,
    borderWidth: 1, borderColor: '#053F5C',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFF',
  },

  // Next Button (Text + Arrow)
  btnNext: { flexDirection: 'row', alignItems: 'center' },
  btnNextText: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(16), color: '#053F5C', marginRight: 10 },
  arrowCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#053F5C', justifyContent: 'center', alignItems: 'center' },

  // Submit Button (Orange Full)
  btnSubmit: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFA629', // Orange
    paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 20, 
    // elevation: 3
  },
  btnSubmitText: {
    fontFamily: 'Poppins_600SemiBold', color: '#053F5C', fontSize: RFValue(14)
  },

  // Read Only Box (Pegawai)
  readOnlyBox: { padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  roText: { fontFamily: 'Poppins_500Medium', fontSize: RFValue(14) },
  roNote: { fontSize: 10, color: '#053F5C', marginTop: 5, fontStyle: 'italic' },
  qrInfoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E7D32', padding: 15, borderRadius: 9, marginBottom: 20 },
  qrText: { color: '#FFF', fontFamily: 'Poppins_600SemiBold', marginLeft: 5 },
});