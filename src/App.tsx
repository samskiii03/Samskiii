import React from 'react';
import { MetaConnectProvider, useMetaConnect } from './context/MetaConnectContext';
import LandingPage from './components/LandingPage';
import PusatDashboard from './components/PusatDashboard';
import GembalaDashboard from './components/GembalaDashboard';
import PengurusDashboard from './components/PengurusDashboard';
import JemaatDashboard from './components/JemaatDashboard';
import NotificationCenter from './components/NotificationCenter';
import { Sparkles, LogOut, ShieldCheck, Award, Users, UserCheck } from 'lucide-react';

function DashboardRouter() {
  const { currentUser, logout } = useMetaConnect();

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col font-sans">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white text-[#1A1A1A] border-b border-[#1A1A1A]/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          
          {/* Logo Brand Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">
              M
            </div>
            <div>
              <div className="font-serif italic text-2xl tracking-tight text-[#1A1A1A] flex items-center gap-1.5 leading-none">
                Meta Connect
                <span className="text-[9px] not-italic bg-[#E8E6E1] border border-[#1A1A1A]/10 text-[#1A1A1A] rounded px-1.5 font-sans font-bold tracking-widest">BETA</span>
              </div>
              <span className="text-[10px] text-[#1A1A1A]/50 uppercase tracking-widest block font-bold mt-0.5">Church Association Platform</span>
            </div>
          </div>

          {/* Right Header Navigation Panel */}
          {currentUser ? (
            <div className="flex items-center space-x-6">
              
              {/* Dynamic Role Badge */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Role Terkini</span>
                <div className="px-3 py-1 bg-[#E8E6E1] rounded-full text-[12px] font-medium text-[#1A1A1A]">
                  {currentUser.role === 'PUSAT' && 'Staff Pusat Sinode'}
                  {currentUser.role === 'GEMBALA' && 'Pastor Gembala'}
                  {currentUser.role === 'PENGURUS' && `Staff [${currentUser.officerTitle}]`}
                  {currentUser.role === 'JEMAAT' && 'Jemaat Lokal'}
                </div>
              </div>

              {/* Broadcast Notification panel bells */}
              <NotificationCenter />

              {/* User Profile info summary */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-[#1A1A1A]">{currentUser.name}</div>
                  <div className="text-[10px] text-[#1A1A1A]/60 font-mono tracking-tight">{currentUser.email}</div>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#1A1A1A]/20 bg-[#F0EFEC] flex items-center justify-center font-bold text-xs text-[#1A1A1A] shadow-sm">
                  {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JD'}
                </div>
              </div>

              {/* Logout and Escape */}
              <button
                id="btn-header-logout"
                onClick={logout}
                className="p-2 rounded-full border border-[#1A1A1A]/10 bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] transition-colors"
                title="Keluar dari Akun"
              >
                <LogOut className="h-4 w-4" />
              </button>

            </div>
          ) : (
            <button
              onClick={() => {
                const sec = document.getElementById('auth-section');
                if (sec) sec.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm transition"
            >
              Portal Akses
            </button>
          )}

        </div>
      </header>

      {/* Main Content routing workspace */}
      <main className="flex-grow">
        {!currentUser && <LandingPage />}
        {currentUser?.role === 'PUSAT' && <PusatDashboard />}
        {currentUser?.role === 'GEMBALA' && <GembalaDashboard />}
        {currentUser?.role === 'PENGURUS' && <PengurusDashboard />}
        {currentUser?.role === 'JEMAAT' && <JemaatDashboard />}
      </main>

      {/* Corporate Footprint Sign-off */}
      <footer className="h-16 bg-white border-t border-[#1A1A1A]/10 flex items-center px-10 justify-between text-[10px] uppercase font-bold tracking-[0.15em] text-[#1A1A1A]/50">
        <div>Sistem Terintegrasi v2.4.0 • Gereja Kristen Meta Connect</div>
        <div className="hidden md:flex items-center gap-4">
          <span>Status: Online</span>
          <span>•</span>
          <span>Terkoneksi ke Server Pusat</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <MetaConnectProvider>
      <DashboardRouter />
    </MetaConnectProvider>
  );
}
