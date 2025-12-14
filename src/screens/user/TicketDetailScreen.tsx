import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator, Image, Modal 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore'; 
import { incidentApi } from '../../services/api/incidents';
import { requestApi } from '../../services/api/requests'; 
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

import ReopenIcon from '../../../assets/icons/reopen.svg';
import UlasanIcon from '../../../assets/icons/ulasan.svg';

export default function TicketDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  
  const { isGuest } = useAuthStore();
  const { ticketId, ticketType = 'incident' } = route.params;

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<any>(null); 
  const [modalImageVisible, setModalImageVisible] = useState(false);

  // --- HELPER FORMAT STATUS ---
  const formatStatusText = (status: string) => {
    if (!status) return '-';
    const s = status.toUpperCase();
    if (s === 'IN_PROGRESS') return 'DIPROSES';
    if (s === 'RESOLVED') return 'SELESAI';
    if (s === 'CLOSED') return 'DITUTUP';
    if (s === 'OPEN') return 'BARU';
    if (s === 'PENDING') return 'MENUNGGU';
    return s.replace('_', ' ');
  };

  // --- HELPER BERSIHKAN DESKRIPSI ---
  const cleanDescription = (desc: string) => {
    if (!desc) return '-';
    // Hapus teks dalam kurung siku [Stage: ...]
    return desc.replace(/\[.*?\]/g, '').trim();
  };

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      let responseData = null;

      // 🅰️ JIKA TAMU (GUEST)
      if (isGuest) {
        const res = await incidentApi.trackPublic(ticketId); 
        const info = res?.data?.ticket_info;
        const timeline = res?.data?.timeline;

        if (info) {
          responseData = {
            ticket: {
              id: info.ticket_number,
              ticket_number: info.ticket_number,
              title: info.title,
              description: info.description,
              status: info.status,
              type: 'incident', 
              created_at: info.created_at,
              reporter_attachment_url: info.reporter_attachment_url || info.attachment_url,
              reporter: { full_name: info.reporter_name || 'Anda', email: '-' }
            },
            logs: (timeline || []).map((t: any) => ({
              id: Math.random(),
              created_at: t.update_time,
              action: t.status_change,
              description: t.handling_description,
              user: { full_name: 'Sistem' }
            }))
          };
        }
      } 
      
      // 🅱️ JIKA PEGAWAI (LOGIN)
      else {
        let rawRes;
        
        if (ticketType === 'request') {
           console.log(`📡 Fetching REQUEST Detail: ${ticketId}`);
           rawRes = await requestApi.getDetail(ticketId);
        } else {
           console.log(`📡 Fetching INCIDENT Detail: ${ticketId}`);
           rawRes = await incidentApi.getDetail(ticketId);
        }

        const ticketObj = rawRes.ticket || rawRes.request || rawRes.data || rawRes; 
        
        const rawLogs = 
          rawRes.progress_updates || 
          rawRes.logs || 
          rawRes.history || 
          rawRes.timeline || 
          ticketObj.progress_updates || 
          ticketObj.logs || 
          [];

        // ✅ MAPPING LOGS (DIBERSIHKAN & DIURUTKAN)
        const formattedLogs = rawLogs.map((log: any) => ({
          id: log.id,
          created_at: log.created_at || log.update_time, 
          action: log.action || log.status_change,       
          description: log.description || log.handling_description, 
          user: log.user || log.updated_by_user 
        }));

        // ✅ SORTING: TERBARU DI ATAS (DESCENDING)
        // Jika mau TERBARU DI BAWAH (ASCENDING), tukar posisi a dan b
        formattedLogs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        responseData = {
          ticket: ticketObj,
          logs: formattedLogs
        };
      }

      if (responseData && responseData.ticket) {
        setDetailData(responseData);
      } else {
        Alert.alert("Error", "Data tiket tidak ditemukan.");
        navigation.goBack();
      }

    } catch (error: any) {
      console.error("Fetch Detail Error:", error);
      const msg = error.response?.status === 404 ? "Tiket tidak ditemukan." : "Gagal memuat detail tiket.";
      Alert.alert("Error", msg);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [ticketId, ticketType, navigation, isGuest]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleReopen = () => Alert.alert("Info", "Fitur Reopen belum tersedia.");
  const handleSurvey = () => navigation.navigate('SatisfactionSurvey', { ticketId });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!detailData || !detailData.ticket) return null;

  const { ticket, logs } = detailData;
  const headerColor = isDark ? colors.text.primary : colors.primary;
  const imageUrl = ticket.reporter_attachment_url || ticket.attachment_url || null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <CustomHeader type="page" title="Detail Tiket" showNotificationButton={!isGuest} onNotificationPress={() => navigation.navigate('Notifications')} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. TOP INFO (Nomor & Judul) */}
        <View style={styles.topInfoContainer}>
          <View style={{ alignItems: 'flex-start', marginBottom: Spacing.sm }}>
            <Text style={[styles.typeText, { color: ticket.type === 'incident' ? '#FF9500' : '#337CAD' }]}>
              {ticket.type === 'incident' ? 'Pengaduan' : 'Permintaan'} 
              <Text style={{ color: colors.text.secondary }}> • {ticket.ticket_number}</Text>
            </Text>
          </View>
          <Text style={[styles.ticketTitle, { color: headerColor }]}>{ticket.title}</Text>
        </View>

        {/* 2. INFO CARD (Status & Detail) */}
        <View style={[styles.card, { backgroundColor: colors.background.card }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: headerColor, fontFamily: FontFamily.poppins.semibold }]}>Status Terkini</Text>
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: colors.primary }]}>
                {formatStatusText(ticket.status)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: headerColor }]}>Dibuat :</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>{formatDate(ticket.created_at)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: headerColor }]}>Pemohon :</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>{ticket.reporter?.full_name || '-'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.infoLabel, { color: headerColor }]}>Email :</Text>
            <Text style={[styles.infoValue, { color: colors.text.primary }]}>{ticket.reporter?.email || '-'}</Text>
          </View>
        </View>

        {/* 3. RIWAYAT STATUS (Dipindah ke Atas) */}
        <Text style={[styles.sectionHeader, { color: headerColor, marginTop: Spacing.sm }]}>Riwayat Status</Text>
        <View style={styles.timelineContainer}>
          {logs && logs.length > 0 ? (
            logs.map((log: any, index: number) => (
              <View key={log.id || index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  {/* Dot Biru untuk yang paling atas (terbaru), abu-abu sisanya */}
                  <View style={[styles.dot, { backgroundColor: index === 0 ? colors.primary : '#ccc' }]} />
                  {index !== logs.length - 1 && <View style={[styles.line, { backgroundColor: '#ddd' }]} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={[styles.historyDate, { color: colors.text.secondary }]}>{formatDate(log.created_at)}</Text>
                    <Text style={[styles.historyStatus, { color: colors.text.primary }]}>
                      {formatStatusText(log.action)}
                    </Text>
                  </View>
                  <Text style={[styles.historyDesc, { color: colors.text.secondary }]}>
                    {cleanDescription(log.description)}
                  </Text>
                  <Text style={[styles.historyUser, { color: colors.text.tertiary }]}>
                    Oleh: {log.user?.full_name || 'System'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
             <Text style={{ color: colors.text.secondary, fontStyle: 'italic' }}>Belum ada riwayat.</Text>
          )}
        </View>

        {/* 4. DESKRIPSI (Tengah) */}
        <Text style={[styles.sectionHeader, { color: headerColor, marginTop: Spacing.lg }]}>Deskripsi</Text>
        <View style={[styles.descCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.descText, { color: colors.text.secondary }]}>
            {cleanDescription(ticket.description)}
          </Text>
        </View>

        {/* 5. LAMPIRAN (Paling Bawah) */}
        {imageUrl && (
          <View style={{ marginTop: Spacing.xl }}>
            <Text style={[styles.sectionHeader, { color: headerColor }]}>Lampiran</Text>
            <TouchableOpacity onPress={() => setModalImageVisible(true)}>
              <Image source={{ uri: imageUrl }} style={styles.attachmentImage} resizeMode="cover" />
              <View style={styles.zoomHint}>
                <Ionicons name="expand" size={16} color="#FFF" />
                <Text style={{ color: '#FFF', fontSize: 10, marginLeft: 4 }}>Ketuk untuk perbesar</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: hp(12) }} />
      </ScrollView>

      {/* BOTTOM BAR */}
      {!isGuest && (
        <View style={[styles.bottomBar, { backgroundColor: colors.background.card }]}>
          {ticket.status === 'closed' && (
            <TouchableOpacity style={[styles.btnAction, { backgroundColor: '#2FA84F' }]} onPress={handleReopen}>
              <ReopenIcon width={20} height={20} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.btnTextWhite}>Reopen</Text>
            </TouchableOpacity>
          )}
          {(ticket.status === 'resolved' || ticket.status === 'closed') && (
            <TouchableOpacity style={[styles.btnAction, { backgroundColor: '#2D7FF9' }]} onPress={handleSurvey}>
              <UlasanIcon width={20} height={20} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.btnTextWhite}>Beri Ulasan</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* MODAL IMAGE */}
      <Modal visible={modalImageVisible} transparent={true}>
        <View style={styles.modalBg}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setModalImageVisible(false)}>
            <Ionicons name="close-circle" size={40} color="#FFF" />
          </TouchableOpacity>
          {imageUrl && <Image source={{ uri: imageUrl }} style={{ width: wp(90), height: hp(70) }} resizeMode="contain" />}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  topInfoContainer: { marginBottom: Spacing.md },
  typeText: { fontFamily: FontFamily.poppins.medium, fontSize: FontSize.sm },
  ticketTitle: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.lg, textAlign: 'center', marginBottom: Spacing.sm },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadow.sm, marginBottom: Spacing.xl },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  infoLabel: { fontFamily: FontFamily.poppins.regular, fontSize: FontSize.sm, flex: 1 },
  infoValue: { fontFamily: FontFamily.poppins.medium, fontSize: FontSize.sm, flex: 1.5, textAlign: 'right' },
  statusBadge: {},
  statusText: { fontFamily: FontFamily.poppins.bold, fontSize: FontSize.sm },
  sectionHeader: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.lg, marginBottom: Spacing.md, textAlign: 'left' },
  attachmentImage: { width: '100%', height: 200, borderRadius: BorderRadius.md, backgroundColor: '#EEE' },
  zoomHint: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, flexDirection: 'row', alignItems: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
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
  historyUser: { fontFamily: FontFamily.poppins.regular, fontSize: 10, marginTop: 4 },
  descCard: { padding: Spacing.md, borderRadius: BorderRadius.lg, ...Shadow.sm },
  descText: { fontFamily: FontFamily.poppins.regular, fontSize: FontSize.sm, lineHeight: 22 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, paddingBottom: hp(4), borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', flexDirection: 'row', gap: Spacing.md },
  btnAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: BorderRadius.lg, paddingHorizontal: 5 },
  btnTextWhite: { fontFamily: FontFamily.poppins.semibold, color: '#FFF', fontSize: FontSize.sm, flexShrink: 1 },
});