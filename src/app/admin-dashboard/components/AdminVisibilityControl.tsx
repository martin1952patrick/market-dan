'use client';
import React, { useState, useMemo } from 'react';
import { Crown, Star, Zap, Award, Search, Calendar, CheckCircle2, X, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import AppImage from '@/components/ui/AppImage';
import type { VisibilityPackageTier, VisibilityPackageConfig } from '@/lib/mockData';
import { Toaster, toast } from 'sonner';

const TIER_CONFIG: Record<VisibilityPackageTier, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  elite: { label: 'Elite', color: '#1C1410', bg: 'linear-gradient(135deg, #D4AF37 0%, #F5E27A 50%, #D4AF37 100%)', border: '#D4AF37', icon: <Crown size={16} /> },
  spotlight: { label: 'Spotlight', color: '#FFFFFF', bg: 'linear-gradient(135deg, #E91E8C 0%, #FF6EC7 50%, #E91E8C 100%)', border: '#E91E8C', icon: <Star size={16} /> },
  premium: { label: 'Premium', color: '#FFFFFF', bg: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #7C3AED 100%)', border: '#7C3AED', icon: <Zap size={16} /> },
  standard: { label: 'Standard', color: '#FFFFFF', bg: 'linear-gradient(135deg, #1C1410 0%, #3D2B1F 50%, #1C1410 100%)', border: '#3D2B1F', icon: <Award size={16} /> },
};

const DURATION_OPTIONS = [
  { days: 7, label: '7 days' },
  { days: 14, label: '14 days' },
  { days: 30, label: '30 days' },
  { days: 60, label: '60 days' },
  { days: 90, label: '90 days' },
];

interface EditModalProps {
  sellerId: string;
  onClose: () => void;
}

function VisibilityEditModal({ sellerId, onClose }: EditModalProps) {
  const { clients, setSellerVisibilityPackage } = useAppStore();
  const seller = clients.find((c) => c.id === sellerId);

  const [selectedTier, setSelectedTier] = useState<VisibilityPackageTier>(
    (seller?.visibilityPackage?.tier ?? seller?.tier ?? 'standard') as VisibilityPackageTier
  );
  const [startDate, setStartDate] = useState<string>(
    seller?.visibilityPackage?.startDate ?? new Date().toISOString().split('T')[0]
  );
  const [durationDays, setDurationDays] = useState<number>(
    seller?.visibilityPackage?.durationDays ?? 30
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!seller) return null;

  const endDate = (() => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + durationDays);
    return d.toISOString().split('T')[0];
  })();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const pkg: VisibilityPackageConfig = {
        tier: selectedTier,
        startDate,
        endDate,
        durationDays,
        setByAdmin: true,
      };
      setSellerVisibilityPackage(sellerId, pkg);
      setSaving(false);
      setSaved(true);
      toast.success(`Visibility package updated for ${seller.businessName}`);
      setTimeout(onClose, 1200);
    }, 800);
  };

  const tierCfg = TIER_CONFIG[selectedTier];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.75)' }}>
      <div className="rounded-2xl border shadow-modal w-full max-w-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <AppImage src={seller.avatar} alt={seller.avatarAlt} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>Set Visibility Package</p>
              <p className="text-xs truncate max-w-[220px]" style={{ color: 'var(--muted-foreground)' }}>{seller.businessName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {saved ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
                <CheckCircle2 size={28} style={{ color: '#16A34A' }} />
              </div>
              <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Package Updated!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{seller.businessName} is now on <strong>{tierCfg.label}</strong></p>
            </div>
          ) : (
            <>
              {/* Tier selection */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Visibility Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TIER_CONFIG) as VisibilityPackageTier[]).map((tier) => {
                    const cfg = TIER_CONFIG[tier];
                    const isSelected = selectedTier === tier;
                    return (
                      <button
                        key={`tier-opt-${tier}`}
                        onClick={() => setSelectedTier(tier)}
                        className="flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 transition-all text-left"
                        style={{
                          borderColor: isSelected ? cfg.border : 'var(--border)',
                          background: isSelected ? cfg.bg : 'var(--muted)',
                        }}
                      >
                        <span style={{ color: isSelected ? cfg.color : 'var(--muted-foreground)', flexShrink: 0 }}>{cfg.icon}</span>
                        <span className="font-semibold text-sm" style={{ color: isSelected ? cfg.color : 'var(--foreground)' }}>{cfg.label}</span>
                        {isSelected && (
                          <span className="ml-auto w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                    <Calendar size={13} className="inline mr-1" />Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-base w-full px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Duration</label>
                  <div className="relative">
                    <select
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="input-base w-full px-3 py-2.5 text-sm appearance-none cursor-pointer"
                    >
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={`dur-${opt.days}`} value={opt.days}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: 'rgba(194,105,42,0.08)', border: '1px solid rgba(194,105,42,0.2)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>Package Summary</p>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                  <strong>{tierCfg.label}</strong> · {durationDays} days
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  {startDate} → {endDate}
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: '#16A34A' }}>
                  ✓ Set by Admin — overrides seller's own selection
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  'Apply Package'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminVisibilityControl() {
  const { clients } = useAppStore();
  const [q, setQ] = useState('');
  const [editingSellerId, setEditingSellerId] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!q.trim()) return clients;
    const lower = q.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.businessName.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        c.location.toLowerCase().includes(lower) ||
        c.name.toLowerCase().includes(lower)
    );
  }, [clients, q]);

  return (
    <div>
      <Toaster position="bottom-right" richColors />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Visibility Package Control</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Set or override each seller's visibility tier, start date, and end date individually. Admin-set packages take priority over seller selections.
        </p>
      </div>

      {/* Search */}
      <div className="rounded-xl border p-4 mb-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search seller by name, email, or location…"
            className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
          {q.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : `All ${clients.length} sellers`}
        </p>
      </div>

      {/* Seller list */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider grid grid-cols-12 gap-3" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          <span className="col-span-4">Seller</span>
          <span className="col-span-3">Current Tier</span>
          <span className="col-span-3">Expiry</span>
          <span className="col-span-2 text-right">Action</span>
        </div>

        {results.length === 0 ? (
          <div className="py-10 text-center" style={{ color: 'var(--muted-foreground)' }}>
            <Search size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No sellers match "{q}"</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {results.map((seller, i) => {
              const tierKey = (seller.visibilityPackage?.tier ?? seller.tier) as VisibilityPackageTier | undefined;
              const tierCfg = tierKey ? TIER_CONFIG[tierKey] : null;
              const isAdminSet = seller.visibilityPackage?.setByAdmin;
              const expiry = seller.visibilityPackage?.endDate ?? seller.subscriptionExpiry;
              const isExpired = expiry ? new Date(expiry) < new Date() : false;

              return (
                <div
                  key={`vis-row-${seller.id}`}
                  className="px-4 py-3.5 grid grid-cols-12 gap-3 items-center transition-colors hover:bg-muted/40"
                  style={{ backgroundColor: i % 2 === 1 ? 'rgba(237,232,225,0.25)' : 'var(--card)' }}
                >
                  <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                    <AppImage src={seller.avatar} alt={seller.avatarAlt} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>{seller.businessName}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{seller.location}</p>
                    </div>
                  </div>

                  <div className="col-span-3">
                    {tierCfg ? (
                      <div className="flex flex-col gap-1">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full w-fit"
                          style={{ background: tierCfg.bg, color: tierCfg.color }}
                        >
                          {tierCfg.icon}
                          {tierCfg.label}
                        </span>
                        {isAdminSet && (
                          <span className="text-xs font-medium" style={{ color: 'var(--primary)' }}>Admin-set</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>No package</span>
                    )}
                  </div>

                  <div className="col-span-3">
                    {expiry ? (
                      <span
                        className="text-xs font-medium"
                        style={{ color: isExpired ? '#DC2626' : '#16A34A' }}
                      >
                        {isExpired ? '⚠ Expired' : '✓ Active'}<br />
                        <span className="font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>{expiry}</span>
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</span>
                    )}
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => setEditingSellerId(seller.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    >
                      Set Package
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingSellerId && (
        <VisibilityEditModal
          sellerId={editingSellerId}
          onClose={() => setEditingSellerId(null)}
        />
      )}
    </div>
  );
}
