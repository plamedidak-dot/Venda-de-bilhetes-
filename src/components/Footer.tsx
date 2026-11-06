import React from 'react';
import { ShieldCheck, Heart, Building } from 'lucide-react';

interface FooterProps {
  onOpenStore: () => void;
  onOpenEvents: () => void;
  onOpenScanner: () => void;
  onOpenTickets: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStore,
  onOpenEvents,
  onOpenScanner,
  onOpenTickets
}) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-center md:text-left">
          <img
            src="/assets/aistudio/PEQUENO_87357065.png"
            alt="Complexo Escolar Privado Proglory"
            className="w-10 h-10 object-contain bg-white rounded p-0.5 border border-amber-400/40 shrink-0"
          />
          <img
            src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
            alt="Associação dos Estudantes AEP-2"
            className="w-10 h-10 object-contain bg-white rounded p-0.5 border border-amber-400/40 shrink-0"
          />
          <div className="space-y-0.5">
            <div className="text-white font-bold text-sm">
              Complexo Escolar Privado Proglory
            </div>
            <p className="text-slate-400 text-[11px]">
              Associação dos Estudantes (AEP-2 Da Graça - Polo II) · 20 de Novembro às 12h
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-slate-300 font-medium">
          <button onClick={onOpenStore} className="hover:text-amber-400 transition-colors">
            Bilhetes
          </button>
          <button onClick={onOpenEvents} className="hover:text-amber-400 transition-colors">
            Gestão de Eventos
          </button>
          <button onClick={onOpenTickets} className="hover:text-amber-400 transition-colors">
            Meus Ingressos
          </button>
          <button onClick={onOpenScanner} className="hover:text-emerald-400 transition-colors">
            Portaria QR
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Controlo de Acesso & Portaria C.E.P.P.</span>
        </div>
      </div>
    </footer>
  );
};
