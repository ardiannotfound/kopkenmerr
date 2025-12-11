import React, { useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

import { useTheme } from '../../context/ThemeContext_OLD';
import CustomHeader from '../../components/CustomHeader';

type DetailRequestRouteProp = RouteProp<{ 
  params: { 
    userData: any;
    userRole: string; 
    userId?: string;
  } 
}, 'params'>;

export default function DetailRequestScreen() {
  const route = useRoute<DetailRequestRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  const { isDarkMode, colors } = useTheme();
  const { userData } = route.params;

  const [opd, setOpd] = useState(userData.opd || ''); 
  const [subService, setSubService] = useState('');
  const [detailService, setDetailService] = useState('');
  const [date] = useState(new Date().toLocaleDateString('id-ID')); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert('Mohon Lengkapi', 'Judul dan Deskripsi wajib diisi.');
      return;
    }
    Alert.alert(
      'Berhasil', 
      'Tiket Permintaan berhasil dikirim!',
      [{ text: 'OK', onPress: () => navigation.navigate('UserApp', { screen: 'Beranda' }) }]
    );
  };

  const handleBack = () => navigation.goBack();
  const goToNotifications = () => navigation.navigate('Notifications');

  // Helper Input
  const renderInput = (label: string, value: string, setValue: (t: string) => void, placeholder: string, multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555657' }]}>{label}</Text>
      <View style={[
        styles.inputBox,
        multiline && styles.textArea,
        { 
          backgroundColor: isDarkMode ? colors.card : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#CBCBCB' 
        }
      ]}>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textAreaInput,
            { color: isDarkMode ? colors.text : '#333' }
          ]}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#666' : '#B0B0B0'}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );

  // Helper Dropdown
  const renderDropdown = (label: string, value: string, placeholder: string, icon: any = 'chevron-down') => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#555657' }]}>{label}</Text>
      <TouchableOpacity style={[
        styles.inputBox, 
        styles.dropdownBox,
        { 
          backgroundColor: isDarkMode ? colors.card : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#CBCBCB' 
        }
      ]}>
        <Text style={{ 
          color: value ? (isDarkMode ? colors.text : '#333') : (isDarkMode ? '#666' : '#B0B0B0'), 
          fontFamily: 'Poppins_400Regular', fontSize: RFValue(14) 
        }}>
          {value || placeholder}
        </Text>
        <Ionicons name={icon} size={20} color={isDarkMode ? '#AAA' : '#555657'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#053F5C' }]}>
      
      <CustomHeader 
        type="page" 
        title="Detail Permintaan" 
        showNotificationButton={true} 
        onNotificationPress={goToNotifications}
      />

      {/* PERBAIKAN WARNA CARD UTAMA: Pakai colors.background agar hitam pekat */}
      <View style={[styles.contentCard, { backgroundColor: isDarkMode ? colors.background : '#FFFFFF' }]}>
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
            
            <View style={styles.stepContainer}>
               <View style={styles.stepWrapper}>
                <View style={[styles.stepCircle, styles.stepInactive]}>
                  <Text style={styles.stepTextInactive}>1</Text>
                </View>
                <Text style={styles.stepLabel}>Pemohon</Text>
              </View>
              <View style={[styles.stepLine, {backgroundColor: '#053F5C'}]} />
              <View style={styles.stepWrapper}>
                <View style={[styles.stepCircle, styles.stepActive]}>
                  <Text style={styles.stepTextActive}>2</Text>
                </View>
                <Text style={styles.stepLabel}>Detail</Text>
              </View>
            </View>

            <View style={[styles.reviewBox, { backgroundColor: isDarkMode ? colors.card : '#F0F7FF', borderColor: isDarkMode ? colors.border : '#E5E2E2' }]}>
              <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
                <Ionicons name="person-circle" size={20} color={isDarkMode ? '#AAA' : '#053F5C'} style={{marginRight:5}} />
                <Text style={[styles.reviewTitle, { color: isDarkMode ? colors.text : '#053F5C' }]}> Pemohon:</Text>
              </View>
              <Text style={[styles.reviewText, { color: isDarkMode ? '#CCC' : '#333' }]}>{userData?.name}</Text>
              <Text style={[styles.reviewSubText, { color: isDarkMode ? '#999' : '#666' }]}>{userData?.opd || 'NIP: ' + userData?.idNumber}</Text>
            </View>

            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionDividerText}>Detail Permintaan</Text>
            </View>

            <View style={styles.formGroup}>
              {renderDropdown('Nama OPD', opd, 'Pilih Dinas / OPD')}
              {renderDropdown('Sub Layanan', subService, 'Pilih Sub Layanan')}
              {renderInput('Detail Spesifikasi', detailService, setDetailService, 'Spesifikasi...')}
              {renderDropdown('Tanggal Permintaan', date, date, 'calendar')}
              {renderInput('Judul Permintaan', title, setTitle, 'Contoh: Laptop Baru')}
              {renderInput('Alasan / Deskripsi', description, setDescription, 'Jelaskan...', true)}

              <Text style={[styles.label, { color: isDarkMode ? '#AAA' : '#053F5C' }]}>Dokumen (Opsional)</Text>
              <TouchableOpacity style={[styles.uploadBoxLarge, { backgroundColor: isDarkMode ? colors.card : '#F0F9FF', borderColor: isDarkMode ? colors.border : '#053F5C' }]}>
                <Ionicons name="document-text-outline" size={40} color={isDarkMode ? '#AAA' : '#555657'} />
                <Text style={styles.uploadTitleBlue}>Unggah Dokumen</Text>
                <Text style={styles.uploadSubGray}>PDF, DOCX (Maks. 5 MB)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.btnBackGroup} onPress={handleBack}>
                <View style={[styles.arrowCircleBack, { borderColor: isDarkMode ? '#FFF' : '#373838', backgroundColor: isDarkMode ? '#333' : '#FFF' }]}>
                   <Ionicons name="arrow-back" size={18} color={isDarkMode ? '#FFF' : '#053F5C'} />
                </View>
                <Text style={[styles.btnBackText, { color: isDarkMode ? '#FFF' : '#053F5C' }]}>Kembali</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
                <Ionicons name="paper-plane" size={20} color="#053F5C" style={{marginRight: 8}} />
                <Text style={styles.btnSubmitText}>Kirim</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentCard: {
    flex: 1,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    paddingHorizontal: wp('6%'), paddingTop: hp('3%'), marginTop: -hp('2%'),
  },
  stepContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp('3%') },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepActive: { backgroundColor: '#053F5C' },
  stepInactive: { backgroundColor: '#E0E0E0' },
  stepTextActive: { color: '#FFF', fontWeight: 'bold' },
  stepTextInactive: { color: '#666', fontWeight: 'bold' },
  stepLabel: { fontSize: 10, fontFamily: 'Poppins_500Medium', color: '#666' },
  stepLine: { width: 50, height: 2, marginBottom: 15 },

  reviewBox: { padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1 },
  reviewTitle: { fontSize: 12, fontFamily: 'Poppins_600SemiBold' },
  reviewText: { fontSize: 14, fontFamily: 'Poppins_500Medium' },
  reviewSubText: { fontSize: 12, fontFamily: 'Poppins_400Regular' },

  sectionHeaderBox: { backgroundColor: '#FFA629', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: hp('3%') },
  sectionDividerText: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(14), color: '#053F5C' },

  formGroup: { gap: hp('1.5%') },
  inputContainer: { marginBottom: 5 },
  label: { fontFamily: 'Poppins_500Medium', fontSize: RFValue(12), marginBottom: 6, marginLeft: 4 },
  
  inputBox: {
    borderWidth: 1, borderRadius: 9, 
    paddingHorizontal: 15, height: hp('6%'), 
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    justifyContent: 'center'
  },
  textInput: { fontFamily: 'Poppins_400Regular', fontSize: RFValue(14), height: '100%' },
  dropdownBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  textArea: { height: hp('15%'), paddingTop: 12, justifyContent: 'flex-start' },
  textAreaInput: { height: '100%', textAlignVertical: 'top' },

  uploadBoxLarge: {
    borderStyle: 'dashed', borderWidth: 1, 
    paddingVertical: hp('4%'), alignItems: 'center', borderRadius: 9,
    marginBottom: 20
  },
  uploadTitleBlue: { fontFamily: 'Poppins_600SemiBold', color: '#429EBD', marginTop: 5, fontSize: RFValue(14) },
  uploadSubGray: { fontFamily: 'Poppins_400Regular', color: '#9A9D9F', fontSize: RFValue(10), marginTop: 2 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: hp('2%') },
  btnBackGroup: { flexDirection: 'row', alignItems: 'center' },
  arrowCircleBack: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1, 
    justifyContent: 'center', alignItems: 'center', marginRight: 8
  },
  btnBackText: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(14) },
  btnSubmit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFA629', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, flex: 1, marginLeft: 15 },
  btnSubmitText: { fontFamily: 'Poppins_600SemiBold', color: '#053F5C', fontSize: RFValue(14) },
});