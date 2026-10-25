import React from 'react';
import type { Metadata } from 'next';
import CountyProfileResolver from './components/CountyProfileResolver';

interface Props {
  params: Promise<{ county: string; segments: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county, segments } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}/${[county, ...segments].join('/')}`;

  return {
    title: { absolute: 'Furniture Seller Profile | Nairobi Spot' },
    description:
      'Discover this furniture seller on Nairobi Spot. Browse their photos, contact details, and more.',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'profile',
      title: 'Furniture Seller Profile | Nairobi Spot',
      description: 'Discover this furniture seller on Nairobi Spot.',
      url: canonicalUrl,
      siteName: 'Nairobi Spot',
      images: [{ url: '/assets/images/better-1792968923560.png', width: 1200, height: 630, alt: 'Nairobi Spot' }],
    },
  };
}

export default async function CatchAllCountyRoute({ params }: Props) {
  const { segments } = await params;
  return <CountyProfileResolver segments={segments} />;
}
