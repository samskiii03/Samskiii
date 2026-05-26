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
  GlobalSettings
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
  
  login: (email: string, passwordHash: string) => { success: boolean; message: string; role?: string };
  logout: () => void;
  registerChurch: (church: Omit<Church, 'id' | 'status' | 'createdAt' | 'customAccentColor' | 'customHeroStatement'>, pastorEmail: string, pastorPass: string) => void;
  registerUser: (user: Omit<User, 'id' | 'status'>) => void;
  
  // Pusat Actions
  verifyChurch: (churchId: string, status: 'APPROVED' | 'REJECTED') => void;
  updateChurchCustomization: (churchId: string, customAccentColor: string, customHeroStatement: string) => void;
  updateChurchDetails: (churchId: string, updatedFields: Partial<Church>) => void;
  updateGlobalSettings: (updatedFields: Partial<GlobalSettings>) => void;
  updateUserProfile: (userId: string, updatedFields: Partial<User>) => void;
  sendNotification: (type: 'INFO' | 'WARNING' | 'ALERT', title: string, message: string, toChurchId: string) => void;
  
  // Gembala Actions
  verifyUser: (userId: string, status: 'APPROVED' | 'REJECTED') => void;
  approveAgenda: (agendaId: string, status: 'APPROVED' | 'REJECTED') => void;
  approveFinance: (financeId: string, status: 'APPROVED' | 'REJECTED') => void;
  approveAttendance: (attendanceId: string, status: 'APPROVED' | 'REJECTED') => void;
  updateOfficerPermissions: (userId: string, title: string, permissions: string[]) => void;
  addOfficer: (userId: string, title: string) => void;
  removeOfficerAccess: (userId: string) => void;
  addLocalDevotional: (title: string, verseRef: string, verseText: string, content: string) => void;
  
  // Officer & Jemaat Actions
  proposeAgenda: (title: string, description: string, date: string, division: string) => void;
  addFinance: (type: 'INCOME' | 'EXPENSE', category: FinanceRecord['category'], amount: number, description: string, date: string) => void;
  addAttendance: (activityName: string, date: string, attendanceCount: number, servantParticipation: { [id: string]: boolean }) => void;
  addPrayer: (requestText: string, isPublic: boolean) => void;
  prayForRequest: (requestId: string) => void;
  addSuggestion: (message: string, target: 'LOCAL' | 'PUSAT') => void;
  
  // Development simulation Switcher
  setCurrentUserDirectly: (role: 'PUSAT' | 'GEMBALA' | 'PENGURUS' | 'JEMAAT', churchId?: string, officerType?: 'Sekretaris' | 'Bendahara') => void;
}

const MetaConnectContext = createContext<MetaConnectContextType | undefined>(undefined);

// Seeds Data
const initialChurches: Church[] = [];

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
  }
];

const initialAgendas: AgendaProposal[] = [];
const initialFinances: FinanceRecord[] = [];
const initialAttendance: AttendanceRecord[] = [];
const initialDevotionals: Devotional[] = [];
const initialPrayers: PrayerRequest[] = [];
const initialSuggestions: Suggestion[] = [];
const initialNotifications: AppNotification[] = [];

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
  // Overwrite older storage versions to force-remove existing template accounts
  if (typeof window !== 'undefined' && localStorage.getItem('mc_cleaned_v3') !== 'true') {
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
    localStorage.setItem('mc_cleaned_v3', 'true');
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

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeChurch, setActiveChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(false);

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
  ) => {
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
  };

  const registerUser = (userData: Omit<User, 'id' | 'status'>) => {
    const targetId = `u-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: targetId,
      status: 'PENDING_VERIFICATION' // Wait for local Gembala approval
    };
    setUsers(prev => [...prev, newUser]);
  };

  // PUSAT Action
  const verifyChurch = (churchId: string, status: 'APPROVED' | 'REJECTED') => {
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
      const notif: AppNotification = {
        id: `n-${Date.now()}`,
        from: 'PUSAT',
        toChurchId: churchId,
        type: status === 'APPROVED' ? 'INFO' : 'ALERT',
        title: status === 'APPROVED' ? 'Selamat! Pendaftaran Disetujui' : 'Pendaftaran Ditangguhkan',
        message: status === 'APPROVED' 
          ? `Gereja ${targetChurch.name} secara resmi tergabung dalam ekosistem Meta Connect. Akun gembala atas nama ${targetChurch.pastorName} telah aktif.`
          : `Sayang sekali, proposal pendirian/pendaftaran gereja ${targetChurch.name} belum memenuhi kritieria verifikator Pusat. Silakan hubungi admin@metaconnect.org`,
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
  const verifyUser = (userId: string, status: 'APPROVED' | 'REJECTED') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const approveAgenda = (agendaId: string, status: 'APPROVED' | 'REJECTED') => {
    setAgendas(prev => prev.map(ag => ag.id === agendaId ? { ...ag, status } : ag));
  };

  const approveFinance = (financeId: string, status: 'APPROVED' | 'REJECTED') => {
    setFinances(prev => prev.map(f => f.id === financeId ? { ...f, status } : f));
  };

  const approveAttendance = (attendanceId: string, status: 'APPROVED' | 'REJECTED') => {
    setAttendance(prev => prev.map(at => at.id === attendanceId ? { ...at, status } : at));
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
      
      proposeAgenda,
      addFinance,
      addAttendance,
      addPrayer,
      prayForRequest,
      addSuggestion,
      
      setCurrentUserDirectly
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
