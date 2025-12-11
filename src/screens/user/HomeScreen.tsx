import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

// 1. IMPORT LIBRARY SAFE AREA
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Data & Components
import { MOCK_USERS, MOCK_TICKETS } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext_OLD';
import CustomHeader from '../../components/CustomHeader';

type HomeScreenRouteProp = RouteProp<{ params: { userRole: string; userId?: string } }, 'params'>;

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<HomeScreenRouteProp>();
  
  // 2. GUNAKAN HOOK INSETS
  const insets = useSafeAreaInsets();
  
  const { colors, isDarkMode } = useTheme();

  const { userRole, userId } = route.params || { userRole: 'guest' };
  const [userName, setUserName] = useState('Masyarakat');
  const [userUnit, setUserUnit] = useState('Umum');

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

  const myTickets = MOCK_TICKETS.filter(t => t.requesterId === userId);
  
  const stats = {
    waiting: myTickets.filter(t => ['pending', 'waiting_seksi', 'waiting_bidang'].includes(t.status)).length,
    process: myTickets.filter(t => ['in_progress', 'ready', 'assigned'].includes(t.status)).length,
    done: myTickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
  };

  const goToIncidentForm = () => navigation.navigate('CreateIncident', { userRole, userId });
  const goToRequestForm = () => navigation.navigate('CreateRequest', { userRole, userId });
  const goToNotifications = () => navigation.navigate('Notifications');

  const incidentColor = isDarkMode ? '#FFFFFF' : '#053F5C'; 
  const requestColor = isDarkMode ? '#FFFFFF' : '#053F5C';  
  const iconBg = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(51, 124, 173, 0.2)'; 

  const renderSummaryCard = (count: number, label: string) => (
    <View style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#333' : 'rgba(196, 196, 196, 0.42)' }]}>
      <View style={styles.summaryCountContainer}>
        <Text style={[styles.summaryCount, { color: isDarkMode ? '#FFF' : 'rgba(0, 0, 0, 0.75)' }]}>
          {count}
        </Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryLabelContainer}>
        <Text style={[styles.summaryLabel, { color: isDarkMode ? '#FFF' : 'rgba(0, 0, 0, 0.75)' }]}>
          {label}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        // 3. APPLY PADDING TOP (Agar tidak nabrak status bar/notch)
        paddingTop: insets.top 
      }
    ]}>
      <StatusBar barStyle="light-content" backgroundColor="#053F5C" />

      <CustomHeader 
        type="home"
        userName={userName}
        userUnit={userUnit}
        onNotificationPress={goToNotifications}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ 
          // 4. APPLY PADDING BOTTOM (Agar tidak tertutup Tab Bar & Home Indicator)
          // 90 adalah perkiraan tinggi TabBar floating + sedikit spasi
          paddingBottom: 100 + insets.bottom 
        }}
      >
        <View style={styles.content}>
          
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.text : '#053F5C' }]}>
            Menu Layanan
          </Text>

          <View style={styles.menuRow}>
            <TouchableOpacity style={styles.menuItem} onPress={goToIncidentForm}>
              <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                <Ionicons name="alert-circle-outline" size={RFValue(28)} color={incidentColor} />
              </View>
              <Text style={[styles.menuText, { color: incidentColor }]}>
                Pengaduan
              </Text>
            </TouchableOpacity>

            {userRole === 'employee' && (
              <TouchableOpacity style={styles.menuItem} onPress={goToRequestForm}>
                <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                  <Ionicons name="document-text-outline" size={RFValue(28)} color={requestColor} />
                </View>
                <Text style={[styles.menuText, { color: requestColor }]}>
                  Permintaan
                </Text>
              </TouchableOpacity>
            )}
          </View>

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
    // Note: paddingTop dihandle via inline style (insets)
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
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'center', 
    gap: wp('10%'), 
    alignItems: 'flex-start',
  },
  menuItem: {
    alignItems: 'center',
    width: wp('28%'),
  },
  iconBox: {
    width: wp('18%'), 
    height: wp('18%'),
    borderRadius: 15, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(12),
    textAlign: 'center',
  },
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