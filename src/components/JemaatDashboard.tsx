import React, { useState } from 'react';
import { useMetaConnect } from '../context/MetaConnectContext';
import { 
  BookOpen, Calendar, Users, HelpCircle, User, MapPin, Check, 
  MessageSquare, Heart, Sparkles, Send, Bell 
} from 'lucide-react';

export default function JemaatDashboard() {
  const { 
    currentUser, 
    activeChurch, 
    users, 
    agendas, 
    devotionals, 
    prayers, 
    suggestions, 
    addPrayer, 
    prayForRequest, 
    addSuggestion 
  } = useMetaConnect();

  // Internal tab bar navigation
  const [activeTab, setActiveTab ] = useState<'dev' | 'agenda' | 'servant' | 'prayer' | 'directory' | 'feedback'>('dev');

  // Input states
  const [prayerText, setPrayerText] = useState('');
  const [suggText, setSuggText] = useState('');
  const [suggTarget, setSuggTarget] = useState<'LOCAL' | 'PUSAT'>('LOCAL');
  const [suggFeedback, setSuggFeedback] = useState('');

  if (!currentUser || !activeChurch) {
    return <div className="p-10 text-center text-slate-500 font-serif italic text-sm">Sinkronisasi data jemaat...</div>;
  }

  const churchId = activeChurch.id;

  // Filters
  const localUsers = users.filter(u => u.churchId === churchId && u.status === 'APPROVED');
  const approvedAgendas = agendas.filter(ag => ag.churchId === churchId && ag.status === 'APPROVED');
  const localDevotionals = devotionals.filter(d => d.churchId === churchId);
  const localPrayers = prayers.filter(p => p.churchId === churchId);

  // Math calculation of upcoming Sunday Servant Timetable
  const teamWorshipLeader = localUsers.find(u => u.serviceRole?.toLowerCase().includes('leader')) || localUsers[0];
  const teamSinger = localUsers.find(u => u.serviceRole?.toLowerCase().includes('singer')) || localUsers[1] || localUsers[0];
  const teamBass = localUsers.find(u => u.serviceRole?.toLowerCase().includes('bass') || u.serviceRole?.toLowerCase().includes('musik')) || localUsers[2] || localUsers[0];

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerText) return;
    addPrayer(prayerText, true);
    setPrayerText('');
  };

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggText) return;
    addSuggestion(suggText, suggTarget);
    setSuggFeedback(suggTarget === 'PUSAT' 
      ? 'Terima kasih, saran Anda dikirimkan langsung ke Sinode Pusat Meta Connect.' 
      : 'Saran Anda berhasil dikirimkan ke meja pelayanan Gembala Sidang Lokal.'
    );
    setSuggText('');
    setTimeout(() => setSuggFeedback(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
      
      {/* Congregant Welcome Card with Custom Local branding accent */}
      <div 
        className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ borderLeft: `6px solid ${activeChurch.customAccentColor || '#1A1A1A'}` }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img 
            src={activeChurch.logoUrl} 
            alt="Church logo" 
            referrerPolicy="no-referrer"
            className="h-16 w-16 rounded-2xl object-cover border border-[#1A1A1A]/10 ring-4 ring-[#F2F1ED]/40 shrink-0"
          />
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Selamat Datang, Jemaat Lokal</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] mt-0.5">{currentUser.name}</h2>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Gereja Terdaftar: <strong className="text-[#1A1A1A]">{activeChurch.name}</strong> / Bidang Pelayanan: <strong className="text-amber-800 uppercase tracking-wider font-bold text-[10px]">{currentUser.serviceRole || 'Jemaat Umum'}</strong>
            </p>
          </div>
        </div>

        {/* Liturgy Banner */}
        <div className="bg-[#F2F1ED]/50 border border-[#1A1A1A]/10 rounded-2xl px-5 py-3 text-center text-xs max-w-xs shrink-0 font-sans">
          <div className="text-[9px] font-mono uppercase tracking-widest font-bold text-[#1A1A1A]/40">KATEGORI LITURGI</div>
          <div className="text-[#1A1A1A] font-serif font-black italic text-sm mt-0.5">Minggu Advent & Trinitas</div>
        </div>
      </div>

      {/* Tabs Menu Section */}
      <div className="flex border-b border-[#1A1A1A]/10 overflow-x-auto whitespace-nowrap gap-6 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('dev')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'dev' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          📖 Baca Renungan ({localDevotionals.length})
        </button>
        <button
          onClick={() => setActiveTab('agenda')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'agenda' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          🗓️ Kegiatan Gereja ({approvedAgendas.length})
        </button>
        <button
          onClick={() => setActiveTab('servant')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'servant' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          🎵 Jadwal Pelayan Mimbar
        </button>
        <button
          onClick={() => setActiveTab('prayer')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'prayer' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          🙏 Dukungan Doa ({localPrayers.length})
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'directory' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          👥 Direktori Jemaat ({localUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'feedback' ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          📝 Kritik & Saran Jemaat
        </button>
      </div>

      {/* TABS COMPONENT RENDER */}
      {activeTab === 'dev' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif text-[#1A1A1A] flex items-center gap-1.5">
              <BookOpen className="h-5 w-5 text-[#1A1A1A]" />
              Khotbah & Renungan Harian Sidang Jemaat
            </h3>
            <p className="text-xs text-slate-400">Nutrisi rohani iman Kristen harian dikomposisi oleh Gembala Sidang gereja Anda untuk menguatkan persekutuan.</p>
          </div>

          {localDevotionals.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-[#1A1A1A]/10 italic text-[#1A1A1A]/50 text-xs">Belum ada renungan harian terbit untuk jemaat hari ini.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localDevotionals.map(dev => (
                <div key={dev.id} className="bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-5 shadow-xs">
                  <div className="border-b border-[#1A1A1A]/10 pb-4 flex justify-between items-baseline gap-2">
                    <h4 className="font-serif font-bold text-lg text-[#1A1A1A] leading-tight">{dev.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{dev.date}</span>
                  </div>
                  <div className="p-4 bg-[#F2F1ED]/40 border-l-4 border-[#1A1A1A] rounded-2xl text-xs text-slate-800 italic font-serif">
                    <strong className="block mb-1 text-[#1A1A1A]">{dev.ref}</strong> "{dev.verseText}"
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify bg-slate-50/25 p-4 rounded-2xl border border-[#1A1A1A]/5">
                    {dev.content}
                  </p>
                  <div className="text-[9px] text-right font-bold text-[#1A1A1A]/50 uppercase tracking-widest font-mono">
                    Oleh: {dev.writtenBy} (Gembala Sidang)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'agenda' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif text-[#1A1A1A]">Kalender Kegiatan & Acara Terdekat</h3>
            <p className="text-xs text-slate-400">Daftar liturgi kegiatan lokal yang telah tervalidasi dan disahkan Gembala untuk diikuti seluruh jemaat.</p>
          </div>

          {approvedAgendas.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-[#1A1A1A]/10 text-slate-400 italic text-xs">Gereja belum menjadwalkan agenda publik minggu ini.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedAgendas.map(ag => (
                <div key={ag.id} className="bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 flex items-start space-x-5 shadow-xs">
                  <div className="bg-[#1A1A1A] p-4 rounded-2xl text-white shrink-0 font-mono text-center min-w-[64px]">
                    <div className="text-[10px] font-bold uppercase opacity-80">{ag.date.split('-')[1]}</div>
                    <div className="text-2xl font-serif font-black">{ag.date.split('-')[2]}</div>
                  </div>
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-[#E8E6E1] text-[#1A1A1A] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Divisi {ag.division}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">{ag.title}</h4>
                    <p className="text-xs text-slate-550 leading-relaxed line-clamp-3 font-sans">{ag.description}</p>
                    <div className="text-[9px] font-mono text-slate-400 pt-2 border-t border-[#1A1A1A]/5 flex items-center justify-between">
                      <span>Diusung: {ag.proposedBy}</span>
                      <span>Tahun: {ag.date.split('-')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'servant' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif text-[#1A1A1A]">Komposisi Tim Pelayan Mimbar (Next Sunday)</h3>
            <p className="text-xs text-slate-400">Dinas penugasan singer, liturgis, worship leader, dan pembuat tata ibadah kebaktian minggu esok.</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 max-w-2xl mx-auto space-y-6 shadow-xs">
            <div className="border-b border-[#1A1A1A]/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest block">IBADAH RAYA PERTAMA & KEDUA</span>
              <span className="text-[9px] bg-[#E8E6E1] text-[#1A1A1A] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">Hari Minggu Esok (31 Mei)</span>
            </div>

            <div className="space-y-4 divide-y divide-[#1A1A1A]/10">
              
              <div className="flex items-center justify-between py-2 text-xs">
                <span className="font-bold text-slate-500">1. Worship Leader (WL)</span>
                <span className="bg-[#E8E6E1]/50 text-[#1A1A1A] px-3 py-1 rounded-xl font-bold border border-[#1A1A1A]/5 font-mono text-[10px]">
                  {teamWorshipLeader?.name || 'Pdt Dr. Henry Budi'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-bold text-slate-500">2. Singer / Paduan Suara</span>
                <span className="bg-[#E8E6E1]/50 text-[#1A1A1A] px-3 py-1 rounded-xl font-bold border border-[#1A1A1A]/5 font-mono text-[10px]">
                  {teamSinger?.name || 'Dewi Lestari'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-bold text-slate-500">3. Pemain Musik / Keyboardist / Bassist</span>
                <span className="bg-[#E8E6E1]/50 text-[#1A1A1A] px-3 py-1 rounded-xl font-bold border border-[#1A1A1A]/5 font-mono text-[10px]">
                  {teamBass?.name || 'Bambang Riyadi'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-bold text-slate-500">4. Penerima Tamu / Penerima Kolekte (Usheer)</span>
                <span className="bg-slate-50 text-slate-650 px-3 py-1 rounded-xl font-medium font-mono text-[10px] border border-slate-100">
                  Anggota Komisi Komunitas Wanita
                </span>
              </div>

              <div className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-bold text-slate-500">5. Multimedia / Soundman / Operator LCD</span>
                <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-xl font-medium font-mono text-[10px] border border-slate-100">
                  Ronal Hutagalung (Dinas Multimedia)
                </span>
              </div>

            </div>

            <p className="text-[9px] text-slate-400 text-center leading-relaxed font-mono uppercase tracking-widest italic border-t border-[#1A1A1A]/5 pt-4">
              *Bagi yang berhalangan hadir silakan hubungi Sekretaris {activeChurch.pastorName} maximal H-2 ibadah.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'prayer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List - Left */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif text-[#1A1A1A]">Saling Mendukung di dalam Doa Syafaat</h3>
              <p className="text-xs text-slate-400">Klik 'Aminkan' sebagai bentuk persekutuan kasih mendukung beban doa jemaat lain.</p>
            </div>
            
            <div className="space-y-4 pt-2 divide-y divide-[#1A1A1A]/10">
              {localPrayers.filter(p => p.isPublic).length === 0 ? (
                <div className="text-center text-slate-450 italic text-xs py-4">Belum ada request doa umum saat ini.</div>
              ) : (
                localPrayers.filter(p => p.isPublic).map(p => {
                  const alreadyApprovedPr = p.aminkanList.includes(currentUser.id);
                  return (
                    <div key={p.id} className="pt-4 first:pt-0 space-y-3 text-xs">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span className="font-bold text-[#1A1A1A]/80">{p.userName}</span>
                        <span>{new Date(p.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <p className="text-[#1A1A1A]/90 font-serif italic text-base leading-relaxed">"{p.requestText}"</p>
                      
                      <div className="flex justify-between items-center pt-2.5 text-[10px] gap-2">
                        <span className="text-slate-500 font-bold uppercase tracking-wider font-mono">Didukung: <strong className="text-[#1A1A1A]">{p.aminkanList.length} Jiwa</strong></span>
                        <button
                          onClick={() => prayForRequest(p.id)}
                          className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-full cursor-pointer transition ${
                            alreadyApprovedPr ? 'bg-emerald-100 text-emerald-800' : 'bg-[#1A1A1A] hover:bg-opacity-90 text-white shadow-xs'
                          }`}
                        >
                          {alreadyApprovedPr ? '✓ Teraminkan' : '🙏 Aminkan'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Form write - Right */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 space-y-4 text-xs font-sans shadow-xs">
            <h4 className="font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono text-[10px]">Ajukan Beban Syafaat</h4>
            
            <form onSubmit={handleAddPrayer} className="space-y-4">
              <textarea
                required
                placeholder="Tuliskan pergumulan hidup Anda (pekerjaan, kesehatan keluarga, atau studi) di sini..."
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                rows={4}
                className="w-full border border-[#1A1A1A]/15 rounded-xl p-3 focus:outline-none focus:border-[#1A1A1A] bg-[#F2F1ED]/20 text-[#1A1A1A]"
              />
              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition"
              >
                Kirim Permohonan Doa
              </button>
            </form>
          </div>

        </div>
      )}

      {activeTab === 'directory' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif text-[#1A1A1A]">Direktori Jemaat Tabernakel</h3>
            <p className="text-xs text-slate-400">Informasi kontak jemaat terverifikasi lokal untuk koordinasi kerja bakti atau acara ibadah sel grup.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
            {localUsers.map(u => (
              <div key={u.id} className="p-5 border border-[#1A1A1A]/10 rounded-2xl hover:bg-[#F2F1ED]/10 transition text-xs text-slate-650 space-y-2 bg-[#F2F1ED]/20 shadow-2xs">
                <div>
                  <div className="font-bold text-base text-[#1A1A1A] truncate">{u.name}</div>
                  <div className="text-[9px] text-amber-800 font-mono font-bold uppercase tracking-wider mt-0.5">{u.serviceRole || 'JEMAAT UMUM'}</div>
                </div>
                <div className="text-[#1A1A1A]/70 text-[10px] font-mono leading-none">{u.gender} • {u.phone}</div>
                <div className="text-[10px] text-slate-550 border-t border-[#1A1A1A]/10 pt-2 font-sans">
                  <strong className="text-[#1A1A1A]">Alamat:</strong> {u.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-[#1A1A1A]/10 space-y-5 shadow-xs">
            <h3 className="text-2xl font-serif text-[#1A1A1A]">Kritik & Saran Jemaat Sidang</h3>
            <p className="text-xs text-slate-400">Pendapat terbuka jemaat membantu mengevaluasi jalannya tata ibadah mingguan, sound musik, maupaun penata AC gereja lokal Anda.</p>
            
            <div className="p-5 bg-[#F2F1ED]/40 border border-[#1A1A1A]/10 rounded-2xl text-slate-700 font-serif leading-relaxed italic text-sm">
              "Kami di Meta Connect percaya bahwa keterbukaan gagasan adalah jalan perbaikan persekutuan gereja yang sehat. Setiap saran Anda dilindungi kerahasiaan identitasnya di depan umum, dikirim eksklusif pada pilar Gembala lokal atau dikirim langsung ke tim pengembang Sinode Pusat."
            </div>
          </div>

          {/* Sugg Writer - Right */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#1A1A1A]/10 space-y-4 text-xs shadow-xs font-sans">
            <h4 className="font-bold text-[#1A1A1A]/70 uppercase tracking-widest font-mono text-[10px]">Kirim Masukan</h4>
            
            <form onSubmit={handleAddSuggestion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] text-[#1A1A1A]/60 font-bold uppercase tracking-wider">Tujuan Sasaran</label>
                <select
                  value={suggTarget}
                  onChange={(e) => setSuggTarget(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-[#1A1A1A]/15 rounded-xl bg-white text-slate-800 focus:outline-none"
                >
                  <option value="LOCAL">Eksklusif Gembala Sidang Lokal</option>
                  <option value="PUSAT">Moderator Sistem Pusat (Sinode)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-[#1A1A1A]/60 font-bold uppercase tracking-wider">Isi Kritik & Masukan</label>
                <textarea
                  required
                  placeholder="Deskripsikan saran perbaikan fasilitas gereja lokal atau keluhan bug aplikasi..."
                  value={suggText}
                  onChange={(e) => setSuggText(e.target.value)}
                  rows={4}
                  className="w-full border border-[#1A1A1A]/15 rounded-xl p-3 focus:outline-none bg-[#F2F1ED]/20 text-[#1A1A1A]"
                />
              </div>

              {suggFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-100">
                  {suggFeedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition"
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
