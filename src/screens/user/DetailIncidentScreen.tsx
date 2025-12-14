import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, Image, ActivityIndicator 
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location'; 

// --- IMPORTS SYSTEM ---
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useIncidentFormStore } from '../../store/incidentFormStore';
import { wp, hp } from '../../styles/spacing';
import CustomHeader from '../../components/CustomHeader';
import SuccessModal from '../../components/SuccessModal';

// --- API ---
import { catalogApi } from '../../services/api/catalogs';
import { incidentApi } from '../../services/api/incidents';
import { uploadToCloudinary } from '../../services/uploadService';

type DetailIncidentRouteProp = RouteProp<{ 
  params: { 
    userData: any; 
    assetId?: string;
    isQrScan?: boolean;
  } 
}, 'params'>;

const SERVICE_OPTIONS = [
  { id: 'Hardware', name: 'Pengaduan Aset TI (Hardware)' },
  { id: 'Jaringan', name: 'Gangguan Jaringan' },
  { id: 'Aplikasi', name: 'Masalah Sistem Informasi' },
  { id: 'Lainnya', name: 'Lainnya' },
];

const ASSET_OPTIONS = [
  { id: 'printer', name: 'Printer' },
  { id: 'ac', name: 'AC' },
  { id: 'Komputer', name: 'Komputer' },
  { id: 'aplikasi_x', name: 'Aplikasi X' },
  { id: 'lainnya', name: 'Lainnya' }, 
];

