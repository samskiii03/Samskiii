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
    currentUser,
    actionLogs,
    deleteUser,
    restoreUser,
    deleteChurch,
    restoreChurch
  } = useMetaConnect();

  // Tab View state
  const [activeView, setActiveView] = useState<'churches' | 'members' | 'proposals' | 'inbox' | 'profile' | 'audit_logs'>('proposals');

  // Reason text for audit verification
  const [churchActionReason, setChurchActionReason] = useState('Verifikasi berkas administratif Kemenag lengkap dan sah');

  // Selected church for launching and customization configuration
  const [selectedChurchId, setSelectedChurchId] = useState('');
  const [churchName, setChurchName] = useState('');
  const [churchAddress, setChurchAddress] = useState('');
  const [churchPermit, setChurchPermit] = useState('');
  const [churchLogo, setChurchLogo] = useState('');
  const [accentColor, setAccentColor] = useState('#0f766e');
  const [heroStatement, setHeroStatement] = useState('');
  const [churchCustomFeedback, setChurchCustomFeedback] = useState('');

  // Selected church for sending official warnings
  const [warningChurchId, setWarningChurchId] = useState('');
  const [warningMessageText, setWarningMessageText] = useState('Peringatan: Harap segera penuhi ketentuan administrasi dan keselarasan dokumen laporan berkala.');

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

  // Filtering states for Members Directory
  const [memberStatusFilter, setMemberStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED'>('ALL');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [memberJustificationReason, setMemberJustificationReason] = useState('Konfirmasi ulang kelengkapan administrasi dan keanggotaan sah jemaat');

  // Filtering states for Church Directory
  const [churchStatusFilter, setChurchStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED'>('ALL');
  const [searchChurchQuery, setSearchChurchQuery] = useState('');
  const [churchActionFeedback, setChurchActionFeedback] = useState('');

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

        <div className="shrink-0 flex flex-col sm:flex-row gap-2">
          <button 
            id="btn-view-audit-logs"
            onClick={() => setActiveView('audit_logs')}
            className={`px-4 py-2 text-xs rounded-full border transition-all text-left flex items-center gap-2 cursor-pointer font-bold ${
              activeView === 'audit_logs' 
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] ring-2 ring-[#1A1A1A]/10' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Histori Aksi & Pertimbangan</span>
          </button>

          <button 
            id="btn-view-admin-profile"
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
          {activeView === 'churches' && (() => {
            const filteredChurches = churches.filter(ch => {
              if (churchStatusFilter !== 'ALL' && ch.status !== churchStatusFilter) return false;
              if (searchChurchQuery.trim()) {
                const q = searchChurchQuery.toLowerCase();
                return (
                  ch.name.toLowerCase().includes(q) ||
                  ch.address.toLowerCase().includes(q) ||
                  ch.pastorName.toLowerCase().includes(q) ||
                  ch.permitNumber.toLowerCase().includes(q)
                );
              }
              return true;
            });

            const handleSendChurchWarning = (chId: string, chName: string) => {
              if (!warningMessageText.trim()) return;
              sendNotification('WARNING', `Peringatan Resmi Sinode Pusat: ${chName}`, warningMessageText, chId);
              setWarningChurchId('');
              setChurchActionFeedback(`Peringatan resmi sukses terkirim ke pihak Gembala Cabang ${chName}!`);
              setTimeout(() => setChurchActionFeedback(''), 5000);
            };

            return (
              <div id="sinode-churches-control-tab" className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden space-y-6 pb-6">
                <div className="border-b border-[#1A1A1A]/10 px-6 py-5 bg-[#F2F1ED]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h3 className="font-serif italic font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                       <Landmark className="h-5 w-5 text-indigo-800" />
                       Kontrol Syarat Wilayah & Direktori Cabang ({churches.length} Cabang)
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">Otoritas peninjauan penuh Sinode Pusat Meta Connect untuk menyetujui, menolak/menangguhkan, menertibkan tertulis, atau menghapus pendaftaran cabang gereja.</p>
                  </div>
                </div>

                {/* Search & Status Filters */}
                <div className="px-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F2F1ED]/30 p-4 rounded-2xl border border-[#1A1A1A]/10 text-xs font-sans">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        id="btn-church-filter-all"
                        type="button"
                        onClick={() => setChurchStatusFilter('ALL')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          churchStatusFilter === 'ALL'
                            ? 'bg-[#1A1A1A] text-white shadow-xs'
                            : 'bg-white/80 hover:bg-[#F2F1ED] text-slate-600 border border-[#1A1A1A]/10'
                        }`}
                      >
                        Semua ({churches.length})
                      </button>
                      <button
                        id="btn-church-filter-approved"
                        type="button"
                        onClick={() => setChurchStatusFilter('APPROVED')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          churchStatusFilter === 'APPROVED'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white/80 hover:bg-[#F2F1ED] text-slate-600 border border-[#1A1A1A]/10'
                        }`}
                      >
                        Aktif / Sah ({churches.filter(c => c.status === 'APPROVED').length})
                      </button>
                      <button
                        id="btn-church-filter-pending"
                        type="button"
                        onClick={() => setChurchStatusFilter('PENDING_VERIFICATION')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          churchStatusFilter === 'PENDING_VERIFICATION'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white/80 hover:bg-[#F2F1ED] text-slate-600 border border-[#1A1A1A]/10'
                        }`}
                      >
                        Menunggu ({churches.filter(c => c.status === 'PENDING_VERIFICATION').length})
                      </button>
                      <button
                        id="btn-church-filter-rejected"
                        type="button"
                        onClick={() => setChurchStatusFilter('REJECTED')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          churchStatusFilter === 'REJECTED'
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-white/80 hover:bg-[#F2F1ED] text-slate-600 border border-[#1A1A1A]/10'
                        }`}
                      >
                        Ditangguhkan ({churches.filter(c => c.status === 'REJECTED').length})
                      </button>
                    </div>

                    <div className="w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Cari nama gereja, pastor, alamat..."
                        value={searchChurchQuery}
                        onChange={(e) => setSearchChurchQuery(e.target.value)}
                        className="w-full text-xs px-3.5 py-1.5 rounded-xl border border-[#1A1A1A]/15 bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {churchActionFeedback && (
                    <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-indigo-900 text-xs font-sans font-bold flex items-center gap-1.5 animate-pulse">
                      <CheckCircle className="h-4 w-4 text-indigo-700" />
                      {churchActionFeedback}
                    </div>
                  )}
                </div>

                <div className="px-6 divide-y divide-[#1A1A1A]/5 space-y-4">
                  {filteredChurches.length === 0 ? (
                    <p className="py-8 text-center text-xs text-slate-400 font-sans italic">Tidak ditemukan cabang gereja dalam database berdasarkan pencarian/status saat ini.</p>
                  ) : (
                    filteredChurches.map(ch => (
                      <div key={ch.id} className="py-4 space-y-4 font-sans">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-start space-x-4">
                            <img 
                              src={ch.logoUrl || "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=200"}
                              alt="Logo"
                              referrerPolicy="no-referrer"
                              className="h-12 w-12 object-cover rounded-xl border border-[#1A1A1A]/10 shrink-0 shadow-xs"
                            />
                            <div>
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="font-bold text-[#1A1A1A] text-sm font-serif italic">{ch.name}</span>
                                <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  ch.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                  ch.status === 'REJECTED' ? 'bg-red-50 text-red-800 border border-red-200' :
                                  'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}>
                                  {ch.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">{ch.address}</p>
                              <p className="text-[10px] font-mono opacity-60 mt-0.5">Kemenag No: {ch.permitNumber} | Pastor: {ch.pastorName} ({ch.pastorEmail})</p>
                            </div>
                          </div>

                          {/* Control Actions Panel */}
                          <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-auto">
                            {/* Warning trigger */}
                            <button
                              id={`btn-toggle-warning-${ch.id}`}
                              onClick={() => {
                                setWarningChurchId(warningChurchId === ch.id ? '' : ch.id);
                              }}
                              className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer font-sans ${
                                warningChurchId === ch.id
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-amber-50 hover:bg-amber-100/50 text-amber-850 border border-amber-200'
                              }`}
                              title="Tulis teguran tertulis langsung ke jemaat lokal ini"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                              <span>Beri Peringatan</span>
                            </button>

                            {/* Launch Setup */}
                            <button
                              id={`btn-manage-config-${ch.id}`}
                              onClick={() => handleSelectChurchToCustomize(ch.id)}
                              className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg border transition flex items-center gap-1 cursor-pointer font-sans ${
                                selectedChurchId === ch.id 
                                  ? 'bg-[#1A1A1A] text-white' 
                                  : 'bg-white hover:bg-[#F2F1ED] text-[#1A1A1A] border-[#1A1A1A]/10'
                              }`}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Atur Launching</span>
                            </button>

                            {/* Accept/Approve Buttons if not APPROVED */}
                            {ch.status !== 'APPROVED' && (
                              <button
                                id={`btn-approve-direct-${ch.id}`}
                                onClick={() => {
                                  verifyChurch(ch.id, 'APPROVED', 'Disahkan dan diaktifkan kembali kelancaran operasionalnya oleh Keputusan Rapat Sinode Pusat.');
                                  setChurchActionFeedback(`Gereja ${ch.name} berhasil disahkan dan aktif penuh!`);
                                  setTimeout(() => setChurchActionFeedback(''), 5000);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold cursor-pointer transition flex items-center gap-1 shadow-xs font-sans"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Sahkan Cabang</span>
                              </button>
                            )}

                            {/* Reject / Suspended Button if not REJECTED */}
                            {ch.status !== 'REJECTED' && (
                              <button
                                id={`btn-reject-direct-${ch.id}`}
                                onClick={() => {
                                  const reason = window.prompt(`Masukkan alasan penangguhan untuk gereja ${ch.name}:`, 'Ditolak/ditangguhkan oleh Rektor Sinode Pusat karena ketidaklengkapan administrasi tahunan.');
                                  if (reason !== null) {
                                    verifyChurch(ch.id, 'REJECTED', reason || 'Ditangguhkan oleh keputusan sinode pusat.');
                                    setChurchActionFeedback(`Laporan administratif: ${ch.name} ditangguhkan.`);
                                    setTimeout(() => setChurchActionFeedback(''), 5000);
                                  }
                                }}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-[10.5px] font-bold cursor-pointer transition flex items-center gap-1 font-sans border border-rose-200"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Tolak / Tangguhkan</span>
                              </button>
                            )}

                            {/* Force Delete Button */}
                            <button
                              id={`btn-delete-direct-${ch.id}`}
                              onClick={() => {
                                if (window.confirm(`PERINGATAN KRITIS: Menghapus "${ch.name}" akan melenyapkan pendaftaran gereja ini dan melarang semua pengurus maupun jemaat lokalnya masuk platform Meta Connect selamanya. Apakah Anda 100% yakin ingin melanjutkan?`)) {
                                  deleteChurch(ch.id);
                                  setChurchActionFeedback(`Data pendaftaran ${ch.name} berhasil dihapus permanen!`);
                                  setTimeout(() => setChurchActionFeedback(''), 5000);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10.5px] font-bold cursor-pointer transition font-sans"
                            >
                              Hapus Permanen
                            </button>
                          </div>
                        </div>

                        {/* Slide open Inline Warning Editor form */}
                        {warningChurchId === ch.id && (
                          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs font-sans space-y-3 animate-fade-in">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                              <span className="font-bold text-amber-800 font-serif italic text-[13px]">Buka Teguran / Peringatan Resmi Cabang</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Kirim peringatan resmi untuk pelanggaran kepatuhan, kejanggalan laporan keuangan, atau ketidakjelasan izin aktivitas kemenag. Pesan akan instan tampil di halaman utama Gembala Cabang.</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input 
                                type="text"
                                value={warningMessageText}
                                onChange={(e) => setWarningMessageText(e.target.value)}
                                className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-800"
                                required
                              />
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setWarningChurchId('')}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer"
                                >
                                  Batal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSendChurchWarning(ch.id, ch.name)}
                                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold cursor-pointer shadow-xs"
                                >
                                  Kirim Sekarang
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Dynamic launching setup details for church */}
                {selectedChurchId && (
                  <div className="m-6 p-6 bg-[#F2F1ED]/40 border border-[#1A1A1A]/10 rounded-2xl space-y-4 font-sans">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif italic font-bold text-sm text-[#1A1A1A]">
                        Pengaturan Tampilan Awal & Launching Cabang: {churches.find(c => c.id === selectedChurchId)?.name}
                      </h4>
                      <button 
                        onClick={() => setSelectedChurchId('')}
                        className="text-xs text-red-650 hover:underline font-bold"
                      >
                        Batal Edit Tampilan
                      </button>
                    </div>
                    
                    <p className="text-[11px] text-[#1A1A1A]/60 leading-relaxed">
                      Lakukan penyesuaian identitas visual, teks slogan penyambutan hari peluncuran, serta lampiran cover/logo gereja cabang lokal terpilih.
                    </p>

                    <form onSubmit={saveChurchLaunchConfiguration} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider block">Koreksi Nama Gereja Resmi</label>
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
                        <label className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-wider block">Koreksi Alamat Lengkap Cabang</label>
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
            );
          })()}
                    {/* TAB 2: Global Anggota Aktif Directory */}
          {activeView === 'members' && (() => {
            const filteredUsers = users.filter(u => {
              if (u.role === 'PUSAT') return false;
              if (memberStatusFilter !== 'ALL' && u.status !== memberStatusFilter) return false;
              if (searchMemberQuery.trim()) {
                const q = searchMemberQuery.toLowerCase();
                const church = churches.find(c => c.id === u.churchId);
                return (
                  u.name.toLowerCase().includes(q) ||
                  u.email.toLowerCase().includes(q) ||
                  (u.serviceRole && u.serviceRole.toLowerCase().includes(q)) ||
                  (church && church.name.toLowerCase().includes(q))
                );
              }
              return true;
            });

            return (
              <div id="members-directory-root" className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden space-y-6">
                <div className="border-b border-[#1A1A1A]/10 px-6 py-5 bg-[#F2F1ED]/20">
                  <h3 className="font-serif italic font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-800" />
                    Kependudukan Jemaat & Peninjauan Akun ({users.filter(u => u.role !== 'PUSAT').length} Registrasi)
                  </h3>
                  <p className="text-xs text-slate-500">Tabel pusat audit terpadu atas anggota jemaat, pengurus, serta pelayan jemaat nasional untuk peninjauan, penghapusan, dan pemulihan akun.</p>
                </div>

                <div className="px-6 space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        id="btn-filter-status-all"
                        type="button"
                        onClick={() => setMemberStatusFilter('ALL')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          memberStatusFilter === 'ALL'
                            ? 'bg-[#1A1A1A] text-[#F9F8F6]'
                            : 'bg-[#F2F1ED] text-slate-600 hover:bg-[#E8E6E1]'
                        }`}
                      >
                        Semua ({users.filter(u => u.role !== 'PUSAT').length})
                      </button>
                      <button
                        id="btn-filter-status-approved"
                        type="button"
                        onClick={() => setMemberStatusFilter('APPROVED')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          memberStatusFilter === 'APPROVED'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#F2F1ED] text-slate-600 hover:bg-[#E8E6E1]'
                        }`}
                      >
                        Sah/Aktif ({users.filter(u => u.status === 'APPROVED' && u.role !== 'PUSAT').length})
                      </button>
                      <button
                        id="btn-filter-status-pending"
                        type="button"
                        onClick={() => setMemberStatusFilter('PENDING_VERIFICATION')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          memberStatusFilter === 'PENDING_VERIFICATION'
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#F2F1ED] text-slate-600 hover:bg-[#E8E6E1]'
                        }`}
                      >
                        Tertunda ({users.filter(u => u.status === 'PENDING_VERIFICATION' && u.role !== 'PUSAT').length})
                      </button>
                      <button
                        id="btn-filter-status-rejected"
                        type="button"
                        onClick={() => setMemberStatusFilter('REJECTED')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                          memberStatusFilter === 'REJECTED'
                            ? 'bg-red-700 text-white'
                            : 'bg-[#F2F1ED] text-slate-600 hover:bg-[#E8E6E1]'
                        }`}
                      >
                        Ditolak/Review ({users.filter(u => u.status === 'REJECTED' && u.role !== 'PUSAT').length})
                      </button>
                    </div>

                    <div className="w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Cari nama, email, gereja..."
                        value={searchMemberQuery}
                        onChange={(e) => setSearchMemberQuery(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Justification Field */}
                  <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans">
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-850 flex items-center gap-1.5 font-serif italic text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Justifikasi Pemulihan / Aktivasi Pusat
                      </span>
                      <p className="text-slate-500 text-[11px]">Masukkan alasan tertulis Anda di bawah. Catatan ini akan dicatat ke audit log keamanan nasional saat Anda menyetujui ulang akun.</p>
                    </div>
                    <input
                      type="text"
                      value={memberJustificationReason}
                      onChange={(e) => setMemberJustificationReason(e.target.value)}
                      placeholder="Masukkan alasan pemulihan akun disini..."
                      className="w-full md:w-1/2 text-xs px-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block px-6 pb-6 overflow-x-auto font-sans">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#1A1A1A]/10 text-slate-400 font-bold uppercase tracking-wider text-[9px] bg-slate-50">
                        <th className="py-3 px-2">Nama Lengkap</th>
                        <th className="py-3 px-2">Posisi / Role</th>
                        <th className="py-3 px-2">Gereja Lokal</th>
                        <th className="py-3 px-2">Jenis Kelamin</th>
                        <th className="py-3 px-2">Status Akun</th>
                        <th className="py-3 px-2 text-right">Opsi Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]/5">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-slate-400 italic">
                            Tidak ditemukan data registrasi akun untuk status filter ini.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(u => {
                          const church = churches.find(c => c.id === u.churchId);
                          return (
                            <tr key={u.id} className="hover:bg-slate-50/70">
                              <td className="py-3 px-2 font-bold text-slate-900 font-sans">
                                <div>{u.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono font-normal">{u.email}</div>
                              </td>
                              <td className="py-3 px-2">
                                <span className="font-semibold text-slate-600 block">{u.role}</span>
                                <span className="text-[10px] text-slate-450">{u.serviceRole || u.officerTitle || '-'}</span>
                              </td>
                              <td className="py-3 px-2 font-medium text-slate-700">{church?.name || 'Belum Terkoneksi'}</td>
                              <td className="py-3 px-2 text-slate-500">{u.gender}</td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  u.status === 'APPROVED' 
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-150' 
                                    : u.status === 'REJECTED' 
                                      ? 'bg-red-50 text-red-800 border border-red-150' 
                                      : 'bg-amber-50 text-amber-805 border border-amber-150'
                                }`}>
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {u.status === 'REJECTED' && (
                                    <button
                                      id={`btn-restore-user-pusat-${u.id}`}
                                      onClick={() => restoreUser(u.id, memberJustificationReason)}
                                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] uppercase font-bold tracking-wider cursor-pointer font-sans shadow-xs transition"
                                      title="Pulihkan & Sahkan Akun"
                                    >
                                      Pulihkan
                                    </button>
                                  )}
                                  {u.status === 'PENDING_VERIFICATION' && (
                                    <button
                                      id={`btn-approve-user-pusat-${u.id}`}
                                      onClick={() => restoreUser(u.id, 'Disetujui langsung oleh Pusat Sinode')}
                                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] uppercase font-bold tracking-wider cursor-pointer font-sans shadow-xs transition"
                                      title="Konfirmasi & Sahkan"
                                    >
                                      Sahkan
                                    </button>
                                  )}
                                  <button
                                    id={`btn-delete-user-pusat-${u.id}`}
                                    onClick={() => {
                                      if (window.confirm(`Hapus permanen akun ${u.name}? Akun tidak akan dapat dikembalikan lagi.`)) {
                                        deleteUser(u.id);
                                      }
                                    }}
                                    className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded text-[10px] font-bold cursor-pointer font-sans transition"
                                    title="Hapus Akun Selamanya"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
                <div className="block md:hidden px-4 pb-6 space-y-4 font-sans">
                  {filteredUsers.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#1A1A1A]/50 italic">Belum ada registrasi untuk status ini.</p>
                  ) : (
                    filteredUsers.map(u => {
                      const church = churches.find(c => c.id === u.churchId);
                      return (
                        <div key={u.id} className="p-4 bg-[#F2F1ED]/35 rounded-2xl border border-[#1A1A1A]/5 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-950 text-sm">{u.name}</h4>
                              <span className="text-[10px] text-slate-500 font-mono block break-all">{u.email}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              u.status === 'APPROVED' 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-150' 
                                : u.status === 'REJECTED' 
                                  ? 'bg-red-50 text-red-800 border border-red-150' 
                                  : 'bg-amber-50 text-amber-805 border border-amber-100'
                            }`}>
                              {u.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#1A1A1A]/5">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans block">Role / Posisi</span>
                              <span className="font-semibold text-slate-750 block">{u.role}</span>
                              <span className="text-[9.5px] text-slate-550">{u.serviceRole || u.officerTitle || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans block">Gereja Lokal</span>
                              <span className="font-semibold text-slate-750 block truncate">{church?.name || 'Belum Terkoneksi'}</span>
                            </div>
                          </div>

                          <div className="flex justify-end gap-1.5 pt-3 border-t border-[#1A1A1A]/5">
                            {u.status === 'REJECTED' && (
                              <button
                                id={`btn-mob-restore-${u.id}`}
                                onClick={() => restoreUser(u.id, memberJustificationReason)}
                                className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                              >
                                Pulihkan Akun
                              </button>
                            )}
                            {u.status === 'PENDING_VERIFICATION' && (
                              <button
                                id={`btn-mob-approve-${u.id}`}
                                onClick={() => restoreUser(u.id, 'Disetujui langsung oleh Pusat Sinode')}
                                className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg text-[10px] uppercase cursor-pointer"
                              >
                                Sahkan Akun
                              </button>
                            )}
                            <button
                              id={`btn-mob-delete-${u.id}`}
                              onClick={() => {
                                if (window.confirm(`Hapus permanen ${u.name}?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })()}

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

                  <div className="p-4 bg-white/60 border border-emerald-100 rounded-xl text-neutral-600 text-xs leading-relaxed space-y-3 font-sans">
                    <div>
                      <div className="font-bold text-[#1A1A1A]">Pernyataan Auditor Hukum Pusat:</div>
                      <p>Setelah melakukan pemeriksaan silang terhadap nomor registrasi kemenag <span className="font-mono font-bold text-emerald-800">{selectedProposal.permitNumber}</span> dan menetapkan legalitas Kemitraan, administrator pusat menyatakan berkas ini layak untuk diaktifkan.</p>
                    </div>

                    <div className="space-y-1 pt-1.5 border-t border-slate-100">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                        Alasan & Pertimbangan Verifikasi (Wajib Diisi):
                      </label>
                      <input
                        type="text"
                        id="input-audit-reason"
                        value={churchActionReason}
                        onChange={(e) => setChurchActionReason(e.target.value)}
                        placeholder="Contoh: Dokumen pendaftaran lengkap dan legalitas Kemenag terverifikasi"
                        className="w-full px-3 py-2 bg-white border border-[#1A1A1A]/10 rounded-lg text-xs text-[#1A1A1A] focus:outline-none focus:border-emerald-600 font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-3">
                    <button
                      id={`btn-deny-dossier-${selectedProposal.id}`}
                      onClick={() => {
                        verifyChurch(selectedProposal.id, 'REJECTED', churchActionReason || 'Berkas dilarang karena ketidaklengkapan data');
                        setReviewProposalId(null);
                        setChurchActionReason('Verifikasi berkas administratif Kemenag lengkap dan sah');
                      }}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs rounded-full font-bold cursor-pointer"
                    >
                      <XCircle className="h-4 w-4 inline mr-1" /> Tolak Berkas Dokumen
                    </button>
                    <button
                      id={`btn-approve-dossier-${selectedProposal.id}`}
                      onClick={() => {
                        verifyChurch(selectedProposal.id, 'APPROVED', churchActionReason || 'Verifikasi berkas administratif Kemenag lengkap dan sah');
                        setReviewProposalId(null);
                        setChurchActionReason('Verifikasi berkas administratif Kemenag lengkap dan sah');
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

          {activeView === 'audit_logs' && (
            <div id="audit-logs-view-panel" className="bg-white rounded-3xl p-6 border border-[#1A1A1A]/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="font-serif italic text-xl text-[#1A1A1A] flex items-center gap-2">
                    <Shield className="h-5 w-5 text-indigo-700" />
                    Histori Aksi & Justifikasi Pertimbangan
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">Daftar rekapan real-time atas seluruh penyerahan, penolakan, verifikasi pusat/lokal, program kerja, serta mutasi keuangan dalam sistem.</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40 block">Total Tindakan</span>
                  <span className="text-lg font-serif italic font-bold text-indigo-800">{actionLogs ? actionLogs.length : 0} Rekaman</span>
                </div>
              </div>

              <div className="space-y-4 font-sans">
                {(!actionLogs || actionLogs.length === 0) ? (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    Belum ada tindakan administratif terdata dalam sistem ini.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {actionLogs.map((log: any) => {
                      const dateFormatted = new Date(log.timestamp).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      let actionTagBg = 'bg-slate-100 text-slate-700 border-slate-200';
                      if (log.actionType.includes('GEREJA')) actionTagBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                      else if (log.actionType.includes('ANGGOTA')) actionTagBg = 'bg-sky-50 text-sky-700 border-sky-200';
                      else if (log.actionType.includes('KEUANGAN')) actionTagBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      else if (log.actionType.includes('AGENDA')) actionTagBg = 'bg-amber-50 text-amber-700 border-amber-200';
                      else if (log.actionType.includes('ABSENSI')) actionTagBg = 'bg-rose-50 text-rose-700 border-rose-200';

                      return (
                        <div 
                          key={log.id} 
                          className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 bg-[#F2F1ED]/10 transition-all text-xs flex flex-col md:flex-row justify-between gap-4"
                        >
                          <div className="space-y-2 max-w-xl">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider border uppercase ${actionTagBg}`}>
                                {log.actionType}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="font-mono text-slate-500 font-bold">{dateFormatted}</span>
                            </div>

                            <p className="text-slate-900 font-bold leading-relaxed font-sans mt-0.5">
                              Target Aksi: <span className="text-indigo-900 font-serif font-bold italic">{log.targetName}</span>
                            </p>

                            <div className="p-2.5 bg-[#F2F1ED]/40 border border-slate-150 rounded-xl space-y-1">
                              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Catatan Pertimbangan / Alasan:</div>
                              <p className="text-slate-700 font-sans leading-relaxed italic">"{log.reason}"</p>
                            </div>
                          </div>

                          <div className="md:text-right flex flex-col justify-between shrink-0 space-y-2 border-t md:border-t-0 border-[#1A1A1A]/5 pt-2 md:pt-0">
                            <div>
                              <span className="text-[10px] block text-slate-400">Kasir / Aktor:</span>
                              <span className="font-bold text-[#1A1A1A] block">{log.actorName}</span>
                              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-1 rounded inline-block mt-0.5">{log.actorRole}</span>
                            </div>

                            <div>
                              <span className={`px-2 py-1 rounded inline-block font-sans text-[10px] font-bold ${
                                log.status === 'APPROVED' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : log.status === 'REJECTED' 
                                    ? 'bg-red-50 text-red-700 border border-red-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {log.status === 'APPROVED' ? 'Disetujui ✓' : log.status === 'REJECTED' ? 'Ditolak ✗' : 'Menunggu •'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
