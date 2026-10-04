'use client';
import React, { useState } from 'react';
import { X, Save, Key, Eye, EyeOff, CheckCircle2, AlertCircle, User, Image, Package, ChevronRight, LayoutDashboard, Link2, Copy, CheckCheck, Tag, CreditCard } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import type { ClientProfile, ListingTier } from '@/lib/mockData';
import AppImage from '@/components/ui/AppImage';
import ProfileEditor from '@/app/client-dashboard/components/ProfileEditor';
import MediaManager from '@/app/client-dashboard/components/MediaManager';
import VisibilityPackage from '@/app/client-dashboard/components/VisibilityPackage';
import ListingPreview from '@/app/client-dashboard/components/ListingPreview';
import { getProfileUrl } from '@/lib/mockData';

interface Props {
  client: ClientProfile;
  onClose: () => void;
}

type AdminSellerTab = 'overview' | 'account' | 'profile' | 'media' | 'visibility' | 'preview';

const TIER_OPTIONS: { value: ListingTier; label: string; bg: string; text: string }[] = [
  { value: 'elite', label: 'Elite', bg: '#D4AF37', text: '#1C1410' },
  { value: 'spotlight', label: 'Spotlight', bg: '#E91E8C', text: '#FFFFFF' },
  { value: 'premium', label: 'Premium', bg: '#7C3AED', text: '#FFFFFF' },
  { value: 'standard', label: 'Standard', bg: '#1C1410', text: '#FFFFFF' },
  { value: null, label: 'None', bg: '#E5E7EB', text: '#6B7280' },
];

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

