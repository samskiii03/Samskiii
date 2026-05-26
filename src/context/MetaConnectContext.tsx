import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Church, 
  AgendaProposal, 
  FinanceRecord, 
  AttendanceRecord, 
  Devotional, 
  PrayerRequest, 
  Suggestion, 
  AppNotification,
  GlobalSettings,
  ActionLog
} from '../types';

interface MetaConnectContextType {
  churches: Church[];
  users: User[];
  agendas: AgendaProposal[];
  finances: FinanceRecord[];
  attendance: AttendanceRecord[];
  devotionals: Devotional[];
  prayers: PrayerRequest[];
  suggestions: Suggestion[];
  notifications: AppNotification[];
  currentUser: User | null;
  activeChurch: Church | null;
  loading: boolean;
  globalSettings: GlobalSettings;
  actionLogs: ActionLog[];
  
  login: (email: string, passwordHash: string) => { success: boolean; message: string; role?: string };
  logout: () => void;
  registerChurch: (church: Omit<Church, 'id' | 'status' | 'createdAt' | 'customAccentColor' | 'customHeroStatement'>, pastorEmail: string, pastorPass: string) => { success: boolean; message: string };
  registerUser: (user: Omit<User, 'id' | 'status'>) => { success: boolean; message: string };
  
  // Pusat Actions
  verifyChurch: (churchId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
  updateChurchCustomization: (churchId: string, customAccentColor: string, customHeroStatement: string) => void;
  updateChurchDetails: (churchId: string, updatedFields: Partial<Church>) => void;
  updateGlobalSettings: (updatedFields: Partial<GlobalSettings>) => void;
  updateUserProfile: (userId: string, updatedFields: Partial<User>) => void;
  sendNotification: (type: 'INFO' | 'WARNING' | 'ALERT', title: string, message: string, toChurchId: string) => void;
  
  // Gembala Actions
  verifyUser: (userId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
  approveAgenda: (agendaId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
  approveFinance: (financeId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
  approveAttendance: (attendanceId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
  updateOfficerPermissions: (userId: string, title: string, permissions: string[]) => void;
  addOfficer: (userId: string, title: string) => void;
  removeOfficerAccess: (userId: string) => void;
  addLocalDevotional: (title: string, verseRef: string, verseText: string, content: string) => void;
  
  // Global Account Deletion and Recovery
  deleteUser: (userId: string) => void;
  restoreUser: (userId: string, reason?: string) => void;
  deleteChurch: (churchId: string) => void;
  restoreChurch: (churchId: string, reason?: string) => void;
  
  // Officer & Jemaat Actions
  proposeAgenda: (title: string, description: string, date: string, division: string) => void;
  addFinance: (type: 'INCOME' | 'EXPENSE', category: FinanceRecord['category'], amount: number, description: string, date: string) => void;
  addAttendance: (activityName: string, date: string, attendanceCount: number, servantParticipation: { [id: string]: boolean }) => void;
  addPrayer: (requestText: string, isPublic: boolean) => void;
  prayForRequest: (requestId: string) => void;
  addSuggestion: (message: string, target: 'LOCAL' | 'PUSAT') => void;
  
  // Development simulation Switcher
  setCurrentUserDirectly: (role: 'PUSAT' | 'GEMBALA' | 'PENGURUS' | 'JEMAAT', churchId?: string, officerType?: 'Sekretaris' | 'Bendahara') => void;
  addLog: (actionType: string, targetName: string, status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'SUBMITTED', reason: string) => void;
}

const MetaConnectContext = createContext<MetaConnectContextType | undefined>(undefined);

// Seeds Data
const initialChurches: Church[] = [
  {
    id: 'ch-1',
    name: 'Gereja Meta Bethel',
    address: 'Jl. Merdeka No. 12, Jakarta Pusat',
    permitNumber: 'IG/2024/99120',
    logoUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=200',
    pastorName: 'Pdt. Dr. Henry Budi',
    pastorEmail: 'gembala_budi',
    status: 'APPROVED',
    createdAt: '2026-01-10T00:00:00Z',
    customAccentColor: '#0f766e', // Teal 700
    customHeroStatement: 'Membangun Tubuh Kristus yang Sehat dan Terhubung di Era Digital'
  }
];

const initialUsers: User[] = [
  {
    id: 'u-admin',
    name: 'Samskiii',
    email: 'Samskiii',
    phone: '08123456789',
    birthDate: '1990-01-01',
    address: 'Kantor Pusat Sinode',
    gender: 'Laki-laki',
    role: 'PUSAT',
    status: 'APPROVED',
    churchId: '',
    serviceRole: 'Verifikator Pusat',
    password: 'simorangkir'
  },
  {
    id: 'u-budi',
    name: 'Pdt. Dr. Henry Budi',
    email: 'gembala_budi',
    phone: '08123456780',
    birthDate: '1970-04-12',
    address: 'Kompleks GMB No. 1, Jakarta',
    gender: 'Laki-laki',
    role: 'GEMBALA',
    status: 'APPROVED',
    churchId: 'ch-1',
    serviceRole: 'Gembala Sidang',
    password: 'budi'
  },
  {
    id: 'u-anton',
    name: 'Anton Bendahara',
    email: 'bendahara_anton',
    phone: '08134567891',
    birthDate: '1985-11-20',
    address: 'Jl. Melati Baru 4, Jakarta',
    gender: 'Laki-laki',
    role: 'PENGURUS',
    status: 'APPROVED',
    churchId: 'ch-1',
    serviceRole: 'Bendahara Jemaat',
    officerTitle: 'Bendahara',
    permissions: ['manage_finances'],
    password: 'anton'
  },
  {
    id: 'u-shanti',
    name: 'Shanti Sekretaris',
    email: 'sekretaris_shanti',
    phone: '08156789234',
    birthDate: '1990-01-14',
    address: 'Kuningan Residence, Jakarta',
    gender: 'Perempuan',
    role: 'PENGURUS',
    status: 'APPROVED',
    churchId: 'ch-1',
    serviceRole: 'Sekretariat Utama',
    officerTitle: 'Sekretaris',
    permissions: ['manage_attendance'],
    password: 'shanti'
  },
  {
    id: 'u-bambang',
    name: 'Bambang Riyadi',
    email: 'jemaat_bambang',
    phone: '08170093821',
    birthDate: '1995-03-24',
    address: 'Tebet Timur Dalam, Jakarta',
    gender: 'Laki-laki',
    role: 'JEMAAT',
    status: 'APPROVED',
    churchId: 'ch-1',
    serviceRole: 'Worship Leader / Singer',
    password: '123'
  },
  {
    id: 'u-dewi',
    name: 'Dewi Lestari',
    email: 'jemaat_dewi',
    phone: '08987654321',
    birthDate: '1998-09-02',
    address: 'Pancoran Indah II, Jakarta',
    gender: 'Perempuan',
    role: 'JEMAAT',
    status: 'APPROVED',
    churchId: 'ch-1',
    serviceRole: 'Singer Choir',
    password: '123'
  },
  {
    id: 'u-tony',
    name: 'Tony Wijaya (Antrean)',
    email: 'jemaat_tony',
    phone: '08119998811',
    birthDate: '1983-05-15',
    address: 'Jl. Menteng Tenggulun, Jakarta',
    gender: 'Laki-laki',
    role: 'JEMAAT',
    status: 'PENDING_VERIFICATION',
    churchId: 'ch-1',
    serviceRole: 'Pemain Bass / Musik',
    password: '123'
  }
];

const initialAgendas: AgendaProposal[] = [
  {
    id: 'ag-1',
    churchId: 'ch-1',
    title: 'Kebaktian Kebangunan Rohani (KKR) Pemuda',
    description: 'KKR bersama pengisi lagu pemuda nasional. Target kehadiran 150 anak muda.',
    date: '2026-06-20',
    division: 'Pemuda',
    proposedBy: 'Shanti Sekretaris',
    proposedById: 'u-shanti',
    status: 'PENDING',
    createdAt: '2026-05-24T08:00:00Z'
  },
  {
    id: 'ag-2',
    churchId: 'ch-1',
    title: 'Acara Bakti Sosial Pasar Murah Jemaat',
    description: 'Menyediakan sembako murah diskon 50% untuk warga sekitar gereja.',
    date: '2026-06-12',
    division: 'Misi/Sosial',
    proposedBy: 'Shanti Sekretaris',
    proposedById: 'u-shanti',
    status: 'APPROVED',
    createdAt: '2026-05-15T09:30:00Z'
  }
];

const initialFinances: FinanceRecord[] = [
  {
    id: 'f-1',
    churchId: 'ch-1',
    type: 'INCOME',
    category: 'Persepuluhan',
    amount: 15500000,
    description: 'Akumulasi persepuluhan jemaat ibadah raya Mei minggu 3',
    date: '2026-05-18',
    inputBy: 'Anton Bendahara',
    status: 'APPROVED',
    createdAt: '2026-05-18T18:00:00Z'
  },
  {
    id: 'f-2',
    churchId: 'ch-1',
    type: 'INCOME',
    category: 'Persembahan Kolekte',
    amount: 4850000,
    description: 'Kolekte Ibadah Raya 1 & 2',
    date: '2026-05-24',
    inputBy: 'Anton Bendahara',
    status: 'PENDING',
    createdAt: '2026-05-24T20:10:00Z'
  },
  {
    id: 'f-3',
    churchId: 'ch-1',
    type: 'EXPENSE',
    category: 'Transport Pembicara',
    amount: 1500000,
    description: 'Transport Pembicara Tamu Kebaktian Minggu Pdt. Andreas',
    date: '2026-05-24',
    inputBy: 'Anton Bendahara',
    status: 'PENDING',
    createdAt: '2026-05-24T20:15:00Z'
  },
  {
    id: 'f-4',
    churchId: 'ch-1',
    type: 'EXPENSE',
    category: 'Peralatan Multimedia',
    amount: 6800000,
    description: 'Pengadaan mic wireless Shure 2 unit untuk singer',
    date: '2026-05-12',
    inputBy: 'Anton Bendahara',
    status: 'APPROVED',
    createdAt: '2026-05-12T10:00:00Z'
  }
];

const initialAttendance: AttendanceRecord[] = [
  {
    id: 'at-1',
    churchId: 'ch-1',
    activityName: 'Ibadah Raya Minggu (Mei M3)',
    date: '2026-05-17',
    attendanceCount: 124,
    servantParticipation: {
      'u-bambang': true,
      'u-dewi': true,
      'u-tony': false
    },
    status: 'APPROVED',
    inputBy: 'Shanti Sekretaris',
    createdAt: '2026-05-17T13:00:00Z'
  },
  {
    id: 'at-2',
    churchId: 'ch-1',
    activityName: 'Ibadah Raya Minggu (Mei M4)',
    date: '2026-05-24',
    attendanceCount: 142,
    servantParticipation: {
      'u-bambang': true,
      'u-dewi': true,
      'u-tony': true
    },
    status: 'PENDING',
    inputBy: 'Shanti Sekretaris',
    createdAt: '2026-05-24T15:30:00Z'
  }
];

const initialDevotionals: Devotional[] = [
  {
    id: 'd-1',
    churchId: 'ch-1',
    title: 'Kekuatan di Balik Koneksi Tubuh Kristus',
    verseRef: 'Roma 12:5',
    verseText: '...demikian juga kita, walaupun banyak, adalah satu tubuh di dalam Kristus; tetapi kita masing-masing adalah anggota yang seorang terhadap yang lain.',
    content: 'Tuhan mendesain gereja-Nya bukan sebagai kumpulan individu yang berjalan sendiri-sendiri, melainkan sebagai sebuah ekosistem yang terhubung lancar. Koneksi rohani lokal memicu kedamaian jemaat.',
    date: '2026-05-26',
    writtenBy: 'Pdt. Dr. Henry Budi'
  }
];

const initialPrayers: PrayerRequest[] = [
  {
    id: 'p-1',
    churchId: 'ch-1',
    userId: 'u-bambang',
    userName: 'Bambang Riyadi',
    requestText: 'Mohon doakan bagi kesehatan ibu saya yang sedang menjalani pemulihan pasca operasi di RS.',
    isPublic: true,
    date: '2026-05-25T01:50:00Z',
    aminkanList: ['u-shanti', 'u-anton']
  }
];

const initialSuggestions: Suggestion[] = [
  {
    id: 's-1',
    churchId: 'ch-1',
    userName: 'Bambang Riyadi',
    message: 'Apakah mungkin pendingin ruangan di ruang anak-anak bisa diperbaiki demi kenyamanan belajar mengajar?',
    date: '2026-05-24T10:00:00Z',
    target: 'LOCAL'
  }
];

const initialNotifications: AppNotification[] = [
  {
    id: 'n-1',
    from: 'PUSAT',
    toChurchId: 'GLOBAL',
    type: 'INFO',
    title: 'Peluncuran Fitur Verifikasi Multi-Role',
    message: 'Sistem Meta Connect kini mendukung alur verifikasi jemaat oleh Gembala Lokal dan pelayanan mimbar.',
    date: '2026-05-01T08:00:00Z'
  }
];

const initialActionLogs: ActionLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-05-25T09:00:00Z',
    actorName: 'Samskiii',
    actorRole: 'PUSAT',
    actionType: 'VERIFIKASI_GEREJA',
    targetName: 'Gereja Meta Bethel',
    status: 'APPROVED',
    reason: 'Dokumen pendaftaran lengkap dan legalitas Kemenag terverifikasi.'
  }
];

const initialGlobalSettings: GlobalSettings = {
  title: 'Menghubungkan Pelayanan dengan Satu Ketukan Melalui Meta Connect',
  subtitle: 'Platform manajemen gereja modern terintegrasi berdasar peran. Meningkatkan keaktifan, transparansi keuangan, dan tata kelola jemaat dalam satu ekosistem terpadu.',
  heroBadge: 'KONEKTIVITAS GEREJA TERSEGMENTASI',
  promoText1: 'Otoritas Pusat (Verifikator Global) - Memeriksa kelayakan pendaftaran gereja lokal baru, menerbitkan legalitas akun Gembala, dan memantau analitik statistik perkembangan pertumbuhan jemaat secara makro.',
  promoText2: 'Gembala Sidang Lokal - Memegang pimpinan tertinggi lokal, melantik & mendelegasikan wewenang keuangan kepada Bendahara, menyetujui log absensi Sekretaris, serta memublikasikan renungan harian rohani.',
  promoText3: 'Staff Kantor Pengurus - Bendahara mengentri pendapatan & belanja operasional. Sekretaris melakukan rekam presensi komitmen pelayan minggu ibadah. Semua entri dikirim langsung ke persetujuan Gembala.',
  promoText4: 'Jemaat & Pelayan Pelayanan - Mendapatkan santapan rohani harian, memantau rincian tugas pelayanan hari Minggu, mengajukan permohonan doa, dan memberikan feedback saran demi keterbukaan gereja.',
  showStats: true,
  backgroundStyle: 'warm'
};

export const MetaConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe storage initial check - do NOT remove data if any previous church or user accounts are stored
  if (typeof window !== 'undefined' && localStorage.getItem('mc_cleaned_v4') !== 'true') {
    if (!localStorage.getItem('mc_churches') && !localStorage.getItem('mc_users')) {
      localStorage.removeItem('mc_churches');
      localStorage.removeItem('mc_users');
      localStorage.removeItem('mc_agendas');
      localStorage.removeItem('mc_finances');
      localStorage.removeItem('mc_attendance');
      localStorage.removeItem('mc_devotionals');
      localStorage.removeItem('mc_prayers');
      localStorage.removeItem('mc_suggestions');
      localStorage.removeItem('mc_notifications');
      localStorage.removeItem('mc_current_user');
      localStorage.removeItem('mc_action_logs');
    }
    localStorage.setItem('mc_cleaned_v4', 'true');
  }

  const [churches, setChurches] = useState<Church[]>(() => {
    const saved = localStorage.getItem('mc_churches');
    return saved ? JSON.parse(saved) : initialChurches;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mc_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [agendas, setAgendas] = useState<AgendaProposal[]>(() => {
    const saved = localStorage.getItem('mc_agendas');
    return saved ? JSON.parse(saved) : initialAgendas;
  });

  const [finances, setFinances] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem('mc_finances');
    return saved ? JSON.parse(saved) : initialFinances;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('mc_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [devotionals, setDevotionals] = useState<Devotional[]>(() => {
    const saved = localStorage.getItem('mc_devotionals');
    return saved ? JSON.parse(saved) : initialDevotionals;
  });

  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => {
    const saved = localStorage.getItem('mc_prayers');
    return saved ? JSON.parse(saved) : initialPrayers;
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    const saved = localStorage.getItem('mc_suggestions');
    return saved ? JSON.parse(saved) : initialSuggestions;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('mc_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('mc_global_settings');
    return saved ? JSON.parse(saved) : initialGlobalSettings;
  });

  const [actionLogs, setActionLogs] = useState<ActionLog[]>(() => {
    const saved = localStorage.getItem('mc_action_logs');
    return saved ? JSON.parse(saved) : initialActionLogs;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeChurch, setActiveChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mc_action_logs', JSON.stringify(actionLogs));
  }, [actionLogs]);

  const addLog = (
    actionType: string,
    targetName: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'SUBMITTED',
    reason: string
  ) => {
    const newLog: ActionLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser ? currentUser.name : 'Sistem',
      actorRole: currentUser ? currentUser.role : 'SYSTEM',
      actionType,
      targetName,
      status,
      reason: reason || 'Kriteria persetujuan administratif umum terpenuhi'
    };
    setActionLogs(prev => [newLog, ...prev]);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mc_churches', JSON.stringify(churches));
  }, [churches]);

  useEffect(() => {
    localStorage.setItem('mc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mc_agendas', JSON.stringify(agendas));
  }, [agendas]);

  useEffect(() => {
    localStorage.setItem('mc_finances', JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    localStorage.setItem('mc_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('mc_devotionals', JSON.stringify(devotionals));
  }, [devotionals]);

  useEffect(() => {
    localStorage.setItem('mc_prayers', JSON.stringify(prayers));
  }, [prayers]);

  useEffect(() => {
    localStorage.setItem('mc_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  useEffect(() => {
    localStorage.setItem('mc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mc_global_settings', JSON.stringify(globalSettings));
  }, [globalSettings]);

  useEffect(() => {
    localStorage.setItem('mc_current_user', JSON.stringify(currentUser));
    if (currentUser && currentUser.churchId) {
      const ch = churches.find(c => c.id === currentUser.churchId) || null;
      setActiveChurch(ch);
    } else {
      setActiveChurch(null);
    }
  }, [currentUser, churches]);

  // Auth Operations
  const login = (email: string, passwordHash: string) => {
    setLoading(true);
    const u = users.find(x => 
      x.email.toLowerCase() === email.toLowerCase() || 
      x.name.toLowerCase() === email.toLowerCase()
    );
    setLoading(false);
    
    if (!u) {
      return { success: false, message: 'Email atau Username tidak terdaftar.' };
    }

    if (u.password && u.password !== passwordHash) {
      return { success: false, message: 'Kata sandi tidak sesuai.' };
    }

    if (u.status !== 'APPROVED') {
      return { 
        success: false, 
        message: u.status === 'PENDING_VERIFICATION' 
          ? 'Akun Anda sedang dalam antrean verifikasi oleh gembala sidang gereja lokal.' 
          : 'Maaf, permohonan verifikasi akun Anda ditolak oleh pihak berwenang.' 
      };
    }

    // Checking church status if user is Gembala, Pengurus or Jemaat
    if (u.churchId) {
      const ch = churches.find(c => c.id === u.churchId);
      if (ch && ch.status !== 'APPROVED') {
        return {
          success: false,
          message: ch.status === 'PENDING_VERIFICATION'
            ? `Pendaftaran gereja ${ch.name} sedang diverifikasi oleh Pusat. Silakan tunggu.`
            : `Pendaftaran gereja ${ch.name} ditolak oleh Pusat.`
        };
      }
    }

    setCurrentUser(u);
    return { success: true, message: 'Berhasil masuk.', role: u.role };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerChurch = (
    churchData: Omit<Church, 'id' | 'status' | 'createdAt' | 'customAccentColor' | 'customHeroStatement'>,
    pastorEmail: string,
    pastorPass: string
  ): { success: boolean; message: string } => {
    // Check duplication across all users
    const isDuplicate = users.some(u => u.email.toLowerCase() === pastorEmail.toLowerCase() || u.name.toLowerCase() === pastorEmail.toLowerCase());
    if (isDuplicate) {
      return { success: false, message: 'Username sudah terdaftar! Harap gunakan username / email unik.' };
    }

    const newChurchId = `ch-${Date.now()}`;
    const newPastorId = `u-${Date.now()}`;

    const newChurch: Church = {
      ...churchData,
      id: newChurchId,
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString(),
      customAccentColor: '#1e3a8a', // default dark blue
      customHeroStatement: `Membangun Jemaat ${churchData.name} yang Kokoh`
    };

    const newPastor: User = {
      id: newPastorId,
      name: churchData.pastorName,
      email: pastorEmail,
      phone: '0812XXXXXXXX',
      birthDate: '1975-01-01',
      address: churchData.address,
      gender: 'Laki-laki',
      role: 'GEMBALA',
      status: 'PENDING_VERIFICATION', // will be approved automatically once the church is approved by Pusat!
      churchId: newChurchId,
      serviceRole: 'Gembala Sidang',
      password: pastorPass
    };

    setChurches(prev => [...prev, newChurch]);
    setUsers(prev => [...prev, newPastor]);

    // Send a system suggestion as notification to Pusat in real time!
    const newSugg: Suggestion = {
      id: `s-pus-${Date.now()}`,
      churchId: newChurchId,
      userName: churchData.pastorName,
      message: `Proposal Pendaftaran Gereja Baru: ${churchData.name} mengajukan diri ke platform.`,
      date: new Date().toISOString(),
      target: 'PUSAT'
    };
    setSuggestions(prev => [...prev, newSugg]);

    addLog('PENDAFTARAN_GEREJA', churchData.name, 'PENDING', `Mengajukan pendaftaran gereja lokal dengan gembala ${churchData.pastorName}`);
    return { success: true, message: 'Berkas gereja berhasil didaftarkan. Harap tunggu verifikasi Pusat.' };
  };

  const registerUser = (userData: Omit<User, 'id' | 'status'>): { success: boolean; message: string } => {
    // Check duplication across users
    const isDuplicate = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase() || u.name.toLowerCase() === userData.email.toLowerCase());
    if (isDuplicate) {
      return { success: false, message: 'Username sudah terdaftar! Harap gunakan username / email unik.' };
    }

    const targetId = `u-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: targetId,
      status: 'PENDING_VERIFICATION' // Wait for local Gembala approval
    };
    setUsers(prev => [...prev, newUser]);
    addLog('PENDAFTARAN_ANGGOTA', userData.name, 'PENDING', `Mendaftar keanggotaan gereja baru dengan penugasan pelayan: ${userData.serviceRole || 'Jemaat Biasa'}`);
    return { success: true, message: 'Registrasi berhasil. Akun Anda sedang dalam antrean verifikasi oleh gembala sidang.' };
  };

  // PUSAT Action
  const verifyChurch = (churchId: string, status: 'APPROVED' | 'REJECTED', reason = 'Verifikasi berkas administratif Kemenag') => {
    setChurches(prev => prev.map(ch => ch.id === churchId ? { ...ch, status } : ch));
    
    // Auto sync Pastor representation of that church
    setUsers(prev => prev.map(u => {
      if (u.churchId === churchId && u.role === 'GEMBALA') {
        return { ...u, status };
      }
      return u;
    }));

    // Broadcast automated notification to that church
    const targetChurch = churches.find(c => c.id === churchId);
    if (targetChurch) {
      addLog('VERIFIKASI_GEREJA', targetChurch.name, status, reason);

      const notif: AppNotification = {
        id: `n-${Date.now()}`,
        from: 'PUSAT',
        toChurchId: churchId,
        type: status === 'APPROVED' ? 'INFO' : 'ALERT',
        title: status === 'APPROVED' ? 'Selamat! Pendaftaran Disetujui' : 'Pendaftaran Ditangguhkan',
        message: status === 'APPROVED' 
          ? `Gereja ${targetChurch.name} secara resmi tergabung dalam ekosistem Meta Connect. Akun gembala atas nama ${targetChurch.pastorName} telah aktif.`
          : `Sayang sekali, proposal pendirian/pendaftaran gereja ${targetChurch.name} belum memenuhi kritieria verifikator Pusat. Alasan: ${reason}`,
        date: new Date().toISOString()
      };
      setNotifications(prev => [...prev, notif]);
    }
  };

  const updateChurchCustomization = (churchId: string, customAccentColor: string, customHeroStatement: string) => {
    setChurches(prev => prev.map(ch => 
      ch.id === churchId 
        ? { ...ch, customAccentColor, customHeroStatement } 
        : ch
    ));
  };

  const updateChurchDetails = (churchId: string, updatedFields: Partial<Church>) => {
    setChurches(prev => prev.map(ch => 
      ch.id === churchId 
        ? { ...ch, ...updatedFields } 
        : ch
    ));
  };

  const updateGlobalSettings = (updatedFields: Partial<GlobalSettings>) => {
    setGlobalSettings(prev => ({ ...prev, ...updatedFields }));
  };

  const updateUserProfile = (userId: string, updatedFields: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, ...updatedFields } 
        : u
    ));
    setCurrentUser(prev => {
      if (prev && prev.id === userId) {
        const next = { ...prev, ...updatedFields };
        return next;
      }
      return prev;
    });
  };

  const sendNotification = (type: 'INFO' | 'WARNING' | 'ALERT', title: string, message: string, toChurchId: string) => {
    const notif: AppNotification = {
      id: `n-${Date.now()}`,
      from: 'PUSAT',
      toChurchId,
      type,
      title,
      message,
      date: new Date().toISOString()
    };
    setNotifications(prev => [...prev, notif]);
  };

  // GEMBALA Action
  const verifyUser = (userId: string, status: 'APPROVED' | 'REJECTED', reason = 'Verifikasi keanggotaan jemaat') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      addLog('VERIFIKASI_ANGGOTA', targetUser.name, status, reason);
    }
  };

  const approveAgenda = (agendaId: string, status: 'APPROVED' | 'REJECTED', reason = 'Persetujuan proposal program kerja') => {
    setAgendas(prev => prev.map(ag => ag.id === agendaId ? { ...ag, status } : ag));
    const targetAgenda = agendas.find(ag => ag.id === agendaId);
    if (targetAgenda) {
      addLog('PERSETUJUAN_AGENDA', targetAgenda.title, status, reason);
    }
  };

  const approveFinance = (financeId: string, status: 'APPROVED' | 'REJECTED', reason = 'Persetujuan kas keuangan') => {
    setFinances(prev => prev.map(f => f.id === financeId ? { ...f, status } : f));
    const targetFin = finances.find(f => f.id === financeId);
    if (targetFin) {
      const typeLabel = targetFin.type === 'INCOME' ? 'Pendapatan' : 'Pengeluaran';
      addLog('PERSETUJUAN_KEUANGAN', `${typeLabel}: ${targetFin.category} (${targetFin.amount.toLocaleString('id-ID')})`, status, reason);
    }
  };

  const approveAttendance = (attendanceId: string, status: 'APPROVED' | 'REJECTED', reason = 'Persetujuan presensi/absensi pelayan') => {
    setAttendance(prev => prev.map(at => at.id === attendanceId ? { ...at, status } : at));
    const targetAt = attendance.find(at => at.id === attendanceId);
    if (targetAt) {
      addLog('PERSETUJUAN_ABSENSI', targetAt.activityName, status, reason);
    }
  };

  const updateOfficerPermissions = (userId: string, title: string, permissions: string[]) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: 'PENGURUS',
          officerTitle: title,
          permissions
        };
      }
      return u;
    }));
  };

  const addOfficer = (userId: string, title: string) => {
    const isTreasurer = title === 'Bendahara';
    const isSecretary = title === 'Sekretaris';
    const permissions = isTreasurer 
      ? ['manage_finances'] 
      : isSecretary 
        ? ['manage_attendance'] 
        : ['propose_agenda'];

    updateOfficerPermissions(userId, title, permissions);
  };

  const removeOfficerAccess = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u };
        updated.role = 'JEMAAT';
        delete updated.officerTitle;
        delete updated.permissions;
        return updated;
      }
      return u;
    }));
  };

  const addLocalDevotional = (title: string, verseRef: string, verseText: string, content: string) => {
    if (!currentUser || !currentUser.churchId) return;
    
    const newDev: Devotional = {
      id: `dev-${Date.now()}`,
      churchId: currentUser.churchId,
      title,
      verseRef,
      verseText,
      content,
      date: new Date().toISOString().split('T')[0],
      writtenBy: currentUser.name
    };
    
    setDevotionals(prev => [newDev, ...prev]);
  };

  // OFFICER Actions
  const proposeAgenda = (title: string, description: string, date: string, division: string) => {
    if (!currentUser || !currentUser.churchId) return;
    const newAgenda: AgendaProposal = {
      id: `ag-${Date.now()}`,
      churchId: currentUser.churchId,
      title,
      description,
      date,
      division,
      proposedBy: currentUser.name,
      proposedById: currentUser.id,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setAgendas(prev => [...prev, newAgenda]);
  };

  const addFinance = (type: 'INCOME' | 'EXPENSE', category: FinanceRecord['category'], amount: number, description: string, date: string) => {
    if (!currentUser || !currentUser.churchId) return;
    const newFin: FinanceRecord = {
      id: `f-${Date.now()}`,
      churchId: currentUser.churchId,
      type,
      category,
      amount,
      description,
      date,
      inputBy: currentUser.name,
      status: 'PENDING', // MUST get Pastor (Gembala) approval
      createdAt: new Date().toISOString()
    };
    setFinances(prev => [...prev, newFin]);
  };

  const addAttendance = (activityName: string, date: string, attendanceCount: number, servantParticipation: { [id: string]: boolean }) => {
    if (!currentUser || !currentUser.churchId) return;
    const newAt: AttendanceRecord = {
      id: `at-${Date.now()}`,
      churchId: currentUser.churchId,
      activityName,
      date,
      attendanceCount,
      servantParticipation,
      status: 'PENDING', // Sekretaris logs, Gembala approves
      inputBy: currentUser.name,
      createdAt: new Date().toISOString()
    };
    setAttendance(prev => [...prev, newAt]);
  };

  // JEMAAT Actions
  const addPrayer = (requestText: string, isPublic: boolean) => {
    if (!currentUser || !currentUser.churchId) return;
    const newPrayer: PrayerRequest = {
      id: `p-${Date.now()}`,
      churchId: currentUser.churchId,
      userId: currentUser.id,
      userName: currentUser.name,
      requestText,
      isPublic,
      date: new Date().toISOString(),
      aminkanList: []
    };
    setPrayers(prev => [newPrayer, ...prev]);
  };

  const prayForRequest = (requestId: string) => {
    if (!currentUser) return;
    setPrayers(prev => prev.map(p => {
      if (p.id === requestId) {
        const alreadyAmin = p.aminkanList.includes(currentUser.id);
        const newList = alreadyAmin 
          ? p.aminkanList.filter(id => id !== currentUser.id)
          : [...p.aminkanList, currentUser.id];
        return { ...p, aminkanList: newList };
      }
      return p;
    }));
  };

  const addSuggestion = (message: string, target: 'LOCAL' | 'PUSAT') => {
    if (!currentUser || !currentUser.churchId) return;
    const sugg: Suggestion = {
      id: `s-${Date.now()}`,
      churchId: currentUser.churchId,
      userName: currentUser.name,
      message,
      date: new Date().toISOString(),
      target
    };
    setSuggestions(prev => [...prev, sugg]);
  };

  const deleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      addLog('HAPUS_AKUN', targetUser.name, 'REJECTED', `Menghapus akun atas nama ${targetUser.name} dengan peran ${targetUser.role}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(null);
      }
    }
  };

  const restoreUser = (userId: string, reason = 'Pemulihan dan aktivasi kembali jemaat/pengurus') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u));
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      addLog('PEMULIHAN_AKUN', targetUser.name, 'APPROVED', reason);
    }
  };

  const deleteChurch = (churchId: string) => {
    const targetCh = churches.find(ch => ch.id === churchId);
    if (targetCh) {
      addLog('HAPUS_GEREJA', targetCh.name, 'REJECTED', `Menghapus pendaftaran gereja lokal ${targetCh.name}`);
      setChurches(prev => prev.filter(ch => ch.id !== churchId));
    }
  };

  const restoreChurch = (churchId: string, reason = 'Pemulihan status legalitas gereja lokal') => {
    setChurches(prev => prev.map(ch => ch.id === churchId ? { ...ch, status: 'APPROVED' } : ch));
    const targetCh = churches.find(ch => ch.id === churchId);
    if (targetCh) {
      addLog('PEMULIHAN_GEREJA', targetCh.name, 'APPROVED', reason);
    }
  };

  // Fast Dev Switcher simulation helper
  const setCurrentUserDirectly = (role: 'PUSAT' | 'GEMBALA' | 'PENGURUS' | 'JEMAAT', churchId = 'ch-1', officerType: 'Sekretaris' | 'Bendahara' = 'Sekretaris') => {
    if (role === 'PUSAT') {
      const u = users.find(x => x.role === 'PUSAT');
      if (u) setCurrentUser(u);
    } else if (role === 'GEMBALA') {
      const u = users.find(x => x.role === 'GEMBALA' && x.churchId === churchId);
      if (u) setCurrentUser(u);
    } else if (role === 'PENGURUS') {
      const u = users.find(x => x.role === 'PENGURUS' && x.churchId === churchId && x.officerTitle === officerType);
      if (u) {
        setCurrentUser(u);
      } else {
        // Fallback to any officer in that church
        const anyO = users.find(x => x.role === 'PENGURUS' && x.churchId === churchId);
        if (anyO) setCurrentUser(anyO);
      }
    } else if (role === 'JEMAAT') {
      const u = users.find(x => x.role === 'JEMAAT' && x.churchId === churchId && x.status === 'APPROVED');
      if (u) setCurrentUser(u);
    }
  };

  return (
    <MetaConnectContext.Provider value={{
      churches,
      users,
      agendas,
      finances,
      attendance,
      devotionals,
      prayers,
      suggestions,
      notifications,
      currentUser,
      activeChurch,
      loading,
      globalSettings,
      actionLogs,
      
      login,
      logout,
      registerChurch,
      registerUser,
      
      verifyChurch,
      updateChurchCustomization,
      updateChurchDetails,
      updateGlobalSettings,
      updateUserProfile,
      sendNotification,
      
      verifyUser,
      approveAgenda,
      approveFinance,
      approveAttendance,
      updateOfficerPermissions,
      addOfficer,
      removeOfficerAccess,
      addLocalDevotional,
      
      deleteUser,
      restoreUser,
      deleteChurch,
      restoreChurch,
      
      proposeAgenda,
      addFinance,
      addAttendance,
      addPrayer,
      prayForRequest,
      addSuggestion,
      
      setCurrentUserDirectly,
      addLog
    }}>
      {children}
    </MetaConnectContext.Provider>
  );
};

export const useMetaConnect = () => {
  const context = useContext(MetaConnectContext);
  if (!context) throw new Error('useMetaConnect must be used within MetaConnectProvider');
  return context;
};
