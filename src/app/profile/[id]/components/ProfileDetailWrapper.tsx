'use client';
import React from 'react';
import { notFound } from 'next/navigation';
import { useAppStore } from '@/lib/AppContext';
import ProfileDetailClient from './ProfileDetailClient';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';

interface Props {
  // Legacy: match by string id (e.g. "client-001")
  id?: string;
  // New: match by numeric id (e.g. 1, 58)
  numericId?: number;
}

export default function ProfileDetailWrapper({ id, numericId }: Props) {
  const { clients } = useAppStore();

  const profile = numericId !== undefined
    ? clients.find((p) => p.numericId === numericId)
    : clients.find((p) => p.id === id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />
      <ProfileDetailClient profile={profile} />
      <PublicFooter />
    </div>
  );
}
