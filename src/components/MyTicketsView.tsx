import React, { useState } from 'react';
import { TicketItem } from '../types';
import { TicketPassCard } from './TicketPassCard';
import { Ticket, QrCode, Filter, Sparkles, RefreshCw } from 'lucide-react';

interface MyTicketsViewProps {
  tickets: TicketItem[];
  onOpenStore: () => void;
  onTestScanTicket: (ticketNumber: string) => void;
  onResetDemoData: () => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  tickets,
  onOpenStore,
  onTestScanTicket,
  onResetDemoData
}) => {
  const [filter, setFilter] = useState<'all' | 'valid' | 'used'>('all');

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'valid') return t.status === 'valid';
    if (filter === 'used') return t.status === 'used';
    return true;
  });

  const validCount = tickets.filter((t) => t.status === 'valid').length;
  const usedCount = tickets.filter((t) => t.status === 'used').length;

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Ticket className="w-3.5 h-3.5" />
            <span>Carteira Digital de Ingressos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Os Meus Bilhetes do Batismo
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Apresenta o QR code diretamente no teu telemóvel na portaria do recinto. A ligação à internet não é obrigatória.
          </p>
        </div>

        {/* Filter Segmented Control & Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'all' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({tickets.length})
            </button>
            <button
              onClick={() => setFilter('valid')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'valid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Válidos ({validCount})
            </button>
            <button
              onClick={() => setFilter('used')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === 'used' ? 'bg-red-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Utilizados ({usedCount})
            </button>
          </div>

          <button
            onClick={onResetDemoData}
            title="Repor bilhetes de demonstração"
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ticket List or Empty State */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800/80 p-8 max-w-md mx-auto">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            Nenhum bilhete encontrado nesta categoria
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Adquire o teu bilhete oficial para o Batismo dos Caloiros com emissão instantânea de código QR.
          </p>
          <button
            onClick={onOpenStore}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all"
          >
            Comprar Bilhete Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTickets.map((t) => (
            <TicketPassCard
              key={t.id}
              ticket={t}
              onTestScan={onTestScanTicket}
            />
          ))}
        </div>
      )}
    </section>
  );
};
