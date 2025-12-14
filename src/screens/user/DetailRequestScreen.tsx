import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, FlatList, ActivityIndicator, Image 
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import SuccessModal from '../../components/SuccessModal';
import { wp, hp } from '../../styles/spacing';

// --- API ---
import { catalogApi } from '../../services/api/catalogs';
import { requestApi } from '../../services/api/requests'; // Pastikan file ini ada
import { uploadToCloudinary } from '../../services/uploadService';

type DetailRequestRouteProp = RouteProp<{ 
  params: { 
    userData: {
      name: string;
      nip: string;
      opdName: string;
      opdId: number; // Wajib ada ID untuk fetch katalog
      email: string;
      phone: string;
      address: string;
    };
  } 
}, 'params'>;

// OPSI ASET HARDCODE (SAMA SEPERTI WEB)
const ASSET_OPTIONS = [
  { id: "printer", name: "Printer" },
  { id: "laptop", name: "Laptop" },
  { id: "pc", name: "Personal Computer (PC)" },
  { id: "ac", name: "AC" },
  { id: "projector", name: "Proyektor" },
  { id: "scanner", name: "Scanner" },
  { id: "network_device", name: "Perangkat Jaringan" },
  { id: "lainnya", name: "Lainnya" },
];

export default function DetailRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<DetailRequestRouteProp>();
  const insets = useSafeAreaInsets();
  
  const { theme, colors, typography, isDark } = useTheme();
  const { userData } = route.params || {};

  // ✅ FIX: GENERATE STYLES DULU DI SINI
  const styles = getStyles(theme, colors, typography, isDark);

  // --- DATA OPTIONS (STATE UTAMA) ---
  const [catalogRawData, setCatalogRawData] = useState<any[]>([]); // Data mentah dari API
  
  const [level1Options, setLevel1Options] = useState<any[]>([]); // Katalog
  const [level2Options, setLevel2Options] = useState<any[]>([]); // Sub Layanan
  const [level3Options, setLevel3Options] = useState<any[]>([]); // Detail Layanan

  // --- FORM SELECTION STATE ---
  const [selectedL1, setSelectedL1] = useState<any>(null); // Katalog ID
  const [selectedL2, setSelectedL2] = useState<any>(null); // Sub Layanan ID
  const [selectedL3, setSelectedL3] = useState<any>(null); // Detail Layanan ID & Name
  
  const [isAssetRequired, setIsAssetRequired] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // --- FORM INPUT STATE ---
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTicket, setCreatedTicket] = useState('');

  // --- MODAL STATE ---
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [onSelectModal, setOnSelectModal] = useState<(item: any) => void>(() => {});

  // 1. FETCH CATALOG SAAT MOUNT (Berdasarkan OPD ID)
  useEffect(() => {
    const initCatalog = async () => {
      if (!userData?.opdId) {
        Alert.alert("Error", "ID OPD tidak ditemukan. Silakan kembali.");
        return;
      }
      try {
        const data = await catalogApi.getServiceCatalog(userData.opdId);
        setCatalogRawData(data);
        
        // Map Level 1 (Katalog)
        const l1 = data.map((item: any) => ({ id: item.id, name: item.name }));
        setLevel1Options(l1);
      } catch (error) {
        Alert.alert("Gagal", "Gagal memuat katalog layanan.");
      }
    };
    initCatalog();
  }, [userData]);

  // 2. LOGIC CASCADING: Saat Level 1 (Katalog) Berubah
  useEffect(() => {
    if (selectedL1) {
      // Cari data parent
      const parent = catalogRawData.find(c => c.id === selectedL1.id);
      if (parent && parent.children) {
        const l2 = parent.children.map((child: any) => ({ id: child.id, name: child.name }));
        setLevel2Options(l2);
      } else {
        setLevel2Options([]);
      }
    } else {
      setLevel2Options([]);
    }
    // Reset Child di bawahnya
    setSelectedL2(null);
    setLevel3Options([]);
    setSelectedL3(null);
    setIsAssetRequired(false);
    setSelectedAsset(null);
  }, [selectedL1]);

  // 3. LOGIC CASCADING: Saat Level 2 (Sub Layanan) Berubah
  useEffect(() => {
    if (selectedL1 && selectedL2) {
      const parent = catalogRawData.find(c => c.id === selectedL1.id);
      const sub = parent?.children?.find((c: any) => c.id === selectedL2.id);
      
      if (sub && sub.children) {
        const l3 = sub.children.map((child: any) => ({ 
          id: child.id, 
          name: child.name, 
          needAsset: child.needAsset // Penting buat logic asset
        }));
        setLevel3Options(l3);
      } else {
        setLevel3Options([]);
      }
    } else {
      setLevel3Options([]);
    }
    // Reset Child di bawahnya
    setSelectedL3(null);
    setIsAssetRequired(false);
    setSelectedAsset(null);
  }, [selectedL2]);

  // 4. LOGIC ASSET: Saat Level 3 (Detail) Berubah
  const handleLevel3Change = (item: any) => {
    setSelectedL3(item);
    // Logic Web: const needsAsset = selectedOption?.needAsset === true;
    if (item.needAsset) {
      setIsAssetRequired(true);
    } else {
      setIsAssetRequired(false);
      setSelectedAsset(null);
    }
  };

  // --- HANDLERS LAIN ---
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAttachment(result.assets[0]);
      }
    } catch (err) { console.warn(err); }
  };

  const handleSubmit = async () => {
    if (!selectedL3 || !title || !description) {
      Alert.alert('Belum Lengkap', 'Detail Layanan, Judul, dan Deskripsi wajib diisi.');
      return;
    }
    if (isAssetRequired && !selectedAsset) {
      Alert.alert('Belum Lengkap', 'Layanan ini membutuhkan informasi Aset.');
      return;
    }

    setLoading(true);
    try {
      let attachmentUrl = null;
      if (attachment) {
        attachmentUrl = await uploadToCloudinary(attachment.uri);
      }

      // Payload sesuai Web
      const payload = {
        title: title,
        description: description,
        service_item_id: selectedL3.id,
        service_detail: {
          permintaan: selectedL3.name, // Label detail layanan
        },
        requested_date: date.toISOString().split('T')[0],
        attachment_url: attachmentUrl,
        asset_identifier: isAssetRequired ? selectedAsset.id : null, // ID Asset jika ada
        
        // Data user tambahan jika backend butuh (opsional)
        opd_id: userData.opdId,
      };

      console.log('🚀 SENDING PAYLOAD:', payload);

      const response = await requestApi.create(payload); // Pastikan API ini ada
      const ticketNum = response?.ticket?.ticket_number || "REQ-DRAFT";
      
      setCreatedTicket(ticketNum);
      setLoading(false);
      setShowSuccess(true);

    } catch (error: any) {
      setLoading(false);
      console.error(error);
      const msg = error.response?.data?.message || "Terjadi kesalahan.";
      Alert.alert('Gagal', msg);
    }
  };

  const openModal = (title: string, data: any[], onSelect: (i: any) => void) => {
    setModalTitle(title);
    setModalData(data);
    setOnSelectModal(() => (item: any) => {
      onSelect(item);
      setModalVisible(false);
    });
    setModalVisible(true);
  };

  // --- RENDER HELPERS ---
  const renderDropdownButton = (label: string, value: string | undefined, placeholder: string, onPress: () => void, disabled = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[
          styles.inputBox, 
          styles.dropdownBox,
          { 
            backgroundColor: disabled ? (isDark ? colors.gray[800] : colors.gray[100]) : 'transparent',
            opacity: disabled ? 0.6 : 1 
          }
        ]}
        onPress={disabled ? undefined : onPress}
      >
        <Text style={{ 
          color: value ? colors.text.primary : colors.text.secondary, 
          fontSize: theme.fontSize.sm 
        }}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderInput = (label: string, value: string, setValue: (t: string) => void, placeholder: string, multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputBox, 
        multiline && styles.textAreaWrapper,
        { backgroundColor: isDark ? colors.background.card : colors.background.primary }
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.textAreaInput,
            { color: colors.text.primary }
          ]}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader type="page" title="Detail Permintaan" showNotificationButton={true} />

      <View style={styles.contentCard}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        >
          
          {/* STEPPER */}
          <View style={styles.stepContainer}>
             <View style={styles.stepWrapper}><View style={[styles.stepCircle, { backgroundColor: colors.gray[300] }]}><Text style={styles.stepTextInactive}>1</Text></View><Text style={styles.stepLabelInactive}>Pemohon</Text></View>
             <View style={[styles.stepLine, {backgroundColor: colors.primary}]} />
             <View style={styles.stepWrapper}><View style={[styles.stepCircle, { backgroundColor: colors.primary }]}><Text style={styles.stepTextActive}>2</Text></View><Text style={styles.stepLabelActive}>Detail</Text></View>
          </View>

          {/* REVIEW BOX */}
          <View style={styles.reviewBox}>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
              <Ionicons name="person-circle" size={20} color={colors.primary} style={{marginRight:5}} />
              <Text style={styles.reviewTitle}> Pemohon:</Text>
            </View>
            <Text style={styles.reviewText}>{userData?.name || 'User'}</Text>
            <Text style={styles.reviewSubText}>{userData?.opdName || 'Instansi'}</Text>
          </View>

          <View style={styles.sectionHeaderBox}>
            <Text style={styles.sectionDividerText}>Detail Permintaan</Text>
          </View>

          <View style={styles.formGroup}>
            
            {/* LEVEL 1: Katalog Layanan */}
            {renderDropdownButton(
              'Katalog Layanan', 
              selectedL1?.name, 
              'Pilih Katalog', 
              () => openModal('Pilih Katalog', level1Options, setSelectedL1)
            )}

            {/* LEVEL 2: Sub Layanan (Disabled jika L1 belum pilih) */}
            {renderDropdownButton(
              'Sub Layanan', 
              selectedL2?.name, 
              'Pilih Sub Layanan', 
              () => openModal('Pilih Sub Layanan', level2Options, setSelectedL2),
              level2Options.length === 0
            )}
            
            {/* LEVEL 3: Detail Layanan (Disabled jika L2 belum pilih) */}
            {renderDropdownButton(
              'Detail Layanan', 
              selectedL3?.name, 
              'Pilih Detail', 
              () => openModal('Pilih Detail', level3Options, handleLevel3Change),
              level3Options.length === 0
            )}

            {/* ASET (Muncul jika needAsset = true) */}
            {isAssetRequired && renderDropdownButton(
              'Pilih Aset Terkait', 
              selectedAsset?.name, 
              'Pilih Aset', 
              () => openModal('Pilih Aset', ASSET_OPTIONS, setSelectedAsset)
            )}
            
            {/* TANGGAL */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tanggal Permintaan</Text>
              <TouchableOpacity style={[styles.inputBox, styles.dropdownBox]} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: colors.text.primary, fontSize: theme.fontSize.sm }}>
                  {date.toLocaleDateString('id-ID')}
                </Text>
                <Ionicons name="calendar" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}
            </View>

            {renderInput('Judul Permintaan', title, setTitle, 'Contoh: Laptop Baru')}
            {renderInput('Alasan / Deskripsi', description, setDescription, 'Jelaskan kebutuhan...', true)}

            {/* UPLOAD */}
            <Text style={styles.label}>Lampiran (Opsional)</Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
              {attachment ? (
                <View style={{ alignItems: 'center' }}>
                   <Ionicons name="document-text" size={32} color={colors.primary} />
                   <Text style={{ color: colors.primary, fontSize: 12, marginTop: 5 }} numberOfLines={1}>
                     {attachment.name}
                   </Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="cloud-upload-outline" size={32} color="#429EBD" />
                  <Text style={{ color: '#429EBD', fontWeight: '600', marginTop: 5 }}>Unggah File</Text>
                  <Text style={{ color: colors.text.secondary, fontSize: 10 }}>PDF, JPG (Maks. 5 MB)</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={colors.text.primary} />
              <Text style={styles.btnBackText}>Kembali</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color={colors.sectionTitle.text} /> : (
                 <>
                   <Ionicons name="paper-plane" size={20} color={colors.sectionTitle.text} style={{marginRight: 8}} />
                   <Text style={styles.btnSubmitText}>Kirim</Text>
                 </>
              )}
            </TouchableOpacity>
          </View>

        </KeyboardAwareScrollView>
      </View>

      {/* Modal Picker */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => onSelectModal(item)}>
                  <Text style={{ color: colors.text.primary, fontSize: theme.fontSize.sm }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <SuccessModal 
        visible={showSuccess} 
        ticketNumber={createdTicket} 
        onClose={() => { setShowSuccess(false); navigation.navigate('UserApp', { screen: 'Beranda' }); }} 
      />

    </View>
  );
}