export default function DetailIncidentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<DetailIncidentRouteProp>();
  const insets = useSafeAreaInsets();
  
  const { theme, colors, typography, isDark } = useTheme();
  const { user, isGuest } = useAuthStore();
  const { detailData, setDetailData, resetForm } = useIncidentFormStore();

  const { userData, assetId, isQrScan } = route.params || {};
  const styles = getStyles(theme, colors, typography, isDark);

  // --- STATE ---
  const [opdOptions, setOpdOptions] = useState<any[]>([]);
  
  const [selectedOpd, setSelectedOpd] = useState<any>(detailData.selectedOpd);
  const [selectedCategory, setSelectedCategory] = useState<any>(detailData.selectedCategory); 
  const [selectedAsset, setSelectedAsset] = useState<any>(detailData.selectedAsset);

  const [manualAssetName, setManualAssetName] = useState('');

  const [title, setTitle] = useState(detailData.title || (isQrScan ? `Laporan Aset: ${assetId}` : ''));
  const [description, setDescription] = useState(detailData.description || '');
  const [locationStr, setLocationStr] = useState(detailData.locationStr || '');
  
  const [date, setDate] = useState(new Date(detailData.date)); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attachment, setAttachment] = useState<any>(detailData.attachment);
  
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false); 
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState<any[]>([]);
  const [onSelectModal, setOnSelectModal] = useState<(item: any) => void>(() => {});

  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTicket, setCreatedTicket] = useState('');

  // 1. INITIAL LOAD
  useEffect(() => {
    const init = async () => {
      if (!isGuest && user?.opd && !selectedOpd) {
        setSelectedOpd({ id: user.opd.id, name: user.opd.name });
      } 
      const opds = await catalogApi.getOpds();
      setOpdOptions(opds || []);
    };
    init();

    if (isQrScan && assetId) {
      setSelectedAsset({ id: assetId, name: `ID: ${assetId}` });
    }
  }, [isGuest, user, isQrScan, assetId]);

  // Sync Store
  useEffect(() => {
    setDetailData({ title, description, locationStr, selectedOpd, selectedCategory, selectedAsset, date, attachment });
  }, [title, description, locationStr, selectedOpd, selectedCategory, selectedAsset, date, attachment]);


  // --- HANDLERS ---
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Izin', 'Aktifkan lokasi.'); return; }
      const loc: any = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      let address = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (address.length > 0) {
        const addr = address[0];
        const parts = [addr.street, addr.district, addr.city].filter(Boolean);
        setLocationStr(parts.join(', '));
      } else { setLocationStr(`${loc.coords.latitude}, ${loc.coords.longitude}`); }
    } catch { Alert.alert('Gagal', 'Gagal ambil lokasi.'); } finally { setLocationLoading(false); }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });
    if (!result.canceled) setAttachment(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!selectedOpd || !selectedCategory || !title || !description || !locationStr) {
      Alert.alert('Belum Lengkap', 'Mohon lengkapi semua data wajib.');
      return;
    }
    
    if (selectedAsset?.id === 'lainnya' && !manualAssetName) {
      Alert.alert('Belum Lengkap', 'Mohon isi nama aset manual.');
      return;
    }

    setLoading(true);
    try {
      let attachmentUrl = null;
      if (attachment?.uri) attachmentUrl = await uploadToCloudinary(attachment.uri);

      let finalAssetId = null;
      let finalDescription = description;

      if (isQrScan) {
        finalAssetId = assetId;
      } else if (selectedAsset?.id === 'lainnya') {
        finalAssetId = null;
        finalDescription = `[Aset Manual: ${manualAssetName}]\n${description}`;
      } else {
        finalAssetId = selectedAsset?.id || null;
      }

      const basePayload = {
        title,
        description: finalDescription, 
        category: selectedCategory.id, 
        incident_location: locationStr,
        incident_date: date.toISOString().split('T')[0],
        opd_id: Number(selectedOpd.id),
        asset_identifier: finalAssetId,
        attachment_url: attachmentUrl,
      };

      let response;
      if (isGuest) {
        const guestPayload = { ...basePayload, reporter_name: userData?.name, reporter_nik: userData?.idNumber, reporter_email: userData?.email, reporter_phone: userData?.phone, reporter_address: userData?.address };
        response = await incidentApi.createPublic(guestPayload);
      } else {
        response = await incidentApi.create(basePayload);
      }

      setCreatedTicket(response?.ticket?.ticket_number || response?.ticket_number || "INC-New");
      resetForm();
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert("Gagal Kirim", error.response?.data?.message || "Terjadi kesalahan.");
    } finally { setLoading(false); }
  };

  const openModal = (title: string, data: any[], onSelect: (i: any) => void) => {
    setModalTitle(title); setModalData(data);
    setOnSelectModal(() => (item: any) => { onSelect(item); setModalVisible(false); });
    setModalVisible(true);
  };

  const renderDropdownButton = (label: string, value: string | undefined, placeholder: string, onPress: () => void, disabled = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.inputBox, styles.dropdownBox, { opacity: disabled ? 0.6 : 1, backgroundColor: disabled ? (isDark ? colors.gray[800] : colors.gray[100]) : 'transparent' }]}
        onPress={disabled ? undefined : onPress}
      >
        <Text style={{ color: value ? colors.text.primary : colors.text.secondary, fontSize: theme.fontSize.sm }}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader type="page" title="Detail Pengaduan" showNotificationButton={true} />

      <View style={styles.contentCard}>
        <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
          
          <View style={styles.stepContainer}>
             <View style={styles.stepWrapper}><View style={[styles.stepCircle, { backgroundColor: colors.gray[300] }]}><Text style={styles.stepTextInactive}>1</Text></View><Text style={styles.stepLabelInactive}>Data Diri</Text></View>
             <View style={[styles.stepLine, {backgroundColor: colors.primary}]} />
             <View style={styles.stepWrapper}><View style={[styles.stepCircle, { backgroundColor: colors.primary }]}><Text style={styles.stepTextActive}>2</Text></View><Text style={styles.stepLabelActive}>Detail Insiden</Text></View>
          </View>

          {isQrScan && (
            <View style={[styles.successScanBox, { borderColor: colors.success }]}>
              <Ionicons name="qr-code" size={24} color={colors.success} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.successTitle, { color: colors.success }]}>Scan QR Berhasil!</Text>
                <Text style={[styles.successText, { color: colors.text.secondary }]}>
                  ID Aset: <Text style={{ fontWeight: 'bold', color: colors.text.primary }}>{assetId}</Text>
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            </View>
          )}

          <View style={styles.reviewBox}>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
              <Ionicons name="person-circle" size={20} color={colors.primary} style={{marginRight:5}} />
              <Text style={styles.reviewTitle}>Pemohon:</Text>
            </View>
            <Text style={styles.reviewText}>{userData?.name || user?.full_name || 'User'}</Text>
          </View>

          <View style={styles.sectionHeaderBox}><Text style={styles.sectionDividerText}>Detail Pengaduan</Text></View>

          <View style={styles.formGroup}>
            {/* LOKASI */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Lokasi Kejadian (Wajib GPS)</Text>
              <View style={[styles.inputBox, { paddingRight: 5, justifyContent: 'space-between' }]}>
                <TextInput style={{ flex: 1, color: colors.text.primary, marginRight: 10, fontSize: theme.fontSize.sm }} value={locationStr} placeholder="Tekan tombol lokasi →" placeholderTextColor={colors.text.secondary} editable={false} />
                <TouchableOpacity onPress={getCurrentLocation} disabled={locationLoading} style={styles.gpsButton}>
                  {locationLoading ? <ActivityIndicator size="small" color="#FFF" /> : <Ionicons name="location" size={20} color="#FFF" />}
                </TouchableOpacity>
              </View>
            </View>

            {/* DROPDOWNS */}
            {renderDropdownButton('Nama OPD', selectedOpd?.name, 'Pilih OPD Tujuan', () => openModal('Pilih OPD', opdOptions, setSelectedOpd), !isGuest && selectedOpd !== null)}
            {renderDropdownButton('Jenis Layanan', selectedCategory?.name, 'Pilih Layanan', () => openModal('Pilih Layanan', SERVICE_OPTIONS, setSelectedCategory))}
            
            {renderDropdownButton(
              'Nama Aset', 
              selectedAsset?.name || (isQrScan ? `Aset Terdeteksi (${assetId})` : ''), 
              'Pilih Aset', 
              () => openModal('Pilih Aset', ASSET_OPTIONS, setSelectedAsset),
              isQrScan 
            )}

            {selectedAsset?.id === 'lainnya' && (
              <View style={[styles.inputContainer, { marginTop: -5 }]}>
                <Text style={styles.label}>Sebutkan Nama Aset</Text>
                <TextInput 
                  // ✅ FIX: Force color agar responsive
                  style={[styles.inputBox, { color: colors.text.primary, backgroundColor: isDark ? '#333' : '#FFF3E0', borderColor: '#FFA000' }]} 
                  value={manualAssetName} 
                  onChangeText={setManualAssetName} 
                  placeholder="Contoh: Kabel LAN Putus / Meja Patah" 
                  placeholderTextColor={colors.text.secondary} 
                />
              </View>
            )}

            {/* TANGGAL */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tanggal Kejadian</Text>
              <TouchableOpacity style={[styles.inputBox, styles.dropdownBox]} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: colors.text.primary, fontSize: theme.fontSize.sm }}>{date.toLocaleDateString('id-ID')}</Text>
                <Ionicons name="calendar" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />}
            </View>

            {/* JUDUL */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Judul Pengaduan</Text>
              <TextInput 
                // ✅ FIX: Force color agar responsive
                style={[styles.inputBox, { color: colors.text.primary }]} 
                value={title} 
                onChangeText={setTitle} 
                placeholder="Cth: Printer Rusak" 
                placeholderTextColor={colors.text.secondary} 
              />
            </View>

            {/* DESKRIPSI */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Deskripsi Pengaduan</Text>
              <TextInput 
                // ✅ FIX: Force color agar responsive
                style={[styles.inputBox, styles.textArea, { color: colors.text.primary }]} 
                value={description} 
                onChangeText={setDescription} 
                placeholder="Jelaskan detail masalah..." 
                placeholderTextColor={colors.text.secondary} 
                multiline 
                textAlignVertical="top" 
              />
            </View>

            <Text style={styles.label}>Lampiran (Opsional)</Text>
            
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
              {attachment ? (
                <View style={{ alignItems: 'center' }}>
                  <Image 
                    source={{ uri: attachment.uri }} 
                    style={{ width: 80, height: 80, borderRadius: 8, marginBottom: 8 }} 
                  />
                  <Text style={{ color: '#429EBD', fontSize: 12, fontFamily: theme.fontFamily.poppins.medium }}>
                    Ganti Foto
                  </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  {/* ✅ Icon Abu-abu */}
                  <Ionicons name="cloud-upload-outline" size={32} color="#9E9E9E" />
                  
                  {/* ✅ Teks Biru Muda */}
                  <Text style={{ 
                    color: '#429EBD', 
                    fontSize: 14, 
                    fontFamily: theme.fontFamily.poppins.medium, 
                    marginTop: 8 
                  }}>
                    Unggah File
                  </Text>
                  
                  {/* ✅ Teks Abu-abu */}
                  <Text style={{ 
                    color: '#9E9E9E', 
                    fontSize: 10, 
                    fontFamily: theme.fontFamily.poppins.regular, 
                    marginTop: 4 
                  }}>
                    PNG, JPG, PDF (Maks. 5 MB)
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={20} color={colors.text.primary} /><Text style={styles.btnBackText}>Kembali</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} disabled={loading}>{loading ? <ActivityIndicator color={colors.sectionTitle.text} /> : <><Ionicons name="paper-plane" size={20} color={colors.sectionTitle.text} style={{marginRight:8}} /><Text style={styles.btnSubmitText}>Kirim</Text></>}</TouchableOpacity>
          </View>

        </KeyboardAwareScrollView>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{modalTitle}</Text><TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={colors.text.secondary} /></TouchableOpacity></View>
            <FlatList data={modalData} keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} renderItem={({ item }) => (<TouchableOpacity style={styles.modalItem} onPress={() => onSelectModal(item)}><Text style={{ color: colors.text.primary, fontSize: theme.fontSize.sm }}>{item.name || item.label}</Text></TouchableOpacity>)} />
          </View>
        </View>
      </Modal>

      <SuccessModal visible={showSuccess} ticketNumber={createdTicket} onClose={() => { setShowSuccess(false); navigation.navigate('UserApp', { screen: 'Beranda' }); }} />
    </View>
  );
}

