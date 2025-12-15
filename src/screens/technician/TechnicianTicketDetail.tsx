import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator, StatusBar, 
  KeyboardAvoidingView, Platform, RefreshControl 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore'; 
// API Services
import { incidentApi } from '../../services/api/incidents'; 
import { requestApi } from '../../services/api/requests';
// Styles & Types
import { Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { Typography, FontFamily, FontSize } from '../../styles/typography';

// Interface lokal untuk State UI (Gabungan Incident & Request + UI helpers)
interface TicketUIState {
  id: number;
  ticketNumber: string;
  type: 'incident' | 'request';
  title: string;
  description: string;
  status: string;
  stage: string | null;
  priority: string;
  sla: string | null;
  pelapor: string;
  lokasi: string;
  created_at: string;
  worklogs: any[]; // Array log gabungan
}

export default function TechnicianTicketDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const { user } = useAuthStore(); 

  // Params dari Navigasi
  const { ticketId, ticketType = 'incident' } = route.params;

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<TicketUIState | null>(null);
  const [newLog, setNewLog] = useState('');

  const styles = getStyles(colors, isDark);

  // --- 1. FETCH DETAIL ---
  const fetchDetail = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      
      let rawData: any;
      
      // A. Panggil API berdasarkan tipe
      try {
        if (ticketType === 'request') {
          rawData = await requestApi.getDetail(ticketId);
        } else {
          rawData = await incidentApi.getDetail(ticketId);
        }
      } catch (err) {
        // Fallback safety jika tipe salah kirim
        console.warn("Retrying with fallback API...");
        try {
           rawData = await incidentApi.getDetail(ticketId);
        } catch {
           rawData = await requestApi.getDetail(ticketId);
        }
      }

      // B. Normalisasi Data (Incident/Request structure)
      // Backend incident/request detail biasanya dibungkus dlm key 'ticket', 'request', atau 'data'
      const t = rawData?.ticket || rawData?.request || rawData?.data || rawData;

      if (t) {
        // C. Mapping Logs (Gabungan Progress Updates & System Logs)
        const progressLogs = rawData.progress_updates || t.progress_updates || [];
        const systemLogs = rawData.logs || t.logs || [];
        
        const allRawLogs = [
            ...progressLogs.map((l: any) => ({ ...l, type: "progress" })),
            ...systemLogs.map((l: any) => ({ ...l, type: "system" })),
        ];

        // Format log agar seragam
        const mappedLogs = allRawLogs.map((log: any) => {
            let activityText = "Update status";
            let userName = "Sistem";

            if (log.type === "progress") {
                activityText = log.handling_description || log.notes || `Status berubah ke ${log.status_change}`;
                userName = log.updated_by_user?.full_name || "Teknisi";
            } else {
                activityText = log.description || log.action;
                userName = log.user?.full_name || "Sistem";
            }

            return {
                id: log.id || Math.random(),
                date: log.created_at || log.update_time || new Date().toISOString(),
                activity: activityText,
                user: userName,
                type: log.type
            };
        }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // D. Set State
        setTicket({
            id: t.id,
            ticketNumber: t.ticket_number,
            type: ticketType === 'request' ? 'request' : 'incident',
            title: t.title,
            description: t.description,
            status: t.status,
            stage: t.stage,
            priority: t.priority || 'Medium', // Fallback
            sla: t.sla_due || null,
            // Handle pelapor (relasi bisa jadi object atau null)
            pelapor: t.reporter?.full_name || t.reporter_name || "Tanpa Nama",
            lokasi: t.incident_location || t.location || "-",
            created_at: t.created_at,
            worklogs: mappedLogs,
        });
      }
    } catch (error) {
      console.error("Gagal load detail:", error);
      Alert.alert("Error", "Gagal memuat detail tiket.");
      navigation.goBack();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ticketId, ticketType, refreshing]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDetail();
  };

  // --- 2. API ACTION WRAPPER ---
  const updateTicketAPI = async (payload: any) => {
    if (!ticket) return;
    
    // Panggil method updateProgress dari service yang sesuai
    if (ticket.type === 'incident') {
        return await incidentApi.updateProgress(ticket.id, payload);
    } else {
        return await requestApi.updateProgress(ticket.id, payload);
    }
  };

  // --- 3. HANDLERS (LOGIC SAMA SEPERTI WEB) ---

  // A. MULAI KERJAKAN (Assigned -> In Progress)
  const handleStartProgress = () => {
    Alert.alert(
      "Mulai Kerjakan?",
      "SLA Response Time akan tercatat mulai dari sekarang.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya, Mulai", 
          onPress: async () => {
            setSubmitting(true);
            try {
              const payload = {
                update_number: (ticket?.worklogs.length || 0) + 1,
                status_change: "in_progress",
                stage_change: "execution",
                handling_description: "Memulai pengerjaan tiket (Status: Sedang Dikerjakan)",
                notes: "Memulai pengerjaan", // Field khusus Request
              };

              await updateTicketAPI(payload);
              onRefresh(); // Refresh data
              Alert.alert("Sukses", "Status diperbarui: Sedang Dikerjakan");
            } catch (error: any) {
              const msg = error.response?.data?.message || "Gagal update status.";
              Alert.alert("Gagal", msg);
            } finally {
              setSubmitting(false);
            }
          } 
        }
      ]
    );
  };

  // B. SUBMIT LOG (Catatan Harian)
  const handleSubmitLog = async () => {
    if (!newLog.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        update_number: (ticket?.worklogs.length || 0) + 1,
        status_change: ticket?.status,
        stage_change: ticket?.stage,
        handling_description: newLog, // Field Incident
        notes: newLog, // Field Request
      };

      await updateTicketAPI(payload);
      setNewLog('');
      onRefresh();
      Alert.alert("Sukses", "Catatan aktivitas tersimpan");
    } catch (error: any) {
      Alert.alert("Error", "Gagal menyimpan log");
    } finally {
      setSubmitting(false);
    }
  };

  // C. SELESAIKAN TIKET (In Progress -> Resolved)
  const handleResolve = () => {
    Alert.alert(
        "Selesaikan Tiket?",
        "Tiket akan ditandai sebagai selesai.",
        [
          { text: "Batal", style: "cancel" },
          { 
            text: "Selesaikan", 
            onPress: async () => {
              setSubmitting(true);
              const defaultNote = "Tiket diselesaikan oleh teknisi.";
              try {
                const payload = {
                  update_number: (ticket?.worklogs.length || 0) + 1,
                  status_change: "resolved",
                  stage_change: null,
                  final_solution: defaultNote,
                  handling_description: defaultNote,
                  notes: defaultNote,
                };
  
                await updateTicketAPI(payload);
                Alert.alert("Berhasil", "Tiket telah diselesaikan!");
                navigation.goBack();
              } catch (error: any) {
                Alert.alert("Gagal", "Gagal menyelesaikan tiket.");
              } finally {
                setSubmitting(false);
              }
            } 
          }
        ]
      );
  };

  // --- HELPER RENDER ---
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getPriorityColor = (p: string) => {
    if (!p) return colors.info;
    const priority = p.toLowerCase();
    if (priority === 'major' || priority === 'high') return colors.error; 
    if (priority === 'medium') return colors.warning;
    return colors.info;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!ticket) return null;

  // Logic Condition (Mapping Status)
  const isNewAssigned = ticket.status === 'assigned' || (ticket.status === 'open' && ticket.stage === 'triase');
  const isWorking = ticket.status === 'in_progress';
  const isResolved = ticket.status === 'resolved' || ticket.status === 'closed';

  return (
    <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background.primary} />
      
      <CustomHeader 
        title="Ruang Kerja Teknisi" 
        type="page" 
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView 
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. TICKET HEADER CARD */}
        <View style={styles.card}>
          <View style={[styles.priorityStrip, { backgroundColor: getPriorityColor(ticket.priority) }]} />
          
          <View style={styles.cardContent}>
            <View style={styles.cardHeaderRow}>
               <View style={[styles.badge, { backgroundColor: isDark ? colors.gray[800] : colors.gray[100] }]}>
                  <Text style={[styles.badgeText, { color: colors.text.secondary }]}>
                    {ticket.type === 'incident' ? 'PENGADUAN' : 'PERMINTAAN'}
                  </Text>
               </View>
               <Text style={[Typography.caption, { color: colors.text.tertiary }]}>
                 {formatDate(ticket.created_at)}
               </Text>
            </View>

            <Text style={[Typography.h3, { color: colors.text.primary, marginBottom: Spacing.sm }]}>
              {ticket.title}
            </Text>
            
            <View style={[styles.descBox, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
               <Text style={[Typography.label, { color: colors.text.secondary, fontSize: FontSize.xs }]}>
                 Deskripsi Masalah:
               </Text>
               <Text style={[Typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
                 {ticket.description}
               </Text>
            </View>

            <View style={styles.metaContainer}>
               <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={14} color={colors.primary} />
                  <Text style={[Typography.caption, { color: colors.text.secondary }]}>{ticket.pelapor}</Text>
               </View>
               <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color={colors.primary} />
                  <Text style={[Typography.caption, { color: colors.text.secondary }]}>{ticket.lokasi}</Text>
               </View>
            </View>
          </View>
        </View>

        {/* 2. SLA INFO */}
        <View style={styles.slaCard}>
           <View style={{flexDirection:'row', alignItems:'center'}}>
              <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(211, 47, 47, 0.2)' : '#FEE2E2' }]}>
                 <Ionicons name="time-outline" size={20} color={colors.error} />
              </View>
              <View style={{marginLeft: Spacing.sm}}>
                 <Text style={[Typography.h4, { color: colors.text.primary }]}>{ticket.priority}</Text>
                 <Text style={[Typography.caption, { color: colors.text.tertiary }]}>
                    Deadline: {ticket.sla ? formatDate(ticket.sla) : '-'}
                 </Text>
              </View>
           </View>
           {isWorking && (
             <View style={styles.runningBadge}>
                <Ionicons name="alert-circle" size={12} color={colors.warning} />
                <Text style={styles.runningText}>SLA Berjalan</Text>
             </View>
           )}
        </View>

        {/* 3. ACTION ZONES (CONDITIONAL) */}

        {/* --- SKENARIO 1: ASSIGNED -> START WORK --- */}
        {isNewAssigned && (
          <View style={[styles.actionCard, { backgroundColor: isDark ? 'rgba(5, 63, 92, 0.2)' : '#E0F2FE', borderColor: colors.info }]}>
             <Text style={[Typography.h4, { color: colors.info }]}>Tiket Ditugaskan</Text>
             <Text style={[Typography.bodySmall, { color: colors.text.secondary, marginTop: 4 }]}>
                Tekan tombol di bawah untuk memulai pengerjaan. Status akan berubah menjadi "Sedang Dikerjakan".
             </Text>
             <TouchableOpacity 
                style={[styles.btnPrimary, { marginTop: Spacing.md }]} 
                onPress={handleStartProgress}
                disabled={submitting}
             >
                {submitting ? <ActivityIndicator color="#fff" /> : (
                    <>
                      <Ionicons name="construct-outline" size={18} color="#fff" style={{marginRight: 8}} />
                      <Text style={[Typography.button, { color: '#fff' }]}>Mulai Kerjakan</Text>
                    </>
                )}
             </TouchableOpacity>
          </View>
        )}

        {/* --- SKENARIO 2: IN PROGRESS -> LOG & RESOLVE --- */}
        {isWorking && (
            <View style={styles.workZone}>
                <View style={styles.workZoneHeader}>
                    <Text style={[Typography.h4, { color: colors.text.primary }]}>Aktivitas Pengerjaan</Text>
                    <TouchableOpacity 
                      style={[styles.btnSuccessSmall, { backgroundColor: '#DCFCE7' }]} 
                      onPress={handleResolve} 
                      disabled={submitting}
                    >
                       <Ionicons name="checkmark-circle" size={16} color="#15803d" style={{marginRight: 4}} />
                       <Text style={{ color: '#15803d', fontWeight: 'bold', fontSize: 12 }}>Selesaikan</Text>
                    </TouchableOpacity>
                </View>

                {/* Input Log */}
                <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50], borderColor: colors.border.light }]}>
                    <Text style={[Typography.label, { color: colors.text.secondary, fontSize: FontSize.xs, marginBottom: 8 }]}>
                      Tambah Catatan Progres
                    </Text>
                    <TextInput 
                        style={[styles.textInput, { color: colors.text.primary, backgroundColor: colors.background.card, borderColor: colors.border.light }]}
                        placeholder="Contoh: Sedang melakukan scanning virus..."
                        placeholderTextColor={colors.text.tertiary}
                        multiline
                        value={newLog}
                        onChangeText={setNewLog}
                    />
                    <TouchableOpacity 
                        style={[styles.btnSubmit, { backgroundColor: colors.primary, opacity: !newLog.trim() ? 0.5 : 1 }]} 
                        onPress={handleSubmitLog}
                        disabled={!newLog.trim() || submitting}
                    >
                        {submitting ? <ActivityIndicator size="small" color="#fff" /> : (
                            <>
                              <Ionicons name="send" size={14} color="#fff" style={{marginRight: 6}} />
                              <Text style={{color:'#fff', fontWeight:'bold', fontSize: 12}}>Simpan Log</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Timeline History */}
                <View style={styles.timelineBox}>
                    {ticket.worklogs.map((log: any, index: number) => (
                        <View key={log.id || index} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                                <View style={[styles.dot, { backgroundColor: index === 0 ? colors.warning : colors.gray[300] }]} />
                                {index !== ticket.worklogs.length - 1 && <View style={[styles.line, { backgroundColor: colors.border.light }]} />}
                            </View>
                            <View style={styles.timelineContent}>
                                <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 2}}>
                                   <Text style={[Typography.label, { fontSize: 12, color: colors.text.primary }]}>{log.user}</Text>
                                   <Text style={[Typography.caption, { color: colors.text.tertiary }]}>{formatDate(log.date)}</Text>
                                </View>
                                <View style={[styles.logBubble, { backgroundColor: isDark ? colors.gray[800] : colors.gray[100] }]}>
                                   <Text style={[Typography.bodySmall, { color: colors.text.secondary }]}>{log.activity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                    {ticket.worklogs.length === 0 && (
                        <Text style={[Typography.caption, { fontStyle:'italic', textAlign:'center', marginTop: 10 }]}>
                          Belum ada aktivitas.
                        </Text>
                    )}
                </View>
            </View>
        )}

        {/* --- SKENARIO 3: RESOLVED --- */}
        {isResolved && (
            <View style={[styles.actionCard, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : '#F0FDF4', borderColor: colors.success }]}>
                <View style={{alignItems:'center', padding: Spacing.sm}}>
                    <Ionicons name="checkmark-done-circle" size={48} color={colors.success} />
                    <Text style={[Typography.h3, { color: colors.success, marginTop: Spacing.sm }]}>Tiket Terselesaikan</Text>
                    <Text style={[Typography.bodySmall, { textAlign:'center', color: colors.text.secondary, marginTop: 4 }]}>
                        Tiket ini telah ditandai selesai. Terima kasih atas kerja keras Anda.
                    </Text>
                </View>
            </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- STYLES ---
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background.secondary 
  },
  card: { 
    backgroundColor: colors.background.card, 
    borderRadius: BorderRadius.lg, 
    ...Shadow.sm, 
    marginBottom: Spacing.md, 
    overflow: 'hidden',
    flexDirection: 'row'
  },
  priorityStrip: { 
    width: 4, 
    height: '100%' 
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md
  },
  cardHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: Spacing.xs 
  },
  badge: { 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: BorderRadius.sm 
  },
  badgeText: { 
    fontSize: 10, 
    fontFamily: FontFamily.poppins.semibold 
  },
  descBox: { 
    padding: Spacing.sm, 
    borderRadius: BorderRadius.md, 
    marginBottom: Spacing.md 
  },
  metaContainer: { 
    flexDirection: 'row', 
    gap: Spacing.md 
  },
  metaItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  
  // SLA Card
  slaCard: { 
    backgroundColor: colors.background.card, 
    borderRadius: BorderRadius.lg, 
    padding: Spacing.md, 
    marginBottom: Spacing.md, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    ...Shadow.sm
  },
  iconBox: { 
    width: 40, 
    height: 40, 
    borderRadius: BorderRadius.md, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  runningBadge: { 
    backgroundColor: '#FFEDD5', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: BorderRadius.sm, 
    borderWidth: 1, 
    borderColor: '#FED7AA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  runningText: { 
    fontSize: 10, 
    color: '#C2410C', 
    fontFamily: FontFamily.poppins.bold 
  },

  // Action Zones
  actionCard: { 
    borderWidth: 1, 
    borderRadius: BorderRadius.lg, 
    padding: Spacing.md, 
    marginBottom: Spacing.md 
  },
  btnPrimary: { 
    backgroundColor: colors.primary, 
    padding: 12, 
    borderRadius: BorderRadius.md, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  // Work Zone
  workZone: { 
    backgroundColor: colors.background.card, 
    borderRadius: BorderRadius.lg, 
    padding: Spacing.md, 
    marginBottom: Spacing.md,
    ...Shadow.sm
  },
  workZoneHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: Spacing.md
  },
  btnSuccessSmall: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: BorderRadius.sm, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  inputContainer: { 
    padding: Spacing.sm, 
    borderRadius: BorderRadius.md, 
    borderWidth: 1, 
    marginBottom: Spacing.lg 
  },
  textInput: { 
    borderRadius: BorderRadius.sm, 
    padding: Spacing.sm, 
    height: 80, 
    textAlignVertical: 'top', 
    borderWidth: 1, 
    marginBottom: Spacing.sm 
  },
  btnSubmit: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: BorderRadius.sm, 
    alignSelf: 'flex-end', 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  // Timeline
  timelineBox: { 
    paddingLeft: 4 
  },
  timelineItem: { 
    flexDirection: 'row', 
    marginBottom: 0 
  },
  timelineLeft: { 
    width: 24, 
    alignItems: 'center', 
    marginRight: 8 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    zIndex: 1, 
    marginTop: 4 
  },
  line: { 
    width: 2, 
    flex: 1, 
    marginTop: -4 
  },
  timelineContent: { 
    flex: 1, 
    paddingBottom: Spacing.lg 
  },
  logBubble: { 
    padding: Spacing.sm, 
    borderRadius: BorderRadius.md, 
    marginTop: 2 
  },
});