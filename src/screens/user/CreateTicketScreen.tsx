import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_USERS, MOCK_SERVICES } from '../../data/mockData';

type CreateTicketRouteProp = RouteProp<{ 
  params: { 
    type: 'incident' | 'request'; 
    userRole: string; 
    userId?: string;
    assetId?: string; // <--- Tambah ini
    isQrScan?: boolean; // <--- Tambah ini
  } 
}, 'params'>;

export default function CreateTicketScreen() {
  const route = useRoute<CreateTicketRouteProp>();
  const navigation = useNavigation();
  const { type, userRole, userId, assetId, isQrScan } = route.params;

  // --- STATE ---
  const [step, setStep] = useState(1); // 1 = Data Pelapor, 2 = Detail

  // Data Pelapor (Guest)
  const [guestName, setGuestName] = useState('');
  const [guestNik, setGuestNik] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');

  // Detail Tiket
  const [opd, setOpd] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Data User Pegawai (Auto-fill)
  const employeeData = userRole === 'employee' ? MOCK_USERS.find(u => u.id === userId) : null;

  // --- LOGIC ---

  const handleNext = () => {
    // Validasi Step 1
    if (userRole === 'guest') {
      if (!guestName || !guestNik || !guestPhone) {
        Alert.alert('Mohon Lengkapi', 'Nama, NIK, dan No HP wajib diisi.');
        return;
      }
    }
    // Jika pegawai, data otomatis ada, jadi langsung lanjut
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    // Validasi Step 2
    if (!description) {
      Alert.alert('Mohon Lengkapi', 'Deskripsi laporan wajib diisi.');
      return;
    }
    if (type === 'incident' && !title) {
        Alert.alert('Mohon Lengkapi', 'Judul insiden wajib diisi.');
        return;
    }

    // Simulasi Submit
    Alert.alert(
      'Berhasil', 
      `Tiket ${type === 'incident' ? 'Pengaduan' : 'Permintaan'} berhasil dikirim! ID Tiket akan dikirim ke email/notifikasi.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

useEffect(() => {
    if (isQrScan && assetId) {
      // Ini mengisi state 'title' dengan data QR
      setTitle(`Laporan Aset: ${assetId}`);
    }
  }, [isQrScan, assetId]);

  // --- RENDER COMPONENT ---

  // Render Step Indicator
  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepWrapper}>
        <View style={[styles.stepCircle, step >= 1 && styles.stepActive]}>
          <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>1</Text>
        </View>
        <Text style={styles.stepLabel}>Data Pelapor</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepWrapper}>
        <View style={[styles.stepCircle, step >= 2 && styles.stepActive]}>
          <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>Detail</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {renderStepIndicator()}

        <ScrollView style={styles.content}>
          <Text style={styles.headerTitle}>
            {type === 'incident' ? 'Form Pengaduan Insiden' : 'Form Permintaan Layanan'}
          </Text>

          {/* STEP 1: DATA PELAPOR */}
          {step === 1 && (
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>Identitas Pelapor</Text>
              
              {userRole === 'guest' ? (
                <>
                  <Text style={styles.label}>Nama Lengkap</Text>
                  <TextInput style={styles.input} value={guestName} onChangeText={setGuestName} placeholder="Contoh: Budi Santoso" />
                  
                  <Text style={styles.label}>NIK</Text>
                  <TextInput style={styles.input} value={guestNik} onChangeText={setGuestNik} keyboardType="numeric" placeholder="16 digit NIK" />
                  
                  <Text style={styles.label}>No. Telepon / WA</Text>
                  <TextInput style={styles.input} value={guestPhone} onChangeText={setGuestPhone} keyboardType="phone-pad" placeholder="0812..." />

                  <Text style={styles.label}>Alamat Lengkap</Text>
                  <TextInput style={[styles.input, {height: 60}]} value={guestAddress} onChangeText={setGuestAddress} multiline placeholder="Jl..." />
                </>
              ) : (
                <View style={styles.readOnlyBox}>
                  <View style={styles.row}>
                    <Ionicons name="person" size={18} color="#666" style={{marginRight:8}} />
                    <Text style={styles.roText}>{employeeData?.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Ionicons name="card" size={18} color="#666" style={{marginRight:8}} />
                    <Text style={styles.roText}>NIP: {employeeData?.nip}</Text>
                  </View>
                  <View style={styles.row}>
                    <Ionicons name="business" size={18} color="#666" style={{marginRight:8}} />
                    <Text style={styles.roText}>{employeeData?.opd}</Text>
                  </View>
                  <View style={styles.row}>
                    <Ionicons name="call" size={18} color="#666" style={{marginRight:8}} />
                    <Text style={styles.roText}>{employeeData?.phone}</Text>
                  </View>
                  <Text style={styles.roNote}>*Data diambil otomatis dari profil pegawai</Text>
                </View>
              )}
            </View>
          )}

          {/* STEP 2: DETAIL LAPORAN */}
          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>Rincian {type === 'incident' ? 'Masalah' : 'Permintaan'}</Text>

              {/* OPD Terkait (Hanya Guest) */}
              {userRole === 'guest' && (
                <>
                  <Text style={styles.label}>OPD / Dinas Terkait</Text>
                  <TextInput style={styles.input} value={opd} onChangeText={setOpd} placeholder="Contoh: Dinas Kominfo" />
                </>
              )}

              {/* Pilihan Layanan (Hanya Request) */}
              {type === 'request' && (
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.label}>Pilih Katalog Layanan</Text>
                  {MOCK_SERVICES.map((srv) => (
                    <TouchableOpacity 
                        key={srv.id} 
                        style={[styles.radioOption, title === srv.name && styles.radioActive]} 
                        onPress={() => setTitle(srv.name)}
                    >
                      <View style={[styles.radioCircle, title === srv.name && styles.radioCircleActive]} />
                      <View>
                        <Text style={styles.radioTitle}>{srv.name}</Text>
                        <Text style={styles.radioDesc}>{srv.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Judul (Hanya Incident) */}
              {type === 'incident' && (
                <>
                  <Text style={styles.label}>Judul / Aset Bermasalah</Text>
                  
                  {isQrScan ? (
                    // TAMPILAN KHUSUS SCAN QR (KOTAK HIJAU)
                    <View style={styles.qrInfoBox}>
                      <Ionicons name="qr-code" size={24} color="#fff" style={{marginRight: 10}} />
                      <View>
                        <Text style={{color:'#fff', fontSize:10, fontWeight:'bold', opacity: 0.9}}>
                          TERISI OTOMATIS VIA SCAN QR
                        </Text>
                        <Text style={{color:'#fff', fontSize:18, fontWeight:'bold'}}>
                          {assetId} {/* Menampilkan ID Aset dari QR */}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    // TAMPILAN MANUAL BIASA
                    <TextInput 
                      style={styles.input} 
                      value={title} 
                      onChangeText={setTitle} 
                      placeholder="Contoh: Wifi Mati" 
                    />
                  )}
                </>
              )}

              <Text style={styles.label}>Deskripsi Lengkap</Text>
              <TextInput 
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                value={description} 
                onChangeText={setDescription} 
                multiline 
                placeholder="Jelaskan detail masalah atau kebutuhan Anda..." 
              />

              <Text style={styles.label}>Lampiran (Opsional)</Text>
              <TouchableOpacity style={styles.uploadBox}>
                <Ionicons name="cloud-upload-outline" size={24} color="#007AFF" />
                <Text style={styles.uploadText}>Upload Foto / Dokumen</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>

        {/* FOOTER BUTTONS */}
        <View style={styles.footer}>
          {step === 2 && (
            <TouchableOpacity style={styles.btnSecondary} onPress={handleBack}>
              <Text style={styles.btnTextSecondary}>Kembali</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.btnPrimary, { flex: step === 1 ? 1 : 2 }]} 
            onPress={step === 1 ? handleNext : handleSubmit}
          >
            <Text style={styles.btnTextPrimary}>
              {step === 1 ? 'Lanjut' : 'Kirim Laporan'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  
  // Step Indicator
  stepContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepActive: { backgroundColor: '#007AFF' },
  stepText: { color: '#666', fontWeight: 'bold' },
  stepTextActive: { color: '#fff' },
  stepLabel: { fontSize: 12, color: '#666' },
  stepLine: { width: 50, height: 2, backgroundColor: '#e0e0e0', marginBottom: 15 },

  content: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15, backgroundColor: '#fafafa' },
  
  // Read Only Employee
  readOnlyBox: { backgroundColor: '#f0f7ff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#cce5ff' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  roText: { fontSize: 16, color: '#333' },
  roNote: { fontSize: 12, color: '#007AFF', marginTop: 5, fontStyle: 'italic' },

  // Radio Options
  radioOption: { flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  radioActive: { borderColor: '#007AFF', backgroundColor: '#f0f7ff' },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', marginRight: 12 },
  radioCircleActive: { borderColor: '#007AFF', backgroundColor: '#007AFF' },
  radioTitle: { fontWeight: 'bold', color: '#333' },
  radioDesc: { fontSize: 12, color: '#666' },

  uploadBox: { borderStyle: 'dashed', borderWidth: 1, borderColor: '#007AFF', padding: 20, alignItems: 'center', borderRadius: 8, backgroundColor: '#f0f7ff' },
  uploadText: { color: '#007AFF', marginTop: 5, fontWeight: '600' },

  // Footer Buttons
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', flexDirection: 'row', gap: 10 },
  btnPrimary: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', flex: 1 },
  btnSecondary: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, alignItems: 'center', flex: 1 },
  btnTextPrimary: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnTextSecondary: { color: '#333', fontWeight: 'bold', fontSize: 16 },

  qrInfoBox: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#2e7d32', // Hijau tua biar kontras
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 20
  },
});