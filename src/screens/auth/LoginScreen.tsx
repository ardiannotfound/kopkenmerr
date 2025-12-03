import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_USERS } from '../../data/mockData'; // Import data dummy
import { setCurrentUser } from '../../data/Session';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  // State untuk input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Password dummy (bebas isi apa aja)

  const handleLogin = () => {
    // 1. Cari user di database dummy berdasarkan username
      const user = MOCK_USERS.find(u => u.username === username);
      if (user) {
        // --- TAMBAHKAN BARIS INI ---
        setCurrentUser(user.role, user.id); 
        // ---------------------------
        if (user.role === 'employee') {
          navigation.replace('UserApp', { 
            screen: 'Beranda', 
            params: { userRole: 'employee', userId: user.id } 
          });
        } else if (user.role === 'technician') {
        navigation.replace('TechnicianApp', { 
          screen: 'Beranda',
          params: { userRole: 'technician', userId: user.id }
        });
        }
      } else {
      Alert.alert('Gagal Masuk', 'Username tidak ditemukan. Coba: pegawai1 atau teknisi1');
    }
  };

  const handleSSOLogin = () => {
    Alert.alert('Info', 'Fitur SSO Pemerintah akan diintegrasikan dengan backend.');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword'); 
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Silakan Masuk</Text>
        <Text style={styles.subtitle}>Gunakan akun pegawai Anda</Text>

        {/* Input Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username / NIP</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: pegawai1"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Input Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kata Sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan kata sandi"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Lupa Password?</Text>
        </TouchableOpacity>

        {/* Button Login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Masuk</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ATAU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Button SSO */}
        <TouchableOpacity style={styles.ssoButton} onPress={handleSSOLogin}>
          <Text style={styles.ssoButtonText}>Masuk dengan SSO Pemerintah</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#007AFF',
    marginBottom: 20,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
  },
  ssoButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  ssoButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});