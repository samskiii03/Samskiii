import React, { useState } from 'react';
import { useMetaConnect } from '../context/MetaConnectContext';
import { 
  Shield, Landmark, Users, CheckCircle, XCircle, Settings, Mail, Send, 
  TrendingUp, RefreshCw, AlertTriangle, MessageSquare, Info, AppWindow, MapPin,
  Compass, Eye, Heart, Key, User, FileText, ChevronRight, UploadCloud, Edit
} from 'lucide-react';

export default function PusatDashboard() {
  const { 
    churches, 
    users, 
    suggestions, 
    verifyChurch, 
    updateChurchCustomization, 
    updateChurchDetails,
    updateGlobalSettings,
    updateUserProfile,
    sendNotification,
    globalSettings,
    currentUser
  } = useMetaConnect();

  // Tab View state
  const [activeView, setActiveView] = useState<'churches' | 'members' | 'proposals' | 'inbox' | 'profile'>('proposals');

  // Selected church for launching and customization configuration
  const [selectedChurchId, setSelectedChurchId] = useState('');
  const [churchName, setChurchName] = useState('');
  const [churchAddress, setChurchAddress] = useState('');
  const [churchPermit, setChurchPermit] = useState('');
  const [churchLogo, setChurchLogo] = useState('');
  const [accentColor, setAccentColor] = useState('#0f766e');
  const [heroStatement, setHeroStatement] = useState('');
  const [churchCustomFeedback, setChurchCustomFeedback] = useState('');

  // Selected Proposal for detailed dossier viewing
  const [reviewProposalId, setReviewProposalId] = useState<string | null>(null);

  // Global landing page customization state
  const [showGlobalSettingsSaved, setShowGlobalSettingsSaved] = useState(false);
  const [landingTitle, setLandingTitle] = useState(globalSettings?.title || '');
  const [landingSubtitle, setLandingSubtitle] = useState(globalSettings?.subtitle || '');
  const [landingHeroBadge, setLandingHeroBadge] = useState(globalSettings?.heroBadge || '');
  const [landingBackground, setLandingBackground] = useState<'warm' | 'cool' | 'dark' | 'classic'>(globalSettings?.backgroundStyle || 'warm');
  const [promo1, setPromo1] = useState(globalSettings?.promoText1 || '');
  const [promo2, setPromo2] = useState(globalSettings?.promoText2 || '');
  const [promo3, setPromo3] = useState(globalSettings?.promoText3 || '');
  const [promo4, setPromo4] = useState(globalSettings?.promoText4 || '');

  // Admin Account state
  const [adminName, setAdminName] = useState(currentUser?.name || '');
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || '');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phone || '');
  const [adminBirth, setAdminBirth] = useState(currentUser?.birthDate || '');
  const [adminAddress, setAdminAddress] = useState(currentUser?.address || '');
  const [adminPass, setAdminPass] = useState(currentUser?.password || '');
  const [adminFeedback, setAdminFeedback] = useState('');

  // Notification Builder state
  const [notifTarget, setNotifTarget] = useState('GLOBAL');
  const [notifType, setNotifType] = useState<'INFO' | 'WARNING' | 'ALERT'>('INFO');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifFeedback, setNotifFeedback] = useState('');

  // Filtering
  const pendingChurches = churches.filter(c => c.status === 'PENDING_VERIFICATION');
  const verifiedChurches = churches.filter(c => c.status === 'APPROVED');
  const rejectedChurches = churches.filter(c => c.status === 'REJECTED');
  
  const totalApprovedMembers = users.filter(u => u.status === 'APPROVED').length;

  // Handles starting customize a church
  const handleSelectChurchToCustomize = (id: string) => {
    setSelectedChurchId(id);
    const ch = churches.find(c => c.id === id);
    if (ch) {
      setChurchName(ch.name);
      setChurchAddress(ch.address);
      setChurchPermit(ch.permitNumber);
      setChurchLogo(ch.logoUrl || '');
      setAccentColor(ch.customAccentColor || '#0f766e');
      setHeroStatement(ch.customHeroStatement || '');
    }
  };

  // Saves church launch details
  const saveChurchLaunchConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChurchId) return;
    updateChurchDetails(selectedChurchId, {
      name: churchName,
      address: churchAddress,
      permitNumber: churchPermit,
      logoUrl: churchLogo,
      customAccentColor: accentColor,
      customHeroStatement: heroStatement
    });
    setChurchCustomFeedback('Konfigurasi draf & launching awal gereja sukses direkam!');
    setTimeout(() => setChurchCustomFeedback(''), 3000);
  };

  // Saves global landing settings
  const handleSaveGlobalLanding = (e: React.FormEvent) => {
    e.preventDefault();
    updateGlobalSettings({
      title: landingTitle,
      subtitle: landingSubtitle,
      heroBadge: landingHeroBadge,
      backgroundStyle: landingBackground,
      promoText1: promo1,
      promoText2: promo2,
      promoText3: promo3,
      promoText4: promo4
    });
    setShowGlobalSettingsSaved(true);
    setTimeout(() => setShowGlobalSettingsSaved(false), 3000);
  };

  // Saves admin own profile
  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUserProfile(currentUser.id, {
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      birthDate: adminBirth,
      address: adminAddress,
      password: adminPass
    });
    setAdminFeedback('Data profil administrator pusat berhasil diperbarui!');
    setTimeout(() => setAdminFeedback(''), 3000);
  };

  // Broadcasts a notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) {
      alert('Mohon isi judul dan pengumuman pesan.');
      return;
    }
    sendNotification(notifType, notifTitle, notifMsg, notifTarget);
    setNotifFeedback(`Pesan "${notifTitle}" berkategori [${notifType}] sukses dipublikasikan.`);
    setNotifTitle('');
    setNotifMsg('');
    setTimeout(() => setNotifFeedback(''), 4000);
  };

  const selectedProposal = churches.find(c => c.id === reviewProposalId);

  // Pre-seed mock values for custom SVG charting
  const mockMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'];
  const activeChurchesData = [1, 1, 2, 2, verifiedChurches.length]; 
  const activeMembersData = [10, 45, 120, 210, totalApprovedMembers];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-8 animate-fade-in">
      
      {/* Platform Level Hero Banner */}
      <div className="bg-white text-[#1A1A1A] rounded-3xl p-6 md:p-8 shadow-xs border border-[#1A1A1A]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#E8E6E1] text-[#1A1A1A]/80 font-bold text-[10px] tracking-widest uppercase">
            <Shield className="h-3.5 w-3.5 mr-1" /> Otoritas Hukum Pusat
          </div>
          <h2 className="text-3xl font-serif text-[#1A1A1A] mt-2">Portal Konsol Sinode Pusat</h2>
          <p className="text-xs text-[#1A1A1A]/60 max-w-xl font-sans leading-relaxed">
            Sistem birokrasi verifikator proposal pendirian gereja, audit statistik pendaftaran jemaat nasional, moderasi kotak saran, dan kustomisasi tampilan landing page utama.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => {
              setActiveView('profile');
              // Prepopulate profile if needed
              if (currentUser) {
                setAdminName(currentUser.name);
                setAdminEmail(currentUser.email);
                setAdminPhone(currentUser.phone);
                setAdminBirth(currentUser.birthDate);
                setAdminAddress(currentUser.address);
                setAdminPass(currentUser.password);
              }
            }}
            className={`px-4 py-2 text-xs rounded-full border transition-all text-left flex items-center gap-2 cursor-pointer font-bold ${
              activeView === 'profile' 
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                : 'bg-[#F2F1ED] text-[#1A1A1A]/80 border-[#1A1A1A]/10 hover:bg-[#E8E6E1]'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Akun Saya: {currentUser?.name || 'Administrator'}</span>
          </button>
        </div>
      </div>

      {/* Global Performance Counters as Interactive Tabs Menu */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        
        {/* Counter 1: Total Gereja */}
        <button 
          id="tab-kpi-total-gereja"
          onClick={() => setActiveView('churches')}
          className={`text-left p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xs border transition-all duration-300 flex flex-col justify-between h-32 md:h-40 relative group cursor-pointer ${
            activeView === 'churches' 
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] ring-4 ring-[#1A1A1A]/10' 
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/40'
          }`}
        >
          <span className={`text-[8.5px] md:text-[10px] font-bold uppercase tracking-widest ${activeView === 'churches' ? 'text-white/60' : 'text-[#1A1A1A]/50'}`}>
            Total Gereja Terdaftar
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-2xl md:text-4xl font-serif italic font-bold">{churches.length}</span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-60">unit</span>
          </div>
          <div className="mt-auto w-full pt-1 border-t border-dashed border-current/10 flex items-center justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
            <span className="truncate">Aktif: {verifiedChurches.length} | Tolak: {rejectedChurches.length}</span>
            <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 transition shrink-0" />
          </div>
        </button>

        {/* Counter 2: Global Anggota Aktif */}
        <button 
          id="tab-kpi-anggota-aktif"
          onClick={() => setActiveView('members')}
          className={`text-left p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xs border transition-all duration-300 flex flex-col justify-between h-32 md:h-40 relative group cursor-pointer ${
            activeView === 'members' 
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] ring-4 ring-[#1A1A1A]/10' 
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/40'
          }`}
        >
          <span className={`text-[8.5px] md:text-[10px] font-bold uppercase tracking-widest ${activeView === 'members' ? 'text-white/60' : 'text-[#1A1A1A]/50'}`}>
            Global Anggota Aktif
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-2xl md:text-4xl font-serif italic font-bold">{totalApprovedMembers}</span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-60">jiwa</span>
          </div>
          <div className="mt-auto w-full pt-1 border-t border-dashed border-current/10 flex items-center justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
            <span className="truncate">Total: {users.length} Registrasi</span>
            <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 transition shrink-0" />
          </div>
        </button>

        {/* Counter 3: Antrean Verifikasi Proposal */}
        <button 
          id="tab-kpi-verifikasi-proposal"
          onClick={() => setActiveView('proposals')}
          className={`text-left p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xs border transition-all duration-300 flex flex-col justify-between h-32 md:h-40 relative group cursor-pointer ${
            activeView === 'proposals' 
              ? 'bg-red-700 text-white border-red-750 ring-4 ring-red-200' 
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-red-250'
          }`}
        >
          <span className={`text-[8.5px] md:text-[10px] font-bold uppercase tracking-widest ${activeView === 'proposals' ? 'text-white/80' : 'text-red-700/80'}`}>
            Antrean Proposal Baru
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-2xl md:text-4xl font-serif italic font-bold">{pendingChurches.length}</span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-60">berkas</span>
          </div>
          <div className={`mt-auto w-full pt-1 border-t border-dashed border-current/10 flex items-center justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-wider ${
            activeView === 'proposals' ? 'text-white' : 'text-red-650'
          }`}>
            <span className={`truncate ${pendingChurches.length > 0 ? 'animate-pulse font-extrabold' : ''}`}>
              {pendingChurches.length > 0 ? 'Wajib Review' : 'Semua Bersih ✓'}
            </span>
            <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 transition shrink-0" />
          </div>
        </button>

        {/* Counter 4: Inbox Masukan */}
        <button 
          id="tab-kpi-inbox-masukan"
          onClick={() => setActiveView('inbox')}
          className={`text-left p-3 md:p-6 rounded-2xl md:rounded-3xl shadow-xs border transition-all duration-300 flex flex-col justify-between h-32 md:h-40 relative group cursor-pointer ${
            activeView === 'inbox' 
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] ring-4 ring-[#1A1A1A]/10' 
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/40'
          }`}
        >
          <span className={`text-[8.5px] md:text-[10px] font-bold uppercase tracking-widest ${activeView === 'inbox' ? 'text-white/60' : 'text-[#1A1A1A]/50'}`}>
            Masukan / Inbox (Pusat)
          </span>
          <div className="flex items-baseline space-x-1 mt-0.5">
            <span className="text-2xl md:text-4xl font-serif italic font-bold">
              {suggestions.filter(s => s.target === 'PUSAT').length}
            </span>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-60">pesan</span>
          </div>
          <div className="mt-auto w-full pt-1 border-t border-dashed border-current/10 flex items-center justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
            <span className="truncate">Saran Jemaat</span>
            <ChevronRight className="h-3 w-3 opacity-40 group-hover:opacity-100 transition shrink-0" />
          </div>
        </button>

      </div>

      {/* Main Dynamic Workspace Area depending on clickable menu selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Focused content on selection */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TAB 1: Total Gereja Directory & Custom Launching Setup */}
          {activeView === 'churches' && (
            <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden space-y-6">
              <div className="border-b border-[#1A1A1A]/10 px-6 py-5 bg-[#F2F1ED]/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-serif italic font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Direktori Seluruh Cabang Gereja Lokal ({churches.length})
                  </h3>
                  <p className="text-xs text-slate-500">Daftar jaringan resmi gereja lokal yang legalitasnya diakui oleh sinode pusat Meta Connect.</p>
                </div>
              </div>

              <div className="px-6 divide-y divide-[#1A1A1A]/5">
                {churches.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">Belum ada data gereja tersimpan.</p>
                ) : (
                  churches.map(ch => (
                    <div key={ch.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={ch.logoUrl || "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=200"}
                          alt="Logo"
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 object-cover rounded-xl border border-[#1A1A1A]/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-[#1A1A1A]">{ch.name}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              ch.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              ch.status === 'REJECTED' ? 'bg-red-50 text-red-800 border border-red-200' :
                              'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {ch.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{ch.address}</p>
                          <p className="text-[10px] font-mono opacity-60">Izin Kemenag: {ch.permitNumber} | Gembala: {ch.pastorName}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          id={`btn-manage-config-${ch.id}`}
                          onClick={() => handleSelectChurchToCustomize(ch.id)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                            selectedChurchId === ch.id 
                              ? 'bg-[#1A1A1A] text-white' 
                              : 'bg-white hover:bg-[#F2F1ED] text-[#1A1A1A] border-[#1A1A1A]/10'
                          }`}
                        >
                          <Edit className="h-3 w-3" />
                          <span>Atur Launching</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dynamic launching setup details for church */}
              {selectedChurchId && (
                <div className="m-6 p-6 bg-[#F2F1ED]/40 border border-[#1A1A1A]/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif italic font-bold text-sm text-[#1A1A1A]">
                      Pengaturan Tampilan Awal Gereja Lokal: {churches.find(c => c.id === selectedChurchId)?.name}
                    </h4>
                    <button 
                      onClick={() => setSelectedChurchId('')}
                      className="text-xs text-red-600 hover:underline font-bold"
                    >
                      Batal Edit
                    </button>
                  </div>
                  
                  <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed">
                    Ubah struktur kelayakan informasi dasar dan skema launching gereja ini sebelum tampil ke halaman utama dan dapat diakses oleh jemaat lokalnya.
                  </p>

                  <form onSubmit={saveChurchLaunchConfiguration} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider block">Koreksi Nama Gereja</label>
                      <input 
                        type="text" 
                        value={churchName} 
                        onChange={(e)=>setChurchName(e.target.value)} 
                        className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider block">Nomor Izin Kemenag</label>
                      <input 
                        type="text" 
                        value={churchPermit} 
                        onChange={(e)=>setChurchPermit(e.target.value)} 
                        className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider block">Koreksi Alamat Lengkap</label>
                      <input 
                        type="text" 
                        value={churchAddress} 
                        onChange={(e)=>setChurchAddress(e.target.value)} 
                        className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-white"
                        required
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block font-sans">Foto Logo Cabang Gereja (Logo Attachment)</label>
                      
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setChurchLogo(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="border-2 border-dashed border-[#1A1A1A]/20 rounded-2xl p-6 text-center hover:border-[#1A1A1A]/50 transition cursor-pointer bg-white relative overflow-hidden"
                      >
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setChurchLogo(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {churchLogo ? (
                          <div className="space-y-3 flex flex-col items-center relative z-10">
                            <img src={churchLogo} alt="Preview Logo" referrerPolicy="no-referrer" className="h-16 w-16 object-cover rounded-xl border border-[#1A1A1A]/10" />
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider block">Foto Logo Terlampir ✓</span>
                              <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setChurchLogo(''); }}
                                className="text-[10px] text-red-650 hover:text-red-850 font-bold underline mt-1 cursor-pointer"
                              >
                                Hapus / Ganti Lampiran
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-[#1A1A1A] py-2">
                            <UploadCloud className="h-8 w-8 text-slate-400 mx-auto" />
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Tarik Logo Kemari / Klik untuk Pilih Berkas</div>
                            <div className="text-[9px] opacity-60 font-sans">Mendukung berkas Gambar .png, .jpg (Maks 2MB)</div>
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Atau masukkan URL Logo secara manual (Opsional):</label>
                        <input 
                          type="text" 
                          value={churchLogo} 
                          onChange={(e)=>setChurchLogo(e.target.value)} 
                          placeholder="https://example.com/logo.png"
                          className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider block">Warna Aksen Unik (Hex)</label>
                      <div className="flex space-x-2">
                        <input 
                          type="color" 
                          value={accentColor} 
                          onChange={(e)=>setAccentColor(e.target.value)} 
                          className="w-10 h-8 rounded border p-0.5 bg-white cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={accentColor} 
                          onChange={(e)=>setAccentColor(e.target.value)} 
                          className="flex-1 text-xs border border-[#1A1A1A]/15 rounded-lg px-2 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider block font-sans">Slogan Utama / Statement Hero</label>
                      <input 
                        type="text" 
                        value={heroStatement} 
                        onChange={(e)=>setHeroStatement(e.target.value)} 
                        placeholder="Diberkati untuk Memberkati..."
                        className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-white"
                      />
                    </div>

                    {churchCustomFeedback && (
                      <div className="col-span-1 md:col-span-2 p-2.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-wide uppercase border border-emerald-200 rounded text-center">
                        {churchCustomFeedback}
                      </div>
                    )}

                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 pt-2">
                      <button
                        id="btn-save-church-launch"
                        type="submit"
                        className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-opacity-90 text-white rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
                      >
                        Terapkan launching & Tampilan Cabang
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Global Anggota Aktif Directory */}
          {activeView === 'members' && (
            <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden space-y-6">
              <div className="border-b border-[#1A1A1A]/10 px-6 py-5 bg-[#F2F1ED]/20">
                <h3 className="font-serif italic font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kependudukan Jemaat Aktif Nasional ({totalApprovedMembers} Jiwa)
                </h3>
                <p className="text-xs text-slate-500">Tabel pusat audit data seluruh jemaat, pengurus, maupun pelayan yang telah disetujui oleh masing-masing gembala lokal.</p>
              </div>

              {/* Desktop Table (Visible on medium screens and larger) */}
              <div className="hidden md:block px-6 pb-6 overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A1A]/10 text-slate-400 font-bold uppercase tracking-wider text-[9px] bg-slate-50">
                      <th className="py-3 px-2">Nama Lengkap</th>
                      <th className="py-3 px-2">Posisi / Role</th>
                      <th className="py-3 px-2">Gereja Lokal</th>
                      <th className="py-3 px-2">Jenis Kelamin</th>
                      <th className="py-3 px-2">Status Akun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/5">
                    {users.map(u => {
                      const church = churches.find(c => c.id === u.churchId);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="py-3 px-2 font-bold text-slate-900">
                            <div>{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono font-normal">{u.email}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-semibold text-slate-600 block">{u.role}</span>
                            <span className="text-[10px] text-slate-400">{u.serviceRole || u.officerTitle || '-'}</span>
                          </td>
                          <td className="py-3 px-2 font-medium text-slate-700">{church?.name || 'Belum Terkoneksi'}</td>
                          <td className="py-3 px-2 text-slate-500">{u.gender}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              u.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-805'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List (Visible only on mobile devices) */}
              <div className="block md:hidden px-4 pb-6 space-y-4">
                {users.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#1A1A1A]/50">Belum ada data anggota.</p>
                ) : (
                  users.map(u => {
                    const church = churches.find(c => c.id === u.churchId);
                    return (
                      <div key={u.id} className="p-4 bg-[#F2F1ED]/35 rounded-2xl border border-[#1A1A1A]/5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-950 text-sm">{u.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono block break-all">{u.email}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            u.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-150' : 'bg-amber-50 text-amber-805 border border-amber-150'
                          }`}>
                            {u.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#1A1A1A]/5">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans block">Role / Posisi</span>
                            <span className="font-semibold text-slate-750 block">{u.role}</span>
                            <span className="text-[9.5px] text-slate-500">{u.serviceRole || u.officerTitle || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans block">Gereja Lokal</span>
                            <span className="font-semibold text-slate-750 block truncate">{church?.name || 'Belum Terkoneksi'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans block">Gender</span>
                            <span className="text-slate-700">{u.gender || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Antrean Verifikasi Proposal with detailed dossier view */}
          {activeView === 'proposals' && (
            <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden space-y-4">
              <div className="border-b border-[#1A1A1A]/10 px-6 py-4 flex items-center justify-between bg-[#F2F1ED]/20">
                <div className="space-y-0.5">
                  <h3 className="font-serif italic font-bold text-[#1A1A1A] text-lg flex items-center gap-1.5">
                    <Landmark className="h-5 w-5" />
                    Pemberkasan Proposal Kemitraan Sinode Baru
                  </h3>
                  <p className="text-xs text-slate-500">Berkas calon gereja baru yang membutuhkan peninjauan dokumen AD/ART dan persetujuan legalisir pusat.</p>
                </div>
                <span className="bg-[#E8E6E1] text-[#1A1A1A] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {pendingChurches.length} Proposal Review
                </span>
              </div>

              {pendingChurches.length === 0 ? (
                <div className="p-10 text-center text-slate-500 space-y-3">
                  <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                  <p className="font-serif italic text-lg text-[#1A1A1A]">Antrean Berkas Kosong</p>
                  <p className="text-xs text-slate-400">Seluruh cabang gereja lokal yang mendaftar telah di-review dengan aman.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1A1A1A]/10 border-t border-[#1A1A1A]/10">
                  {pendingChurches.map(ch => (
                    <div key={ch.id} className="p-5 space-y-4 hover:bg-[#F2F1ED]/10 transition">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        
                        {/* Logo and Data */}
                        <div className="flex space-x-3.5">
                          <img 
                            src={ch.logoUrl || "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=200"} 
                            alt="Logo"
                            referrerPolicy="no-referrer"
                            className="h-14 w-14 rounded-lg object-cover border border-[#1A1A1A]/10 shrink-0"
                          />
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-[#1A1A1A]">{ch.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0" /> {ch.address}
                            </p>
                            <span className="inline-block bg-[#F2F1ED] text-[10px] font-mono px-2 py-0.5 rounded text-neutral-800 border border-neutral-200">
                              No. Surat Izin: {ch.permitNumber}
                            </span>
                          </div>
                        </div>

                        {/* Gembala / Pastor Payload */}
                        <div className="text-xs text-[#1A1A1A] space-y-1 bg-[#F2F1ED]/40 p-3.5 rounded-xl border border-[#1A1A1A]/10 max-w-sm shrink-0">
                          <span className="font-bold text-[#1A1A1A]/50 block text-[9px] uppercase tracking-wider font-sans">Data Gembala Utama</span>
                          <p className="font-serif italic text-sm">{ch.pastorName}</p>
                          <p className="text-slate-400 font-mono text-[10px]">{ch.pastorEmail}</p>
                        </div>

                      </div>

                      {/* Operational Action buttons with Review Data first directive */}
                      <div className="flex items-center justify-between border-t border-[#1A1A1A]/5 pt-3">
                        <span className="text-[10px] text-slate-400 font-mono">Masuk: {new Date(ch.createdAt).toLocaleDateString('id-ID')}</span>
                        
                        <div className="flex space-x-2">
                          <button
                            id={`btn-open-proposal-review-${ch.id}`}
                            onClick={() => setReviewProposalId(ch.id)}
                            className="px-4 py-2 bg-[#E8E6E1] hover:bg-[#D1CFC9] text-[#1A1A1A] text-xs rounded-full font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" /> Tinjau Berkas & Audit
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* dossier modal/overlay details before agreeing to verify */}
              {selectedProposal && (
                <div className="m-6 p-6 border-2 border-emerald-500 bg-emerald-50/20 rounded-2xl space-y-6 animate-fade-in relative">
                  <div className="border-b border-emerald-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-800">
                      <FileText className="h-5 w-5" />
                      <h4 className="font-serif italic font-bold text-sm">Review Menyeluruh Berkas Dokumen: {selectedProposal.name}</h4>
                    </div>
                    <button 
                      onClick={() => setReviewProposalId(null)}
                      className="text-xs font-bold text-red-700 hover:underline"
                    >
                      Selesai Audit / Tutup
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                    
                    <div className="space-y-3">
                      <h5 className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Informasi Kelembagaan</h5>
                      <div className="p-4 bg-white rounded-xl border border-slate-200/60 space-y-2">
                        <div>
                          <span className="text-slate-400 font-normal block text-[10px]">Nama Lembaga Gereja</span>
                          <span className="font-bold text-[#1A1A1A]">{selectedProposal.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-normal block text-[10px]">Nomor Hand-over / Legalisir Kemenag</span>
                          <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-1 py-0.5 rounded">{selectedProposal.permitNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-normal block text-[10px]">Wilayah Kantor Koordinat / Alamat</span>
                          <span className="font-semibold">{selectedProposal.address}</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-slate-400 font-normal block text-[10px] mb-1">Preview Lampiran Logo</span>
                          <img src={selectedProposal.logoUrl} alt="Logo Attachment Preview" referrerPolicy="no-referrer" className="h-20 w-20 object-cover rounded-xl border border-dashed border-slate-350" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Otorisasi Kredensial Gembala Utama</h5>
                      <div className="p-4 bg-white rounded-xl border border-slate-200/60 space-y-2">
                        <div>
                          <span className="text-slate-400 font-normal block text-[10px]">Nama Pendeta / Pimpinan Sidang</span>
                          <span className="font-bold font-serif text-slate-900">{selectedProposal.pastorName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-normal block text-[10px]">Surel Log Kemitraan (Email)</span>
                          <span className="font-mono text-slate-700">{selectedProposal.pastorEmail}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block text-[10px] text-amber-700">Audit Status Akun</span>
                          <span className="font-bold text-amber-800 bg-amber-50 rounded px-1.5 border border-amber-200 inline-block mt-0.5">MENUNGGU VERIFIKASI PUSAT</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="p-4 bg-white/60 border border-emerald-100 rounded-xl text-neutral-600 text-xs leading-relaxed space-y-1.5 font-sans">
                    <div className="font-bold text-[#1A1A1A]">Pernyataan Auditor Hukum Pusat:</div>
                    <p>Setelah melakukan pemeriksaan silang terhadap nomor registrasi kemenag <span className="font-mono font-bold text-emerald-800">{selectedProposal.permitNumber}</span> dan menetapkan legalitas Kemitraan, administrator pusat menyatakan berkas ini layak untuk diaktifkan.</p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      id={`btn-deny-dossier-${selectedProposal.id}`}
                      onClick={() => {
                        verifyChurch(selectedProposal.id, 'REJECTED');
                        setReviewProposalId(null);
                      }}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs rounded-full font-bold cursor-pointer"
                    >
                      <XCircle className="h-4 w-4 inline mr-1" /> Tolak Berkas Dokumen
                    </button>
                    <button
                      id={`btn-approve-dossier-${selectedProposal.id}`}
                      onClick={() => {
                        verifyChurch(selectedProposal.id, 'APPROVED');
                        setReviewProposalId(null);
                      }}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-705 text-white shadow-md text-xs rounded-full font-bold cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 inline mr-1" /> Kebijakan Pusat: Setujui & Aktifkan
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 4: Suggestions / Mail Inbox */}
          {activeView === 'inbox' && (
            <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden space-y-4">
              <div className="px-6 py-5 border-b border-[#1A1A1A]/10 bg-[#F2F1ED]/20">
                <h3 className="font-serif italic font-bold text-[#1A1A1A] text-lg flex items-center gap-1.5">
                  <MessageSquare className="h-5 w-5" />
                  Kotak Surat Saran Wilayah (Nasionals)
                </h3>
                <p className="text-xs text-slate-500 font-sans">Koleksi masukan langsung dan kritik dari pelayan serta jemaat gereja cabang untuk optimalisasi aplikasi secara global.</p>
              </div>

              <div className="divide-y divide-[#1A1A1A]/5 px-6">
                {suggestions.filter(s => s.target === 'PUSAT').length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    Belum ada surat saran berstempel langsung ke Pusat.
                  </div>
                ) : (
                  suggestions.filter(s => s.target === 'PUSAT').map(sugg => {
                    const ch = churches.find(c => c.id === sugg.churchId);
                    return (
                      <div key={sugg.id} className="py-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="font-bold text-slate-900">{sugg.userName}</span>
                          <span className="font-mono">{new Date(sugg.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <p className="text-neutral-600 leading-relaxed font-sans">{sugg.message}</p>
                        <div className="pt-1 flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <Landmark className="h-3.5 w-3.5 mr-1" />
                          Asal Pengirim: <span className="font-bold ml-1 text-slate-800">{ch?.name || 'Cabang Lokal'}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Admin own account modification section */}
          {activeView === 'profile' && (
            <div className="bg-white rounded-3xl p-6 border border-[#1A1A1A]/10 space-y-6">
              <div className="space-y-1">
                <h3 className="font-serif italic text-xl text-[#1A1A1A] flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Pengaturan Keamanan Profil Administrator Pusat
                </h3>
                <p className="text-xs text-slate-500 font-sans">Ubah nama berwenang, kontak darurat, email login utama, maupun sandi administratif Anda sebagai penilai pusat di aplikasi Meta Connect.</p>
              </div>

              <form onSubmit={handleSaveAdminProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest block font-sans">Nama Pengurus Pusat</label>
                  <input 
                    type="text" 
                    value={adminName} 
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-[#F2F1ED]/20 focus:outline-none focus:border-[#1A1A1A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest block font-sans">Surel Utama (Email login)</label>
                  <input 
                    type="email" 
                    value={adminEmail} 
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-[#F2F1ED]/20 focus:outline-none focus:border-[#1A1A1A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest block font-sans">Nomor Telepon Kantor</label>
                  <input 
                    type="text" 
                    value={adminPhone} 
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-[#F2F1ED]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest block font-sans">Tanggal Lahir Administrasi</label>
                  <input 
                    type="date" 
                    value={adminBirth} 
                    onChange={(e) => setAdminBirth(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-[#F2F1ED]/20"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest block font-sans">Alamat Domisili Kantor Sinode</label>
                  <input 
                    type="text" 
                    value={adminAddress} 
                    onChange={(e) => setAdminAddress(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-[#F2F1ED]/20 focus:outline-none"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest block font-sans">Kata Sandi Rahasia Baru</label>
                  <input 
                    type="password" 
                    value={adminPass} 
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-lg bg-[#F2F1ED]/20 focus:outline-none focus:border-[#1A1A1A]"
                    required
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                {adminFeedback && (
                  <div className="col-span-1 md:col-span-2 p-3 bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-100 rounded-lg text-center font-bold uppercase tracking-wider">
                    {adminFeedback}
                  </div>
                )}

                <div className="col-span-1 md:col-span-2 flex justify-end">
                  <button 
                    id="btn-save-admin-account"
                    type="submit"
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-opacity-90 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xs cursor-pointer text-center"
                  >
                    Simpan Perubahan Akun
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Custom styling landing modifiers & Notification Broadcasting */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Global Landing Customized Panel */}
          <div className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 space-y-4 shadow-sm animate-fade-in text-[#1A1A1A]">
            <h3 className="font-serif italic text-xl flex items-center gap-2">
              <AppWindow className="h-4 w-4" />
              Ubah Tampilan Landing Utama
            </h3>
            
            <p className="text-xs opacity-60 leading-relaxed font-sans">
              Anda berhak mengatur nama, badge, slogan, serta deskripsi multi-birokrasi pendaftaran yang muncul pada halaman Landing Page depan Meta Connect secara instan.
            </p>

            <form onSubmit={handleSaveGlobalLanding} className="space-y-4 text-xs font-medium">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Judul Utama / Big Slogan</label>
                <textarea
                  value={landingTitle}
                  onChange={(e) => setLandingTitle(e.target.value)}
                  placeholder="Menghubungkan Pelayanan dengan Satu Ketukan Melalui Meta Connect"
                  rows={2}
                  className="w-full text-xs border border-[#1A1A1A]/15 rounded p-2.5 bg-[#F2F1ED]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Subjudul Deskripsi</label>
                <textarea
                  value={landingSubtitle}
                  onChange={(e) => setLandingSubtitle(e.target.value)}
                  placeholder="Meningkatkan keaktifan, transparansi keuangan..."
                  rows={3}
                  className="w-full text-xs border border-[#1A1A1A]/15 rounded p-2.5 bg-[#F2F1ED]/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Badge Slogan Atas</label>
                <input
                  type="text"
                  value={landingHeroBadge}
                  onChange={(e) => setLandingHeroBadge(e.target.value)}
                  placeholder="KONEKTIVITAS GEREJA TERSEGMENTASI"
                  className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Tema Warna/Latar Belakang</label>
                <select
                  value={landingBackground}
                  onChange={(e) => setLandingBackground(e.target.value as any)}
                  className="w-full text-xs p-2 border border-[#1A1A1A]/15 rounded-lg bg-[#F2F1ED]/30"
                >
                  <option value="warm">Warm Off-White Paper</option>
                  <option value="cool">Cool Ice Blue Canvas</option>
                  <option value="dark">Chic Midnight Dark</option>
                  <option value="classic">Classic Ivory Cream</option>
                </select>
              </div>

              {/* Promo descriptors 1 to 4 */}
              <div className="space-y-3 pt-2 border-t border-[#1A1A1A]/5">
                <span className="text-[9px] font-bold opacity-50 block uppercase tracking-widest font-sans">Koreksi 4 Deskripsi Alur Birokrasi</span>
                
                <div className="space-y-1">
                  <label className="text-[9.5px] opacity-60 font-semibold block">Sinode Pusat (1)</label>
                  <input
                    type="text"
                    value={promo1}
                    onChange={(e) => setPromo1(e.target.value)}
                    className="w-full p-2 border border-[#1A1A1A]/15 rounded bg-[#F2F1ED]/10 text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] opacity-60 font-semibold block">Gembala Sidang (2)</label>
                  <input
                    type="text"
                    value={promo2}
                    onChange={(e) => setPromo2(e.target.value)}
                    className="w-full p-2 border border-[#1A1A1A]/15 rounded bg-[#F2F1ED]/10 text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] opacity-60 font-semibold block">Staf Pengurus Bendahara (3)</label>
                  <input
                    type="text"
                    value={promo3}
                    onChange={(e) => setPromo3(e.target.value)}
                    className="w-full p-2 border border-[#1A1A1A]/15 rounded bg-[#F2F1ED]/10 text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] opacity-60 font-semibold block">Jemaat & Pelayan (4)</label>
                  <input
                    type="text"
                    value={promo4}
                    onChange={(e) => setPromo4(e.target.value)}
                    className="w-full p-2 border border-[#1A1A1A]/15 rounded bg-[#F2F1ED]/10 text-[11px]"
                  />
                </div>
              </div>

              {showGlobalSettingsSaved && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-100 font-bold rounded-lg text-center uppercase tracking-wide">
                  Tampilan utama diperbarui & diterbitkan!
                </div>
              )}

              <button
                id="btn-apply-global-settings"
                type="submit"
                className="w-full text-xs font-bold bg-[#1A1A1A] hover:bg-opacity-90 text-white rounded-full py-3 uppercase tracking-widest shadow-xs cursor-pointer"
              >
                Terapkan Slogan & Tema Landing
              </button>

            </form>
          </div>

          {/* Broadcast Notification Sender */}
          <div className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 space-y-4 shadow-sm text-[#1A1A1A]">
            <h3 className="font-serif italic text-xl flex items-center gap-1.5">
              <Send className="h-4 w-4" />
              Kirim Notifikasi / Pesan Instan
            </h3>

            <p className="text-xs opacity-60 leading-relaxed font-sans">
              Mempublikasikan pesan peraturan kemenag, imbauan pengurusan ketaatan, atau informasi kedaruratan ke sinode gereja spesifik maupun global.
            </p>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Sasaran Penerbitan</label>
                <select
                  value={notifTarget}
                  onChange={(e) => setNotifTarget(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-[#1A1A1A]/15 bg-[#F2F1ED]/30 text-slate-700 font-medium focus:outline-none"
                >
                  <option value="GLOBAL">Broadcast Global (Seluruh Jaringan)</option>
                  {verifiedChurches.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Derajat Kegawatan</label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-[#1A1A1A]/15 bg-[#F2F1ED]/30 text-slate-700 font-medium font-sans"
                >
                  <option value="INFO">INFO (Hijau / Standard)</option>
                  <option value="WARNING">WARNING (Kuning / Penjadwalan)</option>
                  <option value="ALERT">ALERT (Merah / Segera Tindaki)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Judul Kategori Notifikasi</label>
                <input
                  type="text"
                  placeholder="Pemberitahuan Kelengkapan Dokumen"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full text-xs border border-[#1A1A1A]/15 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold opacity-60 uppercase tracking-widest block font-sans">Isi Berkas Dokumen / Pesan</label>
                <textarea
                  placeholder="Sehubungan dengan pemenuhan AD/ART..."
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  rows={3}
                  className="w-full text-xs border border-[#1A1A1A]/15 rounded-lg p-2.5 focus:outline-none bg-[#F2F1ED]/30"
                />
              </div>

              {notifFeedback && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wide border border-emerald-100 font-bold text-center">
                  {notifFeedback}
                </div>
              )}

              <button
                id="btn-broadcast-notification"
                type="submit"
                className="w-full text-xs font-bold bg-[#1A1A1A] hover:bg-opacity-90 text-white rounded-full py-3.5 uppercase tracking-widest cursor-pointer shadow-xs"
              >
                Kirim Pengumuman / Broadcast
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
