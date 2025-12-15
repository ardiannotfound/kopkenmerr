import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, RefreshControl 
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- IMPORTS SYSTEM ---
import CustomHeader from '../../components/CustomHeader'; 
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { wp, hp, Spacing, BorderRadius, Shadow } from '../../styles/spacing';
import { FontSize, FontFamily } from '../../styles/typography';
import { authApi } from '../../services/api/auth'; 

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  
  const { user, userRole, isGuest, logout, updateUserData } = useAuthStore();
  const role = userRole(); 

  // State untuk Refresh
  const [refreshing, setRefreshing] = useState(false);

  // --- LOGIC REFRESH DATA (PULL TO REFRESH) ---
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Refreshing Profile Data...");
      const response = await authApi.getMe();
      
      if (response && response.user) {
        console.log("✅ Profile Refreshed:", response.user.avatar_url);
        await updateUserData(response.user);
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    } finally {
      setRefreshing(false);
    }
  }, [updateUserData]);

  // --- HANDLE ACTIONS ---
  const handleGuestLogin = async () => {
    await logout();
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }], 
        })
    );
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
          onPress: async () => {
            await logout();
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }], 
                })
            ); 
          } 
        }
      ]
    );
  };

  // --- VIEW TAMU ---
  if (isGuest) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <CustomHeader type="page" title="Profil Akun" showNotificationButton={false} />
        <View style={[styles.guestContainer, { backgroundColor: colors.background.primary }]}>
          <Ionicons name="lock-closed-outline" size={80} color={colors.text.tertiary} />
          <Text style={[styles.guestTitle, { color: colors.text.primary }]}>Akses Terbatas</Text>
          <Text style={[styles.guestDesc, { color: colors.text.secondary }]}>
            Silahkan login terlebih dahulu untuk mengakses profil dan pengaturan akun Anda.
          </Text>
          <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={handleGuestLogin}>
            <Text style={[styles.loginText, { color: colors.white }]}>Login Sekarang</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- VIEW PEGAWAI ---
  const displayInitials = user?.full_name?.charAt(0).toUpperCase() || 'U';
  const displayName = user?.full_name || 'Pengguna';
  
  const getRoleLabel = () => {
    if (role === 'teknisi') return 'Teknisi';
    if (role === 'pegawai_opd') return 'Pegawai';
    return 'Pengguna';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      
      <CustomHeader 
        type="page" 
        title="Profil Saya" 
        showNotificationButton={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 50 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        
        {/* PROFILE CARD */}
        <View style={[styles.profileSection, { backgroundColor: colors.background.primary }]}>
          <View style={styles.profileRow}>
            
            {/* FOTO PROFIL */}
            <View style={styles.avatarContainer}>
              {user?.avatar_url && user.avatar_url !== "" ? (
                <Image 
                  source={{ uri: `${user.avatar_url}?t=${new Date().getTime()}` }} 
                  style={styles.avatarImage} 
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>{displayInitials}</Text>
                </View>
              )}
            </View>

            {/* INFO USER */}
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

            {/* ❌ TOMBOL EDIT ICON DIHAPUS DARI SINI */}

          </View>
        </View>

        {/* MENU ITEMS */}
        <View style={styles.menuContainer}>
          <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>AKUN</Text>

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
          
          {/* 
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
*/}

          {/* LOGOUT BUTTON */}
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

  // --- PROFILE STYLES ---
  profileSection: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadow.sm,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {},
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  userInfo: { flex: 1, marginLeft: Spacing.md, justifyContent: 'center' },
  userName: { fontFamily: FontFamily.poppins.bold, fontSize: FontSize.lg, marginBottom: 2 },
  userRole: { fontFamily: FontFamily.poppins.medium, fontSize: FontSize.sm },
  userNip: { fontFamily: FontFamily.poppins.regular, fontSize: FontSize.xs, marginTop: 2 },
  // editBtnSmall styles removed

  // --- MENU LIST ---
  menuContainer: { paddingHorizontal: wp(6), marginTop: Spacing.md },
  sectionLabel: { fontFamily: FontFamily.poppins.bold, fontSize: 11, marginBottom: Spacing.sm, marginLeft: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.sm, ...Shadow.sm },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  menuText: { flex: 1, fontFamily: FontFamily.poppins.medium, fontSize: FontSize.md },
  
  // --- LOGOUT ---
  logoutItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.md, borderRadius: BorderRadius.lg, marginTop: Spacing.lg },
  logoutText: { fontFamily: FontFamily.poppins.semibold, fontSize: FontSize.md, marginLeft: 10 },
  versionText: { textAlign: 'center', marginTop: Spacing.lg, fontFamily: FontFamily.poppins.regular, fontSize: 10 },
});