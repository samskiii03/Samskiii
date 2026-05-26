import React, { useState } from 'react';
import { useMetaConnect } from '../context/MetaConnectContext';
import { Layers, Shield, Award, Users, User, ChevronRight, Check } from 'lucide-react';

export default function DevelopmentBar() {
  const { currentUser, setCurrentUserDirectly, logout } = useMetaConnect();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-[#1A1A1A] border-b border-[#F2F1ED]/10 text-white z-50 relative font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-mono text-[9px] tracking-widest text-[#E8E6E1]/60 font-bold">MC SIMULATOR v1.0</span>
          <span className="text-[#F2F1ED]/25 font-sans">|</span>
          <span className="text-slate-300 text-[11px]">Beralih peran secara instan untuk menguji alur kerja:</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-300 hover:text-white px-3 py-1 rounded-full border border-white/20 font-mono text-[9px] uppercase tracking-widest transition cursor-pointer"
        >
          {isOpen ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>

      {isOpen && (
        <div className="bg-black/40 px-4 py-4 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* PUSAT SWITCH */}
              <button
                id="btn-switch-pusat"
                onClick={() => setCurrentUserDirectly('PUSAT')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  currentUser?.role === 'PUSAT'
                    ? 'bg-amber-100/10 border-amber-400 text-amber-400'
                    : 'bg-white/5 border-white/10 text-[#E8E6E1]/75 hover:bg-white/10'
                }`}
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>1. Admin Pusat</span>
              </button>

              {/* GEMBALA SWITCH */}
              <button
                id="btn-switch-gembala"
                onClick={() => setCurrentUserDirectly('GEMBALA', 'ch-1')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  currentUser?.role === 'GEMBALA'
                    ? 'bg-amber-100/10 border-amber-400 text-amber-400'
                    : 'bg-white/5 border-white/10 text-[#E8E6E1]/75 hover:bg-white/10'
                }`}
              >
                <Award className="h-3.5 w-3.5 shrink-0" />
                <span>2. Gembala</span>
              </button>

              {/* PENGURUS SEKRETARIS */}
              <button
                id="btn-switch-sekretaris"
                onClick={() => setCurrentUserDirectly('PENGURUS', 'ch-1', 'Sekretaris')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  currentUser?.role === 'PENGURUS' && currentUser?.officerTitle === 'Sekretaris'
                    ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-[#E8E6E1]/75 hover:bg-white/10'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>3. Sekretaris</span>
              </button>

              {/* PENGURUS BENDAHARA */}
              <button
                id="btn-switch-bendahara"
                onClick={() => setCurrentUserDirectly('PENGURUS', 'ch-1', 'Bendahara')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  currentUser?.role === 'PENGURUS' && currentUser?.officerTitle === 'Bendahara'
                    ? 'bg-indigo-500/10 border-indigo-400 text-indigo-400'
                    : 'bg-white/5 border-white/10 text-[#E8E6E1]/75 hover:bg-white/10'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>4. Bendahara</span>
              </button>

              {/* JEMAAT SWITCH */}
              <button
                id="btn-switch-jemaat"
                onClick={() => setCurrentUserDirectly('JEMAAT', 'ch-1')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                  currentUser?.role === 'JEMAAT'
                    ? 'bg-blue-500/10 border-blue-400 text-blue-400'
                    : 'bg-white/5 border-white/10 text-[#E8E6E1]/75 hover:bg-white/10'
                }`}
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>5. Jemaat</span>
              </button>

            </div>

            <div className="flex items-center justify-between gap-4 border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
              <span className="text-[#E8E6E1]/65 text-xs font-mono">
                Akun: {currentUser ? (
                  <span className="font-semibold text-white uppercase text-[11px]">
                    {currentUser.name} <span className="text-amber-500 font-bold">[{currentUser.role}]</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold italic text-[11px]">Landing Page (Belum Masuk)</span>
                )}
              </span>
              {currentUser && (
                <button
                  onClick={logout}
                  className="bg-red-950/40 hover:bg-red-900/60 text-red-300 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-mono font-bold border border-red-900/40 transition cursor-pointer"
                >
                  Keluar Akun
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