const getStyles = (theme: any, colors: any, typography: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  contentCard: { flex: 1, backgroundColor: colors.background.primary, borderTopLeftRadius: theme.borderRadius['2xl'], borderTopRightRadius: theme.borderRadius['2xl'], paddingHorizontal: wp(6), paddingTop: hp(3), marginTop: -hp(2) },
  
  // SCAN SUCCESS BOX
  successScanBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(0,255,0,0.1)' : '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed'
  },
  successTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 2
  },
  successText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12
  },

  stepContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: hp(3) },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepTextActive: { ...typography.caption, fontWeight: 'bold', color: colors.white },
  stepTextInactive: { ...typography.caption, fontWeight: 'bold', color: colors.text.secondary },
  stepLabelActive: { ...typography.caption, textAlign: 'center', color: colors.text.primary },
  stepLabelInactive: { ...typography.caption, textAlign: 'center', color: colors.text.secondary },
  stepLine: { width: 50, height: 2, marginBottom: 15, alignSelf:'center' },
  reviewBox: { backgroundColor: isDark ? colors.background.card : '#F0F7FF', borderColor: isDark ? colors.border.default : '#E5E2E2', borderWidth: 1, borderRadius: theme.borderRadius.md, padding: 12, marginBottom: 20 },
  reviewTitle: { ...typography.label, color: colors.text.primary },
  reviewText: { ...typography.body, color: colors.text.primary, fontWeight: '600' },
  reviewSubText: { ...typography.caption, color: colors.text.secondary },
  sectionHeaderBox: { backgroundColor: colors.sectionTitle.background, borderRadius: theme.borderRadius.md, paddingVertical: 10, alignItems: 'center', marginBottom: 20 },
  sectionDividerText: { ...typography.sectionTitle, color: colors.sectionTitle.text },
  formGroup: { gap: 15 },
  inputContainer: { marginBottom: 5 },
  label: { ...typography.label, fontSize: theme.fontSize.xs, color: colors.text.secondary, marginBottom: 6, marginLeft: 4 },
  inputBox: { borderWidth: 1, borderRadius: theme.borderRadius.md, paddingHorizontal: 15, height: theme.inputHeight.lg, justifyContent: 'center', flexDirection:'row', alignItems:'center', borderColor: colors.border.default, backgroundColor: colors.background.primary },
  dropdownBox: { justifyContent: 'space-between' },
  textArea: { height: 100, paddingTop: 10, alignItems: 'flex-start', textAlignVertical: 'top' },
  uploadBox: { 
    borderStyle: 'solid', 
    borderWidth: 1.5,      
    borderColor: '#BDBDBD', 
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5',
    paddingVertical: 25, 
    alignItems: 'center', 
    borderRadius: theme.borderRadius.md, 
    marginBottom: 10 
  },
  gpsButton: { backgroundColor: colors.button.primary, padding: 8, borderRadius: theme.borderRadius.sm, marginLeft: 5 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30 },
  btnBack: { flexDirection: 'row', alignItems: 'center' },
  btnBackText: { ...typography.button, color: colors.text.primary, marginLeft: 5 },
  btnSubmit: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sectionTitle.background, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  btnSubmitText: { ...typography.button, color: colors.sectionTitle.text },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  modalTitle: { ...typography.h4, color: colors.text.primary },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border.light },
});