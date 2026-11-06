import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { TicketItem, formatKwanza } from '../types';
import { Download, Printer, CheckCircle2, AlertOctagon, Sparkles, Copy, Check, Banknote, Maximize2 } from 'lucide-react';

interface TicketPassCardProps {
  ticket: TicketItem;
  onTestScan?: (ticketNumber: string) => void;
  onOpenPrintModal?: (ticket: TicketItem) => void;
}

export const TicketPassCard: React.FC<TicketPassCardProps> = ({
  ticket,
  onTestScan,
  onOpenPrintModal
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(ticket.ticketNumber, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#020617', // slate-950
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [ticket.ticketNumber]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticket.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `Bilhete-Proglory-${ticket.ticketNumber}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const isUsed = ticket.status === 'used';
  const isPaidCash = ticket.paymentStatus === 'pago_em_mao' || !ticket.paymentStatus;

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl transition-all max-w-sm w-full mx-auto"
    >
      {/* Header Accent Bar based on Wristband Color */}
      <div className={`h-2.5 w-full bg-gradient-to-r ${ticket.wristbandColor}`} />

      {/* Main Ticket Upper Section */}
      <div className="p-5 pb-4">
        {/* Event Header with Both Official Logos */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/PEQUENO_87357065.png"
              alt="Complexo Escolar Privado Proglory"
              className="w-8 h-8 object-contain bg-white rounded p-0.5 border border-amber-400/40 shrink-0"
            />
            <img
              src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
              alt="Associação dos Estudantes AEP-2"
              className="w-8 h-8 object-contain bg-white rounded p-0.5 border border-amber-400/40 shrink-0"
            />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-amber-400 leading-tight">
                C.E.P.P. · AEP-2
              </div>
              <h3 className="text-xs font-bold text-white leading-tight">
                BATISMO DOS CALOIROS '26
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          {isUsed ? (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded shrink-0">
              <AlertOctagon className="w-3 h-3 shrink-0" />
              <span>UTILIZADO</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded shrink-0">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>VÁLIDO</span>
            </div>
          )}
        </div>

        {/* Attendee Info */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/90 mb-4 space-y-1.5 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Titular do Ingresso:</span>
            <span className="text-sm font-bold text-white truncate block">{ticket.attendeeName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tipo de Ingresso:</span>
              <span className="font-semibold text-amber-300 text-xs truncate block">{ticket.tierName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pulseira Portaria:</span>
              <span className="font-semibold text-slate-200 text-xs truncate block">{ticket.wristbandLabel}</span>
            </div>
          </div>

          {ticket.studentNumber && (
            <div className="pt-1 border-t border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estudante / Turma:</span>
              <span className="text-slate-300 text-xs truncate block">
                Nº {ticket.studentNumber} · {ticket.facultyOrCourse || 'Geral'}
              </span>
            </div>
          )}

          {/* Cash Payment Stamp */}
          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Banknote className="w-3 h-3 text-emerald-400" />
              <span>Pagamento:</span>
            </span>
            <span className={`font-bold ${isPaidCash ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isPaidCash ? 'Pago em Mão a Dinheiro' : 'Pendente de Pagamento'}
            </span>
          </div>
        </div>

        {/* Center QR Code Container */}
        <div className="relative p-3 bg-white rounded-lg shadow-inner flex flex-col items-center justify-center">
          {isUsed && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center text-center p-4 z-10">
              <AlertOctagon className="w-8 h-8 text-red-500 mb-1" />
              <p className="text-xs font-bold text-white">BILHETE JÁ VALIDADO</p>
              <p className="text-[11px] text-slate-300 font-mono-nums mt-0.5">
                Entrada às {ticket.usedAt || '12h00'} na {ticket.validatedByGate || 'Portaria'}
              </p>
            </div>
          )}

          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code ${ticket.ticketNumber}`}
              className="w-44 h-44 object-contain"
            />
          ) : (
            <div className="w-44 h-44 bg-slate-100 animate-pulse rounded" />
          )}

          <div className="flex items-center gap-1.5 mt-1 text-slate-800 font-mono-nums font-bold text-xs">
            <span>{ticket.ticketNumber}</span>
            <button
              onClick={handleCopyCode}
              title="Copiar código do bilhete"
              className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Perforated Divider Ticket Effect */}
      <div className="relative flex items-center justify-between px-2">
        <div className="w-4 h-4 rounded-full bg-slate-950 -ml-4 border-r border-slate-800" />
        <div className="flex-1 border-b-2 border-dashed border-slate-800 mx-2" />
        <div className="w-4 h-4 rounded-full bg-slate-950 -mr-4 border-l border-slate-800" />
      </div>

      {/* Ticket Footer / Action Bar */}
      <div className="p-4 bg-slate-950/60 text-xs space-y-2.5">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span>Data: <strong>20 Nov 2026 · 12h00</strong></span>
          <span className="font-mono-nums text-amber-400 font-bold">{formatKwanza(ticket.price)}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Local: Polo II Da Graça</span>
          {ticket.cashReceiptNumber && (
            <span className="font-mono-nums">{ticket.cashReceiptNumber}</span>
          )}
        </div>

        {/* 50x80mm Format Notice & Action */}
        <div className="pt-1 flex flex-col gap-2">
          {onOpenPrintModal && (
            <button
              type="button"
              onClick={() => onOpenPrintModal(ticket)}
              className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Gerar em 50mm × 80mm (Proporção 5:8)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadImage}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded flex items-center justify-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Guardar QR</span>
            </button>

            {onTestScan && !isUsed && (
              <button
                type="button"
                onClick={() => onTestScan(ticket.ticketNumber)}
                className="py-1.5 px-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Validar Portaria</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
