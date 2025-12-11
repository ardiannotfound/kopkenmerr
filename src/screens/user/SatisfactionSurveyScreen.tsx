import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, 
  ScrollView, StatusBar, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontSize, FontFamily } from '../../styles/typography';

// --- IMPORTS SVG ---
import SurveyCheckIcon from '../../../assets/icons/surveycek.svg'; 
import SendIcon from '../../../assets/icons/kirim.svg'; 

export default function SatisfactionSurveyScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // 1. Theme Hook
  const { colors, isDark } = useTheme();
  
  const { ticketId } = route.params || {};
  const [rating, setRating] = useState(0); 
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Mohon Isi Rating", "Silakan berikan bintang 1 sampai 5.");
      return;
    }
    console.log(`Survey ID: ${ticketId}, Rate: ${rating}, Review: ${review}`);
    Alert.alert("Terima Kasih", "Ulasan Anda telah terkirim.", [{ text: "OK", onPress: () => navigation.goBack() }]);
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
            <Ionicons 
              name={star <= rating ? "star" : "star-outline"} 
              size={40} 
              color="#FACC15" 
              style={{ marginHorizontal: 6 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Helper Warna Teks (Responsive Dark Mode)
  // Jika Dark Mode -> Putih, Jika Light -> Primary (Biru)
  const dynamicPrimaryColor = isDark ? colors.text.primary : colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <CustomHeader type="page" title="Survey Kepuasan" showNotificationButton={false} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 1. HEADER SECTION (ROW: Icon + Title) */}
          <View style={styles.headerRow}>
            {/* Icon Survey (Ukuran disesuaikan agar proporsional dengan teks) */}
            <SurveyCheckIcon width={32} height={32} style={{ marginRight: 10 }} />
            
            {/* Judul: Beri Ulasan */}
            <Text style={[styles.titleText, { color: dynamicPrimaryColor }]}>
              Beri Ulasan Kepuasan Anda!
            </Text>
          </View>

          {/* Subtitle */}
          <Text style={[styles.subtitleText, { color: colors.text.secondary }]}>
            Kami menghargai pendapat Anda. Berikan ulasan terhadap penanganan tiket ini.
          </Text>

          {/* 2. RATING SECTION */}
          <View style={styles.ratingSection}>
            <Text style={[styles.questionText, { color: dynamicPrimaryColor }]}>
              Seberapa puas Anda terhadap penanganan tiket ini?
            </Text>
            
            {renderStars()}
            
            <Text style={[styles.ratingLabel, { color: colors.text.tertiary }]}>
              {rating > 0 ? `${rating} dari 5 Bintang` : 'Ketuk bintang untuk menilai'}
            </Text>
          </View>

          {/* 3. INPUT ULASAN */}
          <View style={styles.inputSection}>
            <Text style={[styles.labelInput, { color: dynamicPrimaryColor }]}>
              Tulis Ulasan Anda disini!
            </Text>
            
            <View style={[
              styles.inputBox, 
              { 
                backgroundColor: colors.background.card, 
                borderColor: colors.border.default 
              }
            ]}>
              <TextInput
                style={[styles.textInput, { color: colors.text.primary }]}
                placeholder="Contoh: Petugas fast respon dalam menanggapi layanan pelanggan..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* 4. TOMBOL KIRIM (Padding Horizontal agar tidak terlalu lebar) */}
          <View style={{ paddingHorizontal: wp(5) }}> 
            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: '#429EBD' }]} 
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SendIcon width={20} height={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={[styles.submitText, { color: '#FFFFFF' }]}>
                  Kirim Ulasan
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: hp(5),
  },

  // --- HEADER SECTION (ROW) ---
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    marginBottom: Spacing.xs,
  },
  titleText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.lg, // Ukuran pas untuk header
    textAlign: 'left', // Rata kiri karena ada icon
  },
  
  subtitleText: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingHorizontal: wp(2),
    lineHeight: 22,
    marginBottom: hp(4), // Jarak ke rating
  },

  // --- RATING ---
  ratingSection: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  questionText: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  ratingLabel: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm,
  },

  // --- INPUT ---
  inputSection: {
    marginBottom: hp(4),
  },
  labelInput: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  inputBox: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    height: 140, 
  },
  textInput: {
    flex: 1,
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    textAlignVertical: 'top', 
  },

  // --- BUTTON ---
  submitButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 15,
    alignItems: 'center', 
    justifyContent: 'center',
    ...Shadow.sm,
    width: '100%',
  },
  submitText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
  },
});