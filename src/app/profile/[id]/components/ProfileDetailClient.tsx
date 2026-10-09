'use client';
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Eye, ChevronLeft, ChevronRight, X, Play, Lock, ShieldCheck, Star, Package, Weight, Ruler, Layers, Palette, Sofa, Home, Tag, CheckCircle, Shield, Globe, Truck, Wrench, CreditCard, MessageCircle, AlertTriangle } from 'lucide-react';
import { ClientProfile } from '@/lib/mockData';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

interface Props {
  profile: ClientProfile;
}

const DETAIL_FIELDS: { key: keyof ClientProfile; label: string; icon: React.ReactNode }[] = [
  { key: 'itemType', label: 'Item Type', icon: <Package size={18} style={{ color: '#DC2626' }} /> },
  { key: 'weight', label: 'Weight', icon: <Weight size={18} style={{ color: '#DC2626' }} /> },
  { key: 'dimensions', label: 'Dimensions', icon: <Ruler size={18} style={{ color: '#DC2626' }} /> },
  { key: 'material', label: 'Material', icon: <Layers size={18} style={{ color: '#DC2626' }} /> },
  { key: 'colour', label: 'Colour', icon: <Palette size={18} style={{ color: '#DC2626' }} /> },
  { key: 'style', label: 'Style', icon: <Sofa size={18} style={{ color: '#DC2626' }} /> },
  { key: 'roomPlacement', label: 'Room Placement', icon: <Home size={18} style={{ color: '#DC2626' }} /> },
  { key: 'furnitureType', label: 'Type', icon: <Tag size={18} style={{ color: '#DC2626' }} /> },
  { key: 'condition', label: 'Condition', icon: <CheckCircle size={18} style={{ color: '#DC2626' }} /> },
  { key: 'warranty', label: 'Warranty', icon: <Shield size={18} style={{ color: '#DC2626' }} /> },
  { key: 'origin', label: 'Origin', icon: <Globe size={18} style={{ color: '#DC2626' }} /> },
  { key: 'delivery', label: 'Delivery', icon: <Truck size={18} style={{ color: '#DC2626' }} /> },
  { key: 'assembly', label: 'Assembly', icon: <Wrench size={18} style={{ color: '#DC2626' }} /> },
  { key: 'paymentMethods', label: 'Payment Methods', icon: <CreditCard size={18} style={{ color: '#DC2626' }} /> },
];

