'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, Eye } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { getProfileUrl, ClientProfile } from '@/lib/mockData';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FeaturedProfiles() {
  const { clients, shuffleIntervalMinutes } = useAppStore();

  const baseFeatured = clients
    .filter((p) => p.featured && p.status === 'active' && !p.hidden)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

  const [displayed, setDisplayed] = useState<ClientProfile[]>(baseFeatured);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Re-sync when base list changes (pin/unpin)
  useEffect(() => {
    setDisplayed(baseFeatured);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients]);

  // Set up shuffle interval
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ms = shuffleIntervalMinutes * 60 * 1000;
    intervalRef.current = setInterval(() => {
      setDisplayed((prev) => shuffleArray(prev));
    }, ms);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shuffleIntervalMinutes]);

  if (displayed.length === 0) return null;

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="fill-accent text-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Featured Sellers</span>
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Top Picks This Month</h2>
        </div>
        <a href="#all-listings" className="text-sm font-semibold hidden md:inline-flex items-center gap-1 transition-colors" style={{ color: 'var(--primary)' }}>
          View all listings →
        </a>
      </div>

      {/* Mobile: horizontal scroll showing 4 full + 6th ~1/4 visible */}
      <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-3" style={{ width: 'max-content' }}>
          {displayed.map((profile) => {
            const profileUrl = getProfileUrl(profile);
            return (
              <div
                key={`featured-mob-${profile.id}`}
                className="card-hover rounded-2xl overflow-hidden border flex-shrink-0"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  width: 'calc((100vw - 2rem) / 4.25)',
                  minWidth: 140,
                  maxWidth: 180,
                }}
              >
                <Link href={profileUrl} className="block relative">
                  <div className="w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <AppImage
                      src={profile.media[0]?.url ?? ''}
                      alt={profile.media[0]?.alt ?? `${profile.businessName} furniture display`}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-2 left-2 featured-ribbon text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ color: '#1C1410' }}>
                    <Star size={9} className="fill-current" />
                  </div>
                </Link>
                <div className="p-2">
                  <Link href={profileUrl}>
                    <h3 className="font-bold text-xs truncate hover:underline leading-tight" style={{ color: 'var(--foreground)' }}>{profile.businessName}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={10} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{profile.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-6">
        {displayed.map((profile) => {
          const profileUrl = getProfileUrl(profile);
          return (
            <div key={`featured-${profile.id}`} className="card-hover rounded-2xl overflow-hidden border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              {/* Clickable image */}
              <Link href={profileUrl} className="block relative">
                <div className="w-full h-36 sm:h-52 overflow-hidden">
                  <AppImage
                    src={profile.media[0]?.url ?? ''}
                    alt={profile.media[0]?.alt ?? `${profile.businessName} furniture display`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="absolute top-3 left-3 featured-ribbon text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ color: '#1C1410' }}>
                  <Star size={11} className="fill-current" />
                  <span>Featured</span>
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ backgroundColor: 'rgba(28,20,16,0.6)', color: '#FAF8F5' }}>
                  <Eye size={11} />
                  <span>{profile.views.toLocaleString()}</span>
                </div>
              </Link>

              <div className="p-3 sm:p-5">
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Link href={profileUrl} className="flex-shrink-0">
                    <AppImage
                      src={profile.avatar}
                      alt={profile.avatarAlt}
                      width={44}
                      height={44}
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2"
                      style={{ borderColor: 'var(--primary)' } as React.CSSProperties}
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link href={profileUrl}>
                      <h3 className="font-bold text-sm sm:text-base truncate hover:underline" style={{ color: 'var(--foreground)' }}>{profile.businessName}</h3>
                    </Link>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                  <MapPin size={13} style={{ color: 'var(--primary)' }} />
                  <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--foreground)' }}>{profile.location}</span>
                  {profile.road && (
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>· {profile.road}</span>
                  )}
                </div>

                <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 sm:mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  {profile.description}
                </p>

                <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
                  {profile.categories.slice(0, 2).map((cat) => (
                    <span key={`feat-cat-${profile.id}-${cat}`} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {profile.media.length} photo{profile.media.length !== 1 ? 's' : ''}
                  </span>
                  <Link href={profileUrl} className="btn-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                    See More
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}