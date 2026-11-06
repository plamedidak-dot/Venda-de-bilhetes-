import React, { useState, useEffect } from 'react';
import { TicketCategory, TicketItem, TicketTierId, UserProfile, CaloiroEvent, formatKwanza } from '../types';
import {
  X,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building,
  Receipt,
  Clock,
  Sparkles,
  Calculator
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: TicketCategory[];
  quantities: Record<TicketTierId, number>;
  onSuccess: (newTickets: TicketItem[]) => void;
  currentUser?: UserProfile | null;
  activeEvent?: CaloiroEvent;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  categories,
  quantities,
  onSuccess,
  currentUser,
  activeEvent
}) => {
  // Step: 'details' -> 'payment_cash' -> 'success'
  const [step, setStep] = useState<'details' | 'payment_cash' | 'success'>('details');

  // Mode:
  // 'cash_in_hand': Pagamento presencial liquidado a dinheiro agora (no balcão da AEP-2 / secretaria)
  // 'cash_reserve': Pré-reserva para pagar em dinheiro em mão até ao dia do evento no Polo II
  const [cashPaymentType, setCashPaymentType] = useState<'cash_in_hand' | 'cash_reserve'>('cash_in_hand');

  // Attendee / buyer info
  const [primaryName, setPrimaryName] = useState(currentUser?.name || '');
  const [primaryEmail, setPrimaryEmail] = useState(currentUser?.email || '');
  const [primaryPhone, setPrimaryPhone] = useState(currentUser?.phone || '923 000 000');
  const [studentNumber, setStudentNumber] = useState(currentUser?.studentNumber || '');
  const [facultyOrCourse, setFacultyOrCourse] = useState(currentUser?.courseOrClass || '10ª Classe');

  // Cash in Hand calculation states (Kwanza)
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [receivedByOfficer, setReceivedByOfficer] = useState('Tesouraria da Associação AEP-2 (Polo II)');
  const [manualReceiptNumber, setManualReceiptNumber] = useState('');
  const [createdTickets, setCreatedTickets] = useState<TicketItem[]>([]);

  // Calculate items
  const selectedTiers = categories.filter((c) => (quantities[c.id] || 0) > 0);
  const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = categories.reduce((acc, cat) => acc + (quantities[cat.id] || 0) * cat.price, 0);
  const requiresStudentId = selectedTiers.some((t) => t.requiresStudentNumber);

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setCashTendered(totalPrice);
      const rndRec = 'REC-KZ/' + Math.floor(1000 + Math.random() * 9000);
      setManualReceiptNumber(rndRec);

      if (currentUser) {
        setPrimaryName(currentUser.name);
        setPrimaryEmail(currentUser.email);
        setPrimaryPhone(currentUser.phone);
        if (currentUser.studentNumber) setStudentNumber(currentUser.studentNumber);
        if (currentUser.courseOrClass) setFacultyOrCourse(currentUser.courseOrClass);
      }
    }
  }, [isOpen, currentUser, totalPrice]);

  if (!isOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryName.trim() || !primaryEmail.trim()) return;
    setCashTendered(totalPrice);
    setStep('payment_cash');
  };

  const handleCompleteCashPayment = () => {
    const isPaidNow = cashPaymentType === 'cash_in_hand';
    const change = Math.max(0, cashTendered - totalPrice);

    // Generate actual TicketItems linked to user, event, and cash in hand receipt
    const newTickets: TicketItem[] = [];
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    selectedTiers.forEach((tier) => {
      const qty = quantities[tier.id] || 0;
      for (let i = 0; i < qty; i++) {
        const randCode = Math.floor(10000 + Math.random() * 90000);
        const prefix = tier.id === 'caloiro' ? 'CAL' : tier.id === 'vip' ? 'VIP' : tier.id === 'veterano' ? 'VET' : 'GER';
        const ticketNum = `CEPP-26-${prefix}-${randCode}`;
        const attendee = qty === 1 ? primaryName : `${primaryName} (Ingresso #${i + 1})`;

        const qrPayload = `CEPP26:${ticketNum}:${tier.id.toUpperCase()}:${encodeURIComponent(attendee)}:${totalPrice}KZ:${isPaidNow ? 'PAID_CASH' : 'RESERVED'}`;

        newTickets.push({
          id: 'tkt-' + Date.now() + '-' + i + '-' + Math.random().toString(36).substring(2, 7),
          ticketNumber: ticketNum,
          qrPayload,
          tierId: tier.id,
          tierName: tier.name,
          attendeeName: attendee,
          attendeeEmail: primaryEmail,
          attendeePhone: primaryPhone,
          studentNumber: tier.requiresStudentNumber ? studentNumber || 'N/A' : undefined,
          facultyOrCourse: tier.requiresStudentNumber ? facultyOrCourse || 'Geral' : undefined,
          wristbandColor: tier.wristbandColor,
          wristbandLabel: tier.wristbandLabel,
          price: tier.price,
          purchaseDate: dateStr,
          status: 'valid',
          doorFastTrack: tier.id === 'vip',
          eventId: activeEvent?.id || 'event-proglory-batismo-2026',
          eventName: activeEvent?.name || 'Batismo dos Caloiros 2026 - Complexo Escolar Privado Proglory',
          userId: currentUser?.id,
          paymentStatus: isPaidNow ? 'pago_em_mao' : 'pendente_pagamento_em_mao',
          paymentMethod: isPaidNow ? 'dinheiro_em_mao' : 'reserva_presencial',
          paymentReceivedBy: receivedByOfficer,
          cashReceiptNumber: manualReceiptNumber,
          amountReceivedInCash: isPaidNow ? cashTendered : undefined,
          changeGiven: isPaidNow ? change : undefined
        });
      }
    });

    setCreatedTickets(newTickets);
    setStep('success');

    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore fallback
    }

    onSuccess(newTickets);
  };

  const calculatedChange = Math.max(0, cashTendered - totalPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Institution Brand Stamp */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <img
            src="/assets/aistudio/PEQUENO_87357065.png"
            alt="Complexo Escolar Privado Proglory"
            className="w-9 h-9 object-contain bg-white rounded p-0.5 border border-amber-400/40"
          />
          <img
            src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
            alt="Associação dos Estudantes Proglory"
            className="w-9 h-9 object-contain bg-white rounded p-0.5 border border-amber-400/40"
          />
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Complexo Escolar Privado Proglory · AEP-2
            </div>
            <div className="text-xs font-semibold text-slate-200">
              Pagamento em Dinheiro (Kwanza) · {activeEvent?.name || 'Batismo dos Caloiros'}
            </div>
          </div>
        </div>

        {/* Step Indicator Header */}
        <div className="mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-1">
            <span>Passo {step === 'details' ? '1 de 2' : '2 de 2'}</span>
            <span>·</span>
            <span>{step === 'details' ? 'Dados do Estudante' : 'Registo do Pagamento em Mão'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {step === 'details' && 'Identificação para os Ingressos'}
            {step === 'payment_cash' && 'Pagamento em Mão (Kwanza - Kz)'}
            {step === 'success' && 'Bilhete Emitido com Sucesso!'}
          </h3>
        </div>

        {/* STEP 1: ATTENDEE DETAILS */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            {/* Order Mini-Recap in Kwanzas */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5 mb-4">
              <div className="flex justify-between font-semibold text-slate-200">
                <span>Total de Ingressos ({totalCount}):</span>
                <span className="font-mono-nums text-amber-400 font-bold text-sm">
                  {formatKwanza(totalPrice)}
                </span>
              </div>
              <div className="text-slate-400">
                {selectedTiers.map((t) => `${quantities[t.id]}x ${t.name} (${formatKwanza(t.price)})`).join(' + ')}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nome Completo do Titular / Caloiro *
              </label>
              <input
                type="text"
                required
                value={primaryName}
                onChange={(e) => setPrimaryName(e.target.value)}
                placeholder="Ex: Manuel Gonçalves da Costa"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Nome oficial para conferência na entrada do Polo II e entrega da pulseira.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email para Receber o QR Code *
                </label>
                <input
                  type="email"
                  required
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  placeholder="estudante@proglory.edu"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telemóvel (WhatsApp / Contacto em Angola) *
                </label>
                <input
                  type="tel"
                  required
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="923 000 000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors font-mono-nums"
                />
              </div>
            </div>

            {/* School credentials */}
            {requiresStudentId && (
              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Identificação Escolar do Complexo Escolar Privado Proglory</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Nº de Aluno / Mecanográfico
                    </label>
                    <input
                      type="text"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      placeholder="Ex: CEPP-2026/0491"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Classe / Turma
                    </label>
                    <input
                      type="text"
                      value={facultyOrCourse}
                      onChange={(e) => setFacultyOrCourse(e.target.value)}
                      placeholder="Ex: 10ª Classe - Físicas e Biológicas"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Avançar para Pagamento em Mão</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CASH PAYMENT IN KWANZA */}
        {step === 'payment_cash' && (
          <div className="space-y-5">
            {/* Amount Banner in Kwanza */}
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-amber-400/50 shadow-md">
              <div>
                <span className="text-xs text-slate-400 block">Total a Pagar em Dinheiro:</span>
                <span className="text-2xl font-black font-mono-nums text-amber-400">
                  {formatKwanza(totalPrice)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span>Moeda: <strong>Kwanza (Kz)</strong></span>
              </div>
            </div>

            {/* Mode Selector: Direct in hand payment vs Reservation */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCashPaymentType('cash_in_hand')}
                className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                  cashPaymentType === 'cash_in_hand'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <Banknote className="w-4 h-4 text-amber-400" />
                  <span>Pago a Dinheiro em Mão</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Dinheiro entregue no balcão da AEP-2 ou secretaria. Ativação imediata do QR Code.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCashPaymentType('cash_reserve')}
                className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                  cashPaymentType === 'cash_reserve'
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Reserva para Pagar na Escola</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Gera reserva e o aluno leva os Kwanzas em mão ao Polo II até 20 de Novembro.
                </p>
              </button>
            </div>

            {/* Cash Handout Form */}
            {cashPaymentType === 'cash_in_hand' ? (
              <div className="space-y-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Cálculo de Notas & Troco em Kwanzas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Valor Entregue pelo Aluno (Kz) *</label>
                    <input
                      type="number"
                      step="100"
                      min={totalPrice}
                      value={cashTendered}
                      onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono-nums font-bold text-sm focus:outline-none focus:border-amber-400"
                    />
                    {/* Quick amount shortcuts */}
                    <div className="flex gap-1.5 mt-2">
                      {[totalPrice, totalPrice + 500, totalPrice + 1000, 5000, 10000]
                        .filter((val, idx, arr) => val >= totalPrice && arr.indexOf(val) === idx)
                        .slice(0, 4)
                        .map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setCashTendered(val)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-mono-nums text-slate-300"
                          >
                            {formatKwanza(val)}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Troco a Devolver em Mão</label>
                    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono-nums font-bold text-base">
                      {formatKwanza(calculatedChange)}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {calculatedChange === 0 ? 'Valor exato entregue (sem troco)' : 'Entregar troco ao estudante'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="block text-slate-400 mb-1">Recebido por (Tesoureiro / Delegado)</label>
                    <input
                      type="text"
                      value={receivedByOfficer}
                      onChange={(e) => setReceivedByOfficer(e.target.value)}
                      placeholder="Nome do delegado AEP-2"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Nº do Recibo Físico / Manual</label>
                    <input
                      type="text"
                      value={manualReceiptNumber}
                      onChange={(e) => setManualReceiptNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-amber-400 font-mono-nums text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Ponto de Pagamento em Mão no Complexo Escolar Privado Proglory</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Local de Entrega:</span>
                    <strong className="text-white">Gabinete da AEP-2 · Polo II (Da Graça)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor a Entregar em Mão:</span>
                    <strong className="text-amber-400 font-mono-nums">{formatKwanza(totalPrice)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Prazo Limite:</span>
                    <strong className="text-white">20 de Novembro às 12h00</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ao clicares em "Confirmar Reserva", é gerado o código de pré-adesão. Basta apresentares o comprovativo no balcão para entrega do valor e levantamento da pulseira.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Voltar aos dados
              </button>

              <button
                type="button"
                onClick={handleCompleteCashPayment}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {cashPaymentType === 'cash_in_hand'
                    ? `Confirmar Pagamento em Mão (${formatKwanza(totalPrice)})`
                    : `Confirmar Reserva (${formatKwanza(totalPrice)})`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white mb-1">
                {cashPaymentType === 'cash_in_hand' ? 'Pagamento a Dinheiro Registado!' : 'Reserva de Bilhete Efetuada!'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Emitimos <span className="text-amber-400 font-bold">{createdTickets.length} {createdTickets.length === 1 ? 'ingresso' : 'ingressos'}</span> no valor total de <strong className="text-white font-mono-nums">{formatKwanza(totalPrice)}</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Estudante:</span>
                <span className="font-semibold text-white">{primaryName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estado do Pagamento:</span>
                <span className={`font-bold ${cashPaymentType === 'cash_in_hand' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {cashPaymentType === 'cash_in_hand' ? 'PAGO EM MÃO (DINHEIRO LIQUIDADO)' : 'PENDENTE DE PAGAMENTO NO POLO II'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Valor Total:</span>
                <span className="font-mono-nums text-amber-400 font-bold">{formatKwanza(totalPrice)}</span>
              </div>
              {cashPaymentType === 'cash_in_hand' && (
                <>
                  <div className="flex justify-between text-slate-300">
                    <span>Nº do Recibo:</span>
                    <span className="font-mono-nums text-slate-200">{manualReceiptNumber}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Recebido por:</span>
                    <span className="text-slate-300">{receivedByOfficer}</span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-md shadow-amber-500/20"
            >
              Ver Ingressos & QR Codes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
