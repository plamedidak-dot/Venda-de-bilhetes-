import { CaloiroEvent, TicketCategory } from '../types';

const EVENTS_STORAGE_KEY = 'proglory_events_v3';
const ACTIVE_EVENT_KEY = 'proglory_active_event_id_v3';

export const INITIAL_PROGLORY_EVENTS: CaloiroEvent[] = [
  {
    id: 'event-proglory-batismo-2026',
    name: 'Batismo dos Caloiros 2026 - Complexo Escolar Privado Proglory',
    schoolName: 'Complexo Escolar Privado Proglory',
    associationName: 'Associação dos Estudantes Do Complexo Escolar Privado Proglory (AEP-2)',
    date: '20 de Novembro de 2026',
    dateIso: '2026-11-20',
    time: '12:00', // Activity at 12h
    location: 'Instalações do C.E.P.P. - Da Graça (Polo II)',
    ticketPrice: 2500, // 2.500 Kz (editable in Kwanza!)
    originalPrice: 4000,
    description: 'Atividade solene de Batismo e Integração dos Caloiros do Complexo Escolar Privado Proglory promovida pela Associação dos Estudantes (AEP-2 Da Graça - Polo II). Pagamento em mão na tesouraria da associação. Cerimónia oficial às 12h00, cortejo das turmas, entrega de insígnias, animação musical e batismo tradicional.',
    totalSpots: 1200,
    availableSpots: 480,
    status: 'active',
    bannerUrl: '/src/assets/images/hero_batismo_caloiros_1793942326291.jpg',
    categories: [
      {
        id: 'caloiro',
        name: 'Bilhete Caloiro C.E.P.P.',
        tagline: 'Novos Alunos do Complexo Escolar Proglory',
        price: 2500, // 2.500 Kz
        originalPrice: 4000,
        description: 'Acesso total à cerimónia do Batismo às 12h, fita oficial do caloiro C.E.P.P., pulseira amarela e lanche de convívio.',
        wristbandColor: 'from-amber-400 to-yellow-600',
        wristbandLabel: 'Amarela (Caloiro Proglory)',
        features: [
          'Acesso à Cerimónia Solene de Batismo às 12h00',
          'Fita Académica Oficial Proglory 2026',
          'Lanche de Boas-Vindas & Refrigerante',
          'Acesso a todas as atividades do Polo II'
        ],
        requiresStudentNumber: true,
        availableSpots: 180,
        totalSpots: 400,
        popular: true
      },
      {
        id: 'veterano',
        name: 'Bilhete Sócio / Veterano AEP-2',
        tagline: 'Alunos Veteranos & Sócios da Associação',
        price: 3500, // 3.500 Kz
        originalPrice: 5000,
        description: 'Para estudantes veteranos do C.E.P.P. (11ª e 12ª classes) e membros da Associação dos Estudantes AEP-2.',
        wristbandColor: 'from-blue-600 to-indigo-800',
        wristbandLabel: 'Azul Real (Veterano / Sócio AEP-2)',
        features: [
          'Participação no apadrinhamento e batismo',
          'Desconto de sócio AEP-2 na restauração',
          'Copo oficial comemorativo do evento',
          'Pulseira azul de acesso prioritário'
        ],
        requiresStudentNumber: true,
        availableSpots: 210,
        totalSpots: 500
      },
      {
        id: 'geral',
        name: 'Bilhete Geral / Convidado',
        tagline: 'Familiares, Amigos & Comunidade',
        price: 5000, // 5.000 Kz
        description: 'Entrada para familiares e convidados assistirem à cerimónia solene das 12h e às atividades festivas da tarde.',
        wristbandColor: 'from-slate-500 to-slate-700',
        wristbandLabel: 'Cinza Prata (Geral)',
        features: [
          'Entrada no recinto das festividades',
          'Acesso à bancada de convidados da cerimónia',
          'Acesso à praça de alimentação e música'
        ],
        requiresStudentNumber: false,
        availableSpots: 60,
        totalSpots: 200
      },
      {
        id: 'vip',
        name: 'Acesso VIP / Mesa Reservada',
        tagline: 'Lounge da Associação & Buffet',
        price: 10000, // 10.000 Kz
        originalPrice: 15000,
        description: 'Lounge reservado, pulseira dourada de pano, serviço de buffet e vista privilegiada para o palco da cerimónia.',
        wristbandColor: 'from-amber-300 via-amber-500 to-yellow-700',
        wristbandLabel: 'Dourada Tecido (VIP AEP-2)',
        features: [
          'Entrada Prioritária sem filas no Polo II',
          'Acesso ao Lounge VIP com buffet incluído',
          'Lugar reservado na primeira fila da cerimónia',
          'Brinde oficial exclusivo da AEP-2 Proglory'
        ],
        requiresStudentNumber: false,
        availableSpots: 30,
        totalSpots: 100
      }
    ]
  },
  {
    id: 'event-proglory-arraial-2026',
    name: 'Festa da Recepção ao Caloiro & Arraial Académico AEP-2',
    schoolName: 'Complexo Escolar Privado Proglory',
    associationName: 'Associação dos Estudantes Do Complexo Escolar Privado Proglory (AEP-2)',
    date: '27 de Novembro de 2026',
    dateIso: '2026-11-27',
    time: '14:30',
    location: 'Pátio Central & Pavilhão Desportivo - Polo II',
    ticketPrice: 1500, // 1.500 Kz
    description: 'Tarde cultural e recreativa com torneios desportivos inter-turmas, jogos tradicionais de caloiro, barracas temáticas e festival de música jovem. Pagamento em mão na secretaria ou comissão.',
    totalSpots: 800,
    availableSpots: 320,
    status: 'upcoming',
    bannerUrl: '/src/assets/images/academic_venue_stage_1793942326805.jpg',
    categories: [
      {
        id: 'caloiro',
        name: 'Ingresso Estudante',
        tagline: 'Alunos do C.E.P.P.',
        price: 1500,
        description: 'Acesso ao arraial e inscrição nos jogos',
        wristbandColor: 'from-emerald-500 to-teal-700',
        wristbandLabel: 'Verde (Estudante)',
        features: ['Acesso a jogos e concertos', 'Bebida incluída'],
        requiresStudentNumber: true,
        availableSpots: 250,
        totalSpots: 600
      },
      {
        id: 'geral',
        name: 'Ingresso Geral',
        tagline: 'Público Geral',
        price: 2500,
        description: 'Acesso aos concertos e bancada de jogos',
        wristbandColor: 'from-slate-600 to-slate-800',
        wristbandLabel: 'Cinza (Geral)',
        features: ['Acesso geral'],
        requiresStudentNumber: false,
        availableSpots: 70,
        totalSpots: 200
      }
    ]
  },
  {
    id: 'event-proglory-gala-2026',
    name: 'Baile de Gala & Noite de Talentos Proglory',
    schoolName: 'Complexo Escolar Privado Proglory',
    associationName: 'Associação dos Estudantes Do Complexo Escolar Privado Proglory (AEP-2)',
    date: '05 de Dezembro de 2026',
    dateIso: '2026-12-05',
    time: '17:00',
    location: 'Salão Nobre do Complexo Escolar Privado Proglory',
    ticketPrice: 4000, // 4.000 Kz
    description: 'Encerramento solene das festividades de integração com concurso de talentos, desfile dos caloiros, jantar volante e baile académico.',
    totalSpots: 500,
    availableSpots: 140,
    status: 'upcoming',
    bannerUrl: '/src/assets/images/hero_batismo_caloiros_1793942326291.jpg',
    categories: [
      {
        id: 'caloiro',
        name: 'Ingresso Caloiro / Gala',
        tagline: 'Traje de Gala / Cerimónia',
        price: 4000,
        description: 'Entrada na gala e jantar volante',
        wristbandColor: 'from-purple-600 to-indigo-900',
        wristbandLabel: 'Púrpura Gala',
        features: ['Jantar volante', 'Acesso à pista de dança'],
        requiresStudentNumber: true,
        availableSpots: 100,
        totalSpots: 350
      },
      {
        id: 'vip',
        name: 'Mesa de Honra VIP',
        tagline: 'Lugares Reservados com Serviço Especial',
        price: 15000,
        description: 'Mesa reservada para 2 pessoas com serviço de mesa',
        wristbandColor: 'from-amber-400 to-yellow-600',
        wristbandLabel: 'Dourado Honra',
        features: ['Mesa reservada', 'Menu especial de gala'],
        requiresStudentNumber: false,
        availableSpots: 40,
        totalSpots: 150
      }
    ]
  }
];

