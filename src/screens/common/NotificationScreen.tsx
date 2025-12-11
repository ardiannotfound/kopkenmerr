import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS DATA ---
// Pastikan file ini ada
import { MOCK_NOTIFICATIONS, NotificationItem } from '../../data/mockData';

export default function NotificationScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Theme & Auth
  const { colors, isDark } = useTheme();
  const { user, isGuest } = useAuthStore(); 

  // State
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Permintaan' | 'Pengaduan'>('Semua');
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // --- LOGIC FILTER ---
  const getFilteredData = () => {
    // 1. Jika Masyarakat (Tamu), tampilkan semua (tanpa filter UI)
    if (isGuest) return notifications;

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

    // Navigasi ke Detail
    if (item.ticketId) {
      navigation.navigate('TicketDetail', { ticketId: item.ticketId });
    }
  };

  // --- RENDER CARD NOTIFIKASI ---
  const renderItem = ({ item }: { item: NotificationItem }) => {
    // Logic Background Card:
    // Read -> Warna Card Default (Putih/Abu Gelap)
    // Unread -> Warna Highlight Tipis (Biru Muda/Abu Terang)
    const cardBg = item.isRead 
      ? colors.background.card 
      : (isDark ? 'rgba(59, 130, 246, 0.15)' : '#F0F9FF'); // Highlight unread

    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          { 
            backgroundColor: cardBg, 
            borderColor: colors.border.light 
          }
        ]}
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        {/* HEADER CARD */}
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardType, { color: colors.primary }]}>
            {item.type === 'incident' ? 'Pengaduan' : 'Permintaan'} 
            <Text style={{ color: colors.text.tertiary }}> • #{item.ticketId || 'SYS'}</Text>
          </Text>
          
          {/* Dot Indikator Belum Dibaca */}
          {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
        </View>

        {/* JUDUL */}
        <Text style={[styles.cardTitle, { color: colors.text.primary }]} numberOfLines={1}>
          {item.title}
        </Text>

        {/* PESAN & WAKTU */}
        <View style={styles.cardFooterRow}>
          <Text style={[styles.cardSubtitle, { color: colors.text.secondary }]} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={[styles.cardTime, { color: colors.text.tertiary }]}>
            {item.createdAt}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* 1. HEADER */}
      <CustomHeader 
        type="page"
        title="Notifikasi"
        showNotificationButton={false} // Sudah di halaman notif
      />

      <View style={styles.contentContainer}>
        
        {/* 2. FILTER BUBBLES (Hanya Pegawai/Teknisi) */}
        {!isGuest && (
          <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Semua', 'Permintaan', 'Pengaduan'].map((f) => {
                const isActive = activeFilter === f;
                
                // Warna Bubble
                const bubbleBg = isActive 
                  ? colors.primary // Biru jika aktif
                  : colors.background.card; // Putih/Abu jika tidak aktif
                
                const bubbleBorder = isActive 
                  ? colors.primary 
                  : colors.border.light;

                const bubbleTextColor = isActive 
                  ? colors.white 
                  : colors.text.secondary;

                return (
                  <TouchableOpacity 
                    key={f}
                    style={[
                      styles.filterBubble, 
                      { backgroundColor: bubbleBg, borderColor: bubbleBorder }
                    ]}
                    onPress={() => setActiveFilter(f as any)}
                  >
                    <Text style={[styles.filterText, { color: bubbleTextColor }]}>
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
              <Ionicons name="notifications-off-outline" size={60} color={colors.text.tertiary} />
              <Text style={[styles.emptyText, { color: colors.text.primary }]}>
                Belum Ada Notifikasi
              </Text>
              <Text style={[styles.emptySub, { color: colors.text.secondary }]}>
                Saat ini belum ada notifikasi untuk Anda.
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
  },

  // FILTER SECTION
  filterWrapper: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  filterBubble: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BorderRadius.xl, // Lebih bulat
    marginRight: 10,
    borderWidth: 1,
    ...Shadow.sm, // Shadow tipis
  },
  filterText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.xs,
  },

  // LIST SECTION
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: hp(5),
    paddingTop: Spacing.sm,
  },

  // CARD STYLE
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardType: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  cardTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md, // Lebih besar dikit dari type
    marginBottom: 4,
  },

  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  cardSubtitle: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm,
    flex: 1, 
    marginRight: 15,
    lineHeight: 20,
  },
  cardTime: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: 10,
    marginTop: 2,
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    marginTop: hp(10),
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.lg,
    marginTop: 15,
  },
  emptySub: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: 5,
  },
});