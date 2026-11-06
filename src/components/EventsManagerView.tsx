import React, { useState } from 'react';
import { CaloiroEvent, formatKwanza } from '../types';
import { createEvent, updateEvent, deleteEvent, setActiveEventId } from '../utils/events';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building,
  Sparkles,
  Users,
  Banknote,
  Save,
  X
} from 'lucide-react';

interface EventsManagerViewProps {
  events: CaloiroEvent[];
  activeEvent: CaloiroEvent;
  onRefreshEvents: () => void;
  onSelectActiveEvent: (eventId: string) => void;
}

export const EventsManagerView: React.FC<EventsManagerViewProps> = ({
  events,
  activeEvent,
  onRefreshEvents,
  onSelectActiveEvent
}) => {
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CaloiroEvent | null>(null);

  // Quick price editor state for active event (in Kwanzas)
  const [quickPrice, setQuickPrice] = useState<string>(activeEvent.ticketPrice.toString());
  const [priceUpdatedMsg, setPriceUpdatedMsg] = useState(false);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('20 de Novembro de 2026');
  const [formTime, setFormTime] = useState('12:00');
  const [formLocation, setFormLocation] = useState('Instalações do C.E.P.P. - Da Graça (Polo II)');
  const [formPrice, setFormPrice] = useState('2500');
  const [formDescription, setFormDescription] = useState('');
  const [formSpots, setFormSpots] = useState('1000');
  const [formStatus, setFormStatus] = useState<'active' | 'upcoming' | 'completed'>('upcoming');

  const openCreateModal = () => {
    setFormName('Festa de Integração dos Caloiros 2026');
    setFormDate('20 de Novembro de 2026');
    setFormTime('12:00');
    setFormLocation('Polo II - Da Graça (Complexo Escolar Proglory)');
    setFormPrice('2500');
    setFormDescription('Atividade festiva de batismo e recepção aos novos estudantes do Complexo Escolar Privado Proglory.');
    setFormSpots('1000');
    setFormStatus('upcoming');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (evt: CaloiroEvent) => {
    setEditingEvent(evt);
    setFormName(evt.name);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormLocation(evt.location);
    setFormPrice(evt.ticketPrice.toString());
    setFormDescription(evt.description);
    setFormSpots(evt.totalSpots.toString());
    setFormStatus(evt.status);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice) || 2500;
    const spotsNum = parseInt(formSpots, 10) || 500;

    createEvent({
      name: formName,
      schoolName: 'Complexo Escolar Privado Proglory',
      associationName: 'Associação dos Estudantes Do Complexo Escolar Privado Proglory (AEP-2)',
      date: formDate,
      time: formTime,
      location: formLocation,
      ticketPrice: priceNum,
      description: formDescription,
      totalSpots: spotsNum,
      availableSpots: spotsNum,
      status: formStatus,
      bannerUrl: '/src/assets/images/hero_batismo_caloiros_1793942326291.jpg',
      categories: [
        {
          id: 'caloiro',
          name: 'Bilhete Caloiro',
          tagline: 'Novos Estudantes',
          price: priceNum,
          description: 'Acesso completo ao evento',
          wristbandColor: 'from-amber-400 to-yellow-600',
          wristbandLabel: 'Amarela',
          features: ['Acesso ao batismo', 'Fita oficial'],
          requiresStudentNumber: true,
          availableSpots: Math.floor(spotsNum * 0.4),
          totalSpots: Math.floor(spotsNum * 0.4)
        },
        {
          id: 'geral',
          name: 'Bilhete Geral',
          tagline: 'Convidados & Veteranos',
          price: Math.round(priceNum * 1.5),
          description: 'Acesso geral',
          wristbandColor: 'from-blue-600 to-indigo-800',
          wristbandLabel: 'Azul',
          features: ['Acesso geral'],
          requiresStudentNumber: false,
          availableSpots: Math.floor(spotsNum * 0.6),
          totalSpots: Math.floor(spotsNum * 0.6)
        }
      ]
    });

    setIsCreateModalOpen(false);
    onRefreshEvents();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const priceNum = parseFloat(formPrice) || editingEvent.ticketPrice;
    const spotsNum = parseInt(formSpots, 10) || editingEvent.totalSpots;

    updateEvent(editingEvent.id, {
      name: formName,
      date: formDate,
      time: formTime,
      location: formLocation,
      ticketPrice: priceNum,
      description: formDescription,
      totalSpots: spotsNum,
      status: formStatus
    });

    setEditingEvent(null);
    onRefreshEvents();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem a certeza que deseja eliminar o evento "${name}"?`)) {
      const ok = deleteEvent(id);
      if (!ok) {
        alert('Não é possível eliminar o único evento restante.');
      } else {
        onRefreshEvents();
      }
    }
  };

  const handleQuickPriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickPrice);
    if (!isNaN(val) && val >= 0) {
      updateEvent(activeEvent.id, { ticketPrice: val });
      onRefreshEvents();
      setPriceUpdatedMsg(true);
      setTimeout(() => setPriceUpdatedMsg(false), 2500);
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>Painel da Comissão Organizadora · AEP-2 Proglory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gestão de Festas & Batismos dos Caloiros
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Cria, edita e gere múltiplos eventos, datas, horários e preços dos bilhetes em Kwanzas (Kz) para o Complexo Escolar Privado Proglory.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Evento</span>
        </button>
      </div>

      {/* QUICK PRICE EDITOR FOR THE ACTIVE EVENT IN KWANZAS */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 rounded-xl border border-amber-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Banknote className="w-4 h-4" />
              <span>Edição Imediata do Preço em Kwanzas (Kz)</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {activeEvent.name}
            </h3>
            <p className="text-xs text-slate-400">
              Data: <strong className="text-slate-200">{activeEvent.date} às {activeEvent.time}</strong> · Local: <strong className="text-slate-200">{activeEvent.location}</strong>
            </p>
          </div>

          <form onSubmit={handleQuickPriceUpdate} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="number"
                step="100"
                min="0"
                value={quickPrice}
                onChange={(e) => setQuickPrice(e.target.value)}
                className="w-32 bg-slate-950 border border-amber-400 rounded-lg px-3 py-2 text-white font-mono-nums font-bold text-sm focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-amber-400">Kz</span>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Atualizar Preço</span>
            </button>
          </form>
        </div>

        {priceUpdatedMsg && (
          <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preço do bilhete atualizado com sucesso! O novo valor já está ativo na bilheteira.</span>
          </div>
        )}
      </div>

      {/* EVENTS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">
            Eventos Registados ({events.length})
          </h3>
          <span className="text-xs text-slate-400">
            Clica em "Definir como Ativo" para abrir a venda desse evento
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const isActive = evt.id === activeEvent.id;

            return (
              <div
                key={evt.id}
                className={`flex flex-col justify-between rounded-xl border p-5 bg-slate-900/80 transition-all ${
                  isActive
                    ? 'border-amber-400 ring-1 ring-amber-400/40 shadow-xl shadow-amber-500/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Status & Active Flag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : evt.status === 'upcoming'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isActive ? 'Ativo na Bilheteira' : evt.status === 'upcoming' ? 'Agendado' : 'Concluído'}
                    </span>

                    <span className="text-xs font-mono-nums font-bold text-amber-400">
                      Preço Base: {formatKwanza(evt.ticketPrice)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2 leading-snug">
                    {evt.name}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {evt.description}
                  </p>

                  {/* Metadata Items */}
                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono-nums">{evt.totalSpots} lugares disponíveis</span>
                    </div>
                  </div>
                </div>

                {/* Event Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {!isActive ? (
                    <button
                      type="button"
                      onClick={() => onSelectActiveEvent(evt.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg transition-all"
                    >
                      Definir como Ativo
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Em Venda</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(evt)}
                      title="Editar evento"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id, evt.name)}
                        title="Eliminar evento"
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Adicionar Nova Atividade / Festa dos Caloiros</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Evento *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Data *</label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="20 de Novembro de 2026"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Horário *</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="12:00"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Preço do Bilhete Base (Kz) *</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lotação Total (Lugares) *</label>
                  <input
                    type="number"
                    required
                    value={formSpots}
                    onChange={(e) => setFormSpots(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Localização no Recinto *</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Instalações do C.E.P.P. - Da Graça (Polo II)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Criar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
            <button
              onClick={() => setEditingEvent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Editar Evento e Preço dos Ingressos (Kwanza)</h3>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome do Evento</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Data</label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Horário</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Preço do Bilhete Base (Kz) *</label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-400 rounded-lg px-3 py-2 text-white font-mono-nums font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lotação Total</label>
                  <input
                    type="number"
                    required
                    value={formSpots}
                    onChange={(e) => setFormSpots(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Localização</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Gravar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
