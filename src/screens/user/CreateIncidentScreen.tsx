import React, { useState, useEffect } from 'react';
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

import { MOCK_USERS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/CustomHeader';

type IncidentRouteProp = RouteProp<{ 
  params: { 
    userRole: string; 
    userId?: string;
    assetId?: string; 
    isQrScan?: boolean; 
  } 
}, 'params'>;

export default function CreateIncidentScreen() {
  const route = useRoute<IncidentRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  // 1. AMBIL THEME
  const { colors, isDarkMode } = useTheme();

  const { userRole, userId, assetId, isQrScan } = route.params;

  // --- STATE DATA DIRI ---
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState(''); 
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (userRole === 'employee' && userId) {
      const employee = MOCK_USERS.find(u => u.id === userId);
      if (employee) {
        setName(employee.name);
        setIdNumber(employee.nip || '');
        setEmail(employee.email);
        setPhone(employee.phone);
        setAddress(employee.address || 'Alamat Kantor');
      }
    }
  }, [userRole, userId]);

  const handleNext = () => {
    if (userRole === 'guest') {
      if (!name || !idNumber || !phone) {
        Alert.alert('Mohon Lengkapi', 'Data diri wajib diisi sebelum lanjut.');
        return;
      }
    }

    navigation.navigate('DetailIncident', {
      userData: { name, idNumber, email, phone, address },
      userRole,
      userId,
      assetId,
      isQrScan
    });
  };

  // Helper Render Input dengan Warna Konsisten (Sama seperti Request)
  const renderInput = (
    label: string, 
    value: string, 
    setValue: (text: string) => void, 
    placeholder: string, 
    isMultiline: boolean = false,
    keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad' = 'default'
  ) => {
    const isReadOnly = userRole === 'employee' && (label.includes('Nama') || label.includes('NIP'));

    // Warna Input Box
    const inputBg = isDarkMode ? '#2C2C2C' : (isReadOnly ? '#F5F5F5' : '#FFFFFF');
    const borderColor = isDarkMode ? '#444444' : '#CBCBCB';
    const textColor = isDarkMode ? (isReadOnly ? '#AAAAAA' : '#FFFFFF') : (isReadOnly ? '#888888' : '#333333');

    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#AAAAAA' : '#555657' }]}>
          {label}
        </Text>
        <View style={[
          styles.inputWrapper, 
          isMultiline && styles.textAreaWrapper,
          { 
            backgroundColor: inputBg,
            borderColor: borderColor 
          }
        ]}>
          <TextInput
            style={[
              styles.input, 
              isMultiline && styles.textAreaInput,
              { color: textColor }
            ]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={isDarkMode ? '#666666' : '#B0B0B0'}
            multiline={isMultiline}
            keyboardType={keyboardType}
            editable={!isReadOnly}
            textAlignVertical={isMultiline ? 'top' : 'center'}
          />
        </View>
      </View>
    );
  };

  const goToNotifications = () => navigation.navigate('Notifications');

  return (
    // Background Utama
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <CustomHeader 
        type="page"
        title="Pengaduan"
        showNotificationButton={true} 
        onNotificationPress={goToNotifications}
      />

      {/* PERBAIKAN: Card Background Hitam Pekat di Dark Mode (Bukan Abu Card) */}
      <View style={[
        styles.contentCard, 
        { backgroundColor: isDarkMode ? colors.background : '#FFFFFF' }
      ]}>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepWrapper}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Text style={styles.stepTextActive}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Data Pelapor</Text>
          </View>
          <View style={[styles.stepLine, {backgroundColor: '#053F5C'}]} />
          <View style={styles.stepWrapper}>
            <View style={[styles.stepCircle, styles.stepInactive]}>
              <Text style={styles.stepTextInactive}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Detail Insiden</Text>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
            
            <View style={styles.headerTextContainer}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#053F5C' }]}>
                Formulir Pengaduan
              </Text>
              <Text style={[styles.sectionSubtitle, { color: isDarkMode ? '#CCCCCC' : '#053F5C' }]}>
                Silahkan isi detail pengaduan Anda pada form ini, kami akan segera menindaklanjuti
              </Text>
            </View>

            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionDividerText}>Data Diri Pelapor</Text>
            </View>
            
            <View style={styles.formGroup}>
              {renderInput('Nama Lengkap', name, setName, 'Contoh: Budi Santoso')}
              {renderInput(userRole === 'employee' ? 'NIP' : 'NIK', idNumber, setIdNumber, '198002...', false, 'numeric')}
              {renderInput('Email', email, setEmail, 'email@contoh.com', false, 'email-address')}
              {renderInput('No. Telepon (WhatsApp)', phone, setPhone, '0812...', false, 'phone-pad')}
              {renderInput('Alamat Lengkap', address, setAddress, 'Jalan...', true)}
            </View>

            <View style={styles.footer}>
              <View style={{ flex: 1 }} /> 
              <TouchableOpacity style={styles.btnNext} onPress={handleNext}>
                <Text style={[styles.btnNextText, { color: isDarkMode ? '#FFFFFF' : '#053F5C' }]}>
                  Lanjut
                </Text>
                <View style={[styles.arrowCircle, { backgroundColor: isDarkMode ? '#FFFFFF' : '#373838' }]}>
                  <Ionicons name="arrow-forward" size={16} color={isDarkMode ? '#000' : '#FFF'} />
                </View>
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
    marginTop: -hp('2%'), 
  },
  stepContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: hp('3%') },
  stepWrapper: { alignItems: 'center', width: 80 },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  stepActive: { backgroundColor: '#053F5C' },
  stepInactive: { backgroundColor: '#E0E0E0' },
  stepTextActive: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  stepTextInactive: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  stepLabel: { fontSize: 10, fontFamily: 'Poppins_500Medium', color: '#666' },
  stepLine: { width: 50, height: 2, marginBottom: 15 },

  headerTextContainer: { alignItems: 'center', marginBottom: hp('3%') },
  sectionTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(20), textAlign: 'center', marginBottom: 5 },
  sectionSubtitle: { fontFamily: 'Poppins_400Regular', fontSize: RFValue(12), textAlign: 'center', lineHeight: RFValue(18), paddingHorizontal: 10 },

  sectionHeaderBox: { backgroundColor: '#FFA629', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: hp('3%') },
  sectionDividerText: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(14), color: '#053F5C' },

  formGroup: { gap: hp('1.5%') },
  inputContainer: { marginBottom: 5 },
  label: { fontFamily: 'Poppins_500Medium', fontSize: RFValue(12), marginBottom: 6, marginLeft: 4 },
  
  inputWrapper: {
    borderRadius: 9, borderWidth: 1, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 
  },
  input: { fontFamily: 'Poppins_400Regular', fontSize: RFValue(14), paddingHorizontal: 15, height: hp('6%') },
  textAreaWrapper: { height: hp('15%') },
  textAreaInput: { height: '100%', paddingTop: 12 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: hp('3%') },
  btnNext: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  btnNextText: { fontFamily: 'Poppins_600SemiBold', fontSize: RFValue(16), marginRight: 10 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
});