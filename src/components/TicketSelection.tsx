import React from 'react';
import { CaloiroEvent, TicketTierId, formatKwanza } from '../types';
import { Check, Plus, Minus, ShieldAlert, Sparkles, ShoppingBag, Calendar, Clock, MapPin, Banknote } from 'lucide-react';

interface TicketSelectionProps {
  activeEvent: CaloiroEvent;
  quantities: Record<TicketTierId, number>;
  onUpdateQuantity: (id: TicketTierId, delta: number) => void;
  onProceedToCheckout: () => void;
  onOpenEventsManager: () => void;
}

export const TicketSelection: React.FC<TicketSelectionProps> = ({
  activeEvent,
  quantities,
  onUpdateQuantity,
  onProceedToCheckout,
  onOpenEventsManager
}) => {
  const categories = activeEvent.categories;
  const totalCount = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const totalPrice = categories.reduce((acc, cat) => acc + (quantities[cat.id] || 0) * cat.price, 0);

  return (
    <section id="bilhetes-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Event Header Banner */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <span>Bilheteira Oficial · {activeEvent.schoolName}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>AEP-2 Da Graça</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5" />
              <span>Pagamento a Dinheiro em Mão</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            {activeEvent.name}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeEvent.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-amber-400 font-mono-nums">{activeEvent.time}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeEvent.location}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5">
          <div className="text-xs text-slate-400 flex items-center gap-2 justify-center sm:justify-end">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Validação por QR Code na entrada</span>
          </div>
          <button
            type="button"
            onClick={onOpenEventsManager}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium self-center sm:self-end"
          >
            Editar Preços em Kwanzas ou Trocar Evento
          </button>
        </div>
      </div>

      {/* Ticket Grid (4 columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((tier) => {
          const qty = quantities[tier.id] || 0;
          const isSelected = qty > 0;

          return (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 bg-slate-900/70 ${
                isSelected
                  ? 'border-amber-400 ring-1 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Highlight ribbon if caloiro or popular */}
              {tier.popular && (
                <div className="absolute -top-3 left-4 bg-amber-400 text-slate-950 text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" />
                  <span>Destaque Caloiro</span>
                </div>
              )}

              <div>
                <div className="text-xs font-mono-nums text-slate-400 mb-1">
                  {tier.availableSpots} bilhetes disponíveis
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {tier.name}
                </h3>

                <p className="text-xs text-amber-300 font-medium mb-3">
                  {tier.tagline}
                </p>

                {/* Price Display in Kwanzas */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono-nums text-white">
                    {formatKwanza(tier.price)}
                  </span>
                  {tier.originalPrice && tier.originalPrice > tier.price && (
                    <span className="text-xs font-mono-nums line-through text-slate-500">
                      {formatKwanza(tier.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">/ ingresso</span>
                </div>

                {/* Wristband indicator */}
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 mb-4">
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${tier.wristbandColor} shrink-0`} />
                  <span className="truncate">Pulseira: {tier.wristbandLabel}</span>
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Quantidade:</span>
                  <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(tier.id, -1)}
                      disabled={qty === 0}
                      aria-label="Diminuir quantidade"
                      className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-mono-nums font-bold text-sm text-white">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(tier.id, 1)}
                      disabled={totalCount >= 6 || qty >= tier.availableSpots}
                      aria-label="Aumentar quantidade"
                      className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Order Bar when items are selected */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-4xl mx-auto bg-slate-900/95 border border-amber-400/80 shadow-2xl shadow-black/80 rounded-xl p-4 sm:p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/40">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Resumo da Seleção</span>
                <span>·</span>
                <span className="font-semibold text-white">{totalCount} {totalCount === 1 ? 'ingresso' : 'ingressos'}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono-nums text-white">
                Total: <span className="text-amber-400">{formatKwanza(totalPrice)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToCheckout}
            className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 shrink-0"
          >
            <span>Pagar em Mão & Gerar Ingressos</span>
            <span className="font-mono-nums">({formatKwanza(totalPrice)})</span>
          </button>
        </div>
      )}
    </section>
  );
};
