import React, { useState } from 'react';
import { TicketItem } from '../types';
import { TicketPassCard } from './TicketPassCard';
import { Ticket, QrCode, Filter, Sparkles, Trash2, Plus } from 'lucide-react';

interface MyTicketsViewProps {
  tickets: TicketItem[];
  onOpenStore: () => void;
  onTestScanTicket: (ticketNumber: string) => void;
  onOpenPrintModal: (ticket: TicketItem) => void;
  onClearAllTickets: () => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  tickets,
  onOpenStore,
  onTestScanTicket,
  onOpenPrintModal,
  onClearAllTickets
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
            <span>Carteira de Ingressos & Impressão</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ingressos do Batismo dos Caloiros
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gera e imprime os bilhetes nas dimensões físicas de <strong>50mm de largura × 80mm de altura (5:8)</strong> com validação por QR Code.
          </p>
        </div>

        {/* Filter Segmented Control & Actions */}
        <div className="flex flex-wrap items-center gap-3">
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
            onClick={onOpenStore}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Novo Bilhete</span>
          </button>

          {tickets.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Deseja limpar todos os bilhetes emitidos e deixar o sistema vazio?')) {
                  onClearAllTickets();
                }
              }}
              title="Limpar todos os bilhetes"
              className="p-2 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Limpar Tudo</span>
            </button>
          )}
        </div>
      </div>

      {/* Ticket List or Clean Empty State */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Sistema Limpo · Nenhum Bilhete Emitido
          </h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Todas as informações serão inseridas por si. Clique abaixo para emitir os primeiros bilhetes com pagamento a dinheiro em mão e gerar no tamanho <strong>50mm × 80mm</strong>.
          </p>
          <button
            onClick={onOpenStore}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20"
          >
            Emitir Primeiro Ingresso (Pagar em Mão)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTickets.map((t) => (
            <TicketPassCard
              key={t.id}
              ticket={t}
              onTestScan={onTestScanTicket}
              onOpenPrintModal={onOpenPrintModal}
            />
          ))}
        </div>
      )}
    </section>
  );
};
