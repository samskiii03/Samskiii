export type UserRole = 'PUSAT' | 'GEMBALA' | 'PENGURUS' | 'JEMAAT';

export type UserStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';

export type ChurchStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  gender: 'Laki-laki' | 'Perempuan';
  role: UserRole;
  status: UserStatus;
  churchId: string; // ID of local church, empty for PUSAT
  serviceRole: string; // e.g. "Worship Leader", "Singer", "Keyboardist", "Penerima Tamu", "Multimedia", "Jemaat Biasa"
  officerTitle?: string; // e.g. "Sekretaris", "Bendahara", "Koordinator Pemuda"
  permissions?: string[]; // granular: "manage_finances" | "manage_attendance" | "propose_agenda"
  password?: string;
}

export interface Church {
  id: string;
  name: string;
  address: string;
  permitNumber: string;
  logoUrl: string;
  pastorName: string;
  pastorEmail: string;
  status: ChurchStatus;
  createdAt: string;
  customAccentColor: string; // Hex color editable by Pusat e.g. "#4f46e5" (indigo)
  customHeroStatement: string; // Editable text
}

export interface AgendaProposal {
  id: string;
  churchId: string;
  title: string;
  description: string;
  date: string;
  division: string; // "Pemuda", "Anak-anak", "Wanita", "Umum", "Musik", "Misi/Sosial"
  proposedBy: string; // User Name
  proposedById: string; // User ID
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface FinanceRecord {
  id: string;
  churchId: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'Persepuluhan' | 'Persembahan Kolekte' | 'Donasi Khusus' | 'Pembangunan Kantor' | 'Operasional Ibadah' | 'Transport Pembicara' | 'Peralatan Multimedia' | 'Pecah Roti / Perjamuan' | 'Lain-lain';
  amount: number;
  description: string;
  date: string;
  inputBy: string; // Name of officer
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  churchId: string;
  activityName: string; // e.g., "Ibadah Raya Minggu 1", "Ibadah Youth Sabtu", "Doa Malam Rabu"
  date: string;
  attendanceCount: number;
  // Map of servant ID to active participation status
  servantParticipation: { [servantId: string]: boolean };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  inputBy: string; // Name of Secretary
  createdAt: string;
}

export interface Devotional {
  id: string;
  churchId: string;
  title: string;
  verseRef: string;
  verseText: string;
  content: string;
  date: string;
  writtenBy: string;
}

export interface PrayerRequest {
  id: string;
  churchId: string;
  userId: string;
  userName: string;
  requestText: string;
  isPublic: boolean;
  date: string;
  aminkanList: string[]; // List of user IDs who clicked "Aminkan"
}

export interface Suggestion {
  id: string;
  churchId: string;
  userName: string;
  message: string;
  date: string;
  target: 'LOCAL' | 'PUSAT';
}

export interface AppNotification {
  id: string;
  from: 'PUSAT' | 'GEMBALA';
  toChurchId: string; // 'GLOBAL' or specific church ID
  type: 'INFO' | 'WARNING' | 'ALERT';
  title: string;
  message: string;
  date: string;
}

export interface GlobalSettings {
  title: string;
  subtitle: string;
  heroBadge: string;
  promoText1: string;
  promoText2: string;
  promoText3: string;
  promoText4: string;
  showStats: boolean;
  backgroundStyle: 'warm' | 'cool' | 'dark' | 'classic';
}

