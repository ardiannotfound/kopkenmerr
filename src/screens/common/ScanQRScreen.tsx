import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as Location from 'expo-location'; 
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../../store/authStore';

// MOCK TIKET TEKNISI
const MOCK_ACTIVE_TICKETS = [
  { id: 101, ticketNumber: 'INC-2025-001', technicianId: 3, status: 'assigned', assetName: 'Router' },
  { id: 102, ticketNumber: 'INC-2025-002', technicianId: 3, status: 'in_progress', assetName: 'Server' }
];

export default function ScanQRScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const isFocused = useIsFocused();
  
  const { user, userRole, isGuest } = useAuthStore();
  const role = isGuest ? 'guest' : userRole(); 

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false); 
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && locationStatus.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (!isFocused) setTorchEnabled(false);
  }, [isFocused]);

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLoadingLocation(false);
      return `${location.coords.latitude}, ${location.coords.longitude}`;
    } catch (error) {
      setLoadingLocation(false);
      Alert.alert("Error GPS", "Gagal mengambil lokasi. Pastikan GPS aktif.");
      return null;
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    setTorchEnabled(false);
    
    console.log(`📡 Scanned: ${data}, Role: ${role}`);

    // ============================================================
    // 1️⃣ LOGIKA: MASYARAKAT / GUEST (Harus Isi Data Diri Dulu)
    // ============================================================
    if (role === 'guest' || role === 'masyarakat') {
      Alert.alert(
        "Aset Terdeteksi",
        `ID: ${data}\nSilakan isi data diri Anda untuk melaporkan.`,
        [
          { text: "Batal", onPress: () => setScanned(false), style: "cancel" },
          { 
            text: "Lanjut Isi Data", 
            onPress: () => {
              // ✅ KE STEP 1 (CreateIncident) bawa params aset
              navigation.replace('CreateIncident', {
                assetId: data, 
                isQrScan: true
              });
            }
          }
        ]
      );
    } 
    
    // ============================================================
    // 2️⃣ LOGIKA: PEGAWAI OPD (Langsung ke Detail)
    // ============================================================
    else if (role === 'pegawai_opd') {
      Alert.alert(
        "Aset Terdeteksi",
        `ID: ${data}\nLaporkan kerusakan aset ini?`,
        [
          { text: "Batal", onPress: () => setScanned(false), style: "cancel" },
          { 
            text: "Ya, Lapor", 
            onPress: () => {
              // ✅ LANGSUNG KE STEP 2 (DetailIncident) karena data diri sudah ada
              navigation.replace('DetailIncident', {
                userData: user, // Bawa data user login
                assetId: data, 
                isQrScan: true
              });
            }
          }
        ]
      );
    }

    // ============================================================
    // 3️⃣ LOGIKA: TEKNISI (Maintenance / Check-In)
    // ============================================================
    else if (role === 'teknisi') {
      const matchedTicket = MOCK_ACTIVE_TICKETS.find(t => 
        (data.toUpperCase().includes(t.assetName.toUpperCase()) || t.assetName.toUpperCase().includes(data.toUpperCase()))
      );

      if (matchedTicket) {
        const realCoords = await getCurrentLocation();
        if (realCoords) {
          Alert.alert(
            "✅ Validasi Lokasi Sukses!",
            `Tiket: ${matchedTicket.ticketNumber}\nGPS: ${realCoords}`,
            [
              { text: "Mulai Kerja", onPress: () => navigation.navigate('TicketDetail', { ticketId: matchedTicket.id }) }
            ]
          );
        } else {
           setScanned(false);
        }
      } else {
        Alert.alert(
          "Info Aset",
          `Aset ID: ${data}\nTidak ada tugas aktif. Lihat riwayat?`,
          [
            { text: "Scan Lagi", onPress: () => setScanned(false), style: "cancel" },
            { text: "Lihat Info", onPress: () => navigation.navigate('AssetHistory', { assetId: data }) }
          ]
        );
      }
    }
  };

  // Helper Simulator
  const handleSimulateScan = () => {
    handleBarCodeScanned({ type: 'qr', data: 'PRINTER-001' }); 
  };

  if (hasPermission === null) return <View style={styles.container}><Text style={{color:'#fff'}}>Meminta izin...</Text></View>;
  if (hasPermission === false) return <View style={styles.container}><Text style={{color:'#fff'}}>Akses Kamera Ditolak.</Text></View>;

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned || loadingLocation ? undefined : handleBarCodeScanned}
          enableTorch={torchEnabled && isFocused}
          barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
        />
      )}
      
      {loadingLocation && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color:'#fff', marginTop: 10}}>Validasi Lokasi...</Text>
        </View>
      )}

      <View style={styles.overlay}>
        <Text style={styles.scanTitle}>Scan QR Aset</Text>
        <View style={styles.scanFrame}>
            <View style={styles.cornerTL} /><View style={styles.cornerTR} />
            <View style={styles.cornerBL} /><View style={styles.cornerBR} />
        </View>
        <Text style={styles.instructions}>Arahkan kamera ke QR Code Aset</Text>
        <TouchableOpacity style={[styles.flashButton, torchEnabled && styles.flashButtonActive]} onPress={() => setTorchEnabled(!torchEnabled)}>
            <Ionicons name={torchEnabled ? "flash" : "flash-off"} size={24} color={torchEnabled ? "#000" : "#fff"} />
            <Text style={[styles.flashText, torchEnabled && {color: '#000'}]}>Flash</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close-circle" size={40} color="#fff" />
      </TouchableOpacity>

      <View style={{ position: 'absolute', bottom: 40, alignSelf: 'center' }}>
        <Button title="[DEV] Simulasi Scan" onPress={handleSimulateScan} color="#28a745" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 99 },
  scanTitle: { position: 'absolute', top: 100, color: '#fff', fontSize: 20, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.7)', textShadowRadius: 5 },
  scanFrame: { width: 250, height: 250, backgroundColor: 'transparent', position: 'relative' },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#007AFF' },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#007AFF' },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#007AFF' },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#007AFF' },
  instructions: { color: '#fff', marginTop: 20, fontSize: 16, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 },
  backButton: { position: 'absolute', top: 50, right: 20 },
  flashButton: { flexDirection: 'row', alignItems: 'center', marginTop: 30, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: '#fff' },
  flashButtonActive: { backgroundColor: '#fff', borderColor: '#fff' },
  flashText: { color: '#fff', marginLeft: 10, fontWeight: 'bold' }
});