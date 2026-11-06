import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { TicketItem, GateValidationResult, GateLogEntry, formatKwanza } from '../types';
import { scannerAudio } from '../utils/audio';
import {
  validateTicketCode,
  getStoredGateLogs,
  getStoredTickets,
  addTickets,
  resetDemoDataToInitial
} from '../utils/storage';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  QrCode,
  Users,
  Search,
  RotateCcw,
  Volume2,
  VolumeX,
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface GateScannerViewProps {
  initialTestCode?: string;
  onClearInitialCode?: () => void;
  onRefreshTickets: () => void;
}

export const GateScannerView: React.FC<GateScannerViewProps> = ({
  initialTestCode,
  onClearInitialCode,
  onRefreshTickets
}) => {
  const [manualCode, setManualCode] = useState('');
  const [selectedGate, setSelectedGate] = useState('Porta 1 - Principal (Caloiros)');
  const [validationResult, setValidationResult] = useState<GateValidationResult | null>(null);
  const [gateLogs, setGateLogs] = useState<GateLogEntry[]>([]);
  const [ticketsList, setTicketsList] = useState<TicketItem[]>([]);
  const [guestSearch, setGuestSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Camera scanner states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'portaria-qr-reader-viewport';

  // Load state on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTicketsList(getStoredTickets());
    setGateLogs(getStoredGateLogs());
  };

  // If a test code was requested from the wallet or ticket card
  useEffect(() => {
    if (initialTestCode) {
      handleValidateCode(initialTestCode);
      if (onClearInitialCode) onClearInitialCode();
    }
  }, [initialTestCode]);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  const startCameraScanner = async () => {
    setCameraError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }
      setIsCameraActive(true);

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleValidateCode(decodedText);
        },
        () => {
          // Frame scan error - keep scanning silently
        }
      );
    } catch (err: unknown) {
      console.warn('Camera failed to start:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setCameraError(
        msg.includes('NotAllowedError') || msg.includes('Permission')
          ? 'Permissão de câmara negada pelo navegador. Podes usar a validação por código abaixo.'
          : 'Câmara não detetada ou indisponível. Utiliza o teclado ou a lista de testes rápidos.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsCameraActive(false);
  };

  const handleValidateCode = (code: string) => {
    if (!code || !code.trim()) return;

    const result = validateTicketCode(code, selectedGate);
    setValidationResult(result);

    // Audio feedback
    if (soundEnabled) {
      if (result.status === 'success') {
        scannerAudio.playSuccess();
      } else if (result.status === 'already_used') {
        scannerAudio.playAlreadyUsed();
      } else {
        scannerAudio.playInvalid();
      }
    }

    // Refresh tickets and logs
    loadData();
    onRefreshTickets();
    setManualCode('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidateCode(manualCode);
  };

  const handleResetData = () => {
    resetDemoDataToInitial();
    loadData();
    onRefreshTickets();
    setValidationResult(null);
  };

  // Metrics
  const totalSold = ticketsList.length;
  const validatedCount = ticketsList.filter((t) => t.status === 'used').length;
  const pendingCount = totalSold - validatedCount;
  const occupancyPercent = totalSold > 0 ? Math.round((validatedCount / 2500) * 100) : 0;

  // Filtered guest list for manual search
  const filteredGuests = ticketsList.filter((t) => {
    const q = guestSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      t.attendeeName.toLowerCase().includes(q) ||
      t.ticketNumber.toLowerCase().includes(q) ||
      (t.studentNumber && t.studentNumber.toLowerCase().includes(q))
    );
  });

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Portaria Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sistema de Controlo de Acessos & Portaria</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Validador de Entrada (QR Gate Check-In)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Leitura ótica de alta velocidade com deteção de bilhetes duplicados e indicação de cor de pulseira oficial.
          </p>
        </div>

        {/* Gate Selection and Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
          >
            <option value="Porta 1 - Principal (Caloiros)">Porta 1 - Principal (Caloiros)</option>
            <option value="Porta 2 - Sócios & Doutores">Porta 2 - Sócios & Doutores</option>
            <option value="Porta 3 - VIP Fast-Track">Porta 3 - VIP Fast-Track</option>
            <option value="Porta 4 - Bilhetes Gerais">Porta 4 - Bilhetes Gerais</option>
          </select>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-slate-900 border-slate-800 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Som de feedback ativo' : 'Som desativado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Som ON' : 'Mudo'}</span>
          </button>

          <button
            onClick={handleResetData}
            title="Repor lista de demonstração"
            className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Repor Demo</span>
          </button>
        </div>
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
            Entradas Validadas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-nums text-emerald-400">
              {validatedCount}
            </span>
            <span className="text-xs text-slate-400">/ {totalSold} bilhetes</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
            Afluência no Recinto
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-nums text-white">
              {occupancyPercent}%
            </span>
            <span className="text-xs text-slate-400">lotação (2.500)</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
            Por Entrar (Na Fila)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-nums text-amber-400">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-400">estudantes</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block mb-1">
            Tempo Médio Portaria
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono-nums text-blue-400">
              0.8 s
            </span>
            <span className="text-xs text-slate-400">por caloiro</span>
          </div>
        </div>
      </div>

      {/* Main Validation Console (Split 2-columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Column: Live Scanner + Manual Entry (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Camera Scanner Box */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Leitor Ótico de Câmara
                </h3>
              </div>

              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCameraScanner}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ativar Câmara</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCameraScanner}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>Desligar Câmara</span>
                </button>
              )}
            </div>

            {/* Viewport for html5-qrcode */}
            <div className="relative bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
              <div id={scannerContainerId} className="w-full max-w-[340px]" />

              {!isCameraActive && (
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Câmara de Portaria em Pausa
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
                      Clica em <strong>Ativar Câmara</strong> para ler QR Codes em tempo real com o teu telemóvel ou webcam.
                    </p>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="p-3 m-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Manual / Barcode Gun Input */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Validação Manual ou Leitor de Código de Barras (Pistola USB/Bluetooth)
            </h4>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ex: BAT-26-CAL-10492 ou colar código QR"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono-nums placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all shrink-0 shadow-sm"
              >
                Validar Entrada
              </button>
            </form>
          </div>

          {/* Quick 1-Click Test Scans (Enables instantaneous testing without second device!) */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Testes Rápidos de Demonstração (1 Clique)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">Clica para simular a passagem no scanner</span>
            </div>

            <div className="space-y-2">
              {ticketsList.slice(0, 4).map((ticket) => {
                const isUsed = ticket.status === 'used';
                return (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors text-xs"
                  >
                    <div className="truncate mr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{ticket.attendeeName}</span>
                        <span className="font-mono-nums text-[11px] text-slate-400">{ticket.ticketNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="text-amber-300">{ticket.tierName}</span>
                        <span>·</span>
                        <span>Pulseira: {ticket.wristbandLabel}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleValidateCode(ticket.ticketNumber)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-all ${
                        isUsed
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isUsed ? 'Testar Duplicado' : 'Validar Entrada'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Gate Feedback Screen (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Big Visual Indicator */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ecrã da Portaria · Feedback Imediato
                </span>
                <span className="text-xs font-mono-nums text-slate-400">{selectedGate}</span>
              </div>

              {validationResult ? (
                <div className="animate-in fade-in zoom-in-95 duration-150">
                  {/* SUCCESS */}
                  {validationResult.status === 'success' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30">
                          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                        </div>
                        <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-tight">
                          ENTRADA AUTORIZADA
                        </h3>
                        <p className="text-xs text-slate-200 mt-1">
                          Validação efetuada às {validationResult.timestamp}
                        </p>
                      </div>

                      {/* Attendee Card */}
                      {validationResult.ticket && (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estudante / Titular:</span>
                            <span className="text-lg font-bold text-white block">
                              {validationResult.ticket.attendeeName}
                            </span>
                            {validationResult.ticket.facultyOrCourse && (
                              <span className="text-xs text-slate-300 block">
                                {validationResult.ticket.facultyOrCourse} {validationResult.ticket.studentNumber ? `(Nº ${validationResult.ticket.studentNumber})` : ''}
                              </span>
                            )}
                          </div>

                          {/* Big Wristband Handout Instruction */}
                          <div className="p-3 bg-slate-900 rounded-lg border border-amber-400/50 space-y-1">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                              ATRIBUIR PULSEIRA OFICIAL:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${validationResult.ticket.wristbandColor} shrink-0 shadow-sm`} />
                              <span className="text-sm font-extrabold text-white">
                                {validationResult.ticket.wristbandLabel}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                            <span>Bilhete: <strong className="font-mono-nums text-slate-200">{validationResult.ticket.ticketNumber}</strong></span>
                            <span className="font-mono-nums text-amber-400 font-bold">{formatKwanza(validationResult.ticket.price)}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>{validationResult.ticket.tierName}</span>
                            <span className="text-emerald-400 font-semibold">✓ Pago em Mão (Kz)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ALREADY USED */}
                  {validationResult.status === 'already_used' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-red-500/20 border-2 border-red-500 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-red-500/30">
                          <AlertOctagon className="w-10 h-10 stroke-[2.5]" />
                        </div>
                        <h3 className="text-2xl font-black text-red-400 uppercase tracking-tight">
                          BILHETE JÁ UTILIZADO!
                        </h3>
                        <p className="text-xs text-red-200 font-semibold mt-1">
                          Acesso Bloqueado · Duplicação Proibida
                        </p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-red-900/50 space-y-2 text-xs">
                        <p className="text-slate-300">
                          {validationResult.message}
                        </p>
                        {validationResult.ticket && (
                          <div className="pt-2 border-t border-slate-800 text-slate-400 space-y-1">
                            <div>Titular original: <strong className="text-white">{validationResult.ticket.attendeeName}</strong></div>
                            <div>Código: <strong className="text-amber-400 font-mono-nums">{validationResult.ticket.ticketNumber}</strong></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* INVALID / NOT FOUND */}
                  {validationResult.status === 'invalid' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-amber-500/20 border-2 border-amber-500 text-center">
                        <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/30">
                          <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
                        </div>
                        <h3 className="text-2xl font-black text-amber-400 uppercase tracking-tight">
                          CÓDIGO INVÁLIDO
                        </h3>
                        <p className="text-xs text-amber-200 mt-1">
                          Não encontrado na base de dados oficial.
                        </p>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                        {validationResult.message}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <ShieldCheck className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
                  <p className="text-sm font-medium text-slate-300">
                    Aguardando Leitura de Ingresso
                  </p>
                  <p className="text-xs max-w-xs mx-auto text-slate-500">
                    Aponte o leitor QR ótico ou selecione um bilhete nos testes rápidos.
                  </p>
                </div>
              )}
            </div>

            {/* Clear Screen Button */}
            {validationResult && (
              <button
                type="button"
                onClick={() => setValidationResult(null)}
                className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Limpar Ecrã (Próximo Aluno)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Guest List & Manual Search Modal / Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Lista de Presenças & Validação por Nome
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Caso o caloiro esteja sem bateria ou o telemóvel esteja danificado, a equipa de portaria pode verificar a matrícula e validar manualmente.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={guestSearch}
              onChange={(e) => setGuestSearch(e.target.value)}
              placeholder="Pesquisar por nome ou nº..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Guest Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Estudante / Titular</th>
                <th className="py-2.5 px-3">Nº Mecanográfico</th>
                <th className="py-2.5 px-3">Tipo de Bilhete</th>
                <th className="py-2.5 px-3">Pulseira</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-nums">
              {filteredGuests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">
                    {t.attendeeName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {t.studentNumber || '—'}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="text-amber-300 font-medium">{t.tierName}</span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${t.wristbandColor}`} />
                      <span className="text-slate-300 text-[11px] truncate">{t.wristbandLabel}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    {t.status === 'used' ? (
                      <span className="inline-flex items-center text-red-400 font-semibold text-[11px]">
                        Entrou ({t.usedAt || '21:00'})
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-emerald-400 font-semibold text-[11px]">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-sans">
                    {t.status !== 'used' ? (
                      <button
                        type="button"
                        onClick={() => handleValidateCode(t.ticketNumber)}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded transition-all"
                      >
                        Validar Manual
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Validado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gate Audit Log Feed */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Registo de Auditoria de Entradas (Últimas Leituras)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono-nums">{gateLogs.length} registos</span>
        </div>

        {gateLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">Nenhuma leitura registada até ao momento.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {gateLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-nums text-[11px] text-slate-500">{log.timestamp}</span>
                  <div>
                    <span className="font-semibold text-white mr-2">{log.attendeeName}</span>
                    <span className="text-slate-400 text-[11px]">({log.tierName})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">{log.gate}</span>
                  {log.status === 'success' && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                      AUTORIZADO
                    </span>
                  )}
                  {log.status === 'already_used' && (
                    <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800/80">
                      DUPLICADO
                    </span>
                  )}
                  {log.status === 'invalid' && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/80">
                      INVÁLIDO
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
