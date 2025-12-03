import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WORKING_HOURS, MOCK_HOLIDAYS } from '../../data/mockData';

export default function TechnicianScheduleScreen() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'hours' | 'upcoming'>('calendar');

  // --- LOGIC KALENDER (Desember 2025) ---
  const currentMonth = "Desember 2025";
  const daysInMonth = 31;
  const startDayOffset = 1; // 1 = Senin
  
  // SIMULASI "HARI INI" (Misal hari ini tanggal 4)
  // Di aplikasi real, ganti angka 4 dengan: new Date().getDate()
  const todayDate = 4; 

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: startDayOffset }, () => null);

  const getDayStatus = (day: number) => {
    const dateStr = `2025-12-${day.toString().padStart(2, '0')}`;
    
    // Cek Libur Nasional
    const holiday = MOCK_HOLIDAYS.find(h => h.date === dateStr);
    if (holiday) return { type: 'holiday', label: 'Libur', desc: holiday.name };

    // Cek Weekend
    const dayOfWeek = (startDayOffset + day - 1) % 7;
    if (dayOfWeek === 5 || dayOfWeek === 6) return { type: 'weekend', label: 'Libur', desc: 'Akhir Pekan' };

    return { type: 'work', label: 'Kerja', desc: '08:00 - 16:00' };
  };

  // Handler saat tanggal diklik
  const handleDatePress = (day: number, status: any) => {
    Alert.alert(
      `Detail Tanggal ${day} Desember`,
      `Status: ${status.type === 'work' ? 'Masuk Kerja' : 'Libur'}\nKeterangan: ${status.desc}`,
      [{ text: 'OK' }]
    );
  };

  // --- RENDER SECTIONS ---

  const renderCalendar = () => (
    <View style={styles.card}>
      <View style={styles.calHeader}>
        <Text style={styles.monthTitle}>{currentMonth}</Text>
        <View style={styles.legendBox}>
          <View style={[styles.dot, {backgroundColor: '#d32f2f'}]} /><Text style={styles.legendText}>Lbr</Text>
          <View style={[styles.dot, {backgroundColor: '#e3f2fd'}]} /><Text style={styles.legendText}>Msk</Text>
        </View>
      </View>

      {/* Nama Hari */}
      <View style={styles.weekRow}>
        {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => (
          <Text key={d} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>

      {/* Grid Tanggal */}
      <View style={styles.daysGrid}>
        {emptySlots.map((_, i) => <View key={`empty-${i}`} style={styles.dayCell} />)}
        
        {calendarDays.map((day) => {
          const status = getDayStatus(day);
          const isHoliday = status.type === 'holiday';
          const isWeekend = status.type === 'weekend';
          const isToday = day === todayDate; // Cek apakah ini hari ini
          
          return (
            <TouchableOpacity 
              key={day} 
              onPress={() => handleDatePress(day, status)} // AGAR BISA DIPENCET
              style={[
                styles.dayCell, 
                isHoliday ? styles.bgHoliday : isWeekend ? styles.bgWeekend : styles.bgWork,
                isToday && styles.todayBorder // Outline Hitam untuk Hari Ini
              ]}
            >
              <Text style={[
                styles.dateText, 
                (isHoliday || isWeekend) && { color: '#d32f2f', fontWeight: 'bold' }
              ]}>{day}</Text>

              {/* TULISAN LIBUR DI BAWAHNYA */}
              {isHoliday && (
                <Text style={styles.holidayLabel} numberOfLines={1}>
                  {status.desc}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
        <Text style={styles.infoText}>Kotak bergaris hitam adalah hari ini.</Text>
      </View>
    </View>
  );

  const renderHours = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Jam Operasional Layanan</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.col, {flex: 1}]}>Hari</Text>
          <Text style={[styles.col, {flex: 1}]}>Jam Kerja</Text>
          <Text style={[styles.col, {width: 80, textAlign:'center'}]}>Status</Text>
        </View>
        
        {WORKING_HOURS.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 !== 0 && {backgroundColor: '#f9f9f9'}]}>
            <Text style={[styles.col, {flex: 1, fontWeight: '500'}]}>{item.day}</Text>
            <Text style={[styles.col, {flex: 1, color: '#666'}]}>{item.open} - {item.close}</Text>
            <View style={{width: 80, alignItems: 'center'}}>
              <View style={[styles.statusTag, item.isOpen ? styles.tagOpen : styles.tagClosed]}>
                <Text style={styles.tagText}>{item.isOpen ? 'BUKA' : 'TUTUP'}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderUpcoming = () => (
    <View>
      {MOCK_HOLIDAYS.map((h, index) => (
        <View key={index} style={styles.holidayCard}>
          <View style={styles.dateBox}>
            <Text style={styles.dateMonth}>{new Date(h.date).toLocaleString('id-ID', { month: 'short' }).toUpperCase()}</Text>
            <Text style={styles.dateDay}>{new Date(h.date).getDate()}</Text>
          </View>
          <View style={styles.holidayInfo}>
            <Text style={styles.holidayName}>{h.name}</Text>
            <Text style={styles.holidayType}>{h.isNational ? 'Libur Nasional' : 'Cuti Bersama'}</Text>
            <Text style={styles.holidayDateFull}>{new Date(h.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jadwal & Kalender</Text>
        <Text style={styles.headerSub}>Pengaturan waktu operasional teknisi</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'calendar' && styles.tabActive]} onPress={() => setActiveTab('calendar')}>
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.textActive]}>Kalender</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'hours' && styles.tabActive]} onPress={() => setActiveTab('hours')}>
          <Text style={[styles.tabText, activeTab === 'hours' && styles.textActive]}>Jam Kerja</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabActive]} onPress={() => setActiveTab('upcoming')}>
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.textActive]}>Libur</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'hours' && renderHours()}
        {activeTab === 'upcoming' && renderUpcoming()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerSub: { fontSize: 14, color: '#888', marginTop: 5 },

  tabs: { flexDirection: 'row', padding: 15, gap: 10 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  tabActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  tabText: { color: '#666', fontWeight: '600', fontSize: 13 },
  textActive: { color: '#fff' },

  content: { padding: 15, paddingTop: 0 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },

  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  monthTitle: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  legendBox: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 10, marginRight: 4 },
  legendText: { fontSize: 10, color: '#666' },
  
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayLabel: { width: '13%', textAlign: 'center', fontSize: 12, color: '#999', fontWeight: 'bold' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  
  // STYLE CELL KALENDER
  dayCell: { 
    width: '13.5%', // Sedikit lebih lebar biar pas
    height: 60,     // Tinggi fix biar muat text libur
    justifyContent: 'flex-start', // Text mulai dari atas
    alignItems: 'center', 
    margin: '0.3%', 
    borderRadius: 6,
    paddingTop: 5,
  },
  bgWork: { backgroundColor: '#e3f2fd' },
  bgWeekend: { backgroundColor: '#ffebee' },
  bgHoliday: { backgroundColor: '#ffcdd2' },
  
  // STYLE HARI INI (OUTLINE HITAM)
  todayBorder: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#fff', // Opsional: warnanya jadi putih biar kontras
  },

  dateText: { fontSize: 14, color: '#333', marginBottom: 2 },
  
  // STYLE TEXT LIBUR KECIL
  holidayLabel: {
    fontSize: 8, 
    color: '#d32f2f', 
    textAlign: 'center',
    paddingHorizontal: 2,
  },

  infoBox: { flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 10, backgroundColor: '#f0f7ff', borderRadius: 8 },
  infoText: { marginLeft: 10, color: '#007AFF', fontSize: 12 },

  table: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  tableHeader: { backgroundColor: '#f0f0f0' },
  col: { fontSize: 13, color: '#333' },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tagOpen: { backgroundColor: '#e8f5e9' },
  tagClosed: { backgroundColor: '#ffebee' },
  tagText: { fontSize: 10, fontWeight: 'bold', color: '#333' },

  holidayCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  dateBox: { backgroundColor: '#ffebee', padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: 60, marginRight: 15 },
  dateMonth: { fontSize: 10, color: '#d32f2f', fontWeight: 'bold' },
  dateDay: { fontSize: 20, color: '#d32f2f', fontWeight: 'bold' },
  holidayInfo: { flex: 1, justifyContent: 'center' },
  holidayName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  holidayType: { fontSize: 12, color: '#fff', backgroundColor: '#ef5350', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, marginBottom: 4 },
  holidayDateFull: { fontSize: 12, color: '#888' },
});