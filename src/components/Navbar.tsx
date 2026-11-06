import React from 'react';
import { Ticket, QrCode, CalendarDays, User, LogIn } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'store' | 'events' | 'my-tickets' | 'scanner' | 'info';
  setActiveTab: (tab: 'store' | 'events' | 'my-tickets' | 'scanner' | 'info') => void;
  myTicketsCount: number;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  myTicketsCount,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-2.5">
        {/* Zone 1: Brand Zone with both official logos */}
        <button
          onClick={() => setActiveTab('store')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group transition-opacity hover:opacity-90"
        >
          {/* Logo 1: Complexo Escolar Privado Proglory */}
          <img
            src="/assets/aistudio/PEQUENO_87357065.png"
            alt="Complexo Escolar Privado Proglory"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain bg-white rounded p-0.5 border border-amber-400/40 shrink-0"
          />
          {/* Logo 2: AEP-2 Associação dos Estudantes */}
          <img
            src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
            alt="Associação dos Estudantes Proglory"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain bg-white rounded p-0.5 border border-amber-400/40 shrink-0"
          />
          <div className="hidden sm:block">
            <span className="text-sm font-bold tracking-tight text-white block leading-tight">
              C.E.P.P. · PROGLORY
            </span>
            <span className="text-[10px] text-amber-400 font-semibold block leading-none">
              AEP-2 Da Graça (Polo II)
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('store')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'store' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Bilheteira
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'events' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span>Gestão de Eventos</span>
          </button>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'my-tickets' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <Ticket className="w-4 h-4 text-slate-400" />
            <span>Meus Ingressos</span>
            {myTicketsCount > 0 && (
              <span className="text-[11px] font-mono-nums px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded">
                {myTicketsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'scanner' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Portaria QR</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action (User Profile / Auth) */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                {currentUser.avatarInitials || currentUser.name[0]}
              </div>
              <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Entrar / Perfil</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile subnavigation */}
      <div className="flex md:hidden border-t border-slate-900 bg-slate-950 px-2 py-2 justify-around text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('store')}
          className={`py-1 px-2 rounded ${activeTab === 'store' ? 'text-amber-400 bg-slate-900 font-semibold' : ''}`}
        >
          Bilhetes
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`py-1 px-2 rounded ${activeTab === 'events' ? 'text-amber-400 bg-slate-900 font-semibold' : ''}`}
        >
          Eventos
        </button>
        <button
          onClick={() => setActiveTab('my-tickets')}
          className={`py-1 px-2 rounded flex items-center gap-1 ${activeTab === 'my-tickets' ? 'text-amber-400 bg-slate-900 font-semibold' : ''}`}
        >
          <span>Ingressos</span>
          {myTicketsCount > 0 && (
            <span className="text-[10px] font-mono-nums bg-amber-500 text-slate-950 px-1 rounded font-bold">
              {myTicketsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`py-1 px-2 rounded flex items-center gap-1 ${activeTab === 'scanner' ? 'text-emerald-400 bg-slate-900 font-semibold' : ''}`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Portaria</span>
        </button>
      </div>
    </header>
  );
};
