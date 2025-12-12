import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader'; 
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontSize, FontFamily } from '../../styles/typography';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  
  const { user, userRole, isGuest, logout } = useAuthStore();
  const role = userRole(); 

  // --- 1. VIEW KHUSUS TAMU (GUEST) ---
  if (isGuest) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <CustomHeader 
          type="page" 
          title="Profil Akun" 
          showNotificationButton={false} 
        />
        <View style={[styles.guestContainer, { backgroundColor: colors.background.primary }]}>
          <Ionicons name="lock-closed-outline" size={80} color={colors.text.tertiary} />
          <Text style={[styles.guestTitle, { color: colors.text.primary }]}>Akses Terbatas</Text>
          <Text style={[styles.guestDesc, { color: colors.text.secondary }]}>
            Silahkan login terlebih dahulu untuk mengakses profil dan pengaturan akun Anda.
          </Text>
          <TouchableOpacity 
            style={[styles.loginBtn, { backgroundColor: colors.primary }]} 
            onPress={() => logout()} 
          >
            <Text style={[styles.loginText, { color: colors.white }]}>Login Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- 2. VIEW PEGAWAI / TEKNISI ---
  const displayInitials = user?.full_name?.charAt(0).toUpperCase() || 'U';
  const displayName = user?.full_name || 'Pengguna';
  
  const getRoleLabel = () => {
    if (role === 'teknisi') return 'Teknisi';
    if (role === 'pegawai_opd') return 'Pegawai';
    return 'Pengguna';
  };

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Keluar", style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      
      {/* 1. HEADER (Normal Flow) */}
      <CustomHeader 
        type="page" 
        title="Profil Saya" 
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* 2. SCROLLVIEW (Normal Flow di bawah Header) */}
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 50 }} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* 3. PROFILE SECTION (Standard Layout) */}
        <View style={[styles.profileSection, { backgroundColor: colors.background.primary }]}>
          <View style={styles.profileRow}>
            
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>{displayInitials}</Text>
                </View>
              )}
            </View>

            {/* Info User */}
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text.primary }]}>
                {displayName}
              </Text>
              <Text style={[styles.userRole, { color: colors.text.secondary }]}>
                {getRoleLabel()}
              </Text>
              {user?.nip && (
                <Text style={[styles.userNip, { color: colors.text.tertiary }]}>
                  NIP: {user.nip}
                </Text>
              )}
            </View>

            {/* Tombol Edit Kecil */}
            <TouchableOpacity 
              style={[styles.editBtnSmall, { backgroundColor: colors.background.secondary }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="pencil" size={18} color={colors.primary} />
            </TouchableOpacity>

          </View>
        </View>

        {/* 4. MENU LIST */}
        <View style={styles.menuContainer}>
          <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>AKUN</Text>

          {/* Edit Profil */}
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: colors.background.card }]} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}>
              <Ionicons name="person-outline" size={20} color="#007AFF" />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Edit Profil</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          {/* Ganti Password */}
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: colors.background.card }]} 
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#fff3cd' }]}>
              <Ionicons name="key-outline" size={20} color="#856404" />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Ganti Kata Sandi</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          {/* KHUSUS TEKNISI */}
          {role === 'teknisi' && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.text.tertiary, marginTop: Spacing.lg }]}>TEKNISI AREA</Text>
              <TouchableOpacity 
                style={[styles.menuItem, { backgroundColor: colors.background.card }]} 
                onPress={() => navigation.navigate('TechPerformance')}
              >
                <View style={[styles.iconBox, { backgroundColor: '#f3e5f5' }]}>
                  <Ionicons name="stats-chart-outline" size={20} color="#9c27b0" />
                </View>
                <Text style={[styles.menuText, { color: colors.text.primary }]}>Laporan Kinerja</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            </>
          )}

          {/* LAINNYA */}
          <Text style={[styles.sectionLabel, { color: colors.text.tertiary, marginTop: Spacing.lg }]}>LAINNYA</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: colors.background.card }]} 
            onPress={() => navigation.navigate('AboutApp')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#e8f5e9' }]}>
              <Ionicons name="information-circle-outline" size={20} color="#2e7d32" />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Tentang Aplikasi</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity 
            style={[styles.logoutItem, { backgroundColor: '#ffebee' }]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
            <Text style={[styles.logoutText, { color: '#d32f2f' }]}>Keluar Aplikasi</Text>
          </TouchableOpacity>

          <Text style={[styles.versionText, { color: colors.text.tertiary }]}>Version 1.0.0</Text>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // --- GUEST STYLES ---
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: -hp(10),
  },
  guestTitle: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.xl,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  guestDesc: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.md,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  loginBtn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  loginText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
  },

  // --- PROFILE HEADER (STANDARD) ---
  profileSection: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    // Agar terlihat seperti Card di atas background abu
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadow.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center', // Center vertikal
  },
  avatarContainer: {
    // Tidak perlu border tebal atau elevation berlebih
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center', // Center vertikal
  },
  userName: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize.lg,
    marginBottom: 2,
  },
  userRole: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
  },
  userNip: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  editBtnSmall: {
    padding: 8,
    borderRadius: 20,
    ...Shadow.sm,
  },

  // --- MENU LIST ---
  menuContainer: {
    paddingHorizontal: wp(6),
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: 11,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadow.sm, 
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.md,
  },
  
  // --- LOGOUT ---
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  logoutText: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    fontFamily: FontFamily.poppins.regular,
    fontSize: 10,
  },
});