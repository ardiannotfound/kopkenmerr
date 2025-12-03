// src/data/Session.ts

// 1. Definisikan bentuk data Session
export interface UserSession {
  role: 'guest' | 'employee' | 'technician' | string;
  userId: string;
}

// 2. Variabel Global untuk menyimpan User saat ini
// Default-nya kita set sebagai 'guest' (Masyarakat)
export let CurrentUser: UserSession = {
  role: 'guest',
  userId: '',
};

// 3. Fungsi untuk Mengisi Session (Dipanggil saat Login)
export const setCurrentUser = (role: string, id: string = '') => {
  CurrentUser.role = role;
  CurrentUser.userId = id;
  console.log(`[SESSION] User set to: ${role} (${id})`);
};

// 4. Fungsi untuk Reset Session (Dipanggil saat Logout)
export const logoutUser = () => {
  CurrentUser.role = 'guest';
  CurrentUser.userId = '';
  console.log(`[SESSION] User logged out, reset to guest.`);
};