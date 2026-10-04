import React from 'react';
import type { Metadata } from 'next';
import ProfileDetailWrapper from './components/ProfileDetailWrapper';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const profileUrl = `${baseUrl}/profile/${id}`;

  return {
    title: `Furniture Seller Profile | FurniMarket`,
    description: 'Discover this furniture seller on FurniMarket. Browse their listings, photos, and videos to find quality furniture pieces.',
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      type: 'profile',
      title: 'Furniture Seller Profile | FurniMarket',
      description: 'Discover this furniture seller on FurniMarket. Browse their listings, photos, and videos.',
      url: profileUrl,
      images: [
        {
          url: '/assets/images/app_logo.png',
          width: 1200,
          height: 630,
          alt: 'FurniMarket - Furniture Seller Profile',
        },
      ],
    },
  };
}

export default async function ProfileDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProfileDetailWrapper id={id} />;
}
