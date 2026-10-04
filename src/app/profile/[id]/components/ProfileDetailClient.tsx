'use client';
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Eye, ChevronLeft, ChevronRight, X, Play, Lock } from 'lucide-react';
import { ClientProfile } from '@/lib/mockData';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

interface Props {
  profile: ClientProfile;
}

export default function ProfileDetailClient({ profile }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : 0));
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? Math.min(profile.media.length - 1, prev + 1) : 0));

  const isDormant = profile.status === 'dormant';

  return (
    <main className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Media */}
        <div className="lg:col-span-2">
          {profile.media.length > 0 && (
            <div className={`rounded-2xl overflow-hidden mb-4 ${isDormant ? '' : 'cursor-pointer'}`} onClick={() => !isDormant && openLightbox(0)}>
              <AppImage
                src={profile.media[0].url}
                alt={profile.media[0].alt}
                width={900}
                height={600}
                className={`w-full h-80 md:h-96 object-cover ${isDormant ? 'grayscale opacity-60' : ''}`}
                priority
              />
            </div>
          )}
          {profile.media.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
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
                    className={`w-full h-28 object-cover transition-transform duration-200 group-hover:scale-105 ${isDormant ? 'grayscale opacity-60' : ''}`}
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

        {/* Right: Info */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border p-6 sticky top-24" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {profile.featured && !isDormant && (
              <div className="featured-ribbon text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 mb-4" style={{ color: '#1C1410' }}>
                ★ Featured Seller
              </div>
            )}
            {isDormant && (
              <div className="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 mb-4" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626' }}>
                <Lock size={11} />
                Account Dormant
              </div>
            )}

            <div className="flex items-center gap-3 mb-5">
              <AppImage
                src={profile.avatar}
                alt={profile.avatarAlt}
                width={56}
                height={56}
                className={`w-14 h-14 rounded-full object-cover border-2 ${isDormant ? 'grayscale' : ''}`}
                style={{ borderColor: isDormant ? '#DC2626' : 'var(--primary)' } as React.CSSProperties}
              />
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>{profile.businessName}</h1>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{profile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: 'rgba(194,105,42,0.07)' }}>
              <MapPin size={16} style={{ color: 'var(--primary)' }} />
              <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{profile.location}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.categories.map((cat) => (
                <span key={`detail-cat-${cat}`} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                  {cat}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
              {profile.description}
            </p>

            {isDormant ? (
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <Lock size={20} className="mx-auto mb-2" style={{ color: '#DC2626' }} />
                <p className="text-sm font-semibold mb-1" style={{ color: '#991B1B' }}>Account is Dormant</p>
                <p className="text-xs" style={{ color: '#B91C1C' }}>Contact details are unavailable until the seller renews their subscription.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${profile.phone}`}
                  className="btn-primary flex items-center justify-center gap-2 py-3 text-sm"
                >
                  <Phone size={16} />
                  {profile.phone}
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="btn-secondary flex items-center justify-center gap-2 py-3 text-sm"
                >
                  <Mail size={16} />
                  Send Email
                </a>
              </div>
            )}

            <div className="mt-5 pt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <span className="flex items-center gap-1"><Eye size={12} />{profile.views.toLocaleString()} views</span>
              <span>Joined {profile.joinedDate}</span>
            </div>
          </div>
        </div>
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