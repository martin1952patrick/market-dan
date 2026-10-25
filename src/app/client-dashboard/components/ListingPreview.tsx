'use client';
import React from 'react';
import { MapPin, Phone, Mail, Eye, Star, ExternalLink } from 'lucide-react';
import { ClientProfile } from '@/lib/mockData';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';

interface Props {
  profile: ClientProfile;
}

export default function ListingPreview({ profile }: Props) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Live Preview</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            This is exactly how buyers see your listing on the Nairobi Spot homepage.
          </p>
        </div>
        <Link
          href={`/profile/${profile.id}`}
          className="btn-secondary px-4 py-2 text-sm flex items-center gap-2 flex-shrink-0"
        >
          <ExternalLink size={15} />
          Open Live Page
        </Link>
      </div>

      {/* Card preview */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.06em' }}>
          Listing Card (as shown in search results)
        </p>
        <div className="max-w-xs rounded-xl overflow-hidden border shadow-card" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="relative overflow-hidden h-44">
            <AppImage
              src={profile.media[0]?.url ?? ''}
              alt={profile.media[0]?.alt ?? `${profile.businessName} furniture`}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
            {profile.featured && (
              <div className="absolute top-2 left-2 featured-ribbon text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#1C1410' }}>
                ★ Featured
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium" style={{ backgroundColor: 'rgba(28,20,16,0.65)', color: '#FAF8F5' }}>
              <MapPin size={10} />
              {profile.location}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <AppImage
                src={profile.avatar}
                alt={profile.avatarAlt}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{profile.businessName}</h3>
            </div>
            <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--muted-foreground)' }}>
              {profile.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {profile.categories.slice(0, 2).map((cat) => (
                <span key={`prev-cat-${cat}`} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.08)', color: 'var(--primary)' }}>
                  {cat}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <Eye size={12} /> {profile.views.toLocaleString()}
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                See More →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail page preview */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.06em' }}>
          Full Profile Page (detail view)
        </p>
        <div className="rounded-xl border overflow-hidden shadow-card" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          {profile.media.length > 0 && (
            <div className="h-52 overflow-hidden">
              <AppImage
                src={profile.media[0].url}
                alt={profile.media[0].alt}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            {profile.featured && (
              <div className="featured-ribbon text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 mb-4" style={{ color: '#1C1410' }}>
                <Star size={11} className="fill-current" /> Featured Seller
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <AppImage
                src={profile.avatar}
                alt={profile.avatarAlt}
                width={52}
                height={52}
                className="w-13 h-13 rounded-full object-cover border-2"
                style={{ borderColor: 'var(--primary)' } as React.CSSProperties}
              />
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{profile.businessName}</h2>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{profile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(194,105,42,0.07)' }}>
              <MapPin size={15} style={{ color: 'var(--primary)' }} />
              <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{profile.location}</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
              {profile.description}
            </p>
            <div className="flex flex-col gap-2">
              <div className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg" style={{ pointerEvents: 'none' }}>
                <Phone size={15} /> {profile.phone}
              </div>
              <div className="btn-secondary flex items-center justify-center gap-2 py-2.5 text-sm rounded-lg" style={{ pointerEvents: 'none' }}>
                <Mail size={15} /> Send Email
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl p-4 border" style={{ backgroundColor: 'rgba(194,105,42,0.05)', borderColor: 'rgba(194,105,42,0.2)' }}>
        <p className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
          ✓ Your listing is <strong>{profile.status === 'active' ? 'live' : 'pending review'}</strong> and visible to buyers
          {profile.featured ? ' — currently pinned to the Featured section' : ''}.
          Update your profile or media at any time and changes appear immediately.
        </p>
      </div>
    </div>
  );
}