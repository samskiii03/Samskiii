import React, { useState } from 'react';
import { useMetaConnect } from '../context/MetaConnectContext';
import { 
  Award, Users, CheckCircle, XCircle, DollarSign, Calendar, BookOpen, UserPlus, 
  Clock, Check, ShieldCheck, ArrowUpRight, Zap, Play, Lock, Trash2, Key, Sparkles
} from 'lucide-react';

export default function GembalaDashboard() {
  const { 
    currentUser, 
    activeChurch, 
    users, 
    agendas, 
    finances, 
    attendance, 
    devotionals, 
    suggestions,
    verifyUser, 
    approveAgenda, 
    approveFinance, 
    approveAttendance,
    addOfficer,
    removeOfficerAccess,
    addLocalDevotional
  } = useMetaConnect();

  const [activeSubTab, setActiveSubTab] = useState<'approvals' | 'activity' | 'devotional' | 'staff'>('approvals');

  // Devotional form state
  const [devTitle, setDevTitle] = useState('');
  const [devRef, setDevRef] = useState('');
  const [devText, setDevText] = useState('');
  const [devContent, setDevContent] = useState('');
  const [devFeedback, setDevFeedback] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // New Officer Selector states
  const [selectedMemberToUpgrade, setSelectedMemberToUpgrade] = useState('');
  const [selectedOfficerTitle, setSelectedOfficerTitle] = useState('Sekretaris');
  const [staffFeedback, setStaffFeedback] = useState('');

  if (!currentUser || !activeChurch) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white border rounded shadow max-w-xl mx-auto my-12">
        <Clock className="h-10 w-10 text-amber-500 mx-auto animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Menyinkronkan Akun Gereja Lokal...</h3>
        <p className="text-xs text-slate-400 mt-2">Pastikan gereja lokal Anda sudah berstatus Verified oleh Sinode Pusat agar dapat diadministrasikan.</p>
      </div>
    );
  }

  const churchId = activeChurch.id;

  // 1. Data Filter
  const churchUsers = users.filter(u => u.churchId === churchId);
  const approvedUsers = churchUsers.filter(u => u.status === 'APPROVED');
  const pendingUsers = churchUsers.filter(u => u.status === 'PENDING_VERIFICATION');

  const churchAgendas = agendas.filter(ag => ag.churchId === churchId);
  const pendingAgendas = churchAgendas.filter(ag => ag.status === 'PENDING');

  const churchFinances = finances.filter(f => f.churchId === churchId);
  const pendingFinances = churchFinances.filter(f => f.status === 'PENDING');

  const churchAttendance = attendance.filter(at => at.churchId === churchId);
  const pendingAttendance = churchAttendance.filter(at => at.status === 'PENDING');

  const localSuggestions = suggestions.filter(s => s.churchId === churchId && s.target === 'LOCAL');

  // Math totals
  const totalApprovedFinances = churchFinances.filter(f => f.status === 'APPROVED');
  const totalIncome = totalApprovedFinances.filter(f => f.type === 'INCOME').reduce((acc, c) => acc + c.amount, 0);
  const totalExpense = totalApprovedFinances.filter(f => f.type === 'EXPENSE').reduce((acc, c) => acc + c.amount, 0);
  const balance = totalIncome - totalExpense;

  const activeServants = approvedUsers.filter(u => u.serviceRole && u.serviceRole !== 'Jemaat Biasa');

  // 2. Computed Keaktifan Metrics (Active indicators)
  // We evaluate each member's active score based on:
  // - Was marked "true" in Attendance historical records (approved ones)
  // - Approved financial contributions (optional)
  // - If no historical attendance, we give base engagement rate based on role
  const getMemberKeaktifanScore = (memberId: string, memberRole: string, serviceRole: string) => {
    const approvedEvents = churchAttendance.filter(at => at.status === 'APPROVED');
    if (approvedEvents.length === 0) {
      if (memberRole === 'PENGURUS') return 95;
      if (serviceRole !== 'Jemaat Biasa') return 85;
      return 60; // baseline
    }
    
    let totalServedCount = 0;
    approvedEvents.forEach(at => {
      if (at.servantParticipation && at.servantParticipation[memberId] === true) {
        totalServedCount += 1;
      }
    });

    // Score layout formula
    const presenceRate = (totalServedCount / approvedEvents.length) * 100;
    let score = 55 + Math.round(presenceRate * 0.45);
    if (memberRole === 'PENGURUS') score += 10;
    if (serviceRole !== 'Jemaat Biasa' && totalServedCount > 0) score += 5;
    return Math.min(score, 100);
  };

  // AI Devotional mock assistant loader
  const handleAiDevotionalGenerator = () => {
    setIsAiGenerating(true);
    setDevFeedback('Asisten AI sedang menyusun ayat, teologi tafsir kuno, dan aplikatif khotbah jemaat...');
    
    setTimeout(() => {
      const themes = [
        {
          title: 'Melangkah Melampaui Batas Ketakutan',
          ref: '2 Timotius 1:7',
          verse: 'Sebab Allah memberikan kepada kita bukan roh ketakutan, melainkan roh yang membangkitkan kekuatan, kasih dan ketertiban.',
          text: 'Ketakutan adalah penjara tak terlihat yang melumpuhkan potensi ilahi dalam diri kita. Tatkala kita dipanggil untuk mengarungi ladang baru, keraguan kerap membisikkan kegagalan. Namun, firman Tuhan menegaskan bahwa ketakutan bukanlah berasal dari Dia. Kekuatan rohani, kasih yang tulus, dan pikiran tertib adalah warisan sejati yang memampukan kita menghadapi badai. Hari ini, marilah kita melangkah dengan keyakinan penuh, memperbarui komitmen pelayanan kita bersama Meta Connect, dan menjadi saluran berkat sejati bagi sesama.'
        },
        {
          title: 'Kekayaan Sejati di Dalam Kemurahan Hati',
          ref: 'Amsal 11:25',
          verse: 'Siapa memberi berkat, diberi kelimpahan, siapa memberi minum, ia sendiri akan diberi minum.',
          text: 'Di dunia yang mengajarkan kita untuk terus menumpuk harta, firman Tuhan justru mengundang kita ke dalam paradoks kemurahan hati. Memberi bukanlah kehilangan, melainkan menabur benih kekekalan. Tatkala Bendahara menginput persembahan kolekte jemaat, itu bukanlah deretan angka transaksi belaka, melainkan representasi hati jemaat yang bersyukur. Ketika kita melayani dengan kemurahan hati, saluran berkat ilahi tidak akan pernah kering di hidup kita.'
        }
      ];

      const chosen = themes[Math.floor(Math.random() * themes.length)];
      setDevTitle(chosen.title);
      setDevRef(chosen.ref);
      setDevText(chosen.verse);
      setDevContent(chosen.text);
      
      setIsAiGenerating(false);
      setDevFeedback('Asisten AI berhasil memformulasikan draf firman rohani yang relevan!');
    }, 1500);
  };

  const handlePublishDevotional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devTitle || !devRef || !devText || !devContent) {
      alert('Silakan lengkapi draf renungan sebelum dipublikasikan.');
      return;
    }

    addLocalDevotional(devTitle, devRef, devText, devContent);
    setDevFeedback('Pujian Tuhan! Renungan harian lokal gereja Anda telah terbit dan dapat dibaca oleh seluruh jemaat.');
    
    // clear
    setDevTitle('');
    setDevRef('');
    setDevText('');
    setDevContent('');
    
    setTimeout(() => setDevFeedback(''), 4000);
  };

  const handleUpgradeMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberToUpgrade) {
      alert('Silakan pilih salah satu anggota jemaat.');
      return;
    }
    
    const target = approvedUsers.find(u => u.id === selectedMemberToUpgrade);
    if (!target) return;

    addOfficer(selectedMemberToUpgrade, selectedOfficerTitle);
    setStaffFeedback(`Berhasil melantik ${target.name} sebagai staff resmi [Role: ${selectedOfficerTitle}].`);
    setSelectedMemberToUpgrade('');
    
    setTimeout(() => setStaffFeedback(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      {/* Church Dashboard Header */}
      <div className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderLeft: `6px solid ${activeChurch.customAccentColor || '#1A1A1A'}` }}>
        <div className="flex items-center space-x-4">
          <img 
            src={activeChurch.logoUrl} 
            alt="Church logo" 
            referrerPolicy="no-referrer"
            className="h-16 w-16 rounded-2xl object-cover border border-[#1A1A1A]/10 shadow-xs"
          />
          <div>
            <div className="text-[10px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest font-mono">Workspace Gembala Sidang</div>
            <h2 className="text-3xl font-serif text-[#1A1A1A]">{activeChurch.name}</h2>
            <p className="text-xs text-[#1A1A1A]/60 mt-1 max-w-lg italic font-serif">
              "{activeChurch.customHeroStatement || 'Mengakar ke dalam firman dan berbuah di dalam komunitas.'}"
            </p>
          </div>
        </div>

        <div className="flex bg-[#F2F1ED] rounded-full p-1 border border-[#1A1A1A]/10 max-w-lg w-full">
          {(['approvals', 'activity', 'devotional', 'staff'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 text-[10px] font-bold rounded-full py-2.5 transition uppercase tracking-widest cursor-pointer ${
                activeSubTab === tab 
                  ? 'bg-[#1A1A1A] text-white shadow-xs' 
                  : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
              }`}
            >
              {tab === 'approvals' && 'Sirkulasi Approval'}
              {tab === 'activity' && 'Keaktifan'}
              {tab === 'devotional' && 'Tulis Firman'}
              {tab === 'staff' && 'Wewenang Staff'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1A1A] text-[#F9F8F6] p-6 rounded-3xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Kas Keuangan Gereja</span>
            <div className="text-2xl font-serif italic mt-2 text-[#E8E6E1]">Rp {balance.toLocaleString('id-ID')}</div>
            <span className="text-[10px] text-white/40 block mt-1 uppercase font-semibold tracking-wider">Disetujui Gembala</span>
          </div>
          <div className="p-3 bg-white/10 rounded-full text-white">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-sans">Anggota Jemaat Terdaftar</span>
            <div className="text-2xl font-serif italic mt-2 text-[#1A1A1A]">{approvedUsers.length} Jiwa</div>
            <span className="text-[10px] text-red-700 font-bold block mt-1 uppercase tracking-wider">{pendingUsers.length > 0 ? `${pendingUsers.length} Permohonan` : 'Keanggotaan Stabil'}</span>
          </div>
          <div className="p-3 bg-[#F2F1ED] rounded-full text-[#1A1A1A]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-sans">Pelayan Mimbar Aktif</span>
            <div className="text-2xl font-serif italic mt-2 text-[#1A1A1A]">{activeServants.length} Pelayan</div>
            <span className="text-[10px] text-slate-400 block mt-1 uppercase tracking-wider font-semibold">Tercatat aktif</span>
          </div>
          <div className="p-3 bg-[#F2F1ED] rounded-full text-[#1A1A1A]">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-sans">Perlu Tindakan Gembala</span>
            <div className="text-2xl font-serif italic mt-2 text-red-750">
              {pendingAgendas.length + pendingFinances.length + pendingAttendance.length + pendingUsers.length} Poin
            </div>
            <span className="text-[10px] text-slate-400 block mt-1 uppercase tracking-wider font-semibold">Persetujuan tertunda</span>
          </div>
          <div className="p-3 bg-red-50 rounded-full text-red-650">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      {activeSubTab === 'approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* A. USER REGISTRATION QUEUE */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden">
            <div className="border-b border-[#1A1A1A]/10 px-6 py-4 bg-[#F2F1ED]/25 flex justify-between items-center">
              <h4 className="font-serif italic font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <UserPlus className="h-4 w-4 text-[#1A1A1A]" />
                Antrean Keanggotaan / Jemaat Baru
              </h4>
              <span className="bg-[#E8E6E1] text-[#1A1A1A] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {pendingUsers.length} Jiwa
              </span>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs italic font-sans">
                Tidak ada permohonan keanggotaan baru dalam antrean.
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]/10">
                {pendingUsers.map(user => (
                  <div key={user.id} className="p-5 space-y-4 hover:bg-[#F2F1ED]/5 transition">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-[#1A1A1A] text-sm">{user.name}</div>
                        <div className="text-slate-500 font-mono text-[10px]">{user.email} | {user.phone}</div>
                        <div className="text-slate-400">Alamat: {user.address}</div>
                        <div className="flex space-x-2 mt-2">
                          <span className="bg-[#F2F1ED] text-[#1A1A1A] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            {user.gender}
                          </span>
                          <span className="bg-[#E8E6E1]/60 text-[#1A1A1A] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Misi Pelayanan: {user.serviceRole}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 shrink-0 self-end md:self-start">
                        <button
                          id={`btn-reject-user-${user.id}`}
                          onClick={() => verifyUser(user.id, 'REJECTED')}
                          className="px-4 py-2 hover:bg-[#F2F1ED] text-[#1A1A1A] text-[10px] uppercase tracking-widest rounded-full border border-[#1A1A1A]/15 transition font-bold cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          id={`btn-approve-user-${user.id}`}
                          onClick={() => verifyUser(user.id, 'APPROVED')}
                          className="px-4 py-2 bg-[#1A1A1A] hover:bg-opacity-90 text-white text-[10px] uppercase tracking-widest rounded-full shadow-xs transition font-bold cursor-pointer"
                        >
                          Sahkan
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B. FINANCIAL LEDGER APPROVAL */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden">
            <div className="border-b border-[#1A1A1A]/10 px-6 py-4 bg-[#F2F1ED]/25 flex justify-between items-center">
              <h4 className="font-serif italic font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-[#1A1A1A]" />
                Persetujuan Aliran Kas (Bendahara)
              </h4>
              <span className="bg-[#E8E6E1] text-[#1A1A1A] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {pendingFinances.length} Mutasi
              </span>
            </div>

            {pendingFinances.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs italic font-sans">
                Buku transaksi bendahara bersih. Tidak ada mutasi yang menunggu persetujuan Gembala.
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]/10">
                {pendingFinances.map(record => (
                  <div key={record.id} className="p-5 space-y-3 hover:bg-[#F2F1ED]/5 transition">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          record.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {record.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                        <h5 className="text-sm font-bold text-[#1A1A1A]">{record.category}</h5>
                      </div>
                      <div className="text-right">
                        <div className={`text-base font-bold ${record.type === 'INCOME' ? 'text-emerald-700' : 'text-[#1A1A1A]'}`}>
                          {record.type === 'INCOME' ? '+' : '-'} Rp {record.amount.toLocaleString('id-ID')}
                        </div>
                        <span className="text-[10px] text-slate-450 font-mono">{record.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-[#F2F1ED]/40 p-2.5 rounded-xl border border-[#1A1A1A]/5 font-serif italic">
                      Ref: {record.description}
                    </p>

                    <div className="flex justify-between items-center pt-2 text-[10px] border-t border-[#1A1A1A]/5">
                      <span className="text-slate-400 font-mono">Penginput: <span className="font-bold text-[#1A1A1A]">{record.inputBy}</span></span>
                      <div className="flex space-x-1.5">
                        <button
                          id={`btn-reject-finance-${record.id}`}
                          onClick={() => approveFinance(record.id, 'REJECTED')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-red-700 hover:bg-[#F2F1ED] border border-[#1A1A1A]/10 rounded-full transition font-semibold cursor-pointer"
                        >
                          Tolak
                        </button>
                        <button
                          id={`btn-approve-finance-${record.id}`}
                          onClick={() => approveFinance(record.id, 'APPROVED')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-white bg-[#1A1A1A] hover:bg-opacity-90 rounded-full font-bold transition cursor-pointer"
                        >
                          Setujui
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* C. AGENDA / ACTIVITIES PROPOSAL QUEUE */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden">
            <div className="border-b border-[#1A1A1A]/10 px-6 py-4 bg-[#F2F1ED]/25 flex justify-between items-center">
              <h4 className="font-serif italic font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#1A1A1A]" />
                Daftar Pengajuan Rencana Agenda (Pengurus)
              </h4>
              <span className="bg-[#E8E6E1] text-[#1A1A1A] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {pendingAgendas.length} Acara
              </span>
            </div>

            {pendingAgendas.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs italic font-sans font-medium">
                Arsip pengajuan agenda nihil. Staff belum merencanakan agenda baru.
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]/10">
                {pendingAgendas.map(agenda => (
                  <div key={agenda.id} className="p-5 space-y-3 hover:bg-[#F2F1ED]/5 transition text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <h5 className="font-bold text-[#1A1A1A] text-sm">{agenda.title}</h5>
                        <p className="text-slate-500 font-mono text-[10px]">
                          Tanggal Kegiatan: <span className="font-bold text-slate-700">{agenda.date}</span>
                        </p>
                      </div>
                      <span className="bg-[#E8E6E1] text-[#1A1A1A] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 tracking-wider">
                        Korps {agenda.division}
                      </span>
                    </div>

                    <p className="text-slate-600 bg-[#F2F1ED]/30 p-2.5 rounded-xl border border-[#1A1A1A]/5 leading-relaxed font-sans">
                      {agenda.description}
                    </p>

                    <div className="flex justify-between items-center pt-2 border-t border-[#1A1A1A]/5">
                      <span className="text-[10px] text-slate-400 font-mono">Diusulkan oleh: <strong className="text-[#1A1A1A]">{agenda.proposedBy}</strong></span>
                      <div className="flex space-x-1.5">
                        <button
                          id={`btn-reject-agenda-${agenda.id}`}
                          onClick={() => approveAgenda(agenda.id, 'REJECTED')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer transition font-semibold"
                        >
                          Tolak
                        </button>
                        <button
                          id={`btn-approve-agenda-${agenda.id}`}
                          onClick={() => approveAgenda(agenda.id, 'APPROVED')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold rounded-full cursor-pointer transition"
                        >
                          Setujui
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* D. ATTENDANCE & COMMITTED SERVANTS LIST PERSUASION */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#1A1A1A]/10 overflow-hidden">
            <div className="border-b border-[#1A1A1A]/10 px-6 py-4 bg-[#F2F1ED]/25 flex justify-between items-center">
              <h4 className="font-serif italic font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#1A1A1A]" />
                Validasi Rekap Absensi Kebaktian (Sekretaris)
              </h4>
              <span className="bg-[#E8E6E1] text-[#1A1A1A] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {pendingAttendance.length} Entri
              </span>
            </div>

            {pendingAttendance.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs italic font-sans font-medium">
                Semua laporan rekap ibadah raya minggu dari Sekretariat telah terverifikasi.
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]/10">
                {pendingAttendance.map(record => (
                  <div key={record.id} className="p-5 space-y-3 hover:bg-[#F2F1ED]/5 transition text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-[#1A1A1A] text-sm">{record.activityName}</h5>
                        <p className="text-slate-500 font-mono text-[10px]">Hari Ibadah: {record.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-serif italic text-[#1A1A1A] font-bold block">{record.attendanceCount}</span>
                        <span className="text-[9px] text-[#1A1A1A]/50 block uppercase font-bold tracking-wider">Kehadiran Jemaat</span>
                      </div>
                    </div>

                    {/* Servant assignment reviews */}
                    <div className="bg-[#F2F1ED]/40 border border-[#1A1A1A]/10 p-3 rounded-2xl space-y-1.5">
                      <span className="text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest block font-mono">Status Kedinasan Pelayan Mimbar:</span>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        {Object.entries(record.servantParticipation).map(([id, didServe]) => {
                          const servant = users.find(u => u.id === id);
                          if (!servant) return null;
                          return (
                            <div key={id} className="flex items-center justify-between border-b border-[#1A1A1A]/5 pb-1">
                              <span className="text-[#1A1A1A]/85 truncate max-w-[100px]">{servant.name}</span>
                              <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-bold ${
                                didServe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-850'
                              }`}>
                                {didServe ? 'LAYANI' : 'ABSEN'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#1A1A1A]/5">
                      <span className="text-[10px] text-slate-400 font-mono">Log Sekretaris: <strong className="text-[#1A1A1A]">{record.inputBy}</strong></span>
                      <div className="flex space-x-1.5">
                        <button
                          id={`btn-reject-attendance-${record.id}`}
                          onClick={() => approveAttendance(record.id, 'REJECTED')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full cursor-pointer transition font-semibold"
                        >
                          Tolak
                        </button>
                        <button
                          id={`btn-approve-attendance-${record.id}`}
                          onClick={() => approveAttendance(record.id, 'APPROVED')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold rounded-full cursor-pointer transition"
                        >
                          Validasi Presensi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* METRIC KEAKTIFAN PANEL */}
      {activeSubTab === 'activity' && (
        <div className="bg-white p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-xl font-serif text-[#1A1A1A]">Peringkat Keaktifan Jemaat & Pelayan</h3>
            <p className="text-xs text-slate-400 font-sans">Skor loyalitas kehadiran dihitung berasarkan rekap presensi dinas ibadah tervalidasi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedUsers.map(member => {
              const score = getMemberKeaktifanScore(member.id, member.role, member.serviceRole);
              let colorClass = 'bg-red-500';
              let textStatus = 'Pasif / Perlu Pembinaan';
              let pctColor = 'text-red-750 font-serif font-bold';
              
              if (score >= 85) {
                colorClass = 'bg-emerald-600';
                textStatus = 'Sangat Aktif / Model Pelayanan';
                pctColor = 'text-emerald-700 font-serif font-bold';
              } else if (score >= 70) {
                colorClass = 'bg-indigo-600';
                textStatus = 'Presensi Standard Aktif';
                pctColor = 'text-indigo-700 font-serif font-bold';
              } else if (score >= 60) {
                colorClass = 'bg-amber-600';
                textStatus = 'Cukup Giat / Terpantau standard';
                pctColor = 'text-amber-700 font-serif font-bold';
              }

              return (
                <div key={member.id} className="p-5 border border-[#1A1A1A]/10 bg-[#F2F1ED]/10 hover:bg-[#F2F1ED]/25 rounded-2xl hover:border-[#1A1A1A]/20 transition flex items-center justify-between">
                  <div className="space-y-1 text-xs truncate max-w-[140px] md:max-w-[180px]">
                    <div className="font-bold text-[#1A1A1A] text-sm truncate">{member.name}</div>
                    <div className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">{member.serviceRole}</div>
                    <div className="inline-flex items-center space-x-1.5 mt-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${colorClass}`} />
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-[9px]">{textStatus}</span>
                    </div>
                  </div>

                  {/* Circular or percentage widget representation */}
                  <div className="text-right">
                    <div className={`text-2xl italic ${pctColor}`}>{score}%</div>
                    <span className="text-[9px] text-[#1A1A1A]/40 block uppercase tracking-wider font-bold">Indeks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DEVOTIONAL WRITER */}
      {activeSubTab === 'devotional' && (
        <div className="bg-white p-8 rounded-3xl border border-[#1A1A1A]/10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Writer form - Left */}
            <form onSubmit={handlePublishDevotional} className="lg:col-span-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-[#1A1A1A] flex items-center gap-1.5">
                    <BookOpen className="h-5 w-5 text-[#1A1A1A]" />
                    Komposer Renungan & Ayat Emas Lokal
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">Tulisan rohani atau firman Anda akan dipublikasikan real-time di beranda jemaat lokal.</p>
                </div>
                
                <button
                  id="btn-gemini-devotional"
                  type="button"
                  onClick={handleAiDevotionalGenerator}
                  disabled={isAiGenerating}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase tracking-wider rounded-full border border-indigo-200 transition flex items-center gap-1.5 disabled:opacity-50 shrink-0 self-start sm:self-center cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-600" />
                  {isAiGenerating ? 'AI Menyusun...' : 'Draft dengan AI'}
                </button>
              </div>

              {devFeedback && (
                <div className="p-4 bg-indigo-50/70 text-indigo-800 text-xs border border-indigo-200/50 rounded-2xl flex items-center gap-2">
                  <Zap className="h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="font-semibold">{devFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[10px]">Judul Renungan Harian</label>
                  <input
                    id="input-devotional-title"
                    type="text"
                    required
                    placeholder="e.g. Diperbarui di dalam Kasih-Nya"
                    value={devTitle}
                    onChange={(e) => setDevTitle(e.target.value)}
                    className="w-full border border-[#1A1A1A]/15 rounded-xl p-3 focus:outline-none focus:border-[#1A1A1A] bg-slate-50/35"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[10px]">Referensi Kitab / Ayat</label>
                  <input
                    id="input-devotional-ref"
                    type="text"
                    required
                    placeholder="e.g. Mazmur 23:1"
                    value={devRef}
                    onChange={(e) => setDevRef(e.target.value)}
                    className="w-full border border-[#1A1A1A]/15 rounded-xl p-3 focus:outline-none focus:border-[#1A1A1A] bg-slate-50/35"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[10px]">Naskah Lengkap Ayat Emas</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TUHAN adalah gembalaku, takkan kekurangan aku..."
                  value={devText}
                  onChange={(e) => setDevText(e.target.value)}
                  className="w-full border border-[#1A1A1A]/15 rounded-xl p-3 focus:outline-none focus:border-[#1A1A1A] italic font-serif text-[#1A1A1A]/90 bg-slate-50/35"
                />
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[10px]">Tafsir Teologi & Aplikasi Khotbah Jemaat</label>
                <textarea
                  required
                  placeholder="Tuliskan penjabaran firman renungan rohani aplikatif untuk jemaat..."
                  rows={6}
                  value={devContent}
                  onChange={(e) => setDevContent(e.target.value)}
                  className="w-full border border-[#1A1A1A]/15 rounded-2xl p-4 focus:outline-none focus:border-[#1A1A1A] bg-[#F2F1ED]/25 text-[#1A1A1A] leading-relaxed font-sans"
                />
              </div>

              <button
                id="btn-publish-devotional"
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white font-bold py-3 px-4 rounded-xl text-xs transition uppercase tracking-widest cursor-pointer"
              >
                Sahkan & Terbitkan Renungan Resmi
              </button>
            </form>

            {/* Existing dev list - Right */}
            <div className="lg:col-span-4 space-y-4 lg:border-l border-[#1A1A1A]/10 pl-0 lg:pl-6 pt-6 lg:pt-0">
              <h4 className="font-bold text-[#1A1A1A]/70 text-[10px] uppercase tracking-widest font-mono">Histori Renungan Rilis</h4>
              
              <div className="space-y-4">
                {devotionals.filter(d => d.churchId === churchId).slice(0, 3).map(dev => (
                  <div key={dev.id} className="p-4 border border-[#1A1A1A]/10 rounded-2xl bg-[#F2F1ED]/20 hover:bg-[#F2F1ED]/40 transition text-xs space-y-1">
                    <div className="font-bold text-[#1A1A1A] text-sm">{dev.title}</div>
                    <div className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">{dev.verseRef} | {dev.date}</div>
                    <p className="text-slate-600 line-clamp-3 mt-2 italic font-serif">"{dev.verseText}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STAFF & PERMISSIONS COORDINATION */}
      {activeSubTab === 'staff' && (
        <div className="bg-white p-8 rounded-3xl border border-[#1A1A1A]/10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Staff list - Left */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-serif text-[#1A1A1A] flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-[#1A1A1A]" />
                  Struktur Pengurus & Pendelegasian Wewenang
                </h3>
                <p className="text-xs text-slate-400 font-sans">Gembala sidang berhak mendelegasikan wewenang Bendahara (menginput mutasi kas) atau Sekretaris (menginput absensi pelayan) demi efektivitas pelayanan.</p>
              </div>

              <div className="border border-[#1A1A1A]/10 rounded-2xl overflow-hidden divide-y divide-[#1A1A1A]/10 bg-slate-50/10">
                {approvedUsers.map(u => {
                  const isOfficer = u.role === 'PENGURUS';
                  return (
                    <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F2F1ED]/10 transition text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-[#1A1A1A] text-sm flex items-center gap-2">
                          {u.name}
                          {isOfficer && (
                            <span className="bg-[#E8E6E1]/80 text-[#1A1A1A] text-[9px] border border-[#1A1A1A]/15 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                              {u.officerTitle || 'Staff'}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 font-mono text-[10px]">{u.email}</div>
                        <div className="text-slate-500 font-serif italic">Ketugasan: {u.serviceRole}</div>
                        {isOfficer && u.permissions && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {u.permissions.map(p => (
                              <span key={p} className="bg-[#E8E6E1]/50 border border-[#1A1A1A]/10 text-[#1A1A1A] text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                • {p === 'manage_finances' ? 'Keuangan' : p === 'manage_attendance' ? 'Presensi' : 'Agenda'}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        {isOfficer ? (
                          <button
                            id={`btn-revoke-staff-${u.id}`}
                            onClick={() => removeOfficerAccess(u.id)}
                            className="text-red-700 hover:text-red-800 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Cabut Hak Akses
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[9px] uppercase tracking-wider font-mono font-bold block pt-1 bg-slate-100 px-2 py-1 rounded-full text-center">Jemaat Umum</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form to upgrade / appoint new staff - Right */}
            <div className="lg:col-span-4 space-y-4 lg:border-l border-[#1A1A1A]/10 pl-0 lg:pl-6 pt-6 lg:pt-0">
              <h4 className="font-bold text-[#1A1A1A]/70 text-[10px] uppercase tracking-widest font-mono">Lantik Pengurus Baru</h4>
              
              <form onSubmit={handleUpgradeMember} className="space-y-4 bg-[#F2F1ED]/35 p-5 rounded-2xl border border-[#1A1A1A]/10">
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Pilih Anggota Jemaat</label>
                  <select
                    id="upgrade-member-select"
                    value={selectedMemberToUpgrade}
                    onChange={(e) => setSelectedMemberToUpgrade(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="">-- Hubungkan Jemaat --</option>
                    {approvedUsers.filter(u => u.role !== 'PENGURUS' && u.role !== 'GEMBALA').map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.serviceRole})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1A1A1A]/70 uppercase tracking-wider text-[9px]">Tugaskan Sebagai Jabatan</label>
                  <select
                    id="upgrade-role-select"
                    value={selectedOfficerTitle}
                    onChange={(e) => setSelectedOfficerTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-white focus:outline-none text-[#1A1A1A] font-bold"
                  >
                    <option value="Bendahara">Bendahara (Pendapatan & Pengeluaran)</option>
                    <option value="Sekretaris">Sekretaris (Kehadiran & Absen Pelayan)</option>
                    <option value="Koordinator Pemuda">Koordinator Acara Pemuda</option>
                    <option value="Departemen Musik">Dinas Musik & Multimedia</option>
                  </select>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  *Delegasi ini secara otomatis mengaktivasi tab backend pengurus jemaat yang relevan ketika personil ini login.
                </p>

                {staffFeedback && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-xl border border-emerald-100">
                    {staffFeedback}
                  </div>
                )}

                <button
                  id="btn-appoint-staff-submit"
                  type="submit"
                  className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition shadow-xs"
                >
                  Lantik Pengurus Baru
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
