import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Simpan data (String atau Object)
  save: async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Failed to save data', e);
    }
  },

  // Ambil data
  get: async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to fetch data', e);
      return null;
    }
  },

  // Hapus data
  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove data', e);
    }
  },

  // Bersihkan semua (misal saat logout paksa)
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage', e);
    }
  }
};