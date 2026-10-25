'use client';
import React, { useState } from 'react';
import { LayoutDashboard, User, Image, Eye, Menu, X, Home, Bell, ChevronRight, CreditCard, Copy, CheckCheck, Phone, Loader2, CheckCircle2, Link2, Tag, Package, ShieldCheck, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import ProfileEditor from '@/app/client-dashboard/components/ProfileEditor';
import SmallLocationsManager from '@/app/client-dashboard/components/SmallLocationsManager';
import MediaManager from '@/app/client-dashboard/components/MediaManager';
import ListingPreview from '@/app/client-dashboard/components/ListingPreview';
import VisibilityPackage from '@/app/client-dashboard/components/VisibilityPackage';
import { useAppStore } from '@/lib/AppContext';
import { getProfileUrl } from '@/lib/mockData';
import type { ClientProfile } from '@/lib/mockData';
import AppImage from '@/components/ui/AppImage';

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

type Tab = 'overview' | 'profile' | 'locations' | 'media' | 'preview' | 'visibility';

interface Props {
  sellerId: string;
  onClose: () => void;
}

// MPesa modal (same as seller dashboard)
function MpesaModal({ onClose, businessName }: { onClose: () => void; businessName: string }) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [phoneError, setPhoneError] = useState('');

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.7)' }}>
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
                <p className="text-xs font-medium mb-1" style={{ color: '#15803D' }}>Subscription — 1 Month</p>
                <p className="text-3xl font-bold" style={{ color: '#15803D' }}>KES 1,500</p>
                <p className="text-xs mt-1" style={{ color: '#16A34A' }}>{businessName}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>M-Pesa Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" className="input-base w-full pl-9 pr-4 py-3 text-sm" />
                </div>
                {phoneError && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{phoneError}</p>}
                <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>An STK push will be sent to this number.</p>
              </div>
              <button onClick={handlePay} className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2" style={{ backgroundColor: '#16A34A', color: '#fff' }}>
                <CreditCard size={16} /> Send STK Push
              </button>
            </>
          )}
          {step === 'processing' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>STK Push Sent</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Check your phone <strong>{phone}</strong> and enter your M-Pesa PIN.</p>
            </div>
          )}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
                <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>Payment Successful!</p>
              <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>Subscription renewed. Listing is now active for another month.</p>
              <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: '#16A34A', color: '#fff' }}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSellerDashboard({ sellerId, onClose }: Props) {
  const { clients } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMpesa, setShowMpesa] = useState(false);

  const profile = clients.find((c) => c.id === sellerId) ?? clients[0];
  const profileUrl = getProfileUrl(profile);
  const fullProfileUrl = `https://furniture2333.builtwithrocket.new${profileUrl}`;

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
    { id: 'visibility', label: 'Visibility Package', icon: <Package size={18} /> },
    { id: 'preview', label: 'Live Preview', icon: <Eye size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      {/* Admin banner */}
      <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0" style={{ backgroundColor: '#1C1410', color: '#fff' }}>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' }}
          aria-label="Back to admin dashboard"
        >
          <ArrowLeft size={14} />
          <span>Back to Admin</span>
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck size={15} style={{ color: '#C2692A', flexShrink: 0 }} />
          <p className="text-xs font-semibold truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Admin Mode — Managing: <span style={{ color: '#C2692A' }}>{profile.businessName}</span>
            <span className="ml-2 font-normal" style={{ color: 'rgba(255,255,255,0.55)' }}>({profile.email})</span>
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <AppImage src={profile.avatar} alt={profile.avatarAlt} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
        </div>
      </div>

      {/* Dashboard body */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-60' : 'w-16'}`}
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className={`h-16 flex items-center border-b px-4 ${sidebarOpen ? 'justify-between' : 'justify-center'}`} style={{ borderColor: 'var(--border)' }}>
            {sidebarOpen && (
              <div className="flex items-center gap-2 overflow-hidden">
                <AppLogo size={28} />
                <span className="font-bold text-base truncate" style={{ color: 'var(--primary)' }}>Nairobi Spot</span>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted-foreground)' }} aria-label="Toggle sidebar">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={`admin-seller-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full ${activeTab === item.id ? 'sidebar-active' : ''}`}
                style={activeTab !== item.id ? { color: 'var(--muted-foreground)' } : {}}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left truncate font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.15)', color: 'var(--primary)' }}>
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
                title={!sidebarOpen ? 'View Homepage' : undefined}
              >
                <Home size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">View Homepage</span>}
              </Link>
            </div>
          </nav>

          <div className={`border-t p-3 ${sidebarOpen ? '' : 'flex justify-center'}`} style={{ borderColor: 'var(--border)' }}>
            {sidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{profile.businessName}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{profile.email}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg transition-colors ml-2"
                  style={{ color: 'var(--muted-foreground)' }}
                  title="Back to admin"
                  aria-label="Back to admin dashboard"
                >
                  <ArrowLeft size={16} />
                </button>
              </div>
            ) : (
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--muted-foreground)' }} title="Back to admin" aria-label="Back to admin">
                <ArrowLeft size={16} />
              </button>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 flex-shrink-0" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span className="hidden sm:inline">Dashboard</span>
                <ChevronRight size={14} className="hidden sm:inline" />
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  {navItems.find((n) => n.id === activeTab)?.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:inline ${profile.status === 'active' ? 'badge-active' : profile.status === 'dormant' ? 'badge-suspended' : 'badge-pending'}`}>
                {profile.status === 'active' ? '● Live' : profile.status === 'dormant' ? '● Dormant' : '● Pending Review'}
              </span>
              <button
                onClick={() => setShowMpesa(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ backgroundColor: '#16A34A', color: '#fff' }}
              >
                <CreditCard size={13} />
                <span className="hidden sm:inline">Pay / Subscribe</span>
                <span className="sm:hidden">Pay</span>
              </button>
              <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--muted-foreground)' }} aria-label="Notifications">
                <Bell size={18} />
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 xl:p-8 overflow-y-auto">
            {activeTab === 'overview' && (
              <SellerOverview
                profile={profile}
                completeness={completeness}
                profileUrl={profileUrl}
                fullProfileUrl={fullProfileUrl}
                onNavigate={(tab) => setActiveTab(tab)}
                onPay={() => setShowMpesa(true)}
              />
            )}
            {activeTab === 'profile' && <ProfileEditor profile={profile} />}
            {activeTab === 'locations' && <SmallLocationsManager profile={profile} />}
            {activeTab === 'media' && <MediaManager profile={profile} />}
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
      </div>

      {showMpesa && (
        <MpesaModal onClose={() => setShowMpesa(false)} businessName={profile.businessName} />
      )}
    </div>
  );
}

function SellerOverview({
  profile,
  completeness,
  profileUrl,
  fullProfileUrl,
  onNavigate,
  onPay,
}: {
  profile: ClientProfile;
  completeness: number;
  profileUrl: string;
  fullProfileUrl: string;
  onNavigate: (tab: Tab) => void;
  onPay: () => void;
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
          Welcome back, {profile.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Manage your listing for <strong>{profile.businessName}</strong>
        </p>
      </div>

      {profile.status === 'dormant' && (
        <div className="rounded-xl border p-5 mb-6 flex items-start gap-4" style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderColor: 'rgba(220,38,38,0.3)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <CreditCard size={18} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1" style={{ color: '#991B1B' }}>Account is dormant</p>
            <p className="text-xs mb-3" style={{ color: '#B91C1C' }}>Listing is hidden from buyers. Renew subscription to go live.</p>
            <button onClick={onPay} className="px-4 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor: '#16A34A', color: '#fff' }}>
              Pay Now via M-Pesa
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Link2 size={15} style={{ color: 'var(--primary)' }} />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Shareable Profile URL</h3>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Share this link with customers so they can find this business directly.</p>
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
        <div className="rounded-xl border p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ backgroundColor: 'rgba(245,166,35,0.08)', borderColor: 'rgba(245,166,35,0.3)' }}>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1" style={{ color: '#92400E' }}>Profile is {completeness}% complete</p>
            <p className="text-xs mb-3" style={{ color: '#A16207' }}>Complete the profile for better visibility in search results</p>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(245,166,35,0.2)' }}>
              <div className="h-full rounded-full quota-bar-fill transition-all duration-500" style={{ width: `${completeness}%` }} />
            </div>
          </div>
          <button onClick={() => onNavigate('profile')} className="btn-primary px-4 py-2 text-sm flex-shrink-0">Complete Profile</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Profile Views', value: profile.views.toLocaleString(), change: '+12% this week', positive: true },
          { label: 'Media Uploaded', value: `${mediaUsed} / ${mediaLimit}`, change: `${mediaLimit - mediaUsed} slots remaining`, positive: mediaUsed < mediaLimit },
          { label: 'Location', value: profile.location, change: profile.subLocation || 'Click to change', positive: true },
          { label: 'Listing Status', value: profile.status === 'active' ? 'Live' : profile.status === 'dormant' ? 'Dormant' : 'Pending', change: profile.featured ? '⭐ Featured' : 'Not featured', positive: profile.status === 'active' },
        ].map((stat) => (
          <div key={`admin-seller-stat-${stat.label}`} className="rounded-xl border p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.06em' }}>{stat.label}</p>
            <p className="text-2xl font-bold tabular-nums mb-1" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            <p className="text-xs" style={{ color: stat.positive ? '#16A34A' : '#DC2626' }}>{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
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
          Select the furniture types this seller offers. Selected categories appear as tags on the public listing.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FURNITURE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <button
                key={`admin-fcat-${cat.id}`}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all"
                style={{
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: isSelected ? 'rgba(194,105,42,0.08)' : 'var(--muted)',
                }}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-semibold leading-tight" style={{ color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>{cat.label}</span>
                <span className="text-xs leading-tight hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>{cat.desc}</span>
              </button>
            );
          })}
        </div>
        {selectedCategories.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Active on listing:</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((id) => {
                const cat = FURNITURE_CATEGORIES.find((c) => c.id === id);
                return cat ? (
                  <span key={`admin-active-cat-${id}`} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    {cat.emoji} {cat.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Subscription</p>
          {profile.subscriptionExpiry ? (
            <p className="text-xs" style={{ color: '#16A34A' }}>✓ Active — expires {profile.subscriptionExpiry}</p>
          ) : (
            <p className="text-xs" style={{ color: '#DC2626' }}>No active subscription</p>
          )}
        </div>
        <button
          onClick={onPay}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: '#16A34A', color: '#fff' }}
        >
          <CreditCard size={15} /> Pay via M-Pesa
        </button>
      </div>

      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
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
              key={`admin-quota-slot-${i + 1}`}
              className="w-14 h-14 rounded-lg border-2 flex items-center justify-center text-xs font-semibold overflow-hidden"
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Edit Profile Info', desc: 'Update name, description, contact', tab: 'profile' as Tab, icon: <User size={20} /> },
          { label: 'Small Locations', desc: 'Add or remove areas this seller serves', tab: 'locations' as Tab, icon: <MapPin size={20} /> },
          { label: 'Manage Photos', desc: 'Upload or remove images and videos', tab: 'media' as Tab, icon: <Image size={20} /> },
          { label: 'Preview Listing', desc: 'See how buyers see this profile', tab: 'preview' as Tab, icon: <Eye size={20} /> },
        ].map((action) => (
          <button
            key={`admin-quick-action-${action.tab}`}
            onClick={() => onNavigate(action.tab)}
            className="rounded-xl border p-5 text-left transition-all card-hover"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
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
