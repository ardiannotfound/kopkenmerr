import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { MOCK_NOTIFICATIONS, NotificationItem } from '../../data/mockData';
import { CurrentUser } from '../../data/Session';
import { useTheme } from '../../context/ThemeContext';
import CustomHeader from '../../components/CustomHeader';

export default function NotificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors, isDarkMode } = useTheme();
  const userRole = CurrentUser.role;

  // Fonts
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  // State
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Permintaan' | 'Pengaduan'>('Semua');
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // --- LOGIC FILTER ---
  const getFilteredData = () => {
    // 1. Jika Masyarakat, tampilkan semua (tanpa filter UI)
    if (userRole === 'guest') return notifications;

    // 2. Jika Pegawai/Teknisi, filter berdasarkan Tab
    if (activeFilter === 'Semua') return notifications;
    if (activeFilter === 'Pengaduan') return notifications.filter(n => n.type === 'incident');
    if (activeFilter === 'Permintaan') return notifications.filter(n => n.type === 'request');
    
    return notifications;
  };

  // --- LOGIC KLIK ---
  const handlePress = (item: NotificationItem) => {
    // Tandai sudah dibaca
    const updatedList = notifications.map(n => 
      n.id === item.id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedList);

    // Navigasi
    if (item.ticketId) {
      navigation.navigate('TicketDetail', { ticketId: item.ticketId });
    }
  };

  if (!fontsLoaded) return null;

  // --- RENDER CARD ---
  const renderItem = ({ item }: { item: NotificationItem }) => {
    // Logic Background Card
    // Unread: Soft Blue (Light) / Dark Slate (Dark)
    // Read: White (Light) / Dark Grey (Dark)
    const cardBg = item.isRead 
      ? colors.card 
      : (isDarkMode ? '#1E293B' : '#F0F9FF');

    // Logic Warna Teks 
    // Light Mode: 053F5C (Sesuai Request)
    // Dark Mode: White (Agar terbaca)
    const textColor = isDarkMode ? '#FFFFFF' : '#053F5C';
    const subTextColor = isDarkMode ? '#CCCCCC' : '#053F5C'; // Tetap base color tapi nanti opacity main di style

    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          { 
            backgroundColor: cardBg, 
            borderColor: isDarkMode ? '#444' : '#E5E7EB' 
          }
        ]}
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        {/* ROW 1: JENIS TICKET & ID + DOT UNREAD */}
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardType, { color: textColor }]}>
            {item.type === 'incident' ? 'Pengaduan' : 'Permintaan'} - #{item.ticketId ? 'TIKET' : 'SYSTEM'}
          </Text>
          
          {/* Dot Indikator Belum Dibaca */}
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        {/* ROW 2: JUDUL PENGAJUAN */}
        <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={1}>
          {item.title}
        </Text>

        {/* ROW 3: SUBTITLE & WAKTU */}
        <View style={styles.cardFooterRow}>
          <Text style={[styles.cardSubtitle, { color: subTextColor }]} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={[styles.cardTime, { color: subTextColor }]}>
            {item.createdAt}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 1. HEADER (Page Mode) */}
      <CustomHeader 
        type="page"
        title="Notifikasi"
      />

      <View style={styles.contentContainer}>
        
        {/* 2. FILTER BUBBLES (Hanya Pegawai/Teknisi) */}
        {userRole !== 'guest' && (
          <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Semua', 'Permintaan', 'Pengaduan'].map((f) => {
                const isActive = activeFilter === f;
                // Warna Bubble
                const bubbleBg = isActive ? '#0D3B66' : (isDarkMode ? '#333' : '#FFFFFF');
                // Warna Teks Bubble
                const bubbleText = isActive ? '#FFFFFF' : (isDarkMode ? '#FFF' : '#4B5563');

                return (
                  <TouchableOpacity 
                    key={f}
                    style={[
                      styles.filterBubble, 
                      { backgroundColor: bubbleBg }
                    ]}
                    onPress={() => setActiveFilter(f as any)}
                  >
                    <Text style={[
                      styles.filterText, 
                      { color: bubbleText }
                    ]}>
                      {f === 'Semua' ? 'Semua Notifikasi' : f}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 3. LIST NOTIFIKASI */}
        <FlatList
          data={getFilteredData()}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
              <Text style={[styles.emptyText, { color: isDarkMode ? '#FFF' : '#333' }]}>
                Belum Ada Notifikasi
              </Text>
              <Text style={[styles.emptySub, { color: isDarkMode ? '#AAA' : '#999' }]}>
                Saat ini belum ada notifikasi. Semua notifikasi yang kami kirim tampil di sini!
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    // Kita tidak overlap negatif disini agar header tidak tertutup filter
    // Biarkan mengalir di bawah header
  },

  // FILTER SECTION
  filterWrapper: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
  filterBubble: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Border tipis
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(12),
  },

  // LIST SECTION
  listContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
    paddingTop: hp('1%'),
  },

  // CARD STYLE
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: hp('1.5%'),
    // Shadow
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardType: {
    fontFamily: 'Poppins_500Medium',
    fontSize: RFValue(12),
  },
  
  // Dot Indikator Unread (3B82F6)
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6', 
  },
  
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(14),
    marginBottom: 6,
  },

  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(12),
    flex: 1, 
    marginRight: 15,
  },
  cardTime: {
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(10),
    opacity: 0.6, // 60% Opacity sesuai request
    marginTop: 2,
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    marginTop: hp('10%'),
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: RFValue(16),
    marginTop: 15,
  },
  emptySub: {
    fontFamily: 'Poppins_400Regular',
    fontSize: RFValue(12),
    textAlign: 'center',
    marginTop: 5,
  },
});