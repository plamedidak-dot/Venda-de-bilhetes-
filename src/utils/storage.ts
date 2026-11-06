import { INITIAL_SEEDED_TICKETS } from '../data/initialData';
import { GateLogEntry, GateValidationResult, TicketItem } from '../types';

const TICKETS_KEY = 'batismo_academic_tickets_v1';
const GATE_LOGS_KEY = 'batismo_gate_logs_v1';

export function getStoredTickets(): TicketItem[] {
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    if (!raw) {
      localStorage.setItem(TICKETS_KEY, JSON.stringify(INITIAL_SEEDED_TICKETS));
      return INITIAL_SEEDED_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEEDED_TICKETS;
  }
}

export function saveStoredTickets(tickets: TicketItem[]) {
  try {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  } catch (err) {
    console.error('Error saving tickets to localStorage', err);
  }
}

export function addTickets(newTickets: TicketItem[]) {
  const current = getStoredTickets();
  const updated = [...newTickets, ...current];
  saveStoredTickets(updated);
  return updated;
}

export function getStoredGateLogs(): GateLogEntry[] {
  try {
    const raw = localStorage.getItem(GATE_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addGateLog(entry: GateLogEntry) {
  try {
    const current = getStoredGateLogs();
    const updated = [entry, ...current].slice(0, 50); // Keep last 50
    localStorage.setItem(GATE_LOGS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function validateTicketCode(codeOrPayload: string, gateName: string = 'Porta 1 - Principal'): GateValidationResult {
  const cleanInput = codeOrPayload.trim();
  const tickets = getStoredTickets();
  const now = new Date();
  const timestampStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Match either ticketNumber (e.g. BAT-26-CAL-10492) or qrPayload
  const ticketIndex = tickets.findIndex(
    (t) =>
      t.ticketNumber.toLowerCase() === cleanInput.toLowerCase() ||
      t.qrPayload.toLowerCase() === cleanInput.toLowerCase() ||
      cleanInput.includes(t.ticketNumber)
  );

  if (ticketIndex === -1) {
    const log: GateLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: timestampStr,
      ticketNumber: cleanInput.slice(0, 18) || 'CÓDIGO DESCONHECIDO',
      attendeeName: 'Desconhecido',
      tierName: 'Não Identificado',
      status: 'invalid',
      message: 'Bilhete não registado na base de dados do evento.',
      gate: gateName
    };
    addGateLog(log);

    return {
      status: 'invalid',
      message: 'Código inválido ou inexistente. Não consta no sistema de bilheteira.',
      timestamp: timestampStr,
      gateName
    };
  }

  const ticket = tickets[ticketIndex];

  // Check if already used
  if (ticket.status === 'used') {
    const log: GateLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: timestampStr,
      ticketNumber: ticket.ticketNumber,
      attendeeName: ticket.attendeeName,
      tierName: ticket.tierName,
      status: 'already_used',
      message: `Bilhete já validado anteriormente às ${ticket.usedAt || 'hora prévia'} (${ticket.validatedByGate || 'Portaria'}).`,
      gate: gateName
    };
    addGateLog(log);

    return {
      status: 'already_used',
      ticket,
      message: `Atenção: Este bilhete já foi validado às ${ticket.usedAt || 'hora anterior'} na ${ticket.validatedByGate || 'portaria'}.`,
      timestamp: timestampStr,
      gateName
    };
  }

  // Mark as used
  const updatedTicket: TicketItem = {
    ...ticket,
    status: 'used',
    usedAt: timestampStr,
    validatedByGate: gateName
  };

  tickets[ticketIndex] = updatedTicket;
  saveStoredTickets(tickets);

  const log: GateLogEntry = {
    id: 'log-' + Date.now(),
    timestamp: timestampStr,
    ticketNumber: ticket.ticketNumber,
    attendeeName: ticket.attendeeName,
    tierName: ticket.tierName,
    status: 'success',
    message: `Entrada autorizada com sucesso. Entregar pulseira: ${ticket.wristbandLabel}.`,
    gate: gateName
  };
  addGateLog(log);

  return {
    status: 'success',
    ticket: updatedTicket,
    message: 'Entrada autorizada! Validação efetuada com sucesso.',
    timestamp: timestampStr,
    gateName
  };
}

export function resetDemoDataToInitial() {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(INITIAL_SEEDED_TICKETS));
  localStorage.removeItem(GATE_LOGS_KEY);
  return INITIAL_SEEDED_TICKETS;
}
