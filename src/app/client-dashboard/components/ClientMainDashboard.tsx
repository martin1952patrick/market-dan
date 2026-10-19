'use client';
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, User, Image, Eye, MessageSquare, LogOut, Menu, X, Home, Bell, ChevronRight, CreditCard, Copy, CheckCheck, Phone, Loader2, CheckCircle2, Link2, Tag, Package, AlertCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import ProfileEditor from './ProfileEditor';
import MediaManager from './MediaManager';
import ListingPreview from './ListingPreview';
import VisibilityPackage from './VisibilityPackage';
import MessagesInbox from './MessagesInbox';
import SmallLocationsManager from './SmallLocationsManager';
import { dbService } from '@/lib/services/dbService';
import { useAppStore } from '@/lib/AppContext';
import { getProfileUrl } from '@/lib/mockData';

// Furniture categories for the client dashboard selector
const FURNITURE_CATEGORIES = [
  { id: 'tables', label: 'Tables', emoji: '🪑', desc: 'Dining, coffee & side tables' },
  { id: 'sofa-chairs', label: 'Sofa & Chairs', emoji: '🛋️', desc: 'Sofas, armchairs & recliners' },
  { id: 'shelves', label: 'Shelves & Storage', emoji: '📚', desc: 'Bookshelves, cabinets & racks' },
  { id: 'beds', label: 'Beds & Mattresses', emoji: '🛏️', desc: 'Bed frames & mattresses' },
  { id: 'wardrobes', label: 'Wardrobes', emoji: '🚪', desc: 'Wardrobes & closets' },
  { id: 'office', label: 'Office Furniture', emoji: '💼', desc: 'Desks, office chairs & drawers' },
  { id: 'outdoor', label: 'Outdoor Furniture', emoji: '🌿', desc: 'Garden & patio furniture' },
  { id: 'kitchen', label: 'Kitchen Furniture', emoji: '🍳', desc: 'Kitchen cabinets & islands' },
  { id: 'childrens', label: "Children\'s Furniture", emoji: '🧸', desc: 'Kids beds, desks & chairs' },
  { id: 'custom', label: 'Custom & Bespoke', emoji: '🔨', desc: 'Made-to-order furniture' },
];

interface Props {
  userEmail: string;
  onLogout: () => void;
}

type Tab = 'overview' | 'profile' | 'locations' | 'media' | 'preview' | 'visibility' | 'messages';

