import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORT SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontFamily, FontSize } from '../../styles/typography';

// --- MOCK DATA ---
const WORKING_HOURS = [
  { day: 'Senin', open: '08:00', close: '16:00', isOpen: true },
  { day: 'Selasa', open: '08:00', close: '16:00', isOpen: true },
  { day: 'Rabu', open: '08:00', close: '16:00', isOpen: true },
  { day: 'Kamis', open: '08:00', close: '16:00', isOpen: true },
  { day: 'Jumat', open: '08:00', close: '15:00', isOpen: true },
  { day: 'Sabtu', open: '-', close: '-', isOpen: false },
  { day: 'Minggu', open: '-', close: '-', isOpen: false },
];

const MOCK_HOLIDAYS = [
  { date: '2025-01-01', name: 'Tahun Baru', isNational: true },
  { date: '2025-03-31', name: 'Hari Raya Idul Fitri', isNational: true },
  { date: '2025-04-01', name: 'Cuti Bersama Idul Fitri', isNational: false },
  { date: '2025-05-01', name: 'Hari Buruh', isNational: true },
  { date: '2025-06-07', name: 'Hari Raya Idul Adha', isNational: true },
  { date: '2025-08-17', name: 'HUT RI', isNational: true },
  { date: '2025-12-25', name: 'Hari Raya Natal', isNational: true },
  { date: '2025-12-26', name: 'Cuti Bersama Natal', isNational: false },
];

