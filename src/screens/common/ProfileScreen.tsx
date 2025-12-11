import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// --- IMPORTS BARU ---
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius } from '../../styles/spacing';
import {  FontSize } from '../../styles/typography';
import { FontFamily } from '../../styles/typography';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { theme, colors } = useTheme();
  
  // 1. Ambil Data dari Store (Bukan Mock Data lagi)
  const { user, userRole, isGuest, logout } = useAuthStore();
  const role = userRole(); // 'teknisi', 'pegawai_opd', atau 'masyarakat'

  // Helper Tampilan
  const displayInitials = isGuest ? 'G' : user?.full_name?.charAt(0).toUpperCase() || 'U';
  const displayName = isGuest ? 'Tamu Masyarakat' : user?.full_name || 'Pengguna';
  
  const getRoleLabel = () => {
    if (isGuest) return 'Pengunjung Umum';
    if (role === 'teknisi') return 'Teknisi IT';
    if (role === 'pegawai_opd') return 'Pegawai Pemerintah';
    return 'Pengguna';
  };

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya, Keluar", 
          style: 'destructive',
          onPress: () => logout() // ✅ Cukup panggil ini
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      
      {/* HEADER PROFILE */}
      <View style={[styles.header, { backgroundColor: colors.background.card, borderColor: colors.border.light }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{displayInitials}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text.primary }]}>{displayName}</Text>
        <Text style={[styles.role, { color: colors.text.secondary }]}>{getRoleLabel()}</Text>
        
        {/* NIP hanya muncul jika bukan tamu */}
        {!isGuest && user?.nip && (
          <Text style={[styles.nip, { color: colors.text.tertiary }]}>NIP: {user.nip}</Text>
        )}
      </View>

      {/* MENU CONTAINER */}
      <View style={[styles.menuContainer, { backgroundColor: colors.background.card }]}>
        <Text style={styles.sectionTitle}>Akun</Text>

        {/* MENU KHUSUS AUTHENTICATED USER */}
        {!isGuest && (
          <>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]} onPress={() => navigation.navigate('EditProfile')}>
              <View style={[styles.iconBox, {backgroundColor: '#e3f2fd'}]}>
                <Ionicons name="person-outline" size={20} color="#007AFF" />
              </View>
              <Text style={[styles.menuText, { color: colors.text.primary }]}>Edit Profil</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]} onPress={() => navigation.navigate('ChangePassword')}>
              <View style={[styles.iconBox, {backgroundColor: '#fff3cd'}]}>
                <Ionicons name="key-outline" size={20} color="#856404" />
              </View>
              <Text style={[styles.menuText, { color: colors.text.primary }]}>Ganti Kata Sandi</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>

            {/* KHUSUS TEKNISI */}
            {role === 'teknisi' && (
              <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]} onPress={() => navigation.navigate('TechPerformance')}>
                <View style={[styles.iconBox, {backgroundColor: '#f3e5f5'}]}>
                  <Ionicons name="stats-chart-outline" size={20} color="#9c27b0" />
                </View>
                <Text style={[styles.menuText, { color: colors.text.primary }]}>Laporan Kinerja</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </>
        )}

        {/* MENU UMUM */}
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]} onPress={() => navigation.navigate('AboutApp')}>
          <View style={[styles.iconBox, {backgroundColor: '#e8f5e9'}]}>
            <Ionicons name="information-circle-outline" size={20} color="#2e7d32" />
          </View>
          <Text style={[styles.menuText, { color: colors.text.primary }]}>Tentang Aplikasi</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      {/* TOMBOL LOGOUT */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#d32f2f" style={{marginRight: 10}} />
          <Text style={styles.logoutText}>
            {isGuest ? 'Keluar Mode Tamu' : 'Keluar Aplikasi'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.versionText, { color: colors.text.tertiary }]}>App Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    alignItems: 'center', 
    padding: Spacing.lg, 
    borderBottomWidth: 1,
    paddingTop: hp(5)
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  avatarText: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  name: { 
    fontSize: FontSize.lg, 
    fontFamily: FontFamily.poppins.semibold 
  },
  role: { 
    fontSize: FontSize.sm, 
    marginTop: 2,
    fontFamily: FontFamily.poppins.regular
  },
  nip: { 
    fontSize: FontSize.xs, 
    marginTop: 5,
    fontFamily: FontFamily.poppins.regular
  },

  menuContainer: { 
    marginTop: Spacing.md, 
    paddingVertical: 10 
  },
  sectionTitle: { 
    paddingHorizontal: 20, 
    marginBottom: 10, 
    fontSize: FontSize.xs, 
    fontWeight: 'bold', 
    color: '#999', 
    textTransform: 'uppercase' 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1 
  },
  iconBox: { 
    width: 36, 
    height: 36, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  menuText: { 
    flex: 1, 
    fontSize: FontSize.md,
    fontFamily: FontFamily.poppins.medium
  },

  footer: { 
    padding: 20, 
    marginTop: 20 
  },
  logoutBtn: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ffebee', 
    padding: 15, 
    borderRadius: 10 
  },
  logoutText: { 
    color: '#d32f2f', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  versionText: { 
    textAlign: 'center', 
    marginTop: 15, 
    fontSize: 12 
  },
});