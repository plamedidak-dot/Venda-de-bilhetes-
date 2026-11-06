import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { TicketItem, formatKwanza } from '../types';
import { X, Printer, Download, Sparkles, Check, Copy, Maximize2, Banknote, ShieldCheck } from 'lucide-react';

interface PrintableTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketItem;
  onTestScan?: (ticketNumber: string) => void;
}

export type TicketDimensionSize = '50x80' | '5x8';

export const PrintableTicketModal: React.FC<PrintableTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onTestScan
}) => {
  const [sizeMode, setSizeMode] = useState<TicketDimensionSize>('50x80');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticket) {
      QRCode.toDataURL(ticket.ticketNumber, {
        width: 350,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H'
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR for print', err));
    }
  }, [ticket]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticket.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;

    // Create high resolution canvas 5:8 ratio (1000px x 1600px)
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1600);

    // Accent top banner
    ctx.fillStyle = '#f59e0b'; // Amber 500
    ctx.fillRect(0, 0, 1000, 40);

    // Header text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COMPLEXO ESCOLAR PRIVADO PROGLORY', 500, 120);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('ASSOCIAÇÃO DOS ESTUDANTES (AEP-2)', 500, 165);

    ctx.fillStyle = '#475569';
    ctx.font = '22px sans-serif';
    ctx.fillText('Polo II · Da Graça', 500, 200);

    // Divider line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 230);
    ctx.lineTo(920, 230);
    ctx.stroke();

    // Event title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('BATISMO DOS CALOIROS', 500, 290);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('20 DE NOVEMBRO · 12H00', 500, 335);

    // Attendee Card Box
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(80, 370, 840, 240);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 370, 840, 240);

    ctx.fillStyle = '#64748b';
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TITULAR DO INGRESSO:', 110, 415);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(ticket.attendeeName, 110, 465);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(ticket.tierName, 110, 515);

    ctx.fillStyle = '#475569';
    ctx.font = '24px sans-serif';
    ctx.fillText(`Turma: ${ticket.facultyOrCourse || 'Geral'}  ·  Nº: ${ticket.studentNumber || '—'}`, 110, 565);

    // QR Code Image
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 250, 660, 500, 500);

      // Ticket number below QR
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ticket.ticketNumber, 500, 1220);

      // Price & Payment Stamp
      ctx.fillStyle = '#047857'; // emerald
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(`VALOR: ${formatKwanza(ticket.price)}  ·  PAGO EM MÃO (KZ)`, 500, 1290);

      if (ticket.cashReceiptNumber) {
        ctx.fillStyle = '#64748b';
        ctx.font = '22px monospace';
        ctx.fillText(`Recibo: ${ticket.cashReceiptNumber}  ·  Tesouraria AEP-2`, 500, 1335);
      }

      // Tear-off dashed divider
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(60, 1400);
      ctx.lineTo(940, 1400);
      ctx.stroke();
      ctx.setLineDash([]);

      // Footer notice
      ctx.fillStyle = '#64748b';
      ctx.font = '20px sans-serif';
      ctx.fillText('Apresentar este bilhete com QR Code na portaria do Polo II às 12h00', 500, 1460);
      ctx.fillText('Dimensão Física: 50mm × 80mm (Proporção 5:8)', 500, 1510);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Bilhete-${ticket.ticketNumber}-50x80mm.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    qrImg.src = qrDataUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-7 text-slate-100 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="no-print absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="no-print mb-5 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Gerador & Impressor Oficial de Bilhete</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Bilhete em Formato 5:8 (5mm / 50mm × 8mm / 80mm)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Gerado nas dimensões exatas de 5 de largura por 8 de altura para crachá, pulseira ou impressão em cartão.
          </p>
        </div>

        {/* Size Selection Tabs */}
        <div className="no-print flex items-center justify-between gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800 mb-6 text-xs">
          <span className="text-slate-400 font-medium pl-2">Dimensão de Saída:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSizeMode('50x80')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                sizeMode === '50x80'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              50mm × 80mm (5cm × 8cm - Crachá)
            </button>
            <button
              type="button"
              onClick={() => setSizeMode('5x8')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                sizeMode === '5x8'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5mm × 8mm (Micro-Escala)
            </button>
          </div>
        </div>

        {/* PRINTABLE TICKET CONTAINER (Adheres to 5:8 aspect ratio: width 50mm / height 80mm) */}
        <div className="flex flex-col items-center justify-center py-2">
          <div
            ref={ticketRef}
            id="ticket-to-print"
            className="printable-ticket-area relative bg-white text-slate-950 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-300 flex flex-col justify-between"
            style={{
              width: sizeMode === '5x8' ? '50mm' : '50mm', // displayed readable on screen at 50mm x 80mm
              minHeight: '80mm',
              height: '80mm',
              boxSizing: 'border-box',
              padding: '2.5mm',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {/* Top Bar Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

            {/* Header: Both Logos and Institution */}
            <div className="pt-1 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <img
                  src="/assets/aistudio/PEQUENO_87357065.png"
                  alt="Proglory"
                  className="w-5 h-5 object-contain"
                />
                <img
                  src="/assets/aistudio/LOGOTSHERT_010ed54a.png"
                  alt="AEP-2"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="text-[7.5px] font-black uppercase tracking-tight text-slate-900 leading-none">
                COMPLEXO ESCOLAR PRIVADO PROGLORY
              </div>
              <div className="text-[6.5px] font-bold text-amber-700 leading-tight">
                ASSOCIAÇÃO DOS ESTUDANTES (AEP-2)
              </div>
              <div className="text-[6px] text-slate-500 leading-none mt-0.5">
                BATISMO DOS CALOIROS · 20 NOV · 12H00
              </div>
            </div>

            {/* Attendee Info Card */}
            <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-left my-0.5">
              <div className="text-[6px] text-slate-500 uppercase font-semibold leading-none">
                TITULAR:
              </div>
              <div className="text-[9px] font-black text-slate-950 truncate leading-tight">
                {ticket.attendeeName}
              </div>
              <div className="flex items-center justify-between text-[6.5px] pt-0.5 text-slate-700 leading-none">
                <span className="font-bold text-amber-800">{ticket.tierName}</span>
                <span>{ticket.studentNumber ? `Nº ${ticket.studentNumber}` : ''}</span>
              </div>
            </div>

            {/* Center High-Density QR Code */}
            <div className="flex flex-col items-center justify-center my-0.5">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR ${ticket.ticketNumber}`}
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div className="w-24 h-24 bg-slate-100 animate-pulse rounded" />
              )}
              <div className="font-mono text-[7.5px] font-black text-slate-900 tracking-wider mt-0.5">
                {ticket.ticketNumber}
              </div>
            </div>

            {/* Payment & Tear-off Footer */}
            <div className="text-center pt-0.5 border-t border-dashed border-slate-300">
              <div className="text-[7px] font-black text-emerald-700 leading-tight">
                {formatKwanza(ticket.price)} · PAGO A DINHEIRO EM MÃO
              </div>
              <div className="text-[5.5px] text-slate-500 leading-none mt-0.5">
                {ticket.cashReceiptNumber ? `Recibo: ${ticket.cashReceiptNumber} · ` : ''}Polo II Da Graça · 50mm × 80mm
              </div>
            </div>
          </div>
        </div>

        {/* Physical Dimension Badge */}
        <div className="no-print mt-4 text-center">
          <span className="inline-block text-[11px] font-mono-nums text-amber-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full">
            📏 Dimensões Físicas: 50mm de largura × 80mm de altura (Proporção 5:8)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyCode}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar Código</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Descarregar PNG (5:8)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir no Tamanho Exato</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
