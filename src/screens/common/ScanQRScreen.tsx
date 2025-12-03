import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // <--- TAMBAH useIsFocused
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CurrentUser } from '../../data/Session';

export default function ScanQRScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const isFocused = useIsFocused(); // <--- Deteksi apakah layar sedang aktif dilihat
  
  const userRole = CurrentUser.role;
  const userId = CurrentUser.userId;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false); 

  // 1. Cek Permission Kamera
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  // 2. LOGIC BARU: Matikan Flash otomatis jika layar tidak fokus (Pindah Tab/Back)
  useEffect(() => {
    if (!isFocused) {
      setTorchEnabled(false);
    }
  }, [isFocused]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setTorchEnabled(false); // Matikan flash saat dapat QR
    
    Alert.alert(
      "Aset Terdeteksi",
      `ID Aset: ${data}\nLaporkan masalah pada aset ini?`,
      [
        { text: "Batal", onPress: () => setScanned(false), style: "cancel" },
        { 
          text: "Ya, Lapor", 
          onPress: () => {
            navigation.navigate('CreateTicket', {
              type: 'incident',
              userRole: userRole,
              userId: userId,
              assetId: data,
              isQrScan: true
            });
            // Tidak perlu setScanned(false) disini karena user pindah halaman
            // Nanti saat balik kesini, isFocused mentrigger reset
          }
        }
      ]
    );
  };

  const handleSimulateScan = () => {
    handleBarCodeScanned({ type: 'qr', data: 'PRINTER-EPSON-L3110' });
  };

  if (hasPermission === null) return <View style={styles.container}><Text>Meminta izin kamera...</Text></View>;
  if (hasPermission === false) return <View style={styles.container}><Text>Tidak ada akses kamera.</Text></View>;

  return (
    <View style={styles.container}>
      {/* PENTING: Kita kondisikan render Kamera dengan 'isFocused'.
         Jika user pindah tab/back, kamera PAUSE render-nya, otomatis flash mati.
         Ditambah enableTorch yang dipaksa false jika !isFocused.
      */}
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          enableTorch={torchEnabled && isFocused} // <--- Double Protection
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
        />
      )}
      
      <View style={styles.overlay}>
        <Text style={styles.scanTitle}>Scan QR Aset</Text>
        
        <View style={styles.scanFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
        </View>

        <Text style={styles.instructions}>Arahkan kamera ke QR Code Aset</Text>

        <TouchableOpacity 
          style={[styles.flashButton, torchEnabled && styles.flashButtonActive]} 
          onPress={() => setTorchEnabled(!torchEnabled)}
        >
            <Ionicons name={torchEnabled ? "flash" : "flash-off"} size={24} color={torchEnabled ? "#000" : "#fff"} />
            <Text style={[styles.flashText, torchEnabled && {color: '#000'}]}>
              {torchEnabled ? "Matikan Flash" : "Nyalakan Flash"}
            </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close-circle" size={40} color="#fff" />
      </TouchableOpacity>

      <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}>
        <Button title="[DEV] Simulasi Scan QR" onPress={handleSimulateScan} color="#28a745" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  
  scanTitle: { position: 'absolute', top: 100, color: '#fff', fontSize: 20, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.7)', textShadowRadius: 5 },
  
  scanFrame: { width: 250, height: 250, backgroundColor: 'transparent', position: 'relative' },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#007AFF' },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#007AFF' },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#007AFF' },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#007AFF' },

  instructions: { color: '#fff', marginTop: 20, fontSize: 16, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 },
  
  backButton: { position: 'absolute', top: 50, right: 20 },

  flashButton: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 30, paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1, borderColor: '#fff'
  },
  flashButtonActive: {
    backgroundColor: '#fff', borderColor: '#fff'
  },
  flashText: { color: '#fff', marginLeft: 10, fontWeight: 'bold' }
});