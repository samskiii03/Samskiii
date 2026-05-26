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
    addLocalDevotional,
    actionLogs,
    deleteUser,
    restoreUser
  } = useMetaConnect();

  const [activeSubTab, setActiveSubTab] = useState<'approvals' | 'activity' | 'devotional' | 'staff' | 'members'>('approvals');
  const [localMemberFilter, setLocalMemberFilter] = useState<'ALL' | 'APPROVED' | 'PENDING_VERIFICATION' | 'REJECTED'>('ALL');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localJustificationReason, setLocalJustificationReason] = useState('Resolusi pemulihan & aktivasi kembali status jemaat oleh Gembala Sidang');

  // Interactive metric model panel states
  const [clickedMetric, setClickedMetric] = useState<'KAS' | 'ANGGOTA' | 'PELAYAN' | 'TINDAKAN' | null>(null);

  // Custom reasons states for verifications
  const [userVerifyReason, setUserVerifyReason] = useState('Verifikasi identitas jemaat dan penetapan tugas pelayanan');
  const [financeVerifyReason, setFinanceVerifyReason] = useState('Pengeluaran/pemasukan operasional sah sirkulasi anggaran bendahara');
  const [agendaVerifyReason, setAgendaVerifyReason] = useState('Realisasi agenda program pelayanan jemaat disetujui');
  const [attendanceVerifyReason, setAttendanceVerifyReason] = useState('Verifikasi rekapitulasi kehadiran pelayan di ibadah');

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

        <div className="flex bg-[#F2F1ED] rounded-full p-1 border border-[#1A1A1A]/10 max-w-2xl w-full flex-wrap">
          {(['approvals', 'activity', 'devotional', 'staff', 'members'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 text-[9.5px] font-bold rounded-full py-2.5 transition uppercase tracking-wider cursor-pointer min-w-[70px] ${
                activeSubTab === tab 
                  ? 'bg-[#1A1A1A] text-white shadow-xs' 
                  : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
              }`}
            >
              {tab === 'approvals' && 'Sirkulasi Approval'}
              {tab === 'activity' && 'Keaktifan'}
              {tab === 'devotional' && 'Tulis Firman'}
              {tab === 'staff' && 'Wewenang Staff'}
              {tab === 'members' && 'Administrasi Jemaat'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          id="btn-metric-kas"
          onClick={() => setClickedMetric('KAS')}
          className="bg-[#1A1A1A] text-[#F9F8F6] p-6 rounded-3xl shadow-xs flex items-center justify-between text-left hover:ring-4 hover:ring-neutral-200 transition cursor-pointer"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Kas Keuangan Gereja</span>
            <div className="text-2xl font-serif italic mt-2 text-[#E8E6E1]">Rp {balance.toLocaleString('id-ID')}</div>
            <span className="text-[10px] text-emerald-400 block mt-1 uppercase font-bold tracking-wider">Minta Rincian (Klik) ↗</span>
          </div>
          <div className="p-3 bg-white/10 rounded-full text-white shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </button>

        <button 
          id="btn-metric-anggota"
          onClick={() => setClickedMetric('ANGGOTA')}
          className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 flex items-center justify-between text-left hover:ring-4 hover:ring-slate-100 transition cursor-pointer shadow-xs"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-sans">Anggota Jemaat Terdaftar</span>
            <div className="text-2xl font-serif italic mt-2 text-[#1A1A1A]">{approvedUsers.length} Jiwa</div>
            <span className="text-[10px] text-red-700 font-bold block mt-1 uppercase tracking-wider">
              {pendingUsers.length > 0 ? `${pendingUsers.length} Antrean (Klik)` : 'Lihat Data (Klik) ↗'}
            </span>
          </div>
          <div className="p-3 bg-[#F2F1ED] rounded-full text-[#1A1A1A] shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </button>

        <button 
          id="btn-metric-pelayan"
          onClick={() => setClickedMetric('PELAYAN')}
          className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 flex items-center justify-between text-left hover:ring-4 hover:ring-slate-100 transition cursor-pointer shadow-xs"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-sans">Pelayan Mimbar Aktif</span>
            <div className="text-2xl font-serif italic mt-2 text-[#1A1A1A]">{activeServants.length} Pelayan</div>
            <span className="text-[10px] text-indigo-700 font-bold block mt-1 tracking-wider uppercase">Audit Agenda (Klik) ↗</span>
          </div>
          <div className="p-3 bg-[#F2F1ED] rounded-full text-[#1A1A1A] shrink-0">
            <Award className="h-5 w-5" />
          </div>
        </button>

        <button 
          id="btn-metric-tindakan"
          onClick={() => {
            setClickedMetric('TINDAKAN');
            setActiveSubTab('approvals');
          }}
          className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 flex items-center justify-between text-left hover:ring-4 hover:ring-slate-100 transition cursor-pointer shadow-xs"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/50 font-sans">Perlu Tindakan Gembala</span>
            <div className="text-2xl font-serif italic mt-2 text-red-750">
              {pendingAgendas.length + pendingFinances.length + pendingAttendance.length + pendingUsers.length} Poin
            </div>
            <span className="text-[10px] text-red-650 font-bold block mt-1 uppercase tracking-wider animate-pulse">Selesaikan Sekarang ↗</span>
          </div>
          <div className="p-3 bg-red-50 rounded-full text-red-650 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </button>
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

                      <div className="pt-2 border-t border-dashed border-[#1A1A1A]/10 space-y-2 w-full md:w-auto">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Alasan/Catatan:</span>
                          <input
                            type="text"
                            id={`input-reason-user-${user.id}`}
                            placeholder="Alasan verifikasi atau catatan penugasan jemaat..."
                            defaultValue={`Disahkan sebagai jemaat dan pelayan komitmen: ${user.serviceRole || 'Jemaat biasa'}`}
                            className="w-full text-[10px] px-2.5 py-1 border border-[#1A1A1A]/10 rounded bg-[#F2F1ED]/30 focus:outline-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            id={`btn-reject-user-${user.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-user-${user.id}`) as HTMLInputElement)?.value || 'Ditolak karena ketidaksesuaian administrasi gereja';
                              verifyUser(user.id, 'REJECTED', val);
                            }}
                            className="px-4 py-2 hover:bg-[#F2F1ED] text-[#1A1A1A] text-[10px] uppercase tracking-widest rounded-full border border-[#1A1A1A]/15 transition font-bold cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            id={`btn-approve-user-${user.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-user-${user.id}`) as HTMLInputElement)?.value || 'Lolos verifikasi administrasi dan sah menjadi anggota jemaat';
                              verifyUser(user.id, 'APPROVED', val);
                            }}
                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-opacity-90 text-white text-[10px] uppercase tracking-widest rounded-full shadow-xs transition font-bold cursor-pointer"
                          >
                            Sahkan
                          </button>
                        </div>
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
                      <div className="pt-2 border-t border-dashed border-[#1A1A1A]/5 space-y-2 w-full md:w-auto">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0 font-sans">Alasan/Catatan:</span>
                          <input
                            type="text"
                            id={`input-reason-fin-${record.id}`}
                            placeholder="Alasan persetujuan transaksi kas bendahara..."
                            defaultValue={`Laporan buku kas sah disetujui pada pos operasional: ${record.category}`}
                            className="w-full text-[10px] px-2 py-1 border border-[#1A1A1A]/10 rounded bg-[#F2F1ED]/30 focus:outline-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-1.5 font-bold">
                          <button
                            id={`btn-reject-finance-${record.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-fin-${record.id}`) as HTMLInputElement)?.value || 'Pengeluaran ditutup / direvisi oleh Gembala';
                              approveFinance(record.id, 'REJECTED', val);
                            }}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-red-700 hover:bg-[#F2F1ED] border border-[#1A1A1A]/10 rounded-full transition font-semibold cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            id={`btn-approve-finance-${record.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-fin-${record.id}`) as HTMLInputElement)?.value || 'Aliran kas dikonfirmasi sah sesuai rincian rilis bendahara';
                              approveFinance(record.id, 'APPROVED', val);
                            }}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-white bg-[#1A1A1A] hover:bg-opacity-90 rounded-full font-bold transition cursor-pointer"
                          >
                            Setujui
                          </button>
                        </div>
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
                      <div className="pt-2 border-t border-[#1A1A1A]/5 space-y-2 w-full">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0 font-sans">Alasan/Catatan:</span>
                          <input
                            type="text"
                            id={`input-reason-agenda-${agenda.id}`}
                            placeholder="Alasan persetujuan sirkulasi program kerja..."
                            defaultValue={`Rancangan program '${agenda.title}' disetujui demi perkembangan Jemaat`}
                            className="w-full text-[10px] px-2 py-1 border border-[#1A1A1A]/10 rounded bg-[#F2F1ED]/30 focus:outline-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-1.5">
                          <button
                            id={`btn-reject-agenda-${agenda.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-agenda-${agenda.id}`) as HTMLInputElement)?.value || 'Rancangan acara ditolak untuk direvisi pengurus';
                              approveAgenda(agenda.id, 'REJECTED', val);
                            }}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-full cursor-pointer transition font-semibold"
                          >
                            Tolak
                          </button>
                          <button
                            id={`btn-approve-agenda-${agenda.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-agenda-${agenda.id}`) as HTMLInputElement)?.value || 'Program kerja gereja lokal disahkan secara definitif';
                              approveAgenda(agenda.id, 'APPROVED', val);
                            }}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold rounded-full cursor-pointer transition"
                          >
                            Setujui
                          </button>
                        </div>
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
                      <div className="pt-2 border-t border-[#1A1A1A]/5 space-y-2 w-full">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0 font-sans">Alasan/Catatan:</span>
                          <input
                            type="text"
                            id={`input-reason-attendance-${record.id}`}
                            placeholder="Alasan penyetujuan rekap absensi sekretariat..."
                            defaultValue={`Laporan presensi pelayan ibadah raya ${record.activityName} tervalidasi sakral`}
                            className="w-full text-[10px] px-2 py-1 border border-[#1A1A1A]/10 rounded bg-[#F2F1ED]/30 focus:outline-none"
                          />
                        </div>
                        <div className="flex justify-end space-x-1.5">
                          <button
                            id={`btn-reject-attendance-${record.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-attendance-${record.id}`) as HTMLInputElement)?.value || 'Presensi ditolak karena ketidakcocokan daftar hadir pelayan';
                              approveAttendance(record.id, 'REJECTED', val);
                            }}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full cursor-pointer transition font-semibold"
                          >
                            Tolak
                          </button>
                          <button
                            id={`btn-approve-attendance-${record.id}`}
                            onClick={() => {
                              const val = (document.getElementById(`input-reason-attendance-${record.id}`) as HTMLInputElement)?.value || 'Rekap kehadiran dinas pelayan disahkan secara resmi';
                              approveAttendance(record.id, 'APPROVED', val);
                            }}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-wider bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold rounded-full cursor-pointer transition"
                          >
                            Validasi Presensi
                          </button>
                        </div>
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

      {/* MEMBERS DIRECTORY MANAGEMENT SUBTAB */}
      {activeSubTab === 'members' && (() => {
        const localChurchUsers = users.filter(u => u.churchId === activeChurch.id && u.role !== 'PUSAT');
        const filteredLocalUsers = localChurchUsers.filter(u => {
          if (localMemberFilter !== 'ALL' && u.status !== localMemberFilter) return false;
          if (localSearchQuery.trim()) {
            const q = localSearchQuery.toLowerCase();
            return (
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              (u.serviceRole && u.serviceRole.toLowerCase().includes(q)) ||
              u.role.toLowerCase().includes(q)
            );
          }
          return true;
        });

        return (
          <div id="gembala-members-tab" className="bg-white p-8 rounded-3xl border border-[#1A1A1A]/10 shadow-xs space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif text-[#1A1A1A] flex items-center gap-1.5 font-bold italic">
                <Users className="h-5 w-5 text-indigo-800" />
                Manajemen Administrasi Anggota Jemaat & Pelayan Komitmen
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Portal gembala sidang untuk mengaudit semua status keanggotaan jemaat di cabang {activeChurch.name}. Anda dapat meninjau akun yang ditolak, melakukan pemulihan/re-aktivasi kembali, serta menghapus akun secara permanen.
              </p>
            </div>

            {/* Local Search and Filtration Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F2F1ED]/40 p-5 rounded-2xl border border-[#1A1A1A]/10 font-sans text-xs">
              <div className="flex flex-wrap gap-1.5">
                <button
                  id="btn-local-filter-all"
                  type="button"
                  onClick={() => setLocalMemberFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    localMemberFilter === 'ALL'
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-[#E8E6E1]/70 text-[#1A1A1A]/70 hover:bg-[#E8E6E1]'
                  }`}
                >
                  Semua ({localChurchUsers.length})
                </button>
                <button
                  id="btn-local-filter-approved"
                  type="button"
                  onClick={() => setLocalMemberFilter('APPROVED')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    localMemberFilter === 'APPROVED'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#E8E6E1]/70 text-[#1A1A1A]/70 hover:bg-[#E8E6E1]'
                  }`}
                >
                  Disetujui/Aktif ({localChurchUsers.filter(u => u.status === 'APPROVED').length})
                </button>
                <button
                  id="btn-local-filter-pending"
                  type="button"
                  onClick={() => setLocalMemberFilter('PENDING_VERIFICATION')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    localMemberFilter === 'PENDING_VERIFICATION'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-[#E8E6E1]/70 text-[#1A1A1A]/70 hover:bg-[#E8E6E1]'
                  }`}
                >
                  Menunggu ({localChurchUsers.filter(u => u.status === 'PENDING_VERIFICATION').length})
                </button>
                <button
                  id="btn-local-filter-rejected"
                  type="button"
                  onClick={() => setLocalMemberFilter('REJECTED')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    localMemberFilter === 'REJECTED'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-[#E8E6E1]/70 text-[#1A1A1A]/70 hover:bg-[#E8E6E1]'
                  }`}
                >
                  Ditolak ({localChurchUsers.filter(u => u.status === 'REJECTED').length})
                </button>
              </div>

              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari nama atau pelayanan jemaat..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-[#1A1A1A]/10 bg-white rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* Justification Box */}
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans">
              <div className="space-y-0.5">
                <span className="font-bold text-amber-800 flex items-center gap-1.5 font-serif italic text-sm">
                  <Key className="h-4 w-4 text-amber-600" />
                  Alasan Pemulihan Sidang Jemaat
                </span>
                <p className="text-slate-500 text-[11px]">Masukkan keterangan pemulihan status jemaat di bawah untuk disimpan dalam histori audit log.</p>
              </div>
              <input
                type="text"
                value={localJustificationReason}
                onChange={(e) => setLocalJustificationReason(e.target.value)}
                placeholder="Alasan pemulihan kembali oleh Gembala..."
                className="w-full md:w-1/2 text-xs px-3 py-2 border border-[#1A1A1A]/15 bg-white rounded-xl focus:outline-none"
              />
            </div>

            {/* Members List Table (Desktop) */}
            <div className="hidden md:block overflow-x-auto font-sans">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1A1A1A]/10 text-slate-400 font-bold uppercase tracking-wider text-[9px] bg-slate-50">
                    <th className="py-3 px-2">Nama Lengkap</th>
                    <th className="py-3 px-2">Kategori Keanggotaan</th>
                    <th className="py-3 px-2">Jenis Kelamin</th>
                    <th className="py-3 px-2">Penugasan Liturgis / Pelayanan</th>
                    <th className="py-3 px-2">Status Verifikasi</th>
                    <th className="py-3 px-2 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/5">
                  {filteredLocalUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 italic">
                        Tidak ditemukan jemaat lokal dengan filter ini.
                      </td>
                    </tr>
                  ) : (
                    filteredLocalUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-2 font-bold text-slate-900">
                          <div>{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-normal">{u.email} | {u.phone}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-semibold text-slate-750 block">{u.role}</span>
                          <span className="text-[10px] text-slate-450">{u.officerTitle || 'Jemaat Biasa'}</span>
                        </td>
                        <td className="py-3 px-2 text-slate-500">{u.gender || '-'}</td>
                        <td className="py-3 px-2 font-medium text-indigo-700">{u.serviceRole || '-'}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
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
                                id={`btn-restore-user-gembala-${u.id}`}
                                onClick={() => restoreUser(u.id, localJustificationReason)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[9px] uppercase tracking-wider cursor-pointer shadow-xs transition"
                                title="Pulihkan & Terima Jemaat"
                              >
                                Pulihkan
                              </button>
                            )}
                            {u.status === 'PENDING_VERIFICATION' && (
                              <button
                                id={`btn-approve-user-gembala-${u.id}`}
                                onClick={() => restoreUser(u.id, 'Disetujui langsung oleh Gembala Sidang Lokal')}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-[#1C3FAA] text-white rounded font-bold text-[9px] uppercase tracking-wider cursor-pointer shadow-xs transition"
                                title="Sahkan sebagai Anggota Jemaat"
                              >
                                Sahkan
                              </button>
                            )}
                            <button
                              id={`btn-delete-user-gembala-${u.id}`}
                              onClick={() => {
                                if (window.confirm(`Hapus permanen akun jemaat ${u.name}? Tindakan ini permanen.`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="px-2 py-1 bg-red-50 text-red-650 hover:bg-red-100 rounded text-[9px] font-bold cursor-pointer transition"
                              title="Hapus Jemaat"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Members List (Mobile View) */}
            <div className="block md:hidden space-y-4 font-sans text-xs">
              {filteredLocalUsers.length === 0 ? (
                <p className="py-4 text-center text-slate-400 italic">Belum ada data jemaat yang sesuai.</p>
              ) : (
                filteredLocalUsers.map(u => (
                  <div key={u.id} className="p-4 bg-slate-50 rounded-2xl border border-[#1A1A1A]/10 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900">{u.name}</h4>
                        <span className="text-[10px] text-slate-450 block font-mono">{u.email}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        u.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800' : u.status === 'REJECTED' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-805'
                      }`}>
                        {u.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px] border-t border-[#1A1A1A]/5 pt-2">
                      <div>
                        <span className="text-[8.5px] uppercase tracking-wider text-slate-400 block">Kategori</span>
                        <span className="font-bold text-slate-700">{u.role}</span>
                      </div>
                      <div>
                        <span className="text-[8.5px] uppercase tracking-wider text-slate-400 block">Pelayanan</span>
                        <span className="font-medium text-slate-700">{u.serviceRole || '-'}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-2.5 border-t border-[#1A1A1A]/5">
                      {u.status === 'REJECTED' && (
                        <button
                          id={`btn-mob-restore-gembala-${u.id}`}
                          onClick={() => restoreUser(u.id, localJustificationReason)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded font-bold uppercase text-[9px] cursor-pointer"
                        >
                          Pulihkan
                        </button>
                      )}
                      {u.status === 'PENDING_VERIFICATION' && (
                        <button
                          id={`btn-mob-approve-gembala-${u.id}`}
                          onClick={() => restoreUser(u.id, 'Disetujui langsung oleh Gembala Sidang Lokal')}
                          className="px-3 py-1 bg-indigo-600 text-white rounded font-bold uppercase text-[9px] cursor-pointer"
                        >
                          Sahkan
                        </button>
                      )}
                      <button
                        id={`btn-mob-delete-gembala-${u.id}`}
                        onClick={() => {
                          if (window.confirm(`Hapus permanen ${u.name}?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded font-bold text-[9px] cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })()}

      {/* METRIC DETAILS DROPDOWN/MODAL */}
      {clickedMetric && (
        <div id="metric-info-modal-overlay" className="fixed inset-0 bg-[#1a1a1a]/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative border border-[#1A1A1A]/10 max-h-[85vh] overflow-y-auto shadow-2xl transition-all">
            
            <button
              id="btn-close-metric-modal"
              onClick={() => setClickedMetric(null)}
              className="absolute top-6 right-6 p-2 bg-[#F2F1ED] hover:bg-[#E8E6E1] text-[#1A1A1A]/85 rounded-full cursor-pointer transition"
            >
              <XCircle className="h-5 w-5" />
            </button>

            {clickedMetric === 'KAS' && (() => {
              const chFinances = finances.filter(f => f.churchId === activeChurch.id);
              return (
                <div className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40">Koleksi Audit Wilayah</span>
                    <h3 className="font-serif italic text-2xl text-[#1A1A1A] font-bold">Rincian Buku Kas Keuangan Cabang</h3>
                    <p className="text-slate-500 leading-relaxed">Berikut adalah sirkulasi aliran kas keuangan yang diajukan oleh Bendahara terdaftar. Mutasi berlogo Hijau/Merah menandakan status penyetujuan Gembala.</p>
                  </div>

                  <div className="overflow-x-auto max-h-[350px] border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {chFinances.length === 0 ? (
                      <div className="p-8 text-center text-slate-450 italic">Belum ada mutasi keuangan tercatat.</div>
                    ) : (
                      chFinances.map(f => (
                        <div key={f.id} className="p-3 flex justify-between items-center hover:bg-slate-50/50">
                          <div>
                            <div className="font-bold text-[#1A1A1A]">{f.category}</div>
                            <div className="text-slate-400 text-[10px] font-mono">{f.date} | Pengentri: {f.inputBy}</div>
                            <p className="text-slate-500 italic mt-0.5">"{f.description}"</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`font-bold block text-sm ${f.type === 'INCOME' ? 'text-emerald-700' : 'text-red-700'}`}>
                              {f.type === 'INCOME' ? '+' : '-'} Rp {f.amount.toLocaleString('id-ID')}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                              f.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : f.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {f.status === 'APPROVED' ? 'Disetujui' : f.status === 'REJECTED' ? 'Ditolak' : 'Tertunda'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

            {clickedMetric === 'ANGGOTA' && (() => {
              const chMembers = users.filter(u => u.churchId === activeChurch.id);
              return (
                <div className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40">Koleksi Keanggotaan</span>
                    <h3 className="font-serif italic text-2xl text-[#1A1A1A] font-bold">Anggota Jemaat Terdaftar</h3>
                    <p className="text-slate-500 leading-relaxed">Data riil personil jemaat yang tercatat mendaftarkan dirinya ke gereja lokal {activeChurch.name} melalui formulir pendaftaran.</p>
                  </div>

                  <div className="overflow-x-auto max-h-[350px] border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {chMembers.length === 0 ? (
                      <div className="p-8 text-center text-slate-450 italic">Belum ada jemaat terdaftar.</div>
                    ) : (
                      chMembers.map(m => (
                        <div key={m.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50/50">
                          <div>
                            <div className="font-bold text-[#1A1A1A] text-sm">{m.name}</div>
                            <div className="text-slate-400 text-[10px] font-mono">{m.email} | {m.phone}</div>
                            <div className="text-slate-500 mt-1">Alamat: {m.address}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-[#1A1A1A] block">{m.role}</span>
                            <span className="text-[10px] text-indigo-700 font-bold block">{m.serviceRole || 'Jemaat'}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                              m.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {m.status === 'APPROVED' ? 'Sah' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

            {clickedMetric === 'PELAYAN' && (() => {
              const chServants = users.filter(u => u.churchId === activeChurch.id && u.serviceRole && u.serviceRole !== 'Jemaat Biasa');
              return (
                <div className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40">Korps Pelayanan Kudus</span>
                    <h3 className="font-serif italic text-2xl text-[#1A1A1A] font-bold">Pelayan Mimbar & Staff Kantor</h3>
                    <p className="text-slate-500 leading-relaxed">Roster pengurus, sekretaris, bendahara, pemusik, pendoa, dan pelayan mimbar terpilih yang memegang mandat aktif dalam administrasi gereja.</p>
                  </div>

                  <div className="overflow-x-auto max-h-[350px] border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {chServants.length === 0 ? (
                      <div className="p-8 text-center text-slate-450 italic">Belum ada pelayan mimbar dikonfigurasi.</div>
                    ) : (
                      chServants.map(s => (
                        <div key={s.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50/50">
                          <div>
                            <div className="font-bold text-[#1A1A1A] text-sm">{s.name}</div>
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-150 text-[9px] font-bold uppercase tracking-wider mt-1 inline-block">
                              Spesialis: {s.serviceRole}
                            </span>
                            <div className="text-slate-400 text-[10px] font-mono mt-1">{s.email} | {s.phone}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-slate-800 text-[10px] block font-mono">{s.officerTitle || 'Pelayan Komitmen'}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                              s.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700'
                            }`}>
                              Active
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

            {clickedMetric === 'TINDAKAN' && (() => {
              // Filter audittrail action logs linked to their action, actor, or church
              const chLogs = actionLogs ? actionLogs.filter((log: any) => 
                log.targetName.toLowerCase().includes(activeChurch.name.toLowerCase()) ||
                log.actorName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
                users.some(u => u.churchId === activeChurch.id && u.name.toLowerCase() === log.actorName.toLowerCase())
              ) : [];

              return (
                <div className="space-y-4 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]/40">Audit Trail Keamanan</span>
                    <h3 className="font-serif italic text-2xl text-[#1A1A1A] font-bold">Histori Tindakan Cabang & Pertimbangan</h3>
                    <p className="text-slate-500 leading-relaxed">Rekaman otomatis atas seluruh aksi verifikasi, audit keuangan, legalisasi sekretariat, dan alasan tertulis yang diterbitkan oleh Gembala.</p>
                  </div>

                  <div className="overflow-x-auto max-h-[350px] border border-slate-100 rounded-xl divide-y divide-slate-100">
                    {chLogs.length === 0 ? (
                      <div className="p-8 text-center text-slate-450 italic">Belum ada mutasi tindakan terekam.</div>
                    ) : (
                      chLogs.map((log: any) => (
                        <div key={log.id} className="p-3.5 space-y-2 hover:bg-slate-50/30">
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-150 uppercase tracking-wide">
                              {log.actionType}
                            </span>
                            <span className="font-mono text-slate-450 font-bold">{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1A1A]">Target: <span className="text-indigo-900 font-serif font-bold italic">{log.targetName}</span></p>
                            <p className="text-slate-650 bg-slate-50 border border-slate-150 p-2 rounded-lg mt-1 font-sans italic">
                              Alasan Pertimbangan: "{log.reason || 'Sesuai dengan kriteria umum'}"
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-450 pt-1">
                            <span>Aktor: <strong className="text-slate-700">{log.actorName} ({log.actorRole})</strong></span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              log.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {log.status === 'APPROVED' ? 'SAH ✓' : 'TOLAK ✗'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                id="btn-close-modal-bottom"
                onClick={() => setClickedMetric(null)}
                className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-opacity-90 text-white text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer shadow-xs transition"
              >
                Tutup Jendela Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
