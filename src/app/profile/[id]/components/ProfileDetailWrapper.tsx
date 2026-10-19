'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/AppContext';
import { dbService } from '@/lib/services/dbService';
import type { ClientProfile } from '@/lib/mockData';
import ProfileDetailClient from './ProfileDetailClient';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';

interface Props {
  // Match by string id (e.g. "client-001") or a numeric string (e.g. "58")
  id?: string;
  // Match by numeric id (e.g. 1, 58)
  numericId?: number;
}

export default function ProfileDetailWrapper({ id, numericId }: Props) {
  const { clients } = useAppStore();
  const [dbProfile, setDbProfile] = useState<ClientProfile | null>(null);
  const [checked, setChecked] = useState(false);

  const targetNumeric =
    numericId !== undefined
      ? numericId
      : id && /^\d+$/.test(id)
      ? Number(id)
      : undefined;

  const storeProfile =
    targetNumeric !== undefined
      ? clients.find((p) => p.numericId === targetNumeric)
      : clients.find((p) => p.id === id);

  useEffect(() => {
    let cancelled = false;
    if (storeProfile || targetNumeric === undefined) {
      setChecked(true);
      return;
    }
    (async () => {
      const found = await dbService.fetchSellerByNumericId(targetNumeric);
      if (cancelled) return;
      setDbProfile(found);
      setChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [storeProfile, targetNumeric]);

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
