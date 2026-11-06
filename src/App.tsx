import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TicketSelection } from './components/TicketSelection';
import { CheckoutModal } from './components/CheckoutModal';
import { MyTicketsView } from './components/MyTicketsView';
import { GateScannerView } from './components/GateScannerView';
import { EventInfoSection } from './components/EventInfoSection';
import { EventsManagerView } from './components/EventsManagerView';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { PrintableTicketModal } from './components/PrintableTicketModal';
import { TicketPassCard } from './components/TicketPassCard';
import { Footer } from './components/Footer';
import { TicketItem, TicketTierId, UserProfile, CaloiroEvent } from './types';
import { getStoredTickets, addTickets, clearAllSystemData } from './utils/storage';
import { getCurrentUser, logoutUser } from './utils/auth';
import { getStoredEvents, getActiveEvent, setActiveEventId } from './utils/events';
import { X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'events' | 'my-tickets' | 'scanner' | 'info'>('store');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Events state
  const [events, setEvents] = useState<CaloiroEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<CaloiroEvent>(getActiveEvent());

  // Ticket quantities for active event
  const [quantities, setQuantities] = useState<Record<TicketTierId, number>>({
    caloiro: 0,
    veterano: 0,
    geral: 0,
    vip: 0,
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [testScanCode, setTestScanCode] = useState<string | undefined>(undefined);
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<TicketItem | null>(null);
  const [printableTicket, setPrintableTicket] = useState<TicketItem | null>(null);

  // Initialize data on mount
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setCurrentUser(getCurrentUser());
    const evts = getStoredEvents();
    setEvents(evts);
    const act = getActiveEvent();
    setActiveEvent(act);
    setTickets(getStoredTickets());
  };

  const handleUpdateQuantity = (id: TicketTierId, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (newTickets: TicketItem[]) => {
    addTickets(newTickets);
    setTickets(getStoredTickets());
    // Reset quantities
    setQuantities({
      caloiro: 0,
      veterano: 0,
      geral: 0,
      vip: 0,
    });
    // Automatically open the printable 5:8 modal for the freshly issued ticket!
    if (newTickets.length > 0) {
      setPrintableTicket(newTickets[0]);
    }
  };

  const handleTestScanTicket = (ticketNumber: string) => {
    setTestScanCode(ticketNumber);
    setActiveTab('scanner');
    setSelectedTicketForModal(null);
    setPrintableTicket(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAllTickets = () => {
    clearAllSystemData();
    refreshAllData();
  };

  const handleSelectActiveEvent = (eventId: string) => {
    setActiveEventId(eventId);
    const act = getActiveEvent();
    setActiveEvent(act);
    setEvents(getStoredEvents());
    setQuantities({
      caloiro: 0,
      veterano: 0,
      geral: 0,
      vip: 0,
    });
    setActiveTab('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User tickets filter
  const userTickets = currentUser
    ? tickets.filter(
        (t) =>
          t.userId === currentUser.id ||
          (t.attendeeEmail && t.attendeeEmail.toLowerCase() === currentUser.email.toLowerCase())
      )
    : tickets;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar with C.E.P.P. & AEP-2 Logos & Auth State */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myTicketsCount={userTickets.length}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'store' && (
          <div>
            <HeroSection
              activeEvent={activeEvent}
              onScrollToTickets={() => {
                const el = document.getElementById('bilhetes-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenScanner={() => {
                setActiveTab('scanner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenEventsManager={() => {
                setActiveTab('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <TicketSelection
              activeEvent={activeEvent}
              quantities={quantities}
              onUpdateQuantity={handleUpdateQuantity}
              onProceedToCheckout={handleProceedToCheckout}
              onOpenEventsManager={() => {
                setActiveTab('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <EventInfoSection />
          </div>
        )}

        {activeTab === 'events' && (
          <EventsManagerView
            events={events}
            activeEvent={activeEvent}
            onRefreshEvents={refreshAllData}
            onSelectActiveEvent={handleSelectActiveEvent}
          />
        )}

        {activeTab === 'my-tickets' && (
          <MyTicketsView
            tickets={userTickets}
            onOpenStore={() => {
              setActiveTab('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTestScanTicket={handleTestScanTicket}
            onOpenPrintModal={(ticket) => setPrintableTicket(ticket)}
            onClearAllTickets={handleClearAllTickets}
          />
        )}

        {activeTab === 'scanner' && (
          <GateScannerView
            initialTestCode={testScanCode}
            onClearInitialCode={() => setTestScanCode(undefined)}
            onRefreshTickets={refreshAllData}
          />
        )}

        {activeTab === 'info' && (
          <div className="pt-6">
            <EventInfoSection />
          </div>
        )}
      </main>

      {/* Checkout Modal (Cash in Hand in Kwanza) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          refreshAllData();
        }}
        categories={activeEvent.categories}
        quantities={quantities}
        onSuccess={handlePaymentSuccess}
        currentUser={currentUser}
        activeEvent={activeEvent}
      />

      {/* User Registration & Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          refreshAllData();
        }}
      />

      {/* User Profile & Purchase History Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          userTickets={userTickets}
          onLogout={() => {
            logoutUser();
            setCurrentUser(null);
          }}
          onSelectTicketPass={(t) => setPrintableTicket(t)}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
        />
      )}

      {/* Dedicated Printable Ticket Modal (5mm / 50mm x 8mm / 80mm Scale) */}
      {printableTicket && (
        <PrintableTicketModal
          isOpen={!!printableTicket}
          onClose={() => setPrintableTicket(null)}
          ticket={printableTicket}
          onTestScan={handleTestScanTicket}
        />
      )}

      {/* Institutional Footer */}
      <Footer
        onOpenStore={() => {
          setActiveTab('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEvents={() => {
          setActiveTab('events');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenScanner={() => {
          setActiveTab('scanner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTickets={() => {
          setActiveTab('my-tickets');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