// MPesa STK Push Modal — accepts dynamic amount
function MpesaModal({ onClose, businessName, amount, label }: { onClose: () => void; businessName: string; amount?: number; label?: string }) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [phoneError, setPhoneError] = useState('');

  const displayAmount = amount ?? 1500;
  const displayLabel = label ?? 'Subscription — 1 Month';

  const handlePay = () => {
    if (!phone.match(/^(07|01|\+2547|\+2541)\d{8}$/)) {
      setPhoneError('Enter a valid Safaricom number e.g. 0712 345 678');
      return;
    }
    setPhoneError('');
    setStep('processing');
    setTimeout(() => setStep('success'), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.7)' }}>
      <div className="rounded-2xl border shadow-modal w-full max-w-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#16A34A', color: '#fff' }}>
              <Phone size={16} />
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>M-Pesa Payment</span>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)' }} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          {step === 'input' && (
            <>
              <div className="rounded-xl p-4 mb-5 text-center" style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#15803D' }}>{displayLabel}</p>
                <p className="text-3xl font-bold" style={{ color: '#15803D' }}>KES {displayAmount.toLocaleString()}</p>
                <p className="text-xs mt-1" style={{ color: '#16A34A' }}>{businessName}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>M-Pesa Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="input-base w-full pl-9 pr-4 py-3 text-sm"
                  />
                </div>
                {phoneError && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{phoneError}</p>}
                <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>An STK push will be sent to this number. Enter your M-Pesa PIN to complete.</p>
              </div>
              <button
                onClick={handlePay}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ backgroundColor: '#16A34A', color: '#fff' }}
              >
                <CreditCard size={16} />
                Send STK Push
              </button>
            </>
          )}
          {step === 'processing' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>STK Push Sent</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Check your phone <strong>{phone}</strong> and enter your M-Pesa PIN to complete payment.</p>
              <p className="text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>Waiting for confirmation…</p>
            </div>
          )}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
                <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>Payment Successful!</p>
              <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>Your subscription has been renewed. Your listing is now active.</p>
              <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: '#16A34A', color: '#fff' }}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientMainDashboard({ userEmail, onLogout }: Props) {
  const { clients } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMpesa, setShowMpesa] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Find profile from shared state
  const profile = clients.find((p) => p.email === userEmail) ?? clients[0];

  useEffect(() => {
    if (!profile?.id) return;
    let cancelled = false;
    dbService.fetchSellerMessages(profile.id).then((rows) => {
      if (!cancelled) setUnreadCount(rows.filter((m) => !m.isRead).length);
    });
    return () => {
      cancelled = true;
    };
  }, [profile?.id]);

  const profileUrl = getProfileUrl(profile);
  const fullProfileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://marketdan3738.builtwithrocket.new'}${profileUrl}`;

  // Determine if free trial has ended
  const trialEnded = profile?.freeTrialEnded === true || (() => {
    if (!profile?.freeTrialActivatedAt) return false;
    const activatedAt = new Date(profile.freeTrialActivatedAt);
    const now = new Date();
    const diffDays = (now.getTime() - activatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 30;
  })();

  // Get the amount due based on tier/period
  const TIER_PRICES: Record<string, Record<number, number>> = {
    elite: { 7: 1100, 14: 1950, 30: 3500 },
    spotlight: { 7: 900, 14: 1600, 30: 2800 },
    premium: { 7: 650, 14: 1150, 30: 2100 },
    standard: { 7: 500, 14: 850, 30: 1500 },
  };
  const tierKey = profile?.tier ?? 'standard';
  const durationDays = profile?.visibilityPackage?.durationDays ?? 30;
  const amountDue = TIER_PRICES[tierKey]?.[durationDays] ?? TIER_PRICES[tierKey]?.[30] ?? 1500;
  const tierLabel = `${(tierKey ?? 'standard').charAt(0).toUpperCase() + (tierKey ?? 'standard').slice(1)} — ${durationDays} Days`;

  const completeness = (() => {
    let score = 0;
    if (profile.businessName) score += 20;
    if (profile.description.length > 50) score += 20;
    if (profile.phone) score += 15;
    if (profile.location) score += 15;
    if (profile.media.length >= 1) score += 15;
    if (profile.media.length >= 3) score += 15;
    return score;
  })();

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Edit Profile', icon: <User size={18} /> },
    { id: 'locations', label: 'Small Locations', icon: <MapPin size={18} />, badge: (profile.smallLocations?.length ?? 0) > 0 ? String(profile.smallLocations?.length) : undefined },
    { id: 'media', label: 'Media & Photos', icon: <Image size={18} />, badge: `${profile.media.length}/${profile.uploadLimit}` },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} />, badge: unreadCount > 0 ? String(unreadCount) : undefined },
    { id: 'visibility', label: 'Visibility Package', icon: <Package size={18} /> },
    { id: 'preview', label: 'Live Preview', icon: <Eye size={18} /> },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-56' : 'w-0 lg:w-16'} fixed inset-y-0 left-0 z-30 lg:relative lg:inset-auto overflow-hidden`}
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b px-3" style={{ borderColor: 'var(--border)' }}>
          {sidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 overflow-hidden">
                <AppLogo size={28} />
                <span className="font-bold text-sm truncate" style={{ color: 'var(--primary)' }}>FurniMarket</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} aria-label="Close sidebar">
                <X size={16} />
              </button>
            </div>
          ) : (
            <AppLogo size={28} />
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-1 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={`client-nav-${item.id}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full ${activeTab === item.id ? 'sidebar-active' : ''}`}
              style={activeTab !== item.id ? { color: 'var(--muted-foreground)' } : {}}
              title={item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left truncate font-medium text-xs">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.15)', color: 'var(--primary)' }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}

          <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full"
              style={{ color: 'var(--muted-foreground)' }}
              title="View Homepage"
            >
              <Home size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-medium text-xs">View Homepage</span>}
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{profile.businessName}</p>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{userEmail}</p>
              </div>
              <button onClick={onLogout} className="p-1.5 rounded-lg transition-colors ml-2 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} title="Sign out" aria-label="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button onClick={onLogout} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted-foreground)' }} title="Sign out" aria-label="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b flex items-center justify-between px-3 sm:px-6 sticky top-0 z-20" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg flex-shrink-0"
              style={{ color: 'var(--muted-foreground)' }}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-1.5 text-sm min-w-0" style={{ color: 'var(--muted-foreground)' }}>
              <span className="hidden sm:inline text-xs">Dashboard</span>
              <ChevronRight size={12} className="hidden sm:inline flex-shrink-0" />
              <span className="font-semibold text-xs truncate" style={{ color: 'var(--foreground)' }}>
                {navItems.find((n) => n.id === activeTab)?.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full hidden sm:inline ${profile.status === 'active' ? 'badge-active' : profile.status === 'dormant' ? 'badge-suspended' : 'badge-pending'}`}>
              {profile.status === 'active' ? '● Live' : profile.status === 'dormant' ? '● Dormant' : '● Pending'}
            </span>
            {trialEnded ? (
              <button
                onClick={() => setActiveTab('visibility')}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ backgroundColor: '#DC2626', color: '#fff' }}
              >
                <CreditCard size={12} />
                <span>Pay Now</span>
              </button>
            ) : (
              <button
                onClick={() => setShowMpesa(true)}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ backgroundColor: '#16A34A', color: '#fff' }}
              >
                <CreditCard size={12} />
                <span className="hidden sm:inline">Pay / Subscribe</span>
                <span className="sm:hidden">Pay</span>
              </button>
            )}
            <button className="p-1.5 rounded-lg transition-colors flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} aria-label="Notifications">
              <Bell size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 xl:p-8">
          {activeTab === 'overview' && (
            <ClientOverview
              profile={profile}
              completeness={completeness}
              profileUrl={profileUrl}
              fullProfileUrl={fullProfileUrl}
              onNavigate={(tab) => setActiveTab(tab)}
              onPay={() => setShowMpesa(true)}
              trialEnded={trialEnded}
              amountDue={amountDue}
              tierLabel={tierLabel}
            />
          )}
          {activeTab === 'profile' && <ProfileEditor profile={profile} />}
          {activeTab === 'locations' && <SmallLocationsManager profile={profile} />}
          {activeTab === 'media' && <MediaManager profile={profile} />}
          {activeTab === 'messages' && <MessagesInbox sellerId={profile.id} onUnreadChange={setUnreadCount} />}
          {activeTab === 'visibility' && (
            <VisibilityPackage
              clientId={profile.id}
              clientEmail={profile.email}
              businessName={profile.businessName}
              currentTier={profile.tier}
            />
          )}
          {activeTab === 'preview' && <ListingPreview profile={profile} />}
        </main>
      </div>

      {showMpesa && (
        <MpesaModal
          onClose={() => setShowMpesa(false)}
          businessName={profile.businessName}
          amount={trialEnded ? amountDue : undefined}
          label={trialEnded ? tierLabel : undefined}
        />
      )}
    </div>
  );
}

function ClientOverview({ profile, completeness, profileUrl, fullProfileUrl, onNavigate, onPay, trialEnded, amountDue, tierLabel }: {
  profile: ReturnType<typeof useAppStore>['clients'][0];
  completeness: number;
  profileUrl: string;
  fullProfileUrl: string;
  onNavigate: (tab: Tab) => void;
  onPay: () => void;
  trialEnded: boolean;
  amountDue: number;
  tierLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const mediaUsed = profile.media.length;
  const mediaLimit = profile.uploadLimit;
  const quotaPct = Math.round((mediaUsed / mediaLimit) * 100);

  const handleCopyUrl = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(fullProfileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-screen-xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
          Welcome back, {profile.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Manage your listing for <strong>{profile.businessName}</strong>
        </p>
      </div>

      {/* Trial ended / payment due banner */}
      {trialEnded && (
        <div className="rounded-xl border p-4 mb-6 flex items-start gap-3" style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderColor: 'rgba(220,38,38,0.3)' }}>
          <AlertCircle size={20} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm mb-1" style={{ color: '#991B1B' }}>Free trial ended — payment required</p>
            <p className="text-xs mb-3" style={{ color: '#B91C1C' }}>
              Your listing is hidden from buyers. Pay to reactivate.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: '#B91C1C' }}>Total Due:</span>
                <span className="text-lg font-bold flex items-center gap-1" style={{ color: '#DC2626' }}>
                  <X size={14} style={{ color: '#DC2626' }} />
                  KSh {amountDue.toLocaleString()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626' }}>{tierLabel}</span>
              </div>
              <button
                onClick={() => onNavigate('visibility')}
                className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
                style={{ backgroundColor: '#DC2626', color: '#fff' }}
              >
                <CreditCard size={13} />
                Pay Now via M-Pesa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dormant warning (non-trial) */}
      {profile.status === 'dormant' && !trialEnded && (
        <div className="rounded-xl border p-4 mb-6 flex items-start gap-3" style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderColor: 'rgba(220,38,38,0.3)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <CreditCard size={16} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1" style={{ color: '#991B1B' }}>Your account is dormant</p>
            <p className="text-xs mb-3" style={{ color: '#B91C1C' }}>Your listing is hidden from buyers. Renew your subscription to go live again.</p>
            <button onClick={onPay} className="px-4 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor: '#16A34A', color: '#fff' }}>
              Pay Now via M-Pesa
            </button>
          </div>
        </div>
      )}

      {/* Small locations shortcut */}
      <div className="rounded-xl border p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ backgroundColor: 'rgba(194,105,42,0.06)', borderColor: 'rgba(194,105,42,0.3)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>
          <MapPin size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>
            Small Locations{(profile.smallLocations?.length ?? 0) > 0 ? ` (${profile.smallLocations?.length})` : ''}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {(profile.smallLocations?.length ?? 0) > 0
              ? `Serving: ${profile.smallLocations?.join(', ')}`
              : 'Add the small areas, stages or estates you serve so nearby buyers can find you.'}
          </p>
        </div>
        <button onClick={() => onNavigate('locations')} className="btn-primary px-4 py-2 text-sm flex-shrink-0 flex items-center gap-1.5">
          <MapPin size={14} />
          {(profile.smallLocations?.length ?? 0) > 0 ? 'Manage' : 'Add Small Locations'}
        </button>
      </div>

      {/* Profile URL card */}
      <div className="rounded-xl border p-4 sm:p-5 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Link2 size={15} style={{ color: 'var(--primary)' }} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Your Shareable Profile URL</h3>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
          Share this link with customers so they can find your business directly.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg px-3 py-2 text-xs font-mono truncate" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
            {profileUrl}
          </div>
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0 transition-colors"
            style={{ backgroundColor: copied ? 'rgba(22,163,74,0.1)' : 'rgba(194,105,42,0.1)', color: copied ? '#16A34A' : 'var(--primary)' }}
          >
            {copied ? <><CheckCheck size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>
      </div>

      {completeness < 100 && (
        <div className="rounded-xl border p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ backgroundColor: 'rgba(245,166,35,0.08)', borderColor: 'rgba(245,166,35,0.3)' }}>
          <div className="flex-1 w-full">
            <p className="font-semibold text-sm mb-1" style={{ color: '#92400E' }}>Your profile is {completeness}% complete</p>
            <p className="text-xs mb-3" style={{ color: '#A16207' }}>Complete your profile to get more visibility in search results</p>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(245,166,35,0.2)' }}>
              <div className="h-full rounded-full quota-bar-fill transition-all duration-500" style={{ width: `${completeness}%` }} />
            </div>
          </div>
          <button onClick={() => onNavigate('profile')} className="btn-primary px-4 py-2 text-sm flex-shrink-0">Complete Profile</button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Profile Views', value: profile.views.toLocaleString(), change: '+12% this week', positive: true },
          { label: 'Media Uploaded', value: `${mediaUsed} / ${mediaLimit}`, change: `${mediaLimit - mediaUsed} slots remaining`, positive: mediaUsed < mediaLimit },
          { label: 'Location', value: profile.location, change: profile.subLocation || 'Click to change', positive: true },
          { label: 'Listing Status', value: profile.status === 'active' ? 'Live' : profile.status === 'dormant' ? 'Dormant' : 'Pending', change: profile.featured ? '⭐ Featured' : 'Not featured', positive: profile.status === 'active' },
        ].map((stat) => (
          <div key={`overview-stat-${stat.label}`} className="rounded-xl border p-3 sm:p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 leading-tight" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.06em' }}>{stat.label}</p>
            <p className="text-lg sm:text-2xl font-bold tabular-nums mb-1 truncate" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            <p className="text-xs leading-tight" style={{ color: stat.positive ? '#16A34A' : '#DC2626' }}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Furniture Category Selector */}
      <div className="rounded-xl border p-4 sm:p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
            <Tag size={15} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Furniture Categories</h3>
          {selectedCategories.length > 0 && (
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.15)', color: 'var(--primary)' }}>
              {selectedCategories.length} selected
            </span>
          )}
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Select the furniture types you sell. Selected categories will appear as tags on your public listing.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {FURNITURE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <button
                key={`fcat-${cat.id}`}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border-2 text-center transition-all"
                style={{
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: isSelected ? 'rgba(194,105,42,0.08)' : 'var(--muted)',
                }}
              >
                <span className="text-xl sm:text-2xl">{cat.emoji}</span>
                <span className="text-xs font-semibold leading-tight" style={{ color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>{cat.label}</span>
              </button>
            );
          })}
        </div>
        {selectedCategories.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Active on your listing:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((id) => {
                const cat = FURNITURE_CATEGORIES.find((c) => c.id === id);
                return cat ? (
                  <span key={`active-cat-${id}`} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    {cat.emoji} {cat.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Subscription card */}
      <div className="rounded-xl border p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Subscription</p>
          {trialEnded ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold" style={{ color: '#DC2626' }}>Trial Ended — KSh {amountDue.toLocaleString()} due</span>
            </div>
          ) : profile.subscriptionExpiry ? (
            <p className="text-xs" style={{ color: '#16A34A' }}>
              ✓ Active — expires {profile.subscriptionExpiry}
            </p>
          ) : (
            <p className="text-xs" style={{ color: '#DC2626' }}>No active subscription</p>
          )}
        </div>
        <button
          onClick={() => onNavigate('visibility')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: trialEnded ? '#DC2626' : '#16A34A', color: '#fff' }}
        >
          <CreditCard size={15} />
          {trialEnded ? 'Pay Now' : 'Pay via M-Pesa'}
        </button>
      </div>

      <div className="rounded-xl border p-4 sm:p-5 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Media Upload Quota</h3>
          <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--muted-foreground)' }}>{mediaUsed} of {mediaLimit} used</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="h-full rounded-full quota-bar-fill transition-all duration-500" style={{ width: `${quotaPct}%` }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: mediaLimit }).map((_, i) => (
            <div
              key={`quota-slot-${i + 1}`}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 flex items-center justify-center text-xs font-semibold overflow-hidden"
              style={{
                borderColor: i < mediaUsed ? 'var(--primary)' : 'var(--border)',
                backgroundColor: i < mediaUsed ? 'rgba(194,105,42,0.08)' : 'var(--muted)',
                color: i < mediaUsed ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              {i < mediaUsed ? '✓' : `+${i + 1}`}
            </div>
          ))}
        </div>
        {mediaUsed >= mediaLimit && (
          <p className="text-xs mt-3 font-medium" style={{ color: '#DC2626' }}>
            Upload limit reached. Contact support to request an increase.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Edit Profile Info', desc: 'Update name, description, contact', tab: 'profile' as Tab, icon: <User size={20} /> },
          { label: 'Small Locations', desc: 'Add areas & stages you serve', tab: 'locations' as Tab, icon: <MapPin size={20} /> },
          { label: 'Manage Photos', desc: 'Upload or remove images and videos', tab: 'media' as Tab, icon: <Image size={20} /> },
          { label: 'Preview Listing', desc: 'See how buyers see your profile', tab: 'preview' as Tab, icon: <Eye size={20} /> },
        ].map((action) => (
          <button
            key={`quick-action-${action.tab}`}
            onClick={() => onNavigate(action.tab)}
            className="rounded-xl border p-4 sm:p-5 text-left transition-all card-hover"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
              {action.icon}
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{action.label}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}