// --- STYLES GENERATOR ---
const getStyles = (theme: any, colors: any, typography: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  contentCard: { 
    flex: 1, 
    backgroundColor: colors.background.primary, 
    borderTopLeftRadius: theme.borderRadius['2xl'], 
    borderTopRightRadius: theme.borderRadius['2xl'], 
    paddingHorizontal: wp(6), 
    paddingTop: hp(3), 
    marginTop: -hp(2) 
  },
  
  // Stepper
  stepContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: hp(3) },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepTextActive: { ...typography.caption, fontWeight: 'bold', color: colors.white },
  stepTextInactive: { ...typography.caption, fontWeight: 'bold', color: colors.text.secondary },
  stepLabelActive: { ...typography.caption, textAlign: 'center', color: colors.text.primary },
  stepLabelInactive: { ...typography.caption, textAlign: 'center', color: colors.text.secondary },
  stepLine: { width: 50, height: 2, marginBottom: 15, alignSelf:'center' },

  // Review Box
  reviewBox: {
    backgroundColor: isDark ? colors.background.card : '#F0F7FF',
    borderColor: isDark ? colors.border.default : '#E5E2E2',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    marginBottom: 20
  },
  reviewTitle: { ...typography.label, color: colors.text.primary },
  reviewText: { ...typography.body, color: colors.text.primary, fontWeight: '600' },
  reviewSubText: { ...typography.caption, color: colors.text.secondary },

  // Section Header (Orange)
  sectionHeaderBox: { 
    backgroundColor: colors.sectionTitle.background, 
    borderRadius: theme.borderRadius.md, 
    paddingVertical: 10, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionDividerText: { 
    ...typography.sectionTitle, 
    color: colors.sectionTitle.text 
  },

  // Form
  formGroup: { gap: 15 },
  inputContainer: { marginBottom: 5 },
  label: { ...typography.label, fontSize: theme.fontSize.xs, color: colors.text.secondary, marginBottom: 6, marginLeft: 4 },
  
  inputBox: { 
    borderWidth: 1, 
    borderRadius: theme.borderRadius.md, 
    paddingHorizontal: 15, 
    height: theme.inputHeight.lg, 
    justifyContent: 'center', 
    flexDirection:'row', 
    alignItems:'center',
    borderColor: colors.border.default,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: theme.fontSize.sm,
    padding: 0
  },
  dropdownBox: { justifyContent: 'space-between' },
  textAreaWrapper: { height: 100, paddingTop: 10, alignItems: 'flex-start' },
  textAreaInput: { height: '100%', textAlignVertical: 'top' },

  // Upload Box (Fixed Style)
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

  // Footer
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30 },
  btnBack: { flexDirection: 'row', alignItems: 'center' },
  btnBackText: { ...typography.button, color: colors.text.primary, marginLeft: 5 },
  
  btnSubmit: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.sectionTitle.background, // Orange
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 25 
  },
  btnSubmitText: { ...typography.button, color: colors.sectionTitle.text }, // Blue

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  modalTitle: { ...typography.h4, color: colors.text.primary },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border.light },
});