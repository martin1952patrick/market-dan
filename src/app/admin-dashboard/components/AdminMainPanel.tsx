'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LayoutDashboard, Users, MapPin, FileText, Star, LogOut, Menu, X, Home, ChevronRight, Bell, Settings, Navigation, Search, UserCog, ArrowRight, KeyRound, Phone, Mail, CheckCircle2, Loader2, Eye, EyeOff, Package, Crosshair } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import AppImage from '@/components/ui/AppImage';
import AdminKPIs from './AdminKPIs';
import AdminClientsTable from './AdminClientsTable';
import AdminLocations from './AdminLocations';
import AdminBlog from './AdminBlog';
import AdminFeatured from './AdminFeatured';
import AdminSettings from './AdminSettings';
import AdminNearbyPlaces from './AdminNearbyPlaces';
import AdminSellerDashboard from './AdminSellerDashboard';
import AdminMicroLocations from './AdminMicroLocations';
import AdminVisibilityControl from './AdminVisibilityControl';
import { useAppStore } from '@/lib/AppContext';

interface Props {
  onLogout: () => void;
}

type AdminTab = 'overview' | 'clients' | 'locations' | 'blog' | 'featured' | 'settings' | 'nearby' | 'seller-dashboards' | 'micro-locations' | 'visibility';

// ─── Password Reset Modal ─────────────────────────────────────────────────────
interface PasswordResetModalProps {
  seller: ReturnType<typeof useAppStore>['clients'][number];
  onClose: () => void;
}