export default function TechnicianScheduleScreen() {
  const navigation = useNavigation<any>();
  const { theme, colors, isDark } = useTheme();
  const styles = getStyles(theme, colors, isDark);

  const [activeTab, setActiveTab] = useState<'calendar' | 'hours' | 'upcoming'>('calendar');

  // --- 🆕 STATE UNTUK NAVIGASI BULAN ---
  const today = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0-11

  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // --- 🆕 NAVIGASI BULAN ---
  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToToday = () => {
    setSelectedYear(todayYear);
    setSelectedMonth(todayMonth);
  };

  // --- KALENDER LOGIC ---
  const calendarData = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOffset = firstDay.getDay(); // 0 = Minggu

    return {
      monthName: firstDay.toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
      daysInMonth,
      startDayOffset,
    };
  }, [selectedYear, selectedMonth]);

  const getDayStatus = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(selectedYear, selectedMonth, day);
    const dayOfWeek = date.getDay();

    // Cek Libur Nasional
    const holiday = MOCK_HOLIDAYS.find(h => h.date === dateStr);
    if (holiday) return { type: 'holiday', label: 'Libur', desc: holiday.name };

    // Cek Weekend (Sabtu = 6, Minggu = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { type: 'weekend', label: 'Libur', desc: 'Akhir Pekan' };
    }

    return { type: 'work', label: 'Kerja', desc: '08:00 - 16:00' };
  };

  const handleDatePress = (day: number, status: any) => {
    const monthName = calendarData.monthName.split(' ')[0];
    Alert.alert(
      `Detail ${day} ${monthName}`,
      `Status: ${status.type === 'work' ? 'Masuk Kerja' : 'Libur'}\nKeterangan: ${status.desc}`,
      [{ text: 'OK' }]
    );
  };

  // --- RENDER CALENDAR ---
  const renderCalendar = () => {
    const emptySlots = Array.from({ length: calendarData.startDayOffset }, () => null);
    const calendarDays = Array.from({ length: calendarData.daysInMonth }, (_, i) => i + 1);

    // Cek apakah sedang menampilkan bulan ini
    const isCurrentMonth = selectedMonth === todayMonth && selectedYear === todayYear;

    return (
      <View style={styles.card}>
        {/* 🆕 Header Kalender dengan Navigasi */}
        <View style={styles.calHeader}>
          {/* Tombol Previous */}
          <TouchableOpacity style={styles.navButton} onPress={goToPrevMonth}>
            <Ionicons name="chevron-back" size={24} color={isDark ? '#fff' : colors.primary} />
          </TouchableOpacity>

          {/* Title Bulan */}
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>{calendarData.monthName}</Text>
            {!isCurrentMonth && (
              <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
                <Ionicons name="today" size={14} color={isDark ? '#fff' : colors.primary} />
                <Text style={styles.todayButtonText}>Hari Ini</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tombol Next */}
          <TouchableOpacity style={styles.navButton} onPress={goToNextMonth}>
            <Ionicons name="chevron-forward" size={24} color={isDark ? '#fff' : colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legendBox}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.error }]} />
            <Text style={styles.legendText}>Libur</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.info }]} />
            <Text style={styles.legendText}>Masuk</Text>
          </View>
        </View>

        {/* Nama Hari */}
        <View style={styles.weekRow}>
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
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
            const isToday = day === todayDate && isCurrentMonth;

            return (
              <TouchableOpacity
                key={day}
                onPress={() => handleDatePress(day, status)}
                style={[
                  styles.dayCell,
                  isHoliday ? styles.bgHoliday : isWeekend ? styles.bgWeekend : styles.bgWork,
                  isToday && styles.todayBorder,
                ]}
              >
                <Text style={[
                  styles.dateText,
                  (isHoliday || isWeekend) && styles.holidayDateText,
                  isToday && styles.todayText,
                ]}>
                  {day}
                </Text>
                {isHoliday && (
                  <Text style={styles.holidayLabel} numberOfLines={1}>
                    {status.desc.split(' ')[0]}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={isDark ? colors.text.primary : colors.primary} />
          <Text style={styles.infoText}>Kotak dengan border tebal adalah hari ini</Text>
        </View>
      </View>
    );
  };

  // --- RENDER JAM KERJA ---
  const renderHours = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Jam Operasional Layanan</Text>
      
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCol, styles.tableHeaderText, { flex: 1.2 }]}>Hari</Text>
          <Text style={[styles.tableCol, styles.tableHeaderText, { flex: 1.5 }]}>Jam Kerja</Text>
          <Text style={[styles.tableCol, styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>
            Status
          </Text>
        </View>

        {/* Rows */}
        {WORKING_HOURS.map((item, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              index % 2 !== 0 && styles.tableRowAlt,
              index === WORKING_HOURS.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Text style={[styles.tableCol, { flex: 1.2, fontFamily: FontFamily.poppins.medium }]}>
              {item.day}
            </Text>
            <Text style={[styles.tableCol, { flex: 1.5, color: colors.text.secondary }]}>
              {item.open} - {item.close}
            </Text>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={[styles.statusTag, item.isOpen ? styles.tagOpen : styles.tagClosed]}>
                <Text style={[styles.tagText, { color: item.isOpen ? colors.success : colors.error }]}>
                  {item.isOpen ? 'BUKA' : 'TUTUP'}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // --- RENDER LIBUR MENDATANG ---
  const renderUpcoming = () => {
    const now = new Date();
    // Filter hanya libur yang belum lewat
    const upcomingHolidays = MOCK_HOLIDAYS
      .filter(h => new Date(h.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
      <View>
        {upcomingHolidays.map((holiday, index) => {
          const date = new Date(holiday.date);
          const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <View key={index} style={styles.holidayCard}>
              {/* Date Box */}
              <View style={styles.dateBox}>
                <Text style={styles.dateMonth}>
                  {date.toLocaleString('id-ID', { month: 'short' }).toUpperCase()}
                </Text>
                <Text style={styles.dateDay}>{date.getDate()}</Text>
              </View>

              {/* Holiday Info */}
              <View style={styles.holidayInfo}>
                <Text style={styles.holidayName}>{holiday.name}</Text>
                <View style={[styles.holidayTypeBadge, 
                  holiday.isNational ? styles.badgeNational : styles.badgeLeave
                ]}>
                  <Text style={styles.holidayTypeText}>
                    {holiday.isNational ? 'Libur Nasional' : 'Cuti Bersama'}
                  </Text>
                </View>
                <Text style={styles.holidayDateFull}>
                  {date.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                {daysUntil <= 30 && (
                  <Text style={styles.daysUntilText}>
                    {daysUntil === 0 ? '🎉 Hari ini!' : `📅 ${daysUntil} hari lagi`}
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        {upcomingHolidays.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>Tidak ada libur mendatang</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <CustomHeader
        type="page"
        title="Jadwal & Kalender"
        showNotificationButton
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => setActiveTab('calendar')}
        >
          <Ionicons
            name="calendar"
            size={18}
            color={activeTab === 'calendar' ? colors.primary : colors.text.tertiary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
            Kalender
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'hours' && styles.activeTab]}
          onPress={() => setActiveTab('hours')}
        >
          <Ionicons
            name="time"
            size={18}
            color={activeTab === 'hours' ? colors.primary : colors.text.tertiary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === 'hours' && styles.activeTabText]}>
            Jam Kerja
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Ionicons
            name="flag"
            size={18}
            color={activeTab === 'upcoming' ? colors.primary : colors.text.tertiary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Libur
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'hours' && renderHours()}
        {activeTab === 'upcoming' && renderUpcoming()}
      </ScrollView>
    </View>
  );
}

// ================= STYLES GENERATOR =================
const getStyles = (theme: any, colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: hp(10),
    },

    // --- TABS ---
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
      gap: Spacing.sm,
    },
    tabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: isDark ? colors.background.card : '#F3F4F6',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    activeTab: {
      backgroundColor: isDark ? colors.primary + '20' : colors.primary + '10',
      borderColor: colors.primary,
    },
    tabText: {
      fontFamily: FontFamily.poppins.medium,
      fontSize: FontSize.sm,
      color: colors.text.tertiary,
    },
    activeTabText: {
      color: colors.primary,
      fontFamily: FontFamily.poppins.semibold,
    },

    // --- CARD ---
    card: {
      backgroundColor: colors.background.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      ...Shadow.sm,
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : 'transparent',
    },
    cardTitle: {
      fontFamily: FontFamily.poppins.semibold,
      fontSize: FontSize.lg,
      color: colors.text.primary,
      marginBottom: Spacing.md,
    },

    // --- 🆕 CALENDAR NAVIGATION ---
    calHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.md,
      backgroundColor: isDark ? colors.primary + '15' : colors.primary + '10',
      justifyContent: 'center',
      alignItems: 'center',
    },
    monthTitleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    monthTitle: {
      fontFamily: FontFamily.poppins.bold,
      fontSize: FontSize.lg,
       color: isDark ? colors.text.primary : colors.primary,
    },
    todayButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
      backgroundColor: isDark ? colors.primary + '20' : colors.primary + '15',
    },
    todayButtonText: {
      fontFamily: FontFamily.poppins.medium,
      fontSize: 10,
      color: isDark ? colors.text.primary : colors.primary,
      marginLeft: 4,
    },
    legendBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
      gap: 16,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 4,
    },
    legendText: {
      fontFamily: FontFamily.poppins.regular,
      fontSize: FontSize.xs,
      color: colors.text.secondary,
    },

    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: Spacing.sm,
    },
    dayLabel: {
      width: '14%',
      textAlign: 'center',
      fontFamily: FontFamily.poppins.semibold,
      fontSize: FontSize.xs,
      color: colors.text.tertiary,
    },

    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '13.5%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0.25%',
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    bgWork: {
      backgroundColor: isDark ? colors.info + '15' : '#E0F2FE',
    },
    bgWeekend: {
      backgroundColor: isDark ? colors.error + '10' : '#FEE2E2',
    },
    bgHoliday: {
      backgroundColor: isDark ? colors.error + '20' : '#FECACA',
    },
    todayBorder: {
      borderWidth: 2.5,
      borderColor: colors.primary,
      backgroundColor: colors.background.card,
    },
    dateText: {
      fontFamily: FontFamily.poppins.medium,
      fontSize: FontSize.sm,
      color: colors.text.primary,
    },
    holidayDateText: {
      color: colors.error,
      fontFamily: FontFamily.poppins.bold,
    },
    todayText: {
      color: colors.primary,
      fontFamily: FontFamily.poppins.bold,
    },
    holidayLabel: {
      fontFamily: FontFamily.poppins.regular,
      fontSize: 7,
      color: colors.error,
      textAlign: 'center',
      marginTop: 2,
    },

    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.md,
      padding: Spacing.sm,
      backgroundColor: isDark ? colors.primary + '10' : colors.primary + '08',
      borderRadius: BorderRadius.sm,
    },
    infoText: {
      marginLeft: Spacing.sm,
      fontFamily: FontFamily.poppins.regular,
      fontSize: FontSize.xs,
      color: colors.text.secondary,
    },

    // --- TABLE ---
    table: {
      borderWidth: 1,
      borderColor: colors.border.light,
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    tableRowAlt: {
      backgroundColor: isDark ? colors.background.secondary + '40' : '#F9FAFB',
    },
    tableHeader: {
      backgroundColor: isDark ? colors.background.secondary : '#F3F4F6',
    },
    tableCol: {
      fontFamily: FontFamily.poppins.regular,
      fontSize: FontSize.sm,
      color: colors.text.primary,
    },
    tableHeaderText: {
      fontFamily: FontFamily.poppins.semibold,
      color: colors.text.secondary,
    },
    statusTag: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.sm,
    },
    tagOpen: {
      backgroundColor: isDark ? colors.success + '20' : '#DCFCE7',
    },
    tagClosed: {
      backgroundColor: isDark ? colors.error + '20' : '#FEE2E2',
    },
    tagText: {
      fontFamily: FontFamily.poppins.bold,
      fontSize: 10,
    },

    // --- HOLIDAY CARD ---
    holidayCard: {
      flexDirection: 'row',
      backgroundColor: colors.background.card,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      ...Shadow.sm,
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : 'transparent',
    },
    dateBox: {
      backgroundColor: isDark ? colors.error + '20' : '#FEE2E2',
      padding: Spacing.sm,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      marginRight: Spacing.md,
    },
    dateMonth: {
      fontFamily: FontFamily.poppins.bold,
      fontSize: FontSize.xs,
      color: colors.error,
    },
    dateDay: {
      fontFamily: FontFamily.poppins.bold,
      fontSize: FontSize.xl,
      color: colors.error,
    },
    holidayInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    holidayName: {
      fontFamily: FontFamily.poppins.semibold,
      fontSize: FontSize.base,
      color: colors.text.primary,
      marginBottom: 4,
    },
    holidayTypeBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
      marginBottom: 4,
    },
    badgeNational: {
      backgroundColor: colors.error,
    },
    badgeLeave: {
      backgroundColor: colors.warning,
    },
    holidayTypeText: {
      fontFamily: FontFamily.poppins.bold,
      fontSize: 10,
      color: '#fff',
    },
    holidayDateFull: {
      fontFamily: FontFamily.poppins.regular,
      fontSize: FontSize.xs,
      color: colors.text.secondary,
    },
    daysUntilText: {
      fontFamily: FontFamily.poppins.medium,
      fontSize: FontSize.xs,
      color: colors.primary,
      marginTop: 4,
    },

    // --- EMPTY STATE ---
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xl * 2,
    },
    emptyText: {
      fontFamily: FontFamily.poppins.regular,
      fontSize: FontSize.sm,
      color: colors.text.tertiary,
      marginTop: Spacing.sm,
    },
  });