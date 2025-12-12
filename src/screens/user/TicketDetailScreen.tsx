import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM BARU ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- IMPORTS DATA ---
import { MOCK_TICKETS } from '../../data/mockData';

// --- IMPORTS SVG ---
import ReopenIcon from '../../../assets/icons/reopen.svg';
import UlasanIcon from '../../../assets/icons/ulasan.svg';

export default function TicketDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  
  const { ticketId } = route.params;
  const ticket = MOCK_TICKETS.find(t => t.id === ticketId);

  // --- LOGIC WARNA RESPONSIVE ---
  // Jika Dark Mode -> Putih, Jika Light Mode -> Biru Primary
  const headerColor = isDark ? colors.text.primary : colors.primary;

  // Dummy History Data
  const ticketHistory = [
    {
      date: '25 Okt 2025, 18:00',
      status: 'Selesai',
      description: 'Masalah telah diselesaikan oleh teknisi dan diverifikasi.',
      active: true
    },
    {
      date: '25 Okt 2025, 10:00',
      status: 'Dikerjakan',
      description: 'Teknisi sedang melakukan perbaikan di lokasi.',
      active: false
    },
    {
      date: '24 Okt 2025, 08:30',
      status: 'Pending',
      description: 'Tiket berhasil dibuat dan masuk antrian verifikasi.',
      active: false
    }
  ];

  if (!ticket) return null;

  // --- LOGIC ACTIONS ---
  const handleReopen = () => {
    Alert.alert("Reopen Tiket", "Tiket akan dibuka kembali. Lanjutkan?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya", onPress: () => navigation.goBack() }
    ]);
  };

  const handleSurvey = () => {
    navigation.navigate('SatisfactionSurvey', { ticketId: ticket.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return '#D32F2F'; 
      case 'resolved': return '#4FEA17'; 
      case 'pending': return '#555657'; 
      case 'in_progress': return '#053F5C'; 
      default: return colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* 1. HEADER */}
      <CustomHeader 
        type="page" 
        title="Detail Tiket" 
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 2. TOP INFO SECTION */}
        <View style={styles.topInfoContainer}>
          {/* Tipe & Nomor */}
          <View style={{ alignItems: 'flex-start', marginBottom: Spacing.sm }}>
            <Text style={[styles.typeText, { 
              color: ticket.type === 'incident' ? '#FF9500' : '#337CAD' 
            }]}>
              {ticket.type === 'incident' ? 'Pengaduan' : 'Permintaan'} 
              <Text style={{ color: colors.text.secondary }}> • {ticket.ticketNumber}</Text>
            </Text>
          </View>

          {/* Judul Tiket (Warna Responsive) */}
          <Text style={[styles.ticketTitle, { color: headerColor }]}>
            {ticket.title}
          </Text>
        </View>

        {/* 3. INFO CARD */}
        <View style={[styles.card, { backgroundColor: colors.background.card }]}>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: headerColor, fontFamily: FontFamily.poppins.semibold }]}>
              Status Terkini
            </Text>
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                {ticket.status.toUpperCase().replace('_', ' ')}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: headerColor }]}>Dibuat :</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>24 Okt 2025</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: headerColor }]}>Pemohon :</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>Darren Ardianto</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.infoLabel, { color: headerColor }]}>Email Pemohon :</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>ardiantodarren@gmail.com</Text>
          </View>

        </View>

        {/* 4. RIWAYAT STATUS */}
        <Text style={[styles.sectionHeader, { color: headerColor }]}>
          Riwayat Status
        </Text>

        <View style={styles.timelineContainer}>
          {ticketHistory.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, { backgroundColor: index === 0 ? colors.primary : '#ccc' }]} />
                {index !== ticketHistory.length - 1 && (
                  <View style={[styles.line, { backgroundColor: '#ddd' }]} />
                )}
              </View>

              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={[styles.historyDate, { color: colors.text.secondary }]}>{item.date}</Text>
                  <Text style={[styles.historyStatus, { color: colors.text.primary }]}>{item.status}</Text>
                </View>
                <Text style={[styles.historyDesc, { color: colors.text.secondary }]}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 5. DESKRIPSI */}
        <Text style={[styles.sectionHeader, { color: headerColor, marginTop: Spacing.lg }]}>
          Deskripsi
        </Text>
        <View style={[styles.descCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.descText, { color: colors.text.secondary }]}>
            {ticket.description}
          </Text>
        </View>

        <View style={{ height: hp(12) }} />

      </ScrollView>

      {/* 6. BOTTOM ACTION BUTTONS */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background.card }]}>
        
        {/* REOPEN */}
        {ticket.status === 'closed' && (
          <TouchableOpacity 
            style={[styles.btnAction, { backgroundColor: '#2FA84F' }]} 
            onPress={handleReopen}
          >
            <ReopenIcon width={20} height={20} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.btnTextWhite} numberOfLines={1}>Reopen</Text>
          </TouchableOpacity>
        )}

        {/* ULASAN */}
        {(ticket.status === 'resolved' || ticket.status === 'closed') && (
          <TouchableOpacity 
            style={[styles.btnAction, { backgroundColor: '#2D7FF9' }]} 
            onPress={handleSurvey}
          >
            <UlasanIcon width={20} height={20} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.btnTextWhite} numberOfLines={1}>Beri Ulasan</Text>
          </TouchableOpacity>
        )}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.lg },

  // --- TOP INFO ---
  topInfoContainer: { marginBottom: Spacing.md },
  typeText: { fontFamily: FontFamily.poppins.medium, fontSize: FontSize.sm },
  ticketTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  // --- INFO CARD ---
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  infoLabel: { fontFamily: FontFamily.poppins.regular, fontSize: FontSize.sm, flex: 1 },
  infoValue: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
    flex: 1.5,
    textAlign: 'right',
  },
  statusBadge: {},
  statusText: { fontFamily: FontFamily.poppins.bold, fontSize: FontSize.sm },

  // --- HEADERS ---
  sectionHeader: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.lg,
    marginBottom: Spacing.md,
    textAlign: 'left',
  },

  // --- TIMELINE ---
  timelineContainer: { paddingLeft: Spacing.xs },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', width: 20, marginRight: Spacing.md },
  dot: { width: 12, height: 12, borderRadius: 6, zIndex: 1 },
  line: { width: 2, flex: 1, marginTop: -2, marginBottom: -2 },
  timelineContent: { flex: 1, paddingBottom: Spacing.lg },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  historyDate: { fontFamily: FontFamily.poppins.regular, fontSize: 10 },
  historyStatus: { fontFamily: FontFamily.poppins.bold, fontSize: FontSize.sm },
  historyDesc: { fontFamily: FontFamily.poppins.regular, fontSize: FontSize.sm, lineHeight: 20 },

  // --- DESKRIPSI ---
  descCard: { padding: Spacing.md, borderRadius: BorderRadius.lg, ...Shadow.sm },
  descText: { fontFamily: FontFamily.poppins.regular, fontSize: FontSize.sm, lineHeight: 22 },

  // --- BOTTOM BAR ---
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: hp(4),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 5,
  },
  btnTextWhite: {
    fontFamily: FontFamily.poppins.semibold,
    color: '#FFF',
    fontSize: FontSize.sm,
    flexShrink: 1,
  },
});