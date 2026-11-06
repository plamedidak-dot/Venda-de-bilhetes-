export type TicketTierId = 'caloiro' | 'veterano' | 'geral' | 'vip';

export interface TicketCategory {
  id: TicketTierId;
  name: string;
  tagline: string;
  price: number; // in Kwanzas (Kz)
  originalPrice?: number;
  description: string;
  wristbandColor: string;
  wristbandLabel: string;
  features: string[];
  requiresStudentNumber: boolean;
  availableSpots: number;
  totalSpots: number;
  popular?: boolean;
}

export type TicketStatus = 'valid' | 'used' | 'cancelled';
export type PaymentStatus = 'pago_em_mao' | 'pendente_pagamento_em_mao';

export interface TicketItem {
  id: string;
  ticketNumber: string; // e.g. CEPP-26-CAL-84920
  qrPayload: string;
  tierId: TicketTierId;
  tierName: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  studentNumber?: string;
  facultyOrCourse?: string;
  wristbandColor: string;
  wristbandLabel: string;
  price: number; // in Kwanzas
  purchaseDate: string;
  status: TicketStatus;
  usedAt?: string;
  validatedByGate?: string;
  doorFastTrack: boolean;
  eventId?: string;
  eventName?: string;
  userId?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: 'dinheiro_em_mao' | 'reserva_presencial' | 'multicaixa_express';
  paymentReceivedBy?: string;
  cashReceiptNumber?: string;
  amountReceivedInCash?: number;
  changeGiven?: number;
}

export type PaymentMethodType = 'dinheiro_em_mao' | 'reserva_presencial' | 'multicaixa_express';

export interface PaymentDetails {
  method: PaymentMethodType;
  cashAmountGiven?: number;
  receivedByOfficer?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface GateValidationResult {
  status: 'success' | 'already_used' | 'invalid';
  ticket?: TicketItem;
  message: string;
  timestamp: string;
  gateName: string;
}

export interface GateLogEntry {
  id: string;
  timestamp: string;
  ticketNumber: string;
  attendeeName: string;
  tierName: string;
  status: 'success' | 'already_used' | 'invalid';
  message: string;
  gate: string;
}

export type UserRole = 'student' | 'organizer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentNumber?: string;
  courseOrClass?: string;
  role: UserRole;
  createdAt: string;
  avatarInitials?: string;
}

export interface CaloiroEvent {
  id: string;
  name: string;
  schoolName: string;
  associationName: string;
  date: string; // e.g. "20 de Novembro de 2026"
  dateIso?: string; // e.g. "2026-11-20"
  time: string; // e.g. "12:00"
  location: string;
  ticketPrice: number; // base price in Kwanzas (editable!)
  originalPrice?: number;
  description: string;
  totalSpots: number;
  availableSpots: number;
  status: 'active' | 'upcoming' | 'completed';
  bannerUrl?: string;
  categories: TicketCategory[];
}

/** Formatter helper for Angolan Kwanza (Kz) */
export function formatKwanza(amount: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(amount) + ' Kz';
}
