'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/AppContext';
import { dbService } from '@/lib/services/dbService';
import type { ClientProfile } from '@/lib/mockData';
import ProfileDetailClient from '@/app/profile/[id]/components/ProfileDetailClient';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';

interface Props {
  segments: string[];
}

function resolveNumericId(segments: string[]): number | null {
  // Preferred format: .../numericId/business-name  (id is second to last)
  if (segments.length >= 2) {
    const maybeId = Number(segments[segments.length - 2]);
    if (Number.isInteger(maybeId) && maybeId > 0) return maybeId;
  }
  // Legacy format: .../numericId (id is last)
  const last = Number(segments[segments.length - 1]);
  if (Number.isInteger(last) && last > 0) return last;
  // Last resort: any numeric segment
  for (let i = segments.length - 1; i >= 0; i--) {
    const n = Number(segments[i]);
    if (Number.isInteger(n) && n > 0) return n;
  }
  return null;
}

export default function CountyProfileResolver({ segments }: Props) {
  const { clients } = useAppStore();
  const numericId = resolveNumericId(segments);
  const [dbProfile, setDbProfile] = useState<ClientProfile | null>(null);
  const [checked, setChecked] = useState(false);

  const storeProfile = numericId !== null ? clients.find((c) => c.numericId === numericId) : undefined;

  useEffect(() => {
    let cancelled = false;
    if (numericId === null || storeProfile) {
      setChecked(true);
      return;
    }
    (async () => {
      const found = await dbService.fetchSellerByNumericId(numericId);
      if (cancelled) return;
      setDbProfile(found);
      setChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [numericId, storeProfile]);

  const profile = storeProfile ?? dbProfile;

  if (profile) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <PublicTopbar />
        <ProfileDetailClient profile={profile} />
        <PublicFooter />
      </div>
    );
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div
          className="h-10 w-10 rounded-full border-4 animate-spin"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }}
          aria-label="Loading profile"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Seller not found
        </h1>
        <p className="mb-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          This profile may have been removed or the link is incorrect.
        </p>
        <Link
          href="/furniture"
          className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          Browse all sellers
        </Link>
      </div>
      <PublicFooter />
    </div>
  );
}
