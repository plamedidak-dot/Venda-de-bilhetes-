import { TicketCategory, TicketItem } from '../types';

export const EVENT_DETAILS = {
  title: "BATISMO DOS CALOIROS 2026",
  schoolName: "Complexo Escolar Privado Proglory",
  schoolAbbr: "C.E.P.P.",
  associationName: "Associação dos Estudantes Do Complexo Escolar Privado Proglory",
  associationAbbr: "AEP-2 (Da Graça - Polo II)",
  schoolLogo: "/assets/aistudio/PEQUENO_87357065.png",
  associationLogo: "/assets/aistudio/LOGOTSHERT_010ed54a.png",
  edition: "Edição Oficial 2026",
  motto: "A Grande Celebração de Integração e Tradição Escolar",
  date: "20 de Novembro de 2026",
  time: "12:00", // Activity at 12h
  location: "Pátio Principal & Salão Multiusos - C.E.P.P. Da Graça (Polo II)",
  city: "Polo II - Da Graça",
  ticketPrice: 2500, // Base price in Kwanzas (Kz), fully editable
  currency: "Kz",
  lineup: [
    { time: "11:30", act: "Abertura dos Portões & Acolhimento das Turmas", stage: "Entrada Polo II" },
    { time: "12:00", act: "Início Solene da Cerimónia de Batismo dos Caloiros (AEP-2 & C.E.P.P.)", stage: "Pátio Principal" },
    { time: "13:30", act: "Almoço de Confraternização & Animação Cultural", stage: "Praça Académica" },
    { time: "15:00", act: "Cortejo das Turmas & Apadrinhamento pelos Veteranos", stage: "Arena Proglory" },
    { time: "16:30", act: "DJ Set Especial & Concurso de Dança dos Caloiros", stage: "Palco Multiusos" },
  ],
  rules: [
    "Pagamento efetuado a dinheiro em mão diretamente à Associação de Estudantes (AEP-2) ou na bilheteira da escola.",
    "Apresentar o QR Code no telemóvel ou o bilhete impresso na portaria do Polo II.",
    "Obrigatória a apresentação de Cartão de Estudante do C.E.P.P. ou talão de matrícula para os lotes de Caloiro e Sócio.",
    "Entrada na portaria aberta a partir das 11h30 para início pontual às 12h00.",
    "Validação única do QR Code com bloqueio automático de bilhetes duplicados."
  ]
};

export const TICKET_CATEGORIES: TicketCategory[] = [
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
];

export const INITIAL_SEEDED_TICKETS: TicketItem[] = [
  {
    id: 'ticket-seed-1',
    ticketNumber: 'CEPP-26-CAL-10492',
    qrPayload: 'CEPP26:TKT-10492:CALOIRO:MANUEL-COSTA:VALID',
    tierId: 'caloiro',
    tierName: 'Bilhete Caloiro C.E.P.P.',
    attendeeName: 'Manuel Gonçalves da Costa',
    attendeeEmail: 'manuel.costa@proglory.edu',
    attendeePhone: '931 889 120',
    studentNumber: 'CEPP-2026/0491',
    facultyOrCourse: '10ª Classe - Ciências Físicas e Biológicas',
    wristbandColor: 'from-amber-400 to-yellow-600',
    wristbandLabel: 'Amarela (Caloiro Proglory)',
    price: 2500,
    purchaseDate: '2026-11-04 10:15',
    status: 'valid',
    doorFastTrack: false,
    eventId: 'event-proglory-batismo-2026',
    eventName: 'Batismo dos Caloiros 2026 - Complexo Escolar Privado Proglory',
    userId: 'user-student-1',
    paymentStatus: 'pago_em_mao',
    paymentMethod: 'dinheiro_em_mao',
    paymentReceivedBy: 'Tesouraria da Associação AEP-2 (Da Graça)',
    cashReceiptNumber: 'REC-2026/0491',
    amountReceivedInCash: 3000,
    changeGiven: 500
  },
  {
    id: 'ticket-seed-2',
    ticketNumber: 'CEPP-26-VIP-90214',
    qrPayload: 'CEPP26:TKT-90214:VIP:BEATRIZ-SANTOS:VALID',
    tierId: 'vip',
    tierName: 'Acesso VIP / Mesa Reservada',
    attendeeName: 'Beatriz Teresa dos Santos',
    attendeeEmail: 'beatriz.santos@proglory.edu',
    attendeePhone: '945 112 334',
    studentNumber: 'CEPP-2025/1102',
    facultyOrCourse: '11ª Classe - Ciências Económicas e Jurídicas',
    wristbandColor: 'from-amber-300 via-amber-500 to-yellow-700',
    wristbandLabel: 'Dourada Tecido (VIP AEP-2)',
    price: 10000,
    purchaseDate: '2026-11-05 11:30',
    status: 'valid',
    doorFastTrack: true,
    eventId: 'event-proglory-batismo-2026',
    eventName: 'Batismo dos Caloiros 2026 - Complexo Escolar Privado Proglory',
    userId: 'user-student-2',
    paymentStatus: 'pago_em_mao',
    paymentMethod: 'dinheiro_em_mao',
    paymentReceivedBy: 'Delegado AEP-2 Polo II',
    cashReceiptNumber: 'REC-2026/0512',
    amountReceivedInCash: 10000,
    changeGiven: 0
  },
  {
    id: 'ticket-seed-3',
    ticketNumber: 'CEPP-26-VET-77142',
    qrPayload: 'CEPP26:TKT-77142:VETERANO:ANTONIO-SILVA:USED',
    tierId: 'veterano',
    tierName: 'Bilhete Sócio / Veterano AEP-2',
    attendeeName: 'António Valdemar Silva',
    attendeeEmail: 'antonio.silva@proglory.edu',
    attendeePhone: '924 998 001',
    studentNumber: 'CEPP-2024/0088',
    facultyOrCourse: '12ª Classe - Informática de Gestão',
    wristbandColor: 'from-blue-600 to-indigo-800',
    wristbandLabel: 'Azul Real (Veterano / Sócio AEP-2)',
    price: 3500,
    purchaseDate: '2026-11-03 16:45',
    status: 'used',
    usedAt: '2026-11-05 12:05',
    validatedByGate: 'Portaria Polo II - Principal',
    doorFastTrack: false,
    eventId: 'event-proglory-batismo-2026',
    eventName: 'Batismo dos Caloiros 2026 - Complexo Escolar Privado Proglory',
    userId: 'user-student-1',
    paymentStatus: 'pago_em_mao',
    paymentMethod: 'dinheiro_em_mao',
    paymentReceivedBy: 'Tesouraria da Associação AEP-2',
    cashReceiptNumber: 'REC-2026/0388',
    amountReceivedInCash: 5000,
    changeGiven: 1500
  }
];
