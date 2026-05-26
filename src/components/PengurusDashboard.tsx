import React, { useState } from 'react';
import { useMetaConnect } from '../context/MetaConnectContext';
import { 
  Users, Landmark, HelpCircle, DollarSign, Calendar, BookOpen, 
  Check, X, FileText, Send, AlertCircle, PlusCircle, CheckCircle, Plus, 
  Compass, MessageSquare, Trash2, Zap } from 'lucide-react';

export default function PengurusDashboard() {
  const { 
    currentUser, 
    activeChurch, 
    users, 
    agendas, 
    finances, 
    attendance, 
    devotionals, 
    prayers, 
    suggestions,
    proposeAgenda, 
    addFinance, 
    addAttendance,
    addSuggestion,
    addPrayer,
    prayForRequest
  } = useMetaConnect();

  // Navigation Panel sub-tabs
  const [activeTab, setActiveTab ] = useState<'office' | 'common-dev' | 'common-directory' | 'common-prayer' | 'common-sugg'>('office');

  // 1. Ledger entry states (Treasurer)
  const [finType, setFinType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [finCat, setFinCat] = useState<any>('Persepuluhan');
  const [finAm, setFinAm] = useState('');
  const [finDesc, setFinDesc] = useState('');
  const [finDate, setFinDate] = useState(new Date().toISOString().split('T')[0]);
  const [finFeedback, setFinFeedback] = useState('');

  // 2. Attendance log states (Secretary)
  const [attActivity, setAttActivity] = useState('Ibadah Raya Minggu (Mei M5)');
  const [attCount, setAttCount] = useState('');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attServants, setAttServants] = useState<{ [id: string]: boolean }>({});
  const [attFeedback, setAttFeedback] = useState('');

  // 3. Liturgical agenda proposal states (Any Officer)
  const [agTitle, setAgTitle] = useState('');
  const [agDesc, setAgDesc] = useState('');
  const [agDate, setAgDate] = useState(new Date().toISOString().split('T')[0]);
  const [agDiv, setAgDiv] = useState('Pemuda');
  const [agFeedback, setAgFeedback] = useState('');

  // Common Jemaat inputs inside officer view
  const [prayerText, setPrayerText] = useState('');
  const [suggText, setSuggText] = useState('');
  const [suggFeedback, setSuggFeedback] = useState('');

  if (!currentUser || !activeChurch) {
    return <div className="p-10 text-center text-slate-500 font-serif italic text-sm bg-white border border-[#1A1A1A]/10 rounded-2xl max-w-lg mx-auto">Sinkronisasi data gereja...</div>;
  }

  const churchId = activeChurch.id;

  // Permissions validation
  const canManageFinances = currentUser.permissions?.includes('manage_finances') || currentUser.officerTitle === 'Bendahara';
  const canManageAttendance = currentUser.permissions?.includes('manage_attendance') || currentUser.officerTitle === 'Sekretaris';

  // Filters
  const churchUsers = users.filter(u => u.churchId === churchId && u.status === 'APPROVED');
  const localAgendas = agendas.filter(ag => ag.churchId === churchId);
  const localFinances = finances.filter(f => f.churchId === churchId);
  const localAttendance = attendance.filter(at => at.churchId === churchId);
  const localDevotionals = devotionals.filter(d => d.churchId === churchId);
  const localPrayers = prayers.filter(p => p.churchId === churchId);
  const localSuggestions = suggestions.filter(s => s.churchId === churchId && s.target === 'LOCAL');

  // Servers
  const activeServants = churchUsers.filter(u => u.serviceRole && u.serviceRole !== 'Jemaat Biasa');

  // Submit operations
  const handleSubmitFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finAm || !finDesc) {
      alert('Mohon isi nominal rupiah dan deskripsi mutasi kas.');
      return;
    }
    const amt = parseFloat(finAm);
    if (isNaN(amt) || amt <= 0) {
      alert('Format angka rupiah nominal saldo tidak sesuai.');
      return;
    }

    addFinance(finType, finCat, amt, finDesc, finDate);
    setFinFeedback('Sukses mendaftarkan aliran kas keuangan. Menunggu verifikasi Gembala.');
    setFinAm('');
    setFinDesc('');
    setTimeout(() => setFinFeedback(''), 4000);
  };

  const handleToggleServantAtt = (id: string) => {
    setAttServants(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attCount) {
      alert('Silakan isi jumlah keseluruhan kehadiran jemaat.');
      return;
    }
    const count = parseInt(attCount);
    if (isNaN(count) || count < 0) {
      alert('Jumlah jemaat meleset.');
      return;
    }

    // Capture servant marks
    const participationMap: { [id: string]: boolean } = {};
    activeServants.forEach(s => {
      participationMap[s.id] = !!attServants[s.id];
    });

    addAttendance(attActivity, attDate, count, participationMap);
    setAttFeedback('Log absensi jemaat terkirim mandiri ke Gembala Sidang.');
    setAttCount('');
    setAttServants({});
    setTimeout(() => setAttFeedback(''), 4000);
  };

  const handleSubmitAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agTitle || !agDesc) {
      alert('Silakan lengkapi judul draf agenda.');
      return;
    }

    proposeAgenda(agTitle, agDesc, agDate, agDiv);
    setAgFeedback(`Berhasil mengajukan proposal "${agTitle}". Menunggu persetujuan Gembala.`);
    setAgTitle('');
    setAgDesc('');
    setTimeout(() => setAgFeedback(''), 4500);
  };

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerText) return;
    addPrayer(prayerText, true);
    setPrayerText('');
  };

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggText) return;
    addSuggestion(suggText, 'LOCAL');
    setSuggFeedback('Masukan dikirimkan mandiri ke Gembala Lokal.');
    setSuggText('');
    setTimeout(() => setSuggFeedback(''), 3000);
  };

  // SVGs Charting variables
  const computedApprovedFinances = localFinances.filter(f => f.status === 'APPROVED');
  const sumIncomes = computedApprovedFinances.filter(f => f.type === 'INCOME').reduce((acc, c) => acc + c.amount, 0);
  const sumExpenses = computedApprovedFinances.filter(f => f.type === 'EXPENSE').reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
      
      {/* Officer Command Banner */}
      <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 h-32 w-32 bg-white/5 rounded-full blur-2xl" />
        <div className="space-y-1 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full bg-white/10 text-[#E8E6E1] font-mono text-[9px] tracking-widest uppercase font-bold">
            Pelayan Pengurus Lokal: {currentUser.officerTitle || 'Staff Terakreditasi'}
          </div>
          <h2 className="text-3xl font-serif text-white mt-1.5">{currentUser.name} / {activeChurch.name}</h2>
          <p className="text-xs text-slate-300 max-w-xl font-sans mt-1">
            Tabel rekapitulasi data administratif gereja lokal. Pastikan entri Anda akurat, transparan, dan dapat diverifikasi langsung oleh Gembala Sidang.
          </p>
        </div>

        {/* Global Liturgical Calendar Badge */}
        <div className="text-[10px] bg-black/40 px-5 py-3 rounded-2xl border border-white/10 text-slate-300 tracking-widest font-mono shrink-0 uppercase text-center">
          <div>KALENDER GEREJAWI 2026</div>
          <div className="text-amber-500 font-bold mt-1">Minggu Biasa / Trinitas</div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-[#1A1A1A]/10 overflow-x-auto whitespace-nowrap gap-6 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('office')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'office' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          command center & Statistik
        </button>
        <button
          onClick={() => setActiveTab('common-dev')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'common-dev' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Renungan Harian ({localDevotionals.length})
        </button>
        <button
          onClick={() => setActiveTab('common-directory')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'common-directory' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Informasi Jemaat ({churchUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('common-prayer')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'common-prayer' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Permohonan Doa ({localPrayers.length})
        </button>
        <button
          onClick={() => setActiveTab('common-sugg')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'common-sugg' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Kritik & Saran Lokal ({localSuggestions.length})
        </button>
      </div>

      {/* RENDER PAGES depending on active tab navbar */}
      {activeTab === 'office' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SPECIALIZED WORKSPACE FOR TREASURER/SECRETARY - LEFT (COL-8) */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* 1. TREASURER PENAL */}
              <div className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif italic font-bold text-[#1A1A1A] text-lg flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-[#1A1A1A]" />
                    Pencatatan Kas Bendahara
                  </h3>
                  <p className="text-xs text-slate-400">Gunakan form ini untuk mendokumentasikan mutasi kas masuk/keluar.</p>
                </div>

                {canManageFinances ? (
                  <form onSubmit={handleSubmitFinance} className="space-y-4 font-sans text-xs">
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Aliran Dana</label>
                        <select
                          value={finType}
                          onChange={(e) => setFinType(e.target.value as any)}
                          className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-white font-medium focus:outline-none"
                        >
                          <option value="INCOME">Kas Masuk (+)</option>
                          <option value="EXPENSE">Kas Keluar (-)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Kategori Kas</label>
                        <select
                          value={finCat}
                          onChange={(e) => setFinCat(e.target.value as any)}
                          className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-white text-slate-700 focus:outline-none"
                        >
                          {finType === 'INCOME' ? (
                            <>
                              <option value="Persepuluhan">Persepuluhan Jemaat</option>
                              <option value="Persembahan Kolekte">Persembahan Kolekte</option>
                              <option value="Donasi Khusus">Donasi Khusus Hamba Tuhan</option>
                              <option value="Lain-lain">Pendapatan Lain-lain</option>
                            </>
                          ) : (
                            <>
                              <option value="Pembangunan Kantor">Pembangunan & Renovasi</option>
                              <option value="Operasional Ibadah">Operasional Ibadah / AC</option>
                              <option value="Transport Pembicara">Transport Pembicara</option>
                              <option value="Peralatan Multimedia">Peralatan Multimedia / Singer</option>
                              <option value="Pecah Roti / Perjamuan">Perjamuan Kudus</option>
                              <option value="Lain-lain">Beban Lainnya</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Besaran Rupiah</label>
                        <input
                          id="input-finance-amount"
                          type="number"
                          required
                          placeholder="Rp..."
                          value={finAm}
                          onChange={(e) => setFinAm(e.target.value)}
                          className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-[#F2F1ED]/20 focus:outline-none focus:border-[#1A1A1A]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Tanggal Mutasi</label>
                        <input
                          type="date"
                          required
                          value={finDate}
                          onChange={(e) => setFinDate(e.target.value)}
                          className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-[#F2F1ED]/20 text-slate-700 focus:outline-none focus:border-[#1A1A1A]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Spesifik Catatan Keterangan</label>
                      <input
                        type="text"
                        required
                        placeholder="Keterangan transaksi amplop jemaat..."
                        value={finDesc}
                        onChange={(e) => setFinDesc(e.target.value)}
                        className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>

                    {finFeedback && (
                      <div className="p-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100 rounded-xl">
                        {finFeedback}
                      </div>
                    )}

                    <button
                      id="btn-submit-finance"
                      type="submit"
                      className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-[10px] transition cursor-pointer"
                    >
                      Kirim Mutasi Ke Gembala
                    </button>
                  </form>
                ) : (
                  <div className="p-6 bg-[#F2F1ED]/30 border border-[#1A1A1A]/10 rounded-2xl text-slate-400 text-xs italic text-center font-sans">
                    Menu pengisian aliran kas keuangan eksklusif hanya diizinkan untuk Pengurus berjabatan Bendahara.
                  </div>
                )}
              </div>

              {/* 2. ATTENDANCE LOG PENAL */}
              <div className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif italic font-bold text-[#1A1A1A] text-lg flex items-center gap-1">
                    <CheckCircle className="h-5 w-5 text-[#1A1A1A]" />
                    Presensi Ibadah & Pelayan
                  </h3>
                  <p className="text-xs text-slate-400">Sekretaris menjurnal kehadiran jemaat & melapor kedinasan pelayan mimbar.</p>
                </div>

                {canManageAttendance ? (
                  <form onSubmit={handleSubmitAttendance} className="space-y-4 font-sans text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Nama Kebaktian / Doa</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ibadah Raya Minggu 2"
                        value={attActivity}
                        onChange={(e) => setAttActivity(e.target.value)}
                        className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Umat Hadir (Jiwa)</label>
                        <input
                          id="input-att-count"
                          type="number"
                          required
                          placeholder="e.g. 150"
                          value={attCount}
                          onChange={(e) => setAttCount(e.target.value)}
                          className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-[#F2F1ED]/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Tanggal Ibadah</label>
                        <input
                          type="date"
                          required
                          value={attDate}
                          onChange={(e) => setAttDate(e.target.value)}
                          className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl focus:outline-none bg-[#F2F1ED]/20"
                        />
                      </div>
                    </div>

                    {/* Servants checkbox logs */}
                    <div className="space-y-1.5 border border-[#1A1A1A]/10 p-3 rounded-2xl bg-[#F2F1ED]/25 max-h-36 overflow-hidden flex flex-col">
                      <label className="font-mono text-[9px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest block mb-1">Dinas Pelayan Mimbar Hari Ini:</label>
                      
                      <div className="overflow-y-auto space-y-1 flex-grow pr-1 text-xs">
                        {activeServants.map(s => (
                          <label key={s.id} className="flex items-center space-x-2.5 cursor-pointer py-1 hover:bg-[#F2F1ED]/50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={!!attServants[s.id]}
                              onChange={() => handleToggleServantAtt(s.id)}
                              className="rounded border-[#1A1A1A]/20 text-[#1A1A1A] focus:ring-[#1A1A1A]"
                            />
                            <span className="text-[11px] text-[#1A1A1A] font-bold truncate">
                              {s.name} <span className="font-normal text-slate-400 text-[10px]">({s.serviceRole})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {attFeedback && (
                      <div className="p-3 bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-100 rounded-xl font-bold text-center">
                        {attFeedback}
                      </div>
                    )}

                    <button
                      id="btn-submit-attendance"
                      type="submit"
                      className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-widest transition cursor-pointer"
                    >
                      Kirim Presensi Ke Gembala
                    </button>
                  </form>
                ) : (
                  <div className="p-6 bg-[#F2F1ED]/30 border border-[#1A1A1A]/10 rounded-2xl text-slate-400 text-xs italic text-center">
                    Menu presensi ibadah raya eksklusif hanya diizinkan untuk Pengurus berjabatan Sekretaris.
                  </div>
                )}
              </div>

            </div>

            {/* INTEGRATED CHURCH ANALYTICAL PROGRESS CHARTS */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-6 shadow-xs">
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#1A1A1A]">Laporan & Progress Jaringan Gereja</h3>
                <p className="text-xs text-slate-400">Rasio alokasi keuangan jemaat yang dihitung dari aliran kas tervalidasi Gembala.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* SVG Visual Expense vs Income Doughnut Bar representation */}
                <div className="border border-[#1A1A1A]/10 p-5 rounded-2xl bg-[#F2F1ED]/10 space-y-4">
                  <span className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono block">Rasio Alokasi Keuangan Kas</span>
                  
                  {sumIncomes === 0 && sumExpenses === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-[10px] italic">Sirkulasi transaksi belum dikonfirmasi Gembala Lokal. Kelola via Gembala.</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-500">Total Arus Masuk</span>
                        <span className="text-emerald-700">Rp {sumIncomes.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-500">Belanja Ops</span>
                        <span className="text-amber-800">Rp {sumExpenses.toLocaleString('id-ID')}</span>
                      </div>

                      {/* Bar graph allocation */}
                      <div className="h-6 w-full bg-[#1A1A1A] rounded-xl overflow-hidden flex shadow-inner">
                        <div 
                          style={{ width: `${(sumIncomes / (sumIncomes + sumExpenses)) * 100}%` }} 
                          className="bg-[#E8E6E1] h-full border-r border-[#1A1A1A]"
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold uppercase">
                        <span>Pemberian ({Math.round((sumIncomes / (sumIncomes + sumExpenses)) * 100)}%)</span>
                        <span>Pengeluaran ({Math.round((sumExpenses / (sumIncomes + sumExpenses)) * 100)}%)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sunday Service Attendees trend line */}
                <div className="border border-[#1A1A1A]/10 p-5 rounded-2xl bg-[#F2F1ED]/10 space-y-3">
                  <span className="text-[10px] font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono block">Monitor Hadir Kebaktian</span>
                  
                  <div className="h-28 w-full relative flex items-end justify-between px-2 pt-4">
                    {/* Grid lines */}
                    <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between py-1 border-b border-[#1A1A1A]/10">
                      <div className="border-b border-dashed border-[#1A1A1A]/5 w-full" />
                      <div className="border-b border-dashed border-[#1A1A1A]/5 w-full" />
                    </div>
                    {localAttendance.filter(at => at.status === 'APPROVED').length === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 italic font-serif">Belum ada rekap ibadah utama disahkan.</div>
                    ) : (
                      localAttendance.filter(at => at.status === 'APPROVED').map((at, idx) => {
                        const pctOfBase = (at.attendanceCount / 200) * 100;
                        return (
                          <div key={at.id} className="flex-1 flex flex-col items-center z-10 relative group">
                            <span className="opacity-0 group-hover:opacity-100 transition absolute -top-6 bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded font-mono">
                              {at.attendanceCount} p
                            </span>
                            <div 
                              style={{ height: `${Math.min(pctOfBase, 100)}%` }} 
                              className="w-6 bg-[#1A1A1A] rounded-t-lg shadow-sm hover:bg-[#1A1A1A]/80 transition-all duration-300"
                            />
                            <span className="text-[9px] text-[#1A1A1A]/50 font-mono mt-1 font-bold">{at.date.slice(5)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* SENDER FOR OTHER PROPOSED AGENDAS */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif italic font-bold text-[#1A1A1A] text-lg flex items-center gap-1.5">
                  <Calendar className="h-5 w-5 text-[#1A1A1A]" />
                  Kirim Pengajuan Agenda Baru (Proposal Kegiatan)
                </h3>
                <p className="text-xs text-slate-400">Rencanakan agenda kategorial pemuda, ibadah raya, atau misi jemaat agar dapat direview Gembala.</p>
              </div>

              <form onSubmit={handleSubmitAgenda} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Judul Rencana Acara</label>
                    <input
                      id="input-agenda-title"
                      type="text"
                      required
                      placeholder="e.g. Camp Pemuda Bethel 2026"
                      value={agTitle}
                      onChange={(e) => setAgTitle(e.target.value)}
                      className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Seksi Kategorial</label>
                    <select
                      value={agDiv}
                      onChange={(e) => setAgDiv(e.target.value)}
                      className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-white focus:outline-none text-[#1A1A1A]"
                    >
                      <option value="Pemuda">Pemuda & Remaja (Youth)</option>
                      <option value="Anak-anak">Sekolah Rakyat (Anak-anak)</option>
                      <option value="Wanita">Keluarga Muda / Wanita</option>
                      <option value="Umum">Ibadah Umum / Raya</option>
                      <option value="Musik">Musik & Multimedia</option>
                      <option value="Misi/Sosial">Misi / Bakti Sosial Jemaat</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Rencana Pelaksanaan</label>
                    <input
                      type="date"
                      required
                      value={agDate}
                      onChange={(e) => setAgDate(e.target.value)}
                      className="w-full p-2.5 border border-[#1A1A1A]/15 rounded-xl focus:outline-none text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Justifikasi Konsep & Estimasi Anggaran</label>
                  <textarea
                    required
                    placeholder="Deskripsikan latar belakang acara, pembicara rencana, sasaran jemaat, dan estimasi biaya..."
                    value={agDesc}
                    onChange={(e) => setAgDesc(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-[#1A1A1A]/15 rounded-xl focus:outline-none focus:border-[#1A1A1A] bg-[#F2F1ED]/25 leading-relaxed"
                  />
                </div>

                {agFeedback && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-100 rounded-xl text-center font-bold">
                    {agFeedback}
                  </div>
                )}

                <button
                  id="btn-submit-agenda"
                  type="submit"
                  className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-xl uppercase tracking-widest text-[10px] transition cursor-pointer"
                >
                  Ajukan Berkas Proposal Ke Gembala
                </button>
              </form>
            </div>

          </div>

          {/* SPREADSHEET TIER LOG AND PROP QUEUE STATUS - RIGHT (GOLDEN RATIO COL-4) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* AGENDAS HISTORY */}
            <div className="bg-white p-5 rounded-3xl border border-[#1A1A1A]/10 space-y-4 shadow-xs text-xs">
              <h4 className="font-bold text-[#1A1A1A]/70 text-[10px] uppercase tracking-widest font-mono border-b border-[#1A1A1A]/10 pb-2.5 flex items-center justify-between">
                <span>Pelacakan Status Proposal</span>
                <span className="font-normal text-slate-400">{localAgendas.length} Proposal</span>
              </h4>

              {localAgendas.length === 0 ? (
                <div className="text-center text-slate-400 text-xs italic py-3">Belum ada agenda diusulkan.</div>
              ) : (
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {localAgendas.map(ag => (
                    <div key={ag.id} className="p-3.5 border border-[#1A1A1A]/10 rounded-2xl bg-[#F2F1ED]/20 hover:bg-[#F2F1ED]/35 transition text-xs space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <strong className="text-[#1A1A1A] font-bold text-[13px] leading-tight">{ag.title}</strong>
                        <span className={`px-2 py-0.5 text-[9px] rounded-full font-mono uppercase font-bold text-center shrink-0 ${
                          ag.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : ag.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ag.status === 'APPROVED' ? 'Selesai' : ag.status === 'REJECTED' ? 'Ditolak' : 'Antrean'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">Tgl: {ag.date} | Div: {ag.division}</p>
                      <p className="text-slate-600 line-clamp-2">{ag.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LEDGER MUTATION RECAP STATUS */}
            <div className="bg-white p-5 rounded-3xl border border-[#1A1A1A]/10 space-y-4 shadow-xs text-xs">
              <h4 className="font-bold text-[#1A1A1A]/70 text-[10px] uppercase tracking-widest font-mono border-b border-[#1A1A1A]/10 pb-2.5">
                Log Entri Mutasi Kas Terkini:
              </h4>

              {localFinances.length === 0 ? (
                <div className="text-center text-slate-400 text-xs italic py-3">Buku kas jemaat masih kosong.</div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {localFinances.slice().reverse().map(f => (
                    <div key={f.id} className="p-3 border border-[#1A1A1A]/10 rounded-2xl flex justify-between items-center bg-[#F2F1ED]/10 text-xs gap-2">
                      <div>
                        <div className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                          <span className={`h-2   w-2 rounded-full ${f.type === 'INCOME' ? 'bg-emerald-600' : 'bg-amber-700'}`} />
                          {f.category}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{f.date} | Oleh: {f.inputBy}</div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <div className="font-bold text-[#1A1A1A]">Rp {f.amount.toLocaleString('id-ID')}</div>
                        <span className={`text-[9px] font-mono font-bold uppercase ${
                          f.status === 'APPROVED' ? 'text-emerald-700' : f.status === 'REJECTED' ? 'text-red-700' : 'text-amber-700'
                        }`}>
                          {f.status === 'APPROVED' ? 'Disahkan' : f.status === 'REJECTED' ? 'Ditolak' : 'Antrean'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* RENDER DYNAMIC READING PAGES IN DETAILED BLOCKS */}
      {activeTab === 'common-dev' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif text-[#1A1A1A]">Renungan & Penafsiran Firman Harian</h3>
            <p className="text-xs text-slate-400">Terbit langsung dari meja penulisan pastoral Gembala Sidang untuk asupan iman jemaat.</p>
          </div>

          {localDevotionals.length === 0 ? (
            <div className="p-10 text-center bg-white border border-[#1A1A1A]/10 rounded-3xl text-slate-400 italic text-xs shadow-xs">Belum ada renungan harian diterbitkan oleh Gembala. Silakan beralih ke Gembala di simulator atas untuk meluncurkan satu draf!</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {localDevotionals.map(dev => (
                <div key={dev.id} className="bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 shadow-xs space-y-4">
                  <div className="border-b border-[#1A1A1A]/10 pb-3">
                    <span className="text-[10px] font-mono tracking-wider text-amber-800 block uppercase font-bold">{dev.date} | Oleh: {dev.writtenBy}</span>
                    <h4 className="text-lg font-serif font-bold text-[#1A1A1A] mt-1">{dev.title}</h4>
                  </div>
                  <div className="p-4 bg-[#F2F1ED]/40 border-l-4 border-[#1A1A1A] text-xs italic text-slate-800 leading-relaxed rounded-2xl font-serif">
                    <strong>{dev.ref}</strong> - "{dev.verseText}"
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify">
                    {dev.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'common-directory' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif text-[#1A1A1A]">Informasi Jemaat & Direktori Pelayan</h3>
            <p className="text-xs text-slate-400">Database kependudukan jemaat terverifikasi di bawah pengampuan gereja lokal Meta Connect.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {churchUsers.map(u => (
              <div key={u.id} className="p-4.5 border border-[#1A1A1A]/10 rounded-2xl hover:bg-[#F2F1ED]/10 transition text-xs space-y-2 bg-[#F2F1ED]/20 shadow-2xs">
                <div>
                  <div className="font-bold text-base text-[#1A1A1A] truncate">{u.name}</div>
                  <div className="text-[9px] text-[#1A1A1A]/60 font-mono font-bold uppercase tracking-wider mt-0.5">{u.serviceRole || 'JEMAAT UMUM'}</div>
                </div>
                <div className="text-slate-500 text-[10px] font-mono leading-none">{u.gender} | {u.phone}</div>
                <div className="text-[10px] text-slate-400 block pt-2 border-t border-[#1A1A1A]/10">Alamat: {u.address}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'common-prayer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif text-[#1A1A1A]">Dukung dalam Doa (Syafaat Jemaat)</h3>
              <p className="text-xs text-slate-400">Tekan tombol 'Aminkan' untuk bersatu hati mendoakan saudara seiman.</p>
            </div>
            
            <div className="space-y-4 divide-y divide-[#1A1A1A]/10">
              {localPrayers.filter(p => p.isPublic).length === 0 ? (
                <div className="p-4 text-center text-slate-400 italic text-xs">Belum ada permohonan doa publik.</div>
              ) : (
                localPrayers.filter(p => p.isPublic).map(p => {
                  const hasPr = p.aminkanList.includes(currentUser.id);
                  return (
                    <div key={p.id} className="pt-4 first:pt-0 space-y-3 text-xs">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span className="font-bold text-[#1A1A1A]/80">{p.userName}</span>
                        <span>{new Date(p.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <p className="text-[#1A1A1A]/90 font-serif italic text-base leading-relaxed">"{p.requestText}"</p>
                      
                      <div className="flex justify-between items-center pt-2.5 text-[10px] gap-2">
                        <span className="text-slate-500 font-mono font-bold uppercase tracking-wider">Didukung: <strong className="text-[#1A1A1A]">{p.aminkanList.length} umat</strong></span>
                        <button
                          onClick={() => prayForRequest(p.id)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                            hasPr ? 'bg-emerald-100 text-emerald-800' : 'bg-[#1A1A1A] text-white hover:bg-opacity-90 shadow-xs'
                          }`}
                        >
                          {hasPr ? '✓ Teraminkan' : '🙏 Aminkan'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ADD PRIVATE REQUEST */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 space-y-4 text-xs font-sans shadow-xs">
            <h4 className="font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono text-[10px]">Ajukan Kebutuhan Doa</h4>
            
            <form onSubmit={handleAddPrayer} className="space-y-4">
              <textarea
                required
                placeholder="Tuliskan kebutuhan bimbingan atau permohonan syafaat secara langsung di sini..."
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                rows={4}
                className="w-full border border-[#1A1A1A]/15 rounded-xl p-3 focus:outline-none focus:border-[#1A1A1A] bg-[#F2F1ED]/20 text-[#1A1A1A]"
              />
              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer"
              >
                Kirim ke Syafaat Umum
              </button>
            </form>
          </div>

        </div>
      )}

      {activeTab === 'common-sugg' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-5 shadow-xs">
            <h3 className="text-2xl font-serif text-[#1A1A1A]">Arus Kritik & Saran Jemaat Biasa</h3>
            <p className="text-xs text-slate-400">Masukan yang diinventarisasi jemaat umum untuk perbaikan persekutuan internal gereja.</p>
            
            <div className="space-y-4 divide-y divide-[#1A1A1A]/10">
              {localSuggestions.length === 0 ? (
                <div className="p-4 text-center text-slate-400 italic text-xs">Tidak ada saran kritik terekam belakangan ini.</div>
              ) : (
                localSuggestions.map(s => (
                  <div key={s.id} className="pt-4 first:pt-0 space-y-2 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-[#1A1A1A]/70">Oleh: {s.userName}</span>
                      <span>{new Date(s.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p className="text-slate-700 italic font-serif text-sm">"{s.message}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SENDER BOX */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 space-y-4 text-xs font-sans shadow-xs">
            <h4 className="font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono text-[10px]">Input Masukan Konstruktif</h4>
            
            <form onSubmit={handleAddSuggestion} className="space-y-4">
              <textarea
                required
                placeholder="Berikan saran untuk pengembangan fasilitas fisik atau sarana digital gereja lokal..."
                value={suggText}
                onChange={(e) => setSuggText(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 border border-[#1A1A1A]/15 rounded-xl bg-[#F2F1ED]/20 focus:outline-none"
              />
              {suggFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold rounded-xl">
                  {suggFeedback}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 rounded-xl uppercase tracking-widest cursor-pointer transition shadow-xs"
              >
                Kirim Saran Kritik
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