export default function AdminSellerEditor({ client, onClose }: Props) {
  const { adminUpdateClient, updateClientPassword, setClientTier, toggleVerified, toggleStatus, clients } = useAppStore();
  const [activeTab, setActiveTab] = useState<AdminSellerTab>('overview');
  const [form, setForm] = useState({
    name: client.name,
    businessName: client.businessName,
    email: client.email,
    phone: client.phone,
    county: client.county,
    subcounty: client.subcounty,
    division: client.division,
    location: client.location,
    subLocation: client.subLocation,
    road: client.road,
    description: client.description,
  });
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Get live client from context (reflects any changes made in sub-tabs)
  const liveClient = clients.find((c) => c.id === client.id) ?? client;

  const profileUrl = getProfileUrl(liveClient);
  const fullProfileUrl = `https://furniture2333.builtwithrocket.new${profileUrl}`;

  const completeness = (() => {
    let score = 0;
    if (liveClient.businessName) score += 20;
    if (liveClient.description.length > 50) score += 20;
    if (liveClient.phone) score += 15;
    if (liveClient.location) score += 15;
    if (liveClient.media.length >= 1) score += 15;
    if (liveClient.media.length >= 3) score += 15;
    return score;
  })();

  const mediaUsed = liveClient.media.length;
  const mediaLimit = liveClient.uploadLimit;
  const quotaPct = Math.round((mediaUsed / mediaLimit) * 100);

  const handleSave = () => {
    adminUpdateClient(client.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordReset = () => {
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordError('');
    updateClientPassword(client.id, newPassword);
    setNewPassword('');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

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

  const field = (label: string, key: keyof typeof form, type: string = 'text') => (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      {key === 'description' ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
          rows={3}
          className="input-base w-full px-3 py-2 text-sm resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
          className="input-base w-full px-3 py-2 text-sm"
        />
      )}
    </div>
  );

  const tabs: { id: AdminSellerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={14} /> },
    { id: 'account', label: 'Account & Password', icon: <Key size={14} /> },
    { id: 'profile', label: 'Edit Profile', icon: <User size={14} /> },
    { id: 'media', label: 'Media', icon: <Image size={14} /> },
    { id: 'visibility', label: 'Visibility', icon: <Package size={14} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" style={{ backgroundColor: 'rgba(28,20,16,0.75)' }}>
      <div className="rounded-2xl border shadow-modal w-full max-w-3xl max-h-[95vh] flex flex-col" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <AppImage src={liveClient.avatar} alt={liveClient.avatarAlt} width={40} height={40} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: 'var(--foreground)' }}>
                Admin: Managing Seller Account
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{liveClient.businessName} · {liveClient.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg flex-shrink-0 ml-2" style={{ color: 'var(--muted-foreground)' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b overflow-x-auto flex-shrink-0 scrollbar-thin" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={`admin-seller-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 flex-shrink-0"
              style={{
                borderBottomColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
                backgroundColor: activeTab === tab.id ? 'rgba(194,105,42,0.06)' : 'transparent',
              }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Overview tab — mirrors seller's Overview */}
          {activeTab === 'overview' && (
            <div className="px-5 py-5 flex flex-col gap-5">
              <div className="rounded-xl border p-3 flex items-center gap-2" style={{ backgroundColor: 'rgba(194,105,42,0.06)', borderColor: 'rgba(194,105,42,0.2)' }}>
                <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                  Viewing <strong>{liveClient.businessName}</strong>'s dashboard as admin. All changes apply immediately.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Profile Views', value: liveClient.views.toLocaleString(), note: 'Total views', positive: true },
                  { label: 'Media Uploaded', value: `${mediaUsed} / ${mediaLimit}`, note: `${mediaLimit - mediaUsed} slots left`, positive: mediaUsed < mediaLimit },
                  { label: 'Location', value: liveClient.location || '—', note: liveClient.subLocation || liveClient.county || '—', positive: true },
                  { label: 'Status', value: liveClient.status === 'active' ? 'Live' : liveClient.status === 'dormant' ? 'Dormant' : liveClient.status, note: liveClient.featured ? '⭐ Featured' : 'Not featured', positive: liveClient.status === 'active' },
                ].map((stat) => (
                  <div key={`admin-overview-stat-${stat.label}`} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                    <p className="text-lg font-bold tabular-nums mb-0.5 truncate" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
                    <p className="text-xs truncate" style={{ color: stat.positive ? '#16A34A' : '#DC2626' }}>{stat.note}</p>
                  </div>
                ))}
              </div>

              {/* Profile completeness */}
              {completeness < 100 && (
                <div className="rounded-xl border p-4" style={{ backgroundColor: 'rgba(245,166,35,0.08)', borderColor: 'rgba(245,166,35,0.3)' }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#92400E' }}>Profile is {completeness}% complete</p>
                  <p className="text-xs mb-2" style={{ color: '#A16207' }}>Help this seller complete their profile for better visibility</p>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(245,166,35,0.2)' }}>
                    <div className="h-full rounded-full quota-bar-fill transition-all duration-500" style={{ width: `${completeness}%` }} />
                  </div>
                </div>
              )}

              {/* Profile URL */}
              <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Link2 size={14} style={{ color: 'var(--primary)' }} />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Seller's Public Profile URL</h3>
                </div>
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

              {/* Subscription */}
              <div className="rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Subscription</p>
                  {liveClient.subscriptionExpiry ? (
                    <p className="text-xs" style={{ color: '#16A34A' }}>✓ Active — expires {liveClient.subscriptionExpiry}</p>
                  ) : (
                    <p className="text-xs" style={{ color: '#DC2626' }}>No active subscription</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('visibility')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
                >
                  <CreditCard size={13} />
                  Manage Visibility
                </button>
              </div>

              {/* Media quota */}
              <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Media Upload Quota</h3>
                  <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--muted-foreground)' }}>{mediaUsed} of {mediaLimit} used</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="h-full rounded-full quota-bar-fill transition-all duration-500" style={{ width: `${quotaPct}%` }} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: mediaLimit }).map((_, i) => (
                    <div
                      key={`admin-quota-slot-${i + 1}`}
                      className="w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-semibold overflow-hidden"
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

              {/* Furniture categories */}
              <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={14} style={{ color: 'var(--primary)' }} />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Furniture Categories</h3>
                  {selectedCategories.length > 0 && (
                    <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.15)', color: 'var(--primary)' }}>
                      {selectedCategories.length} selected
                    </span>
                  )}
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Select furniture types this seller offers. These appear as tags on their public listing.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {FURNITURE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={`admin-fcat-${cat.id}`}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center transition-all"
                        style={{
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: isSelected ? 'rgba(194,105,42,0.08)' : 'var(--muted)',
                        }}
                      >
                        <span className="text-xl">{cat.emoji}</span>
                        <span className="text-xs font-semibold leading-tight" style={{ color: isSelected ? 'var(--primary)' : 'var(--foreground)' }}>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Edit Profile', desc: 'Update name, description, contact', tab: 'profile' as AdminSellerTab, icon: <User size={18} /> },
                  { label: 'Manage Media', desc: 'Upload or remove images and videos', tab: 'media' as AdminSellerTab, icon: <Image size={18} /> },
                  { label: 'Preview Listing', desc: 'See how buyers see this profile', tab: 'preview' as AdminSellerTab, icon: <Eye size={18} /> },
                ].map((action) => (
                  <button
                    key={`admin-quick-${action.tab}`}
                    onClick={() => setActiveTab(action.tab)}
                    className="rounded-xl border p-4 text-left transition-all card-hover"
                    style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                      {action.icon}
                    </div>
                    <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>{action.label}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{action.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Account tab */}
          {activeTab === 'account' && (
            <div className="px-5 py-5 flex flex-col gap-5">
              {/* Quick status controls */}
              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(194,105,42,0.04)' }}>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Quick Controls</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => toggleVerified(client.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: liveClient.verified ? 'rgba(29,78,216,0.12)' : 'var(--muted)',
                      color: liveClient.verified ? '#1D4ED8' : 'var(--muted-foreground)',
                    }}
                  >
                    {liveClient.verified ? '✓ Verified' : 'Mark Verified'}
                  </button>
                  {(['active', 'pending', 'suspended', 'dormant'] as const).map((s) => (
                    <button
                      key={`quick-status-${s}`}
                      onClick={() => toggleStatus(client.id, s)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize"
                      style={{
                        backgroundColor: liveClient.status === s ? 'var(--primary)' : 'var(--muted)',
                        color: liveClient.status === s ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>Listing Tier</p>
                  <div className="flex flex-wrap gap-2">
                    {TIER_OPTIONS.map((opt) => (
                      <button
                        key={`tier-opt-${opt.label}`}
                        onClick={() => setClientTier(client.id, opt.value)}
                        className="px-3 py-1 rounded-full text-xs font-semibold transition-all border-2"
                        style={{
                          backgroundColor: opt.bg,
                          color: opt.text,
                          borderColor: liveClient.tier === opt.value ? '#000' : 'transparent',
                          opacity: liveClient.tier === opt.value ? 1 : 0.75,
                        }}
                      >
                        {liveClient.tier === opt.value ? '✓ ' : ''}{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Account info */}
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field('Full Name', 'name')}
                  {field('Business Name', 'businessName')}
                  {field('Email Address', 'email', 'email')}
                  {field('Phone Number', 'phone', 'tel')}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Location Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field('County', 'county')}
                  {field('Sub-County', 'subcounty')}
                  {field('Division', 'division')}
                  {field('Location', 'location')}
                  {field('Sub-Location', 'subLocation')}
                  {field('Road', 'road')}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Business Description</h3>
                {field('Description', 'description')}
              </div>

              {/* Save profile button */}
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: saved ? '#16A34A' : 'var(--primary)', color: saved ? '#fff' : 'var(--primary-foreground)' }}
              >
                {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Account Changes</>}
              </button>

              {/* Password reset */}
              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Key size={16} style={{ color: 'var(--primary)' }} />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Reset Seller Password</h3>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Set a new password for this seller. They can use it to log in immediately.
                </p>

                {/* Current password visible to admin */}
                <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: '#991B1B' }}>Current password (admin view):</span>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="text-xs underline"
                      style={{ color: '#991B1B' }}
                    >
                      {showCurrentPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <span className="font-mono text-sm mt-1 block" style={{ color: '#7F1D1D' }}>
                    {showCurrentPassword ? liveClient.password : '••••••••••'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password…"
                      className="input-base w-full px-3 py-2.5 text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--muted-foreground)' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <button
                    onClick={handlePasswordReset}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
                    style={{ backgroundColor: passwordSaved ? '#16A34A' : '#DC2626', color: '#fff' }}
                  >
                    {passwordSaved ? 'Done!' : 'Set Password'}
                  </button>
                </div>
                {passwordError && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#DC2626' }}>
                    <AlertCircle size={12} /> {passwordError}
                  </div>
                )}
                {passwordSaved && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#16A34A' }}>
                    <CheckCircle2 size={12} /> Password updated successfully.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile tab — reuse seller's ProfileEditor */}
          {activeTab === 'profile' && (
            <div className="px-5 py-5">
              <div className="rounded-xl border p-3 mb-4 flex items-center gap-2" style={{ backgroundColor: 'rgba(194,105,42,0.06)', borderColor: 'rgba(194,105,42,0.2)' }}>
                <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                  You are editing this seller's profile as admin. Changes save immediately.
                </p>
              </div>
              <ProfileEditor profile={liveClient} />
            </div>
          )}

          {/* Media tab — reuse seller's MediaManager */}
          {activeTab === 'media' && (
            <div className="px-5 py-5">
              <div className="rounded-xl border p-3 mb-4 flex items-center gap-2" style={{ backgroundColor: 'rgba(194,105,42,0.06)', borderColor: 'rgba(194,105,42,0.2)' }}>
                <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                  Managing media for <strong>{liveClient.businessName}</strong> as admin.
                </p>
              </div>
              <MediaManager profile={liveClient} />
            </div>
          )}

          {/* Visibility tab — reuse seller's VisibilityPackage */}
          {activeTab === 'visibility' && (
            <div className="px-5 py-5">
              <div className="rounded-xl border p-3 mb-4 flex items-center gap-2" style={{ backgroundColor: 'rgba(194,105,42,0.06)', borderColor: 'rgba(194,105,42,0.2)' }}>
                <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                  Managing visibility package for <strong>{liveClient.businessName}</strong> as admin.
                </p>
              </div>
              <VisibilityPackage clientId={liveClient.id} clientEmail={liveClient.email} businessName={liveClient.businessName} currentTier={liveClient.tier} />
            </div>
          )}

          {/* Preview tab */}
          {activeTab === 'preview' && (
            <div className="px-5 py-5">
              <div className="rounded-xl border p-3 mb-4 flex items-center gap-2" style={{ backgroundColor: 'rgba(194,105,42,0.06)', borderColor: 'rgba(194,105,42,0.2)' }}>
                <ChevronRight size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                  Live preview of <strong>{liveClient.businessName}</strong>'s public listing.
                </p>
              </div>
              <ListingPreview profile={liveClient} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