function PasswordResetModal({ seller, onClose }: PasswordResetModalProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'choose' | 'sending' | 'code' | 'newpass' | 'done'>('choose');
  const [code, setCode] = useState('');
  const [generatedCode] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSendCode = () => {
    setStep('sending');
    setTimeout(() => {
      setCode(generatedCode);
      setStep('code');
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (enteredCode.trim() !== generatedCode) {
      setCodeError('Incorrect code. Please try again.');
      return;
    }
    setCodeError('');
    setStep('newpass');
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }
    setPassError('');
    setStep('done');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.75)' }}>
      <div className="rounded-2xl border shadow-modal w-full max-w-md" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>
              <KeyRound size={18} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>Reset Password</p>
              <p className="text-xs truncate max-w-[200px]" style={{ color: 'var(--muted-foreground)' }}>{seller.businessName}</p>
            </div>
          </div>
          {step !== 'sending' && (
            <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)' }} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          {/* Step: choose method */}
          {step === 'choose' && (
            <>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Choose how to send the verification code to <strong style={{ color: 'var(--foreground)' }}>{seller.name}</strong>:
              </p>
              <div className="flex flex-col gap-3 mb-5">
                <button
                  onClick={() => setMethod('email')}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: method === 'email' ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: method === 'email' ? 'rgba(194,105,42,0.06)' : 'var(--muted)',
                  }}
                >
                  <Mail size={18} style={{ color: method === 'email' ? 'var(--primary)' : 'var(--muted-foreground)', flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Send via Email</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{seller.email}</p>
                  </div>
                  {method === 'email' && <span className="ml-auto w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }} />}
                </button>

                <button
                  onClick={() => setMethod('phone')}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: method === 'phone' ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: method === 'phone' ? 'rgba(194,105,42,0.06)' : 'var(--muted)',
                  }}
                >
                  <Phone size={18} style={{ color: method === 'phone' ? 'var(--primary)' : 'var(--muted-foreground)', flexShrink: 0 }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Send via Phone (SMS)</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{seller.phone || 'No phone on record'}</p>
                  </div>
                  {method === 'phone' && <span className="ml-auto w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }} />}
                </button>
              </div>
              <button
                onClick={handleSendCode}
                disabled={method === 'phone' && !seller.phone}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', opacity: (method === 'phone' && !seller.phone) ? 0.5 : 1 }}
              >
                Send Verification Code
              </button>
            </>
          )}

          {/* Step: sending */}
          {step === 'sending' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(194,105,42,0.1)' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
              </div>
              <p className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>Sending Code…</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Sending verification code via {method === 'email' ? `email to ${seller.email}` : `SMS to ${seller.phone}`}
              </p>
            </div>
          )}

          {/* Step: enter code */}
          {step === 'code' && (
            <>
              <div className="rounded-xl p-4 mb-5 flex items-start gap-3" style={{ backgroundColor: 'rgba(194,105,42,0.08)', border: '1px solid rgba(194,105,42,0.2)' }}>
                {method === 'email' ? <Mail size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} /> : <Phone size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />}
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--primary)' }}>Code Sent!</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    A 6-digit code was sent to {method === 'email' ? seller.email : seller.phone}.
                    {/* Demo: show code in dev */}
                    <span className="ml-1 font-mono font-bold" style={{ color: 'var(--foreground)' }}>(Demo code: {code})</span>
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Enter 6-digit Code</label>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="input-base w-full px-4 py-3 text-center text-xl font-mono tracking-widest"
                  style={{ color: 'var(--foreground)', letterSpacing: '0.3em' }}
                />
                {codeError && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{codeError}</p>}
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={enteredCode.length !== 6}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', opacity: enteredCode.length !== 6 ? 0.5 : 1 }}
              >
                Verify Code
              </button>
              <button
                onClick={() => setStep('choose')}
                className="w-full mt-2 py-2 rounded-xl text-xs font-medium"
                style={{ color: 'var(--muted-foreground)' }}
              >
                ← Change method
              </button>
            </>
          )}

          {/* Step: new password */}
          {step === 'newpass' && (
            <>
              <div className="rounded-xl p-3 mb-5 flex items-center gap-2" style={{ backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <CheckCircle2 size={15} style={{ color: '#16A34A', flexShrink: 0 }} />
                <p className="text-xs font-semibold" style={{ color: '#15803D' }}>Code verified successfully</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="input-base w-full px-4 py-3 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted-foreground)' }}
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Confirm Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="input-base w-full px-4 py-3 text-sm"
                />
                {passError && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{passError}</p>}
              </div>
              <button
                onClick={handleResetPassword}
                disabled={!newPassword || !confirmPassword}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', opacity: (!newPassword || !confirmPassword) ? 0.5 : 1 }}
              >
                Reset Password
              </button>
            </>
          )}

          {/* Step: done */}
          {step === 'done' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
                <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>Password Reset!</p>
              <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>
                Password for <strong>{seller.businessName}</strong> has been successfully reset.
              </p>
              <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminMainPanel({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clients, locations, blogPosts, siteSettings } = useAppStore();

  // Global seller search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [resetSeller, setResetSeller] = useState<ReturnType<typeof useAppStore>['clients'][number] | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter sellers based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.businessName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? '').replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, '')) ||
        c.location.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [clients, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openSellerDashboard = (id: string) => {
    setSelectedSellerId(id);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'clients', label: 'Manage Clients', icon: <Users size={18} />, badge: String(clients.length) },
    { id: 'locations', label: 'Locations', icon: <MapPin size={18} />, badge: String(locations.length) },
    { id: 'micro-locations', label: 'Micro Locations', icon: <Crosshair size={18} />, badge: String(siteSettings?.microLocations?.length ?? 0) },
    { id: 'nearby', label: 'Nearby Places', icon: <Navigation size={18} /> },
    { id: 'visibility', label: 'Visibility Control', icon: <Package size={18} /> },
    { id: 'blog', label: 'Blog Posts', icon: <FileText size={18} />, badge: String(blogPosts.length) },
    { id: 'featured', label: 'Featured Slots', icon: <Star size={18} />, badge: String(clients.filter(c => c.featured && c.status === 'active').length) },
    { id: 'seller-dashboards', label: 'Seller Dashboards', icon: <UserCog size={18} />, badge: String(clients.length) },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const tabLabel = navItems.find((n) => n.id === activeTab)?.label ?? '';

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-56' : 'w-0 lg:w-16'} fixed inset-y-0 left-0 z-30 lg:relative lg:inset-auto overflow-hidden`}
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className={`h-16 flex items-center border-b px-3 ${sidebarOpen ? 'justify-between' : 'justify-center'}`} style={{ borderColor: 'var(--border)' }}>
          {sidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <AppLogo size={28} />
              <div className="min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: 'var(--primary)' }}>Nairobi Spot</p>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>Admin Panel</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} aria-label="Toggle sidebar">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={`admin-nav-${item.id}`}
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
              title="View Homepage"
            >
              <Home size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="font-medium text-xs">View Homepage</span>}
            </Link>
          </div>
        </nav>

        <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>Administrator</p>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>admin@nairobispot.com</p>
              </div>
              <button onClick={onLogout} className="p-1.5 rounded-lg ml-2 transition-colors flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} title="Sign out" aria-label="Sign out">
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

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`} style={{ marginLeft: 0 }}>
        <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg lg:hidden mr-2 flex-shrink-0"
              style={{ color: 'var(--muted-foreground)' }}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-sm flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>
              <span className="hidden sm:inline">Admin</span>
              <ChevronRight size={14} className="hidden sm:inline" />
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{tabLabel}</span>
            </div>
          </div>

          {/* Global Seller Search */}
          <div ref={searchRef} className="relative flex-1 max-w-xs mx-3 sm:mx-6">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search seller to access dashboard…"
                className="input-base w-full pl-8 pr-4 py-2 text-xs rounded-xl"
                aria-label="Search sellers"
              />
            </div>

            {/* Search dropdown */}
            {searchOpen && searchQuery.trim() && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-modal overflow-hidden z-50"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                    No sellers found for "{searchQuery}"
                  </div>
                ) : (
                  <>
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                      <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                        {searchResults.length} seller{searchResults.length !== 1 ? 's' : ''} found — click to access dashboard
                      </p>
                    </div>
                    {searchResults.map((seller) => (
                      <button
                        key={`search-result-${seller.id}`}
                        onClick={() => openSellerDashboard(seller.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60 border-b last:border-b-0"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <AppImage
                          src={seller.avatar}
                          alt={seller.avatarAlt}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>{seller.businessName}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{seller.email} · {seller.location}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                            style={{
                              backgroundColor: seller.status === 'active' ? 'rgba(22,163,74,0.12)' : 'rgba(107,114,128,0.12)',
                              color: seller.status === 'active' ? '#16A34A' : '#6B7280',
                            }}
                          >
                            {seller.status}
                          </span>
                          <UserCog size={13} style={{ color: 'var(--primary)' }} />
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full badge-active hidden sm:inline">● System Live</span>
            <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--muted-foreground)' }} aria-label="Notifications">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 xl:p-8 overflow-auto">
          {activeTab === 'overview' && (
            <>
              <AdminKPIs />
              {/* Seller Quick Access Panel */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>
                    <UserCog size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Seller Dashboard Access</h2>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      Search and open any seller's full dashboard — edit profile, media, visibility, reset password, and more
                    </p>
                  </div>
                </div>
                <SellerQuickSearch clients={clients} onOpen={openSellerDashboard} onResetPassword={(seller) => setResetSeller(seller)} />
              </div>
            </>
          )}
          {activeTab === 'clients' && <AdminClientsTable />}
          {activeTab === 'locations' && <AdminLocations />}
          {activeTab === 'nearby' && <AdminNearbyPlaces />}
          {activeTab === 'micro-locations' && <AdminMicroLocations />}
          {activeTab === 'visibility' && <AdminVisibilityControl />}
          {activeTab === 'blog' && <AdminBlog />}
          {activeTab === 'featured' && <AdminFeatured />}
          {activeTab === 'settings' && <AdminSettings />}
          {activeTab === 'seller-dashboards' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>
                  <UserCog size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Seller Dashboards</h2>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    All sellers listed below — open their dashboard, reset passwords, and manage accounts
                  </p>
                </div>
              </div>
              <SellerQuickSearch clients={clients} onOpen={openSellerDashboard} onResetPassword={(seller) => setResetSeller(seller)} />
            </div>
          )}
        </main>
      </div>

      {/* Seller Full Dashboard — opened via search */}
      {selectedSellerId && (
        <AdminSellerDashboard
          sellerId={selectedSellerId}
          onClose={() => setSelectedSellerId(null)}
        />
      )}

      {/* Password Reset Modal */}
      {resetSeller && (
        <PasswordResetModal
          seller={resetSeller}
          onClose={() => setResetSeller(null)}
        />
      )}
    </div>
  );
}

// ─── Inline Seller Quick Search ───────────────────────────────────────────────
interface QuickSearchProps {
  clients: ReturnType<typeof useAppStore>['clients'];
  onOpen: (id: string) => void;
  onResetPassword: (seller: ReturnType<typeof useAppStore>['clients'][number]) => void;
}

function SellerQuickSearch({ clients, onOpen, onResetPassword }: QuickSearchProps) {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    if (!q.trim()) return clients;
    const lower = q.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.businessName.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        (c.phone ?? '').replace(/\s/g, '').toLowerCase().includes(lower.replace(/\s/g, '')) ||
        c.location.toLowerCase().includes(lower) ||
        c.name.toLowerCase().includes(lower)
    );
  }, [clients, q]);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      {/* Search bar */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search seller by name, email, phone, or location…"
            className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
            aria-label="Search sellers for dashboard access"
          />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
          {q.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : `All ${clients.length} sellers`}
        </p>
      </div>

      {/* Results list */}
      {results.length === 0 ? (
        <div className="py-10 text-center" style={{ color: 'var(--muted-foreground)' }}>
          <Search size={24} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">No sellers match "{q}"</p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {results.map((seller) => {
            const tierColors: Record<string, { bg: string; text: string }> = {
              elite: { bg: '#D4AF37', text: '#1C1410' },
              spotlight: { bg: '#E91E8C', text: '#fff' },
              premium: { bg: '#7C3AED', text: '#fff' },
              standard: { bg: '#1C1410', text: '#fff' },
            };
            const tier = seller.tier ? tierColors[seller.tier] : null;

            return (
              <div
                key={`qs-${seller.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
              >
                <AppImage
                  src={seller.avatar}
                  alt={seller.avatarAlt}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{seller.businessName}</p>
                    {tier && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full capitalize" style={{ backgroundColor: tier.bg, color: tier.text }}>
                        {seller.tier}
                      </span>
                    )}
                    {seller.verified && (
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(29,78,216,0.1)', color: '#1D4ED8' }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                    {seller.email} · {seller.phone || 'No phone'} · {seller.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize hidden sm:inline"
                    style={{
                      backgroundColor: seller.status === 'active' ? 'rgba(22,163,74,0.12)' : seller.status === 'suspended' ? 'rgba(220,38,38,0.1)' : 'rgba(107,114,128,0.1)',
                      color: seller.status === 'active' ? '#16A34A' : seller.status === 'suspended' ? '#DC2626' : '#6B7280',
                    }}
                  >
                    {seller.status}
                  </span>
                  {/* Reset Password button */}
                  <button
                    onClick={() => onResetPassword(seller)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)', border: '1px solid rgba(194,105,42,0.2)' }}
                    title={`Reset password for ${seller.businessName}`}
                  >
                    <KeyRound size={12} />
                    <span className="hidden md:inline">Reset</span>
                  </button>
                  {/* Open Dashboard button */}
                  <button
                    onClick={() => onOpen(seller.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    title={`Open ${seller.businessName}'s dashboard`}
                  >
                    <UserCog size={13} />
                    <span className="hidden sm:inline">Open Dashboard</span>
                    <span className="sm:hidden">Open</span>
                    <ArrowRight size={12} className="hidden sm:inline" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
