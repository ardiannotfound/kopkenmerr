// src/data/mockData.ts

// 1. Tipe Data (Sesuai SRS)
export type UserRole = 'guest' | 'public' | 'employee' | 'technician';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  nip?: string; // Khusus Employee
  opd?: string; // Khusus Employee
  phone: string;
  address: string;
}

export interface ServiceItem {
  id: string;
  category: 'Hardware' | 'Software' | 'Network' | 'Account';
  name: string;
  description: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // Format: INC-202512-001
  type: 'incident' | 'request';
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  requesterId: string; // Link ke User
  technicianId?: string; // Link ke Teknisi
  createdAt: string;
  opd: string;
  assetName?: string; // Untuk Incident
  serviceId?: string; // Untuk Request
}

// 2. Data Dummy Users
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'pegawai1',
    name: 'Budi Santoso',
    email: 'budi@jatim.gov.id',
    role: 'employee',
    nip: '198001012000121001',
    opd: 'Dinas Kominfo',
    phone: '081234567890',
    address: 'Jl. Ahmad Yani No. 1',
  },
  {
    id: 'u2',
    username: 'teknisi1',
    name: 'Agus Teknisi',
    email: 'agus.it@jatim.gov.id',
    role: 'technician',
    phone: '081987654321',
    address: 'Mess Pemprov',
  },
];

// 3. Data Dummy Layanan (Katalog)
export const MOCK_SERVICES: ServiceItem[] = [
  { id: 's1', category: 'Account', name: 'Reset Password Email', description: 'Reset akses email pemerintahan' },
  { id: 's2', category: 'Hardware', name: 'Permintaan Laptop Baru', description: 'Pengadaan aset untuk staff baru' },
  { id: 's3', category: 'Network', name: 'Akses VPN', description: 'Permintaan akses jaringan internal dari luar' },
];

// 4. Data Dummy Tiket
export const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    ticketNumber: 'INC-202312-001',
    type: 'incident',
    title: 'Wifi Kopi Kenangan Error',
    description: 'Tidak bisa login page captive portal',
    status: 'pending',
    priority: 'high',
    requesterId: 'u1',
    createdAt: '2025-12-03T08:00:00Z',
    opd: 'Dinas Kominfo',
    assetName: 'Router Lt 1',
  },
  {
    id: 't2',
    ticketNumber: 'REQ-202312-002',
    type: 'request',
    title: 'Minta Mouse Baru',
    description: 'Mouse lama scrollnya rusak',
    status: 'in_progress',
    priority: 'medium',
    requesterId: 'u1',
    technicianId: 'u2',
    createdAt: '2025-12-02T10:00:00Z',
    opd: 'Dinas Kominfo',
    serviceId: 's2',
  },
  {
    id: 't3',
    ticketNumber: 'INC-202311-099',
    type: 'incident',
    title: 'Printer Macet',
    description: 'Kertas nyangkut dan tinta bocor.',
    status: 'closed', // <--- PENTING: Status Closed
    priority: 'low',
    requesterId: 'u1',
    technicianId: 'u2',
    createdAt: '2025-11-20T08:00:00Z',
    opd: 'Dinas Kominfo',
    assetName: 'Printer Epson L3110',
  },
];

export interface Article {
  id: string;
  title: string;
  category: 'Pengaduan & Permintaan' | 'Proses & Tindak Lanjut' | 'Informasi Layanan';
  content: string;
  isPopular: boolean; // Penanda untuk muncul di "Pertanyaan Populer"
}

// 6. Data Dummy Artikel
export const MOCK_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Bagaimana cara mereset password email pemerintah?',
    category: 'Pengaduan & Permintaan',
    content: 'Untuk mereset password, Anda dapat mengajukan permintaan layanan "Reset Password" melalui aplikasi ini. Pastikan Anda menyertakan NIP dan email alternatif untuk verifikasi.',
    isPopular: true,
  },
  {
    id: 'a2',
    title: 'Berapa lama waktu penanganan (SLA) untuk insiden?',
    category: 'Proses & Tindak Lanjut',
    content: 'SLA penanganan insiden bergantung pada prioritas: High (4 jam), Medium (8 jam), dan Low (24 jam). Waktu dihitung berdasarkan jam kerja operasional.',
    isPopular: true,
  },
  {
    id: 'a3',
    title: 'Daftar Layanan TI yang tersedia untuk Pegawai',
    category: 'Informasi Layanan',
    content: 'Pegawai dapat mengajukan permintaan untuk: Akses VPN, Pembuatan Email Dinas, Peminjaman Perangkat, dan Dukungan Jaringan.',
    isPopular: false,
  },
  {
    id: 'a4',
    title: 'Apa arti status "Pending" pada tiket saya?',
    category: 'Proses & Tindak Lanjut',
    content: 'Status Pending berarti tiket Anda sedang menunggu persetujuan atasan atau menunggu suku cadang (hardware). Cek kolom komentar tiket untuk detailnya.',
    isPopular: false,
  },
  {
    id: 'a5',
    title: 'Cara melaporkan Wifi mati di kantor',
    category: 'Pengaduan & Permintaan',
    content: 'Gunakan menu "Buat Pengaduan", pilih kategori Insiden, dan pastikan Anda melampirkan foto lokasi perangkat Wifi yang bermasalah.',
    isPopular: true,
  },
];
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'incident' | 'request' | 'system'; // incident=Pengaduan, request=Permintaan
  isRead: boolean;
  createdAt: string;
  ticketId?: string; // Link ke tiket jika ada
}

// 8. Data Dummy Notifikasi
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Tiket Diterima',
    message: 'Laporan "Wifi Kopi Kenangan Error" telah diterima dan sedang menunggu penugasan teknisi.',
    type: 'incident',
    isRead: false, // Belum dibaca (Biru Muda)
    createdAt: 'Baru saja',
    ticketId: 't1',
  },
  {
    id: 'n2',
    title: 'Permintaan Disetujui',
    message: 'Permintaan "Mouse Baru" Anda telah disetujui oleh Kepala Bidang.',
    type: 'request',
    isRead: false, // Belum dibaca (Biru Muda)
    createdAt: '1 Jam lalu',
    ticketId: 't2',
  },
  {
    id: 'n3',
    title: 'Tiket Selesai',
    message: 'Perbaikan "Printer Macet" telah selesai. Silakan berikan ulasan Anda.',
    type: 'incident',
    isRead: true, // Sudah dibaca (Putih)
    createdAt: 'Kemarin',
    ticketId: 't3',
  },
];