export default function ProfileDetailClient({ profile }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showPhone, setShowPhone] = useState(false);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : 0));
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? Math.min(profile.media.length - 1, prev + 1) : 0));

  const isDormant = profile.status === 'dormant';

  const hasProductDetails = DETAIL_FIELDS.some((f) => profile[f.key]);

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors" style={{ color: 'var(--muted-foreground)' }}>
        <ChevronLeft size={16} />
        Back to Listings
      </Link>

      {isDormant && (
        <div className="rounded-xl border p-5 mb-6 flex items-center gap-4" style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderColor: 'rgba(220,38,38,0.3)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <Lock size={18} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#991B1B' }}>This account is dormant</p>
            <p className="text-xs mt-0.5" style={{ color: '#B91C1C' }}>This seller has not renewed their subscription. Contact information is unavailable.</p>
          </div>
        </div>
      )}

      {/* ── 1. TITLE & DESCRIPTION ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <AppImage
            src={profile.avatar}
            alt={profile.avatarAlt}
            width={56}
            height={56}
            className={`w-14 h-14 rounded-full object-cover border-2 flex-shrink-0 ${isDormant ? 'grayscale' : ''}`}
            style={{ borderColor: isDormant ? '#DC2626' : 'var(--primary)' } as React.CSSProperties}
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{profile.businessName}</h1>
              {profile.verified && !isDormant && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
              {profile.featured && !isDormant && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.15)', color: 'var(--primary)' }}>
                  <Star size={10} className="fill-current" /> Featured
                </span>
              )}
              {isDormant && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626' }}>
                  <Lock size={11} /> Dormant
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{profile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(194,105,42,0.07)' }}>
          <MapPin size={15} style={{ color: 'var(--primary)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{profile.location}</span>
          {profile.road && <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· {profile.road}</span>}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {profile.categories.map((cat) => (
            <span key={`detail-cat-${cat}`} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
              {cat}
            </span>
          ))}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {profile.description}
        </p>
      </div>

      {/* ── 2. GALLERY IMAGES ── */}
      {profile.media.length > 0 && (
        <div className="mb-8">
          <div className={`rounded-2xl overflow-hidden mb-3 ${isDormant ? '' : 'cursor-pointer'}`} onClick={() => !isDormant && openLightbox(0)}>
            <AppImage
              src={profile.media[0].url}
              alt={profile.media[0].alt}
              width={900}
              height={600}
              className={`w-full h-72 sm:h-96 object-cover ${isDormant ? 'grayscale opacity-60' : ''}`}
              priority
            />
          </div>
          {profile.media.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {profile.media.slice(1).map((item, i) => (
                <div
                  key={`detail-media-${item.id}`}
                  className={`rounded-xl overflow-hidden relative group ${isDormant ? '' : 'cursor-pointer'}`}
                  onClick={() => !isDormant && openLightbox(i + 1)}
                >
                  <AppImage
                    src={item.url}
                    alt={item.alt}
                    width={300}
                    height={200}
                    className={`w-full h-24 sm:h-28 object-cover transition-transform duration-200 group-hover:scale-105 ${isDormant ? 'grayscale opacity-60' : ''}`}
                  />
                  {item.type === 'video' && !isDormant && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(28,20,16,0.4)' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.9)' }}>
                        <Play size={16} className="ml-0.5" style={{ color: '#FAF8F5' }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 3. PRODUCT DETAILS ── */}
      {hasProductDetails && (
        <div className="mb-8 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {DETAIL_FIELDS.map((field) => {
            const value = profile[field.key] as string | undefined;
            if (!value) return null;
            return (
              <div
                key={`detail-field-${field.key}`}
                className="flex items-start gap-4 px-4 py-3 border-b last:border-b-0"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                <div className="flex-shrink-0 w-6 flex items-center justify-center mt-0.5">
                  {field.icon}
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                  <span className="text-sm font-bold" style={{ color: '#DC2626' }}>{field.label}:</span>
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>{value}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. CONTACT SECTION ── */}
      <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold" style={{ color: '#DC2626' }}>CONTACT</h2>
        </div>

        {isDormant ? (
          <div className="p-5 text-center">
            <Lock size={20} className="mx-auto mb-2" style={{ color: '#DC2626' }} />
            <p className="text-sm font-semibold mb-1" style={{ color: '#991B1B' }}>Account is Dormant</p>
            <p className="text-xs" style={{ color: '#B91C1C' }}>Contact details are unavailable until the seller renews their subscription.</p>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4">
            {/* Phone */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Phone size={18} style={{ color: 'var(--foreground)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Cell phone: <span className="font-semibold">{showPhone ? profile.phone : '••••••••••'}</span>
                </span>
              </div>
              <button
                onClick={() => setShowPhone(true)}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-colors flex-shrink-0"
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
              >
                SHOW PHONE
              </button>
            </div>

            {/* Verified + WhatsApp */}
            <div className="flex items-center gap-3">
              {profile.verified && (
                <span className="flex items-center gap-1 text-sm font-bold" style={{ color: '#16A34A' }}>
                  <CheckCircle size={16} style={{ color: '#16A34A' }} /> Verified
                </span>
              )}
              <a
                href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#25D366' }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} style={{ color: '#FFFFFF' }} />
              </a>
            </div>

            {/* Country & City */}
            <div className="flex items-center gap-2">
              <MapPin size={16} style={{ color: 'var(--foreground)' }} />
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>Country: <strong>Kenya</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Home size={16} style={{ color: 'var(--foreground)' }} />
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>City: <strong>{profile.location}</strong></span>
            </div>

            {/* Contact Seller CTA */}
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold w-full mt-1"
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
            >
              <Mail size={18} />
              CONTACT THIS SELLER
            </a>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-bold border transition-colors"
                style={{ backgroundColor: '#1C1410', color: '#FFFFFF', borderColor: '#1C1410' }}
              >
                <span className="text-base">+</span>
                <span>ADD TO FAVORITES</span>
              </button>
              <button
                className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-bold border transition-colors"
                style={{ backgroundColor: '#1C1410', color: '#FFFFFF', borderColor: '#1C1410' }}
              >
                <Star size={14} className="fill-current" style={{ color: '#DC2626' }} />
                <span>ADD REVIEW</span>
              </button>
              <button
                className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-bold border transition-colors"
                style={{ backgroundColor: '#1C1410', color: '#FFFFFF', borderColor: '#1C1410' }}
              >
                <X size={14} style={{ color: '#DC2626' }} />
                <span>REPORT LISTING</span>
              </button>
            </div>

            {/* Safety notice */}
            <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: '#FFF7F7', borderColor: '#FECACA' }}>
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
              <p className="text-xs leading-relaxed" style={{ color: '#DC2626' }}>
                All furniture purchases are made in person or via verified payment methods. <strong>Always inspect</strong> the item before payment. We do not recommend paying before delivery or viewing the product.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Views */}
      <div className="flex items-center justify-between text-xs px-1" style={{ color: 'var(--muted-foreground)' }}>
        <span className="flex items-center gap-1"><Eye size={12} />{profile.views.toLocaleString()} views</span>
        <span>Joined {profile.joinedDate}</span>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && !isDormant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(28,20,16,0.92)' }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(250,248,245,0.12)', color: '#FAF8F5' }}
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 p-3 rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(250,248,245,0.12)', color: '#FAF8F5' }}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <AppImage
              src={profile.media[lightboxIndex].url}
              alt={profile.media[lightboxIndex].alt}
              width={1000}
              height={700}
              className="rounded-xl max-h-[80vh] w-auto object-contain"
            />
            <p className="text-center text-sm mt-3" style={{ color: 'rgba(250,248,245,0.6)' }}>
              {lightboxIndex + 1} / {profile.media.length} — {profile.media[lightboxIndex].alt}
            </p>
          </div>

          {lightboxIndex < profile.media.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 p-3 rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(250,248,245,0.12)', color: '#FAF8F5' }}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </main>
  );
}