export function getStoredEvents(): CaloiroEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_PROGLORY_EVENTS));
      return INITIAL_PROGLORY_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROGLORY_EVENTS;
  }
}

export function saveStoredEvents(events: CaloiroEvent[]) {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving events', err);
  }
}

export function getActiveEvent(): CaloiroEvent {
  const events = getStoredEvents();
  const activeId = localStorage.getItem(ACTIVE_EVENT_KEY);
  if (activeId) {
    const found = events.find((e) => e.id === activeId);
    if (found) return found;
  }
  return events[0] || INITIAL_PROGLORY_EVENTS[0];
}

export function setActiveEventId(id: string) {
  try {
    localStorage.setItem(ACTIVE_EVENT_KEY, id);
  } catch (err) {
    console.error('Error setting active event', err);
  }
}

export function createEvent(newEventData: Omit<CaloiroEvent, 'id'>): CaloiroEvent {
  const events = getStoredEvents();
  const id = 'event-proglory-' + Date.now();
  const newEvent: CaloiroEvent = {
    ...newEventData,
    id
  };
  const updated = [newEvent, ...events];
  saveStoredEvents(updated);
  setActiveEventId(id);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<CaloiroEvent>): CaloiroEvent | null {
  const events = getStoredEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  const current = events[idx];
  const updated: CaloiroEvent = {
    ...current,
    ...updates,
    // If ticketPrice changed, update the primary category price
    categories: updates.categories || current.categories.map((cat, i) => {
      if (updates.ticketPrice !== undefined && i === 0) {
        return { ...cat, price: updates.ticketPrice };
      }
      return cat;
    })
  };

  events[idx] = updated;
  saveStoredEvents(events);
  return updated;
}

export function updateEventPrice(id: string, newPrice: number): CaloiroEvent | null {
  return updateEvent(id, { ticketPrice: newPrice });
}

export function deleteEvent(id: string): boolean {
  const events = getStoredEvents();
  if (events.length <= 1) {
    return false;
  }
  const filtered = events.filter((e) => e.id !== id);
  saveStoredEvents(filtered);
  const activeId = localStorage.getItem(ACTIVE_EVENT_KEY);
  if (activeId === id) {
    setActiveEventId(filtered[0].id);
  }
  return true;
}

export function resetEventsToDefault(): CaloiroEvent[] {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_PROGLORY_EVENTS));
  setActiveEventId(INITIAL_PROGLORY_EVENTS[0].id);
  return INITIAL_PROGLORY_EVENTS;
}
