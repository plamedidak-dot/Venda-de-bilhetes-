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
import { TicketPassCard } from './components/TicketPassCard';
import { Footer } from './components/Footer';
import { TicketItem, TicketTierId, UserProfile, CaloiroEvent } from './types';
import { getStoredTickets, addTickets, resetDemoDataToInitial } from './utils/storage';
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
  };

  const handleTestScanTicket = (ticketNumber: string) => {
    setTestScanCode(ticketNumber);
    setActiveTab('scanner');
    setSelectedTicketForModal(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDemo = () => {
    resetDemoDataToInitial();
    refreshAllData();
  };

  const handleSelectActiveEvent = (eventId: string) => {
    setActiveEventId(eventId);
    const act = getActiveEvent();
    setActiveEvent(act);
    setEvents(getStoredEvents());
    // Reset selection for new event
    setQuantities({
      caloiro: 0,
      veterano: 0,
      geral: 0,
      vip: 0,
    });
    setActiveTab('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User tickets filter: tickets that belong to the current user
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
            onResetDemoData={handleResetDemo}
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

      {/* Checkout Modal */}
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
          onSelectTicketPass={(t) => setSelectedTicketForModal(t)}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
        />
      )}

      {/* Dedicated Ticket Pass Popup if opened from profile */}
      {selectedTicketForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-sm my-8">
            <button
              onClick={() => setSelectedTicketForModal(null)}
              className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 shadow-lg border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <TicketPassCard
              ticket={selectedTicketForModal}
              onTestScan={handleTestScanTicket}
            />
          </div>
        </div>
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
