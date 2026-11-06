import React from 'react';
import { Calendar, Clock, MapPin, ShieldCheck, Zap, ArrowDown, QrCode, DollarSign } from 'lucide-react';
import { CaloiroEvent, formatKwanza } from '../types';

interface HeroSectionProps {
  activeEvent: CaloiroEvent;
  onScrollToTickets: () => void;
  onOpenScanner: () => void;
  onOpenEventsManager: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeEvent,
  onScrollToTickets,
  onOpenScanner,
  onOpenEventsManager
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background Image with Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_batismo_caloiros_1793942326291.jpg"
          alt="Palco e estudantes no Batismo dos Caloiros"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-16 lg:pb-22">
        {/* Logos & Institution Presentation Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-sm max-w-2xl">
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Logo 1: Complexo Escolar Privado Proglory */}
            <img
              src="/assets/aistudio/PEQUENO_87357065.png"
              alt="Complexo Escolar Privado Proglory Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-white rounded-lg p-1 border border-amber-400/50 shadow-md shadow-black/40"
            />
            {/* Logo 2: Associação dos Estudantes */}
            <img
              src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
              alt="Associação dos Estudantes Do Complexo Escolar Privado Proglory Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-white rounded-lg p-1 border border-amber-400/50 shadow-md shadow-black/40"
            />
          </div>

          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight">
              Complexo Escolar Privado Proglory
            </h2>
            <p className="text-xs text-amber-400 font-semibold leading-snug">
              Associação dos Estudantes Do Complexo Escolar Privado Proglory
            </p>
            <p className="text-[11px] text-slate-400">
              AEP-2 Da Graça · Polo II
            </p>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400 mb-3 tracking-wide uppercase">
            <span>Atividade Oficial</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>20 de Novembro às 12h</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Batismo Académico</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-none mb-4">
            Batismo dos Caloiros <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500">Proglory 2026</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl text-pretty">
            A grande cerimónia de integração e apadrinhamento dos novos estudantes do <strong>Complexo Escolar Privado Proglory</strong> promovida pela <strong>Associação dos Estudantes (AEP-2 Da Graça - Polo II)</strong>. Bilheteira digital com QR codes únicos e validação instantânea na portaria.
          </p>

          {/* Activity Date, Time & Location Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-200 mb-8 max-w-2xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Data</span>
                <strong className="text-white">20 de Novembro</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Horário de Início</span>
                <strong className="text-amber-400 font-mono-nums">12:00 (Pontual)</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Preço Base</span>
                <strong className="text-white font-mono-nums">{formatKwanza(activeEvent.ticketPrice)}</strong>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onScrollToTickets}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Comprar Bilhete Online</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenScanner}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-medium text-xs sm:text-sm rounded-lg transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Portaria / Validador QR</span>
            </button>

            <button
              onClick={onOpenEventsManager}
              className="px-4 py-3 bg-slate-900/60 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-400/30 text-xs sm:text-sm rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>Gestão & Editar Preço</span>
            </button>
          </div>
        </div>

        {/* Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-6 border-t border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Início às 12h00</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono-nums text-white">20 Nov</p>
            <p className="text-xs text-slate-400">Polo II - Da Graça</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Validação Rápida</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono-nums text-white">&lt; 1 seg</p>
            <p className="text-xs text-slate-400">QR Code na portaria</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Anti-Duplicação</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono-nums text-white">100% Seguro</p>
            <p className="text-xs text-slate-400">Bloqueio automático de fraude</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              <span>Lotação Máxima</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono-nums text-white">{activeEvent.totalSpots}</p>
            <p className="text-xs text-slate-400">Estudantes e convidados</p>
          </div>
        </div>
      </div>
    </section>
  );
};
