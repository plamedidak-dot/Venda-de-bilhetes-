import React, { useState } from 'react';
import { UserProfile, TicketItem, formatKwanza } from '../types';
import { updateUserProfile } from '../utils/auth';
import { X, User, Mail, Phone, BookOpen, GraduationCap, ShieldCheck, Ticket, Calendar, QrCode, LogOut, Check, Save } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  userTickets: TicketItem[];
  onLogout: () => void;
  onSelectTicketPass: (ticket: TicketItem) => void;
  onProfileUpdated: (updatedUser: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userTickets,
  onLogout,
  onSelectTicketPass,
  onProfileUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [studentNumber, setStudentNumber] = useState(user.studentNumber || '');
  const [courseOrClass, setCourseOrClass] = useState(user.courseOrClass || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile({
      name,
      phone,
      studentNumber,
      courseOrClass
    });
    if (updated) {
      onProfileUpdated(updated);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const isOrganizer = user.role === 'organizer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              {user.avatarInitials || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  isOrganizer
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {isOrganizer ? 'Organizador AEP-2' : 'Estudante C.E.P.P.'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-nums mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Editar Perfil
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Dados do perfil atualizados com sucesso!</span>
          </div>
        )}

        {/* Profile Info / Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 mb-8 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <h4 className="font-bold text-white text-sm">Atualizar Dados Pessoais</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Telemóvel</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nº Mecanográfico / Aluno</label>
                <input
                  type="text"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Classe / Turma / Curso</label>
                <input
                  type="text"
                  value={courseOrClass}
                  onChange={(e) => setCourseOrClass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Gravar Alterações</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-8">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Telemóvel</span>
              <span className="font-mono-nums font-semibold text-slate-200">{user.phone || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Nº de Aluno</span>
              <span className="font-mono-nums font-semibold text-amber-300">{user.studentNumber || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Turma / Curso</span>
              <span className="font-semibold text-slate-200 truncate block">{user.courseOrClass || 'Geral'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Membro Desde</span>
              <span className="font-mono-nums text-slate-400">{user.createdAt}</span>
            </div>
          </div>
        )}

        {/* PURCHASED TICKETS HISTORY SECTION */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">
                Histórico de Ingressos Comprados ({userTickets.length})
              </h4>
            </div>
            <span className="text-xs text-slate-400">
              Registados nesta conta para acesso rápido
            </span>
          </div>

          {userTickets.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800 p-6">
              <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">Nenhum bilhete adquirido ainda</p>
              <p className="text-xs text-slate-500 mt-1">
                Ao comprar ingressos para o Batismo dos Caloiros, eles ficarão guardados aqui para acesso imediato.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userTickets.map((t) => {
                const isUsed = t.status === 'used';
                return (
                  <div
                    key={t.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{t.tierName}</span>
                        <span className="font-mono-nums text-[11px] text-amber-400 font-semibold">
                          {t.ticketNumber}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        {t.eventName || 'Batismo dos Caloiros 2026 - C.E.P.P.'}
                      </p>
                      <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                        <span>Comprado em: {t.purchaseDate}</span>
                        <span>·</span>
                        <span className="font-mono-nums text-amber-400 font-bold">{formatKwanza(t.price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isUsed ? (
                        <span className="text-[11px] font-bold text-red-400 bg-red-950/70 border border-red-800 px-2 py-0.5 rounded">
                          Entrada Validada ({t.usedAt || '12h00'})
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
                          Válido para Acesso
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onSelectTicketPass(t);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Ver QR</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
