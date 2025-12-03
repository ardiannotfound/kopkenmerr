import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, 
  KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SatisfactionSurveyScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { ticketId } = route.params; // Kita terima ID tiket untuk disimpan nanti

  const [rating, setRating] = useState(0); // 0 = Belum pilih
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Mohon Isi Rating", "Silakan berikan bintang 1 sampai 5.");
      return;
    }

    // Disini nanti logic kirim ke API (save integer rating & string review)
    console.log(`Submit Survey Tiket ${ticketId}: Rating ${rating}, Review: ${review}`);

    Alert.alert(
      "Terima Kasih", 
      "Ulasan Anda sangat berharga untuk meningkatkan layanan kami.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  // Render 5 Bintang
  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons 
              name={star <= rating ? "star" : "star-outline"} 
              size={40} 
              color="#FFD700" // Warna Emas
              style={{ marginHorizontal: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.card}>
          <Text style={styles.question}>
            Seberapa puas Anda terhadap penanganan tiket ini?
          </Text>
          
          {/* Komponen Bintang */}
          {renderStars()}
          
          <Text style={styles.ratingLabel}>
            {rating > 0 ? `${rating} dari 5 Bintang` : 'Ketuk bintang untuk menilai'}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tulis Ulasan Anda disini!</Text>
          <TextInput
            style={styles.input}
            placeholder="Ceritakan pengalaman Anda (pelayanan cepat, ramah, dsb)..."
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kirim Ulasan</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 20 },
  card: {
    backgroundColor: '#fff', padding: 25, borderRadius: 12, alignItems: 'center', marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  question: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 20 },
  starsContainer: { flexDirection: 'row', marginBottom: 10 },
  ratingLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  
  inputContainer: { marginBottom: 30 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  input: { 
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, 
    fontSize: 16, minHeight: 120, textAlignVertical: 'top' 
  },
  
  submitButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});