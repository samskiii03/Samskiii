import React, { useState } from 'react';
import { useMetaConnect } from '../context/MetaConnectContext';
import { Bell, Info, AlertTriangle, MessageSquare, ShieldAlert, X } from 'lucide-react';

export default function NotificationCenter() {
  const { currentUser, notifications } = useMetaConnect();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  // Filter notifications: PUSAT broadcasts GLOBAL or to user's church specifically
  const userNotifs = notifications.filter(n => {
    if (currentUser.role === 'PUSAT') return true; // Pusat sees all logs
    return n.toChurchId === 'GLOBAL' || n.toChurchId === currentUser.churchId;
  });

  const unreadCount = userNotifs.length; // mock all unread for evaluation purposes

  return (
    <div className="relative font-sans text-xs">
      <button
        id="btn-trigger-notif"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-white hover:bg-white/10 rounded-full bg-[#1A1A1A] border border-white/10 transition flex items-center justify-center focus:outline-none cursor-pointer"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-650 text-white border-2 border-[#1A1A1A] px-1 py-0.5 rounded-full font-bold text-[8px] min-w-[16px] text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-[#1A1A1A]/15 rounded-3xl shadow-lg z-55 overflow-hidden divide-y divide-[#1A1A1A]/10 animate-scaleIn">
          
          <div className="px-5 py-4 bg-[#1A1A1A] text-white flex justify-between items-center">
            <span className="font-serif italic font-bold flex items-center gap-1.5 text-sm">
              <Bell className="h-4 w-4 text-white" /> Pengumuman Sinode
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {userNotifs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-serif italic">
                Tidak ada pengumuman baru untuk Anda.
              </div>
            ) : (
              userNotifs.slice().reverse().map(notif => {
                let colorBorder = 'border-[#1A1A1A]';
                let icon = <Info className="h-4 w-4 text-[#1A1A1A] shrink-0" />;
                let bgColor = 'bg-[#F2F1ED]/25';

                if (notif.type === 'WARNING') {
                  colorBorder = 'border-amber-700';
                  bgColor = 'bg-amber-50/40';
                } else if (notif.type === 'ALERT') {
                  colorBorder = 'border-red-700';
                  bgColor = 'bg-red-50/40';
                }

                return (
                  <div key={notif.id} className={`p-4 border-l-4 ${colorBorder} ${bgColor} space-y-1 hover:bg-[#F2F1ED]/10 transition`}>
                    <div className="flex justify-between items-center text-[10px] gap-1">
                      <span className="font-bold text-[#1A1A1A] text-[11px] truncate pr-2">{notif.title}</span>
                      <span className="text-[9px] text-slate-400 font-mono shrink-0">{new Date(notif.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p className="text-[#1A1A1A]/80 text-[10px] leading-relaxed font-sans">{notif.message}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 text-center text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/50 bg-[#F2F1ED]/25 font-mono">
            Sistem Saling-Hubung Meta Connect
          </div>

        </div>
      )}
    </div>
  );
}
