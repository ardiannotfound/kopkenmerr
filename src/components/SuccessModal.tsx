import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur'; 
import * as Clipboard from 'expo-clipboard'; // ✅ FIX: Pakai library expo-clipboard

// --- IMPORTS SYSTEM ---
// Pastikan path ini sesuai dengan struktur folder Anda
import { wp, hp, Shadow } from '../styles/spacing'; // Sesuaikan path jika perlu
import { FontFamily, FontSize } from '../styles/typography'; // Sesuaikan path jika perlu

const { width } = Dimensions.get('window');

interface SuccessModalProps {
  visible: boolean;
  ticketNumber: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, ticketNumber, onClose }) => {
  
  const handleCopy = async () => {
    // ✅ FIX: Gunakan setStringAsync untuk Expo
    await Clipboard.setStringAsync(ticketNumber);
    // Opsional: Beri feedback ke user
    Alert.alert("Tersalin", "Nomor tiket berhasil disalin ke clipboard.");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        {/* Blur Background */}
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

        <View style={styles.card}>
          {/* Close Icon Top Right */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          {/* Icon Centang Hijau */}
          <View style={styles.iconWrapper}>
            <Ionicons name="checkmark" size={40} color="#FFF" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Laporan Diterima!</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Terima kasih telah melapor. Laporan Anda telah masuk sistem dengan informasi tiket:
          </Text>

          {/* Ticket Placeholder Box */}
          <View style={styles.ticketBox}>
            <View>
              <Text style={styles.ticketLabel}>Nomor Tiket</Text>
              <Text style={styles.ticketValue}>{ticketNumber || "-"}</Text>
            </View>
            <TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={20} color="#666" />
              <Text style={styles.copyText}>Salin</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          <Text style={styles.footerNote}>
            Silahkan simpan nomor tiket ini untuk mengecek status penanganan melalui menu Lacak Tiket.
          </Text>

          {/* Button Mengerti */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Mengerti, Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', 
  },
  card: {
    width: width * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    // Shadow manual jika helper Shadow tidak ada
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontFamily: FontFamily.poppins?.semibold || 'System', // Safety check font
    fontSize: 20,
    color: '#053F5C', 
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: FontFamily.poppins?.regular || 'System',
    fontSize: 13,
    color: '#053F5C',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ticketBox: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ticketLabel: {
    fontFamily: FontFamily.poppins?.medium || 'System',
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  ticketValue: {
    fontFamily: FontFamily.poppins?.bold || 'System',
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  copyText: {
    fontSize: 10,
    fontFamily: FontFamily.poppins?.medium || 'System',
    color: '#666',
    marginLeft: 4,
  },
  footerNote: {
    fontFamily: FontFamily.poppins?.regular || 'System',
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  button: {
    width: '100%',
    backgroundColor: '#FFA629',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontFamily.poppins?.semibold || 'System',
    color: '#053F5C',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SuccessModal;