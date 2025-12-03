import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from "react-native-chart-kit";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { PERFORMANCE_DATA } from '../../data/mockData';

export default function TechnicianPerformanceScreen() {
  const [filter, setFilter] = useState('Bulan Ini');
  const screenWidth = Dimensions.get("window").width;

  // --- LOGIC EXPORT PDF ---
  const handleExportPDF = async () => {
    try {
      const htmlContent = `
        <html>
          <body>
            <h1>Laporan Kinerja Teknisi</h1>
            <p>Periode: ${filter}</p>
            <hr />
            <h2>Ringkasan</h2>
            <ul>
              <li>Tiket Selesai: ${PERFORMANCE_DATA.stats.ticketsResolved.value}</li>
              <li>Rata-rata MTTR: ${PERFORMANCE_DATA.stats.mttr.value}</li>
              <li>Kepatuhan SLA: ${PERFORMANCE_DATA.stats.slaCompliance.value}</li>
              <li>Kepuasan User: ${PERFORMANCE_DATA.stats.csat.value}</li>
            </ul>
            <p><em>Dicetak otomatis dari Aplikasi Service Desk.</em></p>
          </body>
        </html>
      `;
      
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Gagal membuat PDF.");
    }
  };

  // --- RENDER CARD STATISTIK ---
  const renderStatCard = (title: string, data: any, icon: any) => {
    // Logic Warna: Hijau jika isBetter=true, Merah jika false
    const trendColor = data.isBetter ? '#2e7d32' : '#d32f2f';
    const trendIcon = data.isBetter ? 'arrow-up' : 'arrow-down';
    // Khusus MTTR, kalau "arrow-down" (turun) itu justru bagus (isBetter=true)
    // Jadi kita atur panahnya visual saja:
    const visualIcon = data.diff > 0 ? 'arrow-up' : 'arrow-down';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Ionicons name={icon} size={18} color="#666" />
        </View>
        <Text style={styles.cardValue}>{data.value}</Text>
        <View style={styles.trendContainer}>
          <Ionicons name={visualIcon} size={14} color={trendColor} />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {Math.abs(data.diff)}% vs Bulan Lalu
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header & Export */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laporan Kinerja</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExportPDF}>
          <Ionicons name="print-outline" size={20} color="#fff" />
          <Text style={styles.exportText}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['Bulan Ini', 'Bulan Lalu', 'Tahun Ini'].map((f) => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.textActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {/* 1. GRID STATISTIK */}
        <View style={styles.grid}>
          {renderStatCard('Tiket Selesai', PERFORMANCE_DATA.stats.ticketsResolved, 'checkbox')}
          {renderStatCard('Rata-rata MTTR', PERFORMANCE_DATA.stats.mttr, 'timer')}
          {renderStatCard('Kepatuhan SLA', PERFORMANCE_DATA.stats.slaCompliance, 'shield-checkmark')}
          {renderStatCard('Kepuasan (CSAT)', PERFORMANCE_DATA.stats.csat, 'star')}
        </View>

        {/* 2. CHART: TREND PRODUKTIVITAS */}
        <Text style={styles.chartTitle}>Trend Produktivitas Mingguan</Text>
        <LineChart
          data={{
            labels: PERFORMANCE_DATA.weeklyTrend.labels,
            datasets: [
              { data: PERFORMANCE_DATA.weeklyTrend.incoming, color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`, strokeWidth: 2 }, // Masuk (Orange)
              { data: PERFORMANCE_DATA.weeklyTrend.resolved, color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`, strokeWidth: 2 } // Selesai (Hijau)
            ],
            legend: ["Masuk", "Selesai"]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />

        {/* 3. CHART: KOMPOSISI PEKERJAAN */}
        <Text style={styles.chartTitle}>Komposisi Pekerjaan</Text>
        <View style={styles.donutContainer}>
          <PieChart
            data={PERFORMANCE_DATA.composition}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>

        {/* 4. MOTIVASI CARD */}
        <View style={styles.motivationCard}>
          <View style={styles.motivationHeader}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.motivationTitle}>Kinerja Anda Sangat Baik!</Text>
          </View>
          <Text style={styles.motivationText}>
            Anda mempertahankan rasio kepatuhan SLA di atas 95% selama 3 bulan berturut-turut. 
            Rata-rata MTTR Anda juga 15% lebih cepat dibandingkan rata-rata tim. Pertahankan!
          </Text>
        </View>

      </View>
      <View style={{height: 30}} />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0, 
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#ffa726" }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  exportBtn: { flexDirection: 'row', backgroundColor: '#007AFF', padding: 8, borderRadius: 8, alignItems: 'center' },
  exportText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },

  filterContainer: { flexDirection: 'row', padding: 15, justifyContent: 'center', gap: 10 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e0e0e0' },
  filterActive: { backgroundColor: '#333' },
  filterText: { color: '#666', fontSize: 12, fontWeight: '600' },
  textActive: { color: '#fff' },

  content: { padding: 20, paddingTop: 0 },
  
  // Grid Cards
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  card: { 
    width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardTitle: { fontSize: 12, color: '#666', fontWeight: '600' },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  trendContainer: { flexDirection: 'row', alignItems: 'center' },
  trendText: { fontSize: 10, fontWeight: 'bold', marginLeft: 2 },

  // Charts
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  chart: { borderRadius: 16, marginVertical: 8 },
  donutContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 10, alignItems: 'center', elevation: 2 },

  // Motivation
  motivationCard: { 
    backgroundColor: '#fff3e0', padding: 20, borderRadius: 12, marginTop: 25, 
    borderWidth: 1, borderColor: '#ffe0b2' 
  },
  motivationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  motivationTitle: { fontSize: 16, fontWeight: 'bold', color: '#e65100', marginLeft: 10 },
  motivationText: { fontSize: 14, color: '#ef6c00', lineHeight: 22 },
});