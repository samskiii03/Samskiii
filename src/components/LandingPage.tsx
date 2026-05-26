import React, { useState } from 'react';
import { useMetaConnect } from '../context/MetaConnectContext';
import { Shield, Users, Landmark, BookOpen, Key, Calendar, Mail, User, Phone, MapPin, Sparkles, Check, Info } from 'lucide-react';

export default function LandingPage() {
  const { churches, users, login, registerChurch, registerUser, globalSettings } = useMetaConnect();
  
  const [activeTab, setActiveTab] = useState<'login' | 'reg-user' | 'reg-church'>('login');
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Register User states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [userGender, setUserGender] = useState('Laki-laki');
  const [userAddress, setUserAddress] = useState('');
  const [userChurch, setUserChurch] = useState('');
  const [userServiceRole, setUserServiceRole] = useState('Jemaat Biasa');
  const [userRole, setUserRole] = useState<'JEMAAT' | 'PENGURUS'>('JEMAAT');
  const [userPass, setUserPass] = useState('');
  const [userRegSuccess, setUserRegSuccess] = useState(false);

  // Register Church states
  const [chName, setChName] = useState('');
  const [chAddress, setChAddress] = useState('');
  const [chPermit, setChPermit] = useState('');
  const [chLogo, setChLogo] = useState('');
  const [chPastorName, setChPastorName] = useState('');
  const [chPastorEmail, setChPastorEmail] = useState('');
  const [chPastorPass, setChPastorPass] = useState('');
  const [chRegSuccess, setChRegSuccess] = useState(false);

  // Pre-seed search of approved churches
  const approvedChurches = churches.filter(c => c.status === 'APPROVED');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!loginEmail || !loginPass) {
      setLoginError('Silakan isi email dan kata sandi Anda.');
      return;
    }

    const res = login(loginEmail, loginPass);
    if (res.success) {
      setLoginSuccess(res.message);
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone || !userChurch || !userPass) {
      alert('Mohon lengkapi seluruh kolom formulir.');
      return;
    }

    registerUser({
      name: userName,
      email: userEmail,
      phone: userPhone,
      birthDate: userBirth,
      address: userAddress,
      gender: userGender as 'Laki-laki' | 'Perempuan',
      role: userRole,
      churchId: userChurch,
      serviceRole: userServiceRole,
      password: userPass
    });

    setUserRegSuccess(true);
    setTimeout(() => {
      setUserRegSuccess(false);
      setActiveTab('login');
      // pre-fill login
      setLoginEmail(userEmail);
      setLoginPass(userPass);
    }, 4000);

    // clear states
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setUserBirth('');
    setUserAddress('');
    setUserPass('');
  };

  const handleRegisterChurch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chName || !chAddress || !chPermit || !chPastorName || !chPastorEmail || !chPastorPass) {
      alert('Mohon lengkapi berkas pendaftaran gereja lokal baru.');
      return;
    }

    const defaultLogoUrl = chLogo || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=200';

    registerChurch({
      name: chName,
      address: chAddress,
      permitNumber: chPermit,
      logoUrl: defaultLogoUrl,
      pastorName: chPastorName,
      pastorEmail: chPastorEmail,
    }, chPastorEmail, chPastorPass);

    setChRegSuccess(true);
    setTimeout(() => {
      setChRegSuccess(false);
      setActiveTab('login');
      setLoginEmail(chPastorEmail);
      setLoginPass(chPastorPass);
    }, 4000);

    // clear
    setChName('');
    setChAddress('');
    setChPermit('');
    setChLogo('');
    setChPastorName('');
    setChPastorEmail('');
    setChPastorPass('');
  };

  return (
    <div id="landing-page" className={`min-h-screen pb-16 transition-colors duration-500 ${
      globalSettings?.backgroundStyle === 'cool' ? 'bg-[#F2F5F8] text-[#1e293b]' :
      globalSettings?.backgroundStyle === 'dark' ? 'bg-[#121212] text-[#E8E6E1]' : 
      globalSettings?.backgroundStyle === 'classic' ? 'bg-[#F7F6F0] text-[#1A1A1A]' : 'bg-[#F9F8F6] text-[#1A1A1A]'
    }`}>
      
      {/* Hero Header Jumbotron */}
      <div className={`relative overflow-hidden pt-16 pb-20 px-6 border-b transition-colors duration-500 ${
        globalSettings?.backgroundStyle === 'cool' ? 'bg-[#E1EAF2] border-[#1e293b]/10' :
        globalSettings?.backgroundStyle === 'dark' ? 'bg-[#1C1C1C] border-[#E8E6E1]/10' :
        globalSettings?.backgroundStyle === 'classic' ? 'bg-[#EFEDE6] border-[#1A1A1A]/10' : 'bg-white border-[#1A1A1A]/10'
      }`}>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#E8E6E1]/80 text-[#1A1A1A] mb-6 text-[10px] font-bold tracking-widest uppercase">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>{globalSettings?.heroBadge || 'KONEKTIVITAS GEREJA TERSEGMENTASI'}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight max-w-4xl mx-auto leading-tight">
            {globalSettings?.title || <>Menghubungkan Pelayanan dengan Satu Ketukan Melalui <span className="italic opacity-60">Meta Connect</span></>}
          </h1>
          
          <p className="mt-6 text-sm md:text-base opacity-70 max-w-2xl mx-auto leading-relaxed">
            {globalSettings?.subtitle || 'Platform manajemen gereja modern terintegrasi berdasar peran. Meningkatkan keaktifan, transparansi keuangan, dan tata kelola jemaat dalam satu ekosistem terpadu.'}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={() => { setActiveTab('reg-user'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="bg-[#1A1A1A] hover:bg-opacity-90 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-xs cursor-pointer"
            >
              Registrasi Jemaat
            </button>
            <button 
              onClick={() => { setActiveTab('reg-church'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="bg-white hover:bg-[#F2F1ED] text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition cursor-pointer"
            >
              Daftarkan Gereja Baru
            </button>
          </div>
        </div>
      </div>

      {/* Live Core System Statistics */}
      {(!globalSettings || globalSettings.showStats !== false) && (
        <div className="max-w-7xl mx-auto px-6 -mt-8 mb-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1A1A1A]/10 flex items-center space-x-4 text-[#1A1A1A]">
              <div className="p-3.5 bg-[#E8E6E1]/50 rounded-2xl">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-serif italic">{churches.filter(c => c.status === 'APPROVED').length} Unit</div>
                <div className="text-[10px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest">Gereja Lokal Terintegrasi</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1A1A1A]/10 flex items-center space-x-4 text-[#1A1A1A]">
              <div className="p-3.5 bg-[#E8E6E1]/50 rounded-2xl">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-serif italic">{users.filter(u => u.status === 'APPROVED').length} Jiwa</div>
                <div className="text-[10px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest">Jemaat & Pelayan Aktif</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#1A1A1A]/10 flex items-center space-x-4 text-[#1A1A1A]">
              <div className="p-3.5 bg-[#E8E6E1]/50 rounded-2xl">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-serif italic">100% Aman</div>
                <div className="text-[10px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest">Verifikasi Berjenjang</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Feature Matrix and Login/Register Workspace */}
      <div id="auth-section" className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Structural System details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-3xl font-serif italic text-[#1A1A1A] tracking-tight">
              Sistem Saling-Koneksi Multi-Birokrasi
            </h2>
            <p className="mt-3 text-sm text-[#1A1A1A]/60 leading-relaxed font-sans">
              Meta Connect membagi jalur otorisasi gereja lokal agar tertata akuntabel mulai dari jemaat hingga sinode pusat.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* 1. Lembaga Pusat Block */}
            <div className="flex space-x-4 p-5 bg-white rounded-3xl border border-[#1A1A1A]/10 shadow-xs text-[#1A1A1A]">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#E8E6E1]/40 text-[#1A1A1A]">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">1. Otoritas Pusat (Verifikator Global)</h4>
                <p className="text-xs opacity-70 mt-1 leading-relaxed">
                  {globalSettings?.promoText1 || 'Memeriksa kelayakan pendaftaran gereja lokal baru, menerbitkan legalitas akun Gembala, dan memantau analitik statistik perkembangan pertumbuhan jemaat secara makro.'}
                </p>
              </div>
            </div>

            {/* 2. Gembala Sidang Block */}
            <div className="flex space-x-4 p-5 bg-white rounded-3xl border border-[#1A1A1A]/10 shadow-xs text-[#1A1A1A]">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#E8E6E1]/40 text-[#1A1A1A]">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">2. Gembala Sidang Lokal</h4>
                <p className="text-xs opacity-70 mt-1 leading-relaxed">
                  {globalSettings?.promoText2 || 'Memegang pimpinan tertinggi lokal, melantik & mendelegasikan wewenang keuangan kepada Bendahara, menyetujui log absensi Sekretaris, serta memublikasikan renungan harian rohani.'}
                </p>
              </div>
            </div>

            {/* 3. Pengurus Gereja Block */}
            <div className="flex space-x-4 p-5 bg-white rounded-3xl border border-[#1A1A1A]/10 shadow-xs text-[#1A1A1A]">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#E8E6E1]/40 text-[#1A1A1A]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">3. Staff Pengurus (Sekretaris & Bendahara)</h4>
                <p className="text-xs opacity-70 mt-1 leading-relaxed">
                  {globalSettings?.promoText3 || 'Bendahara mengentri pendapatan & belanja operasional. Sekretaris melakukan rekam presensi komitmen pelayan minggu ibadah. Semua entri dikirim langsung ke persetujuan Gembala.'}
                </p>
              </div>
            </div>

            {/* 4. Jemaat Block */}
            <div className="flex space-x-4 p-5 bg-white rounded-3xl border border-[#1A1A1A]/10 shadow-xs text-[#1A1A1A]">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#E8E6E1]/40 text-[#1A1A1A]">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">4. Jemaat & Pelayan Pelayanan</h4>
                <p className="text-xs opacity-70 mt-1 leading-relaxed">
                  {globalSettings?.promoText4 || 'Mendapatkan santapan rohani harian, memantau rincian tugas pelayanan hari Minggu, mengajukan permohonan doa, dan memberikan feedback saran demi keterbukaan gereja.'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right column: Form portal box */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#1A1A1A]/10 p-6 md:p-8 relative shadow-sm">
          
          {/* Workspace Tabs Header */}
          <div className="flex border-b border-slate-200 pb-px mb-6 justify-between gap-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-3 text-xs uppercase tracking-widest font-bold transition shrink-0 ${
                activeTab === 'login' 
                  ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => setActiveTab('reg-user')}
              className={`pb-3 text-xs uppercase tracking-widest font-bold transition shrink-0 ${
                activeTab === 'reg-user' 
                  ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Daftar Jemaat
            </button>
            <button
              onClick={() => setActiveTab('reg-church')}
              className={`pb-3 text-xs uppercase tracking-widest font-bold transition shrink-0 ${
                activeTab === 'reg-church' 
                  ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Daftar Gereja
            </button>
          </div>

          {/* Form rendered depending on active Tab */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Pintu Masuk Integrasi</span>
                <h3 className="text-xl font-serif italic text-[#1A1A1A]">Mulai Bertransaksi Sehat</h3>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                  {loginError}
                </div>
              )}
              {loginSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-100 font-medium">
                  {loginSuccess}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Alamat Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="input-login-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:border-[#1A1A1A] bg-[#F2F1ED]/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Key className="h-4 w-4" />
                  </span>
                  <input
                    id="input-login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#1A1A1A]/15 rounded-lg focus:outline-none focus:border-[#1A1A1A] bg-[#F2F1ED]/50"
                  />
                </div>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-widest shadow transition mt-2 cursor-pointer"
              >
                Masuk ke Aplikasi
              </button>

              <div className="pt-4 border-t border-slate-100 mt-6 bg-[#F2F1ED]/40 p-4 rounded-xl text-[11px] space-y-1.5 text-slate-600 font-sans">
                <div className="font-bold uppercase tracking-wider text-xs text-[#1A1A1A]/80 mb-1">Petunjuk Demo</div>
                <div>• Pusat: <code className="bg-white px-1.5 py-0.5 border border-slate-250 rounded font-mono text-[10px]">admin@metaconnect.org</code> (pass: <code className="bg-white px-1.5 py-0.5 border border-slate-250 rounded font-mono text-[10px]">admin</code>)</div>
                <div>• Gembala Bethel: <code className="bg-white px-1.5 py-0.5 border border-slate-250 rounded font-mono text-[10px]">budi@metaconnect.org</code> (pass: <code className="bg-white px-1.5 py-0.5 border border-slate-250 rounded font-mono text-[10px]">budi</code>)</div>
                <div>• Bendahara Bethel: <code className="bg-white px-1.5 py-0.5 border border-slate-250 rounded font-mono text-[10px]">anton@metaconnect.org</code> (pass: <code className="bg-white px-1.5 py-0.5 border border-slate-250 rounded font-mono text-[10px]">anton</code>)</div>
              </div>
            </form>
          )}

          {activeTab === 'reg-user' && (
            <form onSubmit={handleRegisterUser} className="space-y-4">
              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Formulir Jemaat & Pelayan</span>
                <h3 className="text-xl font-serif italic text-[#1A1A1A]">Daftar Akun Anggota</h3>
                <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">Pendaftaran memerlukan verifikasi tatap muka / administratif oleh Gembala Sidang terkait agar berstatus Aktif.</p>
              </div>

              {userRegSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-100 flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Registrasi Berhasil! Data jemaat terkirim langsung ke Gembala Sidang. Mempersiapkan login...</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Nama Lengkap</label>
                  <input
                    id="reg-user-name"
                    type="text"
                    required
                    placeholder="Budi Setiawan"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Surel (Email)</label>
                  <input
                    id="reg-user-email"
                    type="email"
                    required
                    placeholder="budi@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Telepon / WA</label>
                  <input
                    id="reg-user-phone"
                    type="text"
                    required
                    placeholder="0812345678"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Tanggal Lahir</label>
                  <input
                    id="reg-user-birth"
                    type="date"
                    required
                    value={userBirth}
                    onChange={(e) => setUserBirth(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Jenis Kelamin</label>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none appearance-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Gereja Lokal</label>
                  <select
                    id="reg-user-church"
                    required
                    value={userChurch}
                    onChange={(e) => setUserChurch(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-[#1A1A1A]/15 bg-white text-[#1A1A1A] rounded focus:border-[#1A1A1A] focus:outline-none text-emerald-700 font-bold"
                  >
                    <option value="">-- Pilih Gereja --</option>
                    {approvedChurches.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Wewenang Posisi</label>
                  <select
                    value={userRole}
                    onChange={(e) => {
                      const sel = e.target.value as 'JEMAAT' | 'PENGURUS';
                      setUserRole(sel);
                      setUserServiceRole(sel === 'PENGURUS' ? 'Staf Pelayanan Umum' : 'Jemaat Biasa');
                    }}
                    className="w-full px-2 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none appearance-none"
                  >
                    <option value="JEMAAT">Jemaat Lokal / Pelayan</option>
                    <option value="PENGURUS">Staf Kantor Pengurus</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Spesialisasi Pelayanan</label>
                  <input
                    type="text"
                    placeholder="Singer, Pemusik, dll"
                    value={userServiceRole}
                    onChange={(e) => setUserServiceRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Alamat Rumah</label>
                <textarea
                  placeholder="Jl. Raya No. 4 Kelurahan..."
                  rows={2}
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Kata Sandi Baru</label>
                <input
                  id="reg-user-password"
                  type="password"
                  required
                  placeholder="Buat sandi mandiri"
                  value={userPass}
                  onChange={(e) => setUserPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                />
              </div>

              <button
                id="btn-reg-user-submit"
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-full text-xs uppercase tracking-widest shadow transition-all mt-2 cursor-pointer"
              >
                Kirim Permohonan Daftar Jemaat
              </button>
            </form>
          )}

          {activeTab === 'reg-church' && (
            <form onSubmit={handleRegisterChurch} className="space-y-4">
              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">Pengurus Sinode / Gembala</span>
                <h3 className="text-xl font-serif italic text-[#1A1A1A]">Daftarkan Jaringan Gereja</h3>
                <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">Mendaftarkan badan gereja mandiri dan data pimpinan Gembala. Ditinjau dan diaktifkan oleh Admin Pusat.</p>
              </div>

              {chRegSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-100 flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Proposal Terkirim! Gereja dalam antrean review Admin Pusat Meta Connect.</span>
                </div>
              )}

              <div className="space-y-3 border-b border-dashed border-slate-250 pb-4">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <Landmark className="h-3.5 w-3.5" /> Identitas Gereja Lokal
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/55">Nama Gereja</label>
                    <input
                      id="reg-church-name"
                      type="text"
                      required
                      placeholder="e.g. GBI Shalom"
                      value={chName}
                      onChange={(e) => setChName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/55">No. Surat Izin / Kemenag</label>
                    <input
                      id="reg-church-permit"
                      type="text"
                      required
                      placeholder="e.g. IG/2026/009"
                      value={chPermit}
                      onChange={(e) => setChPermit(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/55">Alamat Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Jl. Bougenville No.3, Jayawijaya"
                    value={chAddress}
                    onChange={(e) => setChAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70 block">Lampiran File Logo Gereja (Logo Attachment)</label>
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setChLogo(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="border-2 border-dashed border-[#1A1A1A]/20 rounded-xl p-5 text-center hover:border-[#1A1A1A]/50 transition cursor-pointer bg-[#F2F1ED]/30 relative overflow-hidden"
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setChLogo(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {chLogo ? (
                      <div className="space-y-2 flex flex-col items-center relative z-10">
                        <img src={chLogo} alt="Preview Logo" referrerPolicy="no-referrer" className="h-16 w-16 object-cover rounded-lg border border-slate-200" />
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Logo Te-lampir ✓</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setChLogo(''); }}
                          className="text-[10px] text-red-650 hover:text-red-850 font-bold underline"
                        >
                          Hapus Logo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 text-[#1A1A1A]">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Tarik Logo Kemari / Pilih Berkas</div>
                        <div className="text-[10px] opacity-60 font-sans">Mendukung berkas Gambar .png, .jpg (Maks 2MB)</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A]/70 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Gembala Utama (Pastor)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/55">Nama Gembala</label>
                    <input
                      id="reg-church-pastor"
                      type="text"
                      required
                      placeholder="Pdt. Yohanes S.Th."
                      value={chPastorName}
                      onChange={(e) => setChPastorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/55">Email Gembala</label>
                    <input
                      id="reg-church-pastoremail"
                      type="email"
                      required
                      placeholder="pastoryohanes@email.com"
                      value={chPastorEmail}
                      onChange={(e) => setChPastorEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/55">Kata Sandi Akun</label>
                  <input
                    id="reg-church-pastorpassword"
                    type="password"
                    required
                    placeholder="Sandi login Gembala"
                    value={chPastorPass}
                    onChange={(e) => setChPastorPass(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#1A1A1A]/15 bg-[#F2F1ED]/50 rounded focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="btn-reg-church-submit"
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-full text-xs uppercase tracking-widest shadow transition-all mt-2 cursor-pointer"
              >
                Kirim Proposal Pendaftaran Sinode Pusat
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
