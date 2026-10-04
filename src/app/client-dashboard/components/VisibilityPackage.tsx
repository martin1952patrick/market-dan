'use client';
import React, { useState } from 'react';
import { Crown, Star, Zap, Award, CheckCircle2, Phone, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import type { ListingTier } from '@/lib/mockData';

interface PackageTier {
  id: ListingTier;
  label: string;
  tagline: string;
  features: string[];
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  options: { days: number; original: number; price: number }[];
}

const PACKAGES: PackageTier[] = [
  {
    id: 'elite',
    label: 'ELITE PLACEMENT',
    tagline: 'Maximum visibility across the platform',
    features: ['Pinned to Homepage', 'Pinned to Area and Estate Top Section', 'Automated Shuffle'],
    color: '#1C1410',
    bg: 'linear-gradient(135deg, #D4AF37 0%, #F5E27A 50%, #D4AF37 100%)',
    border: '#D4AF37',
    icon: <Crown size={20} />,
    options: [
      { days: 7, original: 1100, price: 0 },
      { days: 14, original: 1950, price: 0 },
      { days: 30, original: 3500, price: 0 },
    ],
  },
  {
    id: 'spotlight',
    label: 'SPOTLIGHT PLACEMENT',
    tagline: 'Stand out in your area',
    features: ['Pinned to Area and Estate Top Section', 'Automated Shuffle'],
    color: '#FFFFFF',
    bg: 'linear-gradient(135deg, #E91E8C 0%, #FF6EC7 50%, #E91E8C 100%)',
    border: '#E91E8C',
    icon: <Star size={20} />,
    options: [
      { days: 7, original: 900, price: 0 },
      { days: 14, original: 1600, price: 0 },
      { days: 30, original: 2800, price: 0 },
    ],
  },
  {
    id: 'premium',
    label: 'PREMIUM PLACEMENT',
    tagline: 'Great middle-section exposure',
    features: ['Displayed in Area and Estate Middle Sections', 'Automated Shuffle'],
    color: '#FFFFFF',
    bg: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #7C3AED 100%)',
    border: '#7C3AED',
    icon: <Zap size={20} />,
    options: [
      { days: 7, original: 650, price: 0 },
      { days: 14, original: 1150, price: 0 },
      { days: 30, original: 2100, price: 0 },
    ],
  },
  {
    id: 'standard',
    label: 'STANDARD PLACEMENT',
    tagline: 'Get listed and found',
    features: ['Displayed in Area and Estate Bottom Sections', 'Automated Shuffle'],
    color: '#FFFFFF',
    bg: 'linear-gradient(135deg, #1C1410 0%, #3D2B1F 50%, #1C1410 100%)',
    border: '#3D2B1F',
    icon: <Award size={20} />,
    options: [
      { days: 7, original: 500, price: 0 },
      { days: 14, original: 850, price: 0 },
      { days: 30, original: 1500, price: 0 },
    ],
  },
];

interface Props {
  clientId: string;
  clientEmail: string;
  businessName: string;
  currentTier?: ListingTier;
}

export default function VisibilityPackage({ clientId, clientEmail, businessName, currentTier }: Props) {
  const { setClientTier, updateClientProfile } = useAppStore();
  const [selectedTier, setSelectedTier] = useState<ListingTier>(currentTier ?? null);
  const [selectedDays, setSelectedDays] = useState<Record<string, number>>({
    elite: 7, spotlight: 7, premium: 7, standard: 7,
  });
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const selectedPackage = PACKAGES.find((p) => p.id === selectedTier);
  const selectedOption = selectedPackage
    ? selectedPackage.options.find((o) => o.days === selectedDays[selectedTier ?? ''])
    : null;
  const totalDue = selectedOption?.price ?? 0;
  const isFree = totalDue === 0;

  const handleActivate = () => {
    if (!selectedTier) return;
    if (!isFree) {
      if (!mpesaPhone.match(/^(07|01|\+2547|\+2541)\d{8}$/)) {
        setPhoneError('Enter a valid Safaricom number e.g. 0712 345 678');
        return;
      }
    }
    setPhoneError('');
    setActivating(true);

    setTimeout(() => {
      // Set tier in context — auto-classifies the seller
      setClientTier(clientId, selectedTier);
      // Set subscription expiry
      const days = selectedDays[selectedTier];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);
      updateClientProfile(clientId, {
        subscriptionExpiry: expiry.toISOString().split('T')[0],
        status: 'active',
      });
      setActivating(false);
      setActivated(true);
    }, 1500);
  };

  if (activated) {
    const pkg = PACKAGES.find((p) => p.id === selectedTier);
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
          <CheckCircle2 size={36} style={{ color: '#16A34A' }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          🎉 {pkg?.label} Activated!
        </h3>
        <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
          <strong>{businessName}</strong> is now live with <strong>{pkg?.label}</strong> for <strong>{selectedDays[selectedTier ?? '']} days</strong>.
        </p>
        <p className="text-xs mt-3 px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: 'rgba(22,163,74,0.1)', color: '#16A34A' }}>
          Your profile has been automatically classified as <strong>{pkg?.label.split(' ')[0]}</strong> and is now visible to buyers.
        </p>
        <button
          onClick={() => setActivated(false)}
          className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
        >
          Change Package
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Select Your Visibility Package</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Choose a placement tier and duration. All packages are <strong style={{ color: '#16A34A' }}>FREE TRIAL</strong> — activate instantly.
        </p>
        {currentTier && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}>
            Current tier: <strong>{currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</strong>
          </div>
        )}
      </div>

      {/* Package cards */}
      <div className="flex flex-col gap-4 mb-6">
        {PACKAGES.map((pkg) => {
          const isSelected = selectedTier === pkg.id;
          const isExpanded = expandedTier === pkg.id || isSelected;
          return (
            <div
              key={`pkg-${pkg.id}`}
              className="rounded-xl border-2 overflow-hidden transition-all cursor-pointer"
              style={{
                borderColor: isSelected ? pkg.border : 'var(--border)',
                backgroundColor: 'var(--card)',
                boxShadow: isSelected ? `0 0 0 2px ${pkg.border}33` : 'none',
              }}
              onClick={() => {
                setSelectedTier(pkg.id);
                setExpandedTier(pkg.id);
              }}
            >
              {/* Tier header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: isSelected ? pkg.bg : 'var(--muted)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                      color: isSelected ? pkg.color : 'var(--muted-foreground)',
                    }}
                  >
                    {pkg.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: isSelected ? pkg.color : 'var(--foreground)' }}>
                      {pkg.label}
                    </p>
                    <p className="text-xs" style={{ color: isSelected ? `${pkg.color}cc` : 'var(--muted-foreground)' }}>
                      {pkg.tagline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: pkg.color }}>
                      Selected
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpandedTier(isExpanded ? null : pkg.id); }}
                    style={{ color: isSelected ? pkg.color : 'var(--muted-foreground)' }}
                    aria-label="Toggle details"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Features + options */}
              {isExpanded && (
                <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {pkg.features.map((f) => (
                      <li key={`feat-${pkg.id}-${f}`} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                        <span style={{ color: '#16A34A' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {pkg.options.map((opt) => {
                      const isOptSelected = selectedDays[pkg.id] === opt.days && isSelected;
                      return (
                        <button
                          key={`opt-${pkg.id}-${opt.days}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTier(pkg.id);
                            setSelectedDays((prev) => ({ ...prev, [pkg.id]: opt.days }));
                          }}
                          className="flex-1 rounded-xl border-2 p-3 text-left transition-all"
                          style={{
                            borderColor: isOptSelected ? pkg.border : 'var(--border)',
                            backgroundColor: isOptSelected ? `${pkg.border}15` : 'var(--background)',
                          }}
                        >
                          <p className="font-bold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>
                            {opt.days} Days
                          </p>
                          <p className="text-xs line-through" style={{ color: 'var(--muted-foreground)' }}>
                            KSh {opt.original.toLocaleString()}
                          </p>
                          <p className="text-sm font-bold" style={{ color: '#16A34A' }}>
                            KSh 0 <span className="text-xs font-normal">(FREE TRIAL)</span>
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total + activation */}
      <div className="rounded-xl border-2 p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Total Due</p>
            {selectedTier ? (
              <p className="text-2xl font-bold" style={{ color: '#16A34A' }}>
                KSh {totalDue.toLocaleString()}
                {isFree && <span className="text-sm font-normal ml-2" style={{ color: '#16A34A' }}>(FREE TRIAL)</span>}
              </p>
            ) : (
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Select a package above</p>
            )}
            {selectedTier && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {selectedPackage?.label.split(' ')[0]} — {selectedDays[selectedTier]} Days
              </p>
            )}
          </div>
          {selectedTier && isFree && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(22,163,74,0.12)', color: '#16A34A' }}>
              🎁 Free Trial
            </span>
          )}
        </div>

        {/* M-Pesa input — only shown when price > 0 */}
        {selectedTier && !isFree && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
              Enter Safaricom M-Pesa Number
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="Type your M-Pesa number here to receive the prompt"
                className="input-base w-full pl-9 pr-4 py-3 text-sm"
              />
            </div>
            {phoneError && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{phoneError}</p>}
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
              An STK push will be sent to this number. Enter your M-Pesa PIN to complete.
            </p>
          </div>
        )}

        <button
          onClick={handleActivate}
          disabled={!selectedTier || activating}
          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: selectedTier ? '#16A34A' : 'var(--muted)',
            color: selectedTier ? '#FFFFFF' : 'var(--muted-foreground)',
          }}
        >
          {activating ? (
            <><Loader2 size={16} className="animate-spin" /> Activating…</>
          ) : (
            <><CheckCircle2 size={16} /> ACTIVATE FREE TRIAL NOW</>
          )}
        </button>
        {selectedTier && (
          <p className="text-xs text-center mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Clicking this instantly publishes your profile live for the selected period.
          </p>
        )}
      </div>
    </div>
  );
}
