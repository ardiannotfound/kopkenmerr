import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MOCK_ARTICLES } from '../../data/mockData';

export default function InformationDetailScreen() {
  const route = useRoute<any>();
  const { articleId } = route.params;

  const article = MOCK_ARTICLES.find(a => a.id === articleId);

  if (!article) return <View><Text>Artikel tidak ditemukan</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.date}>Diperbarui: 03 Des 2025</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.body}>{article.content}</Text>
        
        {/* Simulasi Related Info */}
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>Catatan:</Text>
          <Text style={styles.alertBody}>Jika panduan ini tidak menyelesaikan masalah Anda, silakan buat tiket pengaduan baru.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#e3f2fd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, marginBottom: 10 },
  categoryText: { color: '#1976d2', fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  date: { fontSize: 12, color: '#999' },
  
  content: { padding: 20 },
  body: { fontSize: 16, lineHeight: 24, color: '#444', marginBottom: 30 },
  
  alertBox: { backgroundColor: '#fff3cd', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ffeeba' },
  alertTitle: { fontWeight: 'bold', color: '#856404', marginBottom: 5 },
  alertBody: { color: '#856404', fontSize: 14 },
});