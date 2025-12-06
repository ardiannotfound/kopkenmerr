import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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

// Import Data & Components
import { MOCK_USERS, MOCK_TICKETS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/CustomHeader';

type HomeScreenRouteProp = RouteProp<{ params: { userRole: string; userId?: string } }, 'params'>;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<HomeScreenRouteProp>();
  
  // 1. Theme & Colors (Untuk Dark Mode)
  const { colors, isDarkMode } = useTheme();

  const { userRole, userId } = route.params || { userRole: 'guest' };
  const [userName, setUserName] = useState('Masyarakat');
  const [userUnit, setUserUnit] = useState('Umum');

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (userRole === 'employee' && userId) {
      const user = MOCK_USERS.find(u => u.id === userId);
      if (user) {
        setUserName(user.name);
        setUserUnit(user.opd || 'Pegawai Pemkot');
      }
    } else {
      setUserName('Tamu');
      setUserUnit('Masyarakat Umum');
    }
  }, [userRole, userId]);

  // --- LOGIC HITUNG STATISTIK ---
  const myTickets = MOCK_TICKETS.filter(t => t.requesterId === userId);
  
  const stats = {
    waiting: myTickets.filter(t => ['pending', 'waiting_seksi', 'waiting_bidang'].includes(t.status)).length,
    process: myTickets.filter(t => ['in_progress', 'ready', 'assigned'].includes(t.status)).length,
    done: myTickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
  };

  const goToIncidentForm = () => navigation.navigate('CreateTicket', { type: 'incident', userRole, userId });
  const goToRequestForm = () => navigation.navigate('CreateTicket', { type: 'request', userRole, userId });
  const goToNotifications = () => navigation.navigate('Notifications');

  if (!fontsLoaded) return null;

  // Render Card Ringkasan
  const renderSummaryCard = (count: number, label: string) => (
    <View style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#333' : 'rgba(196, 196, 196, 0.42)' }]}>
      {/* KIRI: ANGKA */}
      <View style={styles.summaryCountContainer}>
        <Text style={[styles.summaryCount, { color: isDarkMode ? '#FFF' : 'rgba(0, 0, 0, 0.75)' }]}>
          {count}
        </Text>
      </View>
      
      {/* TENGAH: GARIS PEMBATAS */}
      <View style={styles.summaryDivider} />
      
      {/* KANAN: LABEL */}
      <View style={styles.summaryLabelContainer}>
        <Text style={[styles.summaryLabel, { color: isDarkMode ? '#FFF' : 'rgba(0, 0, 0, 0.75)' }]}>
          {label}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#053F5C" />

      {/* 1. HEADER */}
      <CustomHeader 
        type="home"
        userName={userName}
        userUnit={userUnit}
        onNotificationPress={goToNotifications}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.content}>
          
          {/* 2. MENU LAYANAN */}
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#053F5C' }]}>
            Menu Layanan
          </Text>

          <View style={styles.menuRow}>
            {/* Tombol Pengaduan (Selalu Ada) */}
            <TouchableOpacity style={styles.menuItem} onPress={goToIncidentForm}>
              <View style={styles.iconBox}>
                <Ionicons name="alert-circle-outline" size={RFValue(28)} color="#053F5C" />
              </View>
              <Text style={[styles.menuText, { color: isDarkMode ? colors.text : '#053F5C' }]}>
                Pengaduan
              </Text>
            </TouchableOpacity>

            {/* Tombol Permintaan (Hanya Pegawai) */}
            {userRole === 'employee' && (
              <TouchableOpacity style={styles.menuItem} onPress={goToRequestForm}>
                <View style={styles.iconBox}>
                  <Ionicons name="document-text-outline" size={RFValue(28)} color="#053F5C" />
                </View>
                <Text style={[styles.menuText, { color: isDarkMode ? colors.text : '#053F5C' }]}>
                  Permintaan
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 3. RINGKASAN LAYANAN (Hanya muncul jika BUKAN Tamu) */}
          {userRole !== 'guest' && (
            <View>
              <Text style={[styles.sectionTitle, { marginTop: hp('4%'), color: isDarkMode ? colors.text : '#053F5C' }]}>
                Ringkasan Layanan
              </Text>

              <View style={styles.summaryContainer}>
                {renderSummaryCard(stats.waiting, 'Menunggu Persetujuan')}
                {renderSummaryCard(stats.process, 'Diproses')}
                {renderSummaryCard(stats.done, 'Selesai')}
              </View>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: wp('6%'),
    paddingTop: hp('3%'),
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(16),
    marginBottom: hp('2%'),
    textAlign: 'left',
  },

  // --- MENU LAYANAN ---
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Agar rapi dari kiri
    gap: wp('5%'), // Jarak antar menu
    alignItems: 'flex-start',
  },
  menuItem: {
    alignItems: 'center',
    width: wp('25%'), // Ukuran item menu
  },
  iconBox: {
    width: wp('18%'), 
    height: wp('18%'),
    borderRadius: 15, 
    backgroundColor: 'rgba(51, 124, 173, 0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(12),
    textAlign: 'center',
  },

  // --- RINGKASAN LAYANAN ---
  summaryContainer: {
    gap: hp('2%'),
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 17,
  },
  summaryCountContainer: {
    width: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCount: {
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(20),
  },
  summaryDivider: {
    width: 2, 
    height: '100%',
    backgroundColor: '#053F5C',
    marginHorizontal: wp('4%'),
  },
  summaryLabelContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(14),
  },
});