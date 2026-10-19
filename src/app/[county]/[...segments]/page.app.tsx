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
    title: 'Furniture Seller Profile | FurniMarket',
    description:
      'Discover this furniture seller on FurniMarket. Browse their photos, contact details, and more.',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'profile',
      title: 'Furniture Seller Profile | FurniMarket',
      description: 'Discover this furniture seller on FurniMarket.',
      url: canonicalUrl,
      siteName: 'FurniMarket',
      images: [{ url: '/assets/images/app_logo.png', width: 1200, height: 630, alt: 'FurniMarket' }],
    },
  };
}

export default async function CatchAllCountyRoute({ params }: Props) {
  const { segments } = await params;
  return <CountyProfileResolver segments={segments} />;
}
