import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CLIENT_PROFILES } from '@/lib/mockData';
import ProfileDetailWrapper from '@/app/profile/[id]/components/ProfileDetailWrapper';

interface Props {
  params: Promise<{ county: string; segments: string[] }>;
}

const slugify = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { county, segments } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // New format: /county/subcounty/location/numericId/business-name
  let numericId: number | null = null;
  if (segments.length >= 2) {
    const maybeId = Number(segments[segments.length - 2]);
    if (!isNaN(maybeId) && maybeId > 0) numericId = maybeId;
  }
  if (numericId === null) {
    const maybeId = Number(segments[segments.length - 1]);
    if (!isNaN(maybeId) && maybeId > 0) numericId = maybeId;
  }

  const profile = numericId ? CLIENT_PROFILES.find((p) => p.numericId === numericId) : null;

  if (!profile) {
    return { title: 'Business Not Found | FurniMarket' };
  }

  const businessName = profile.businessName;
  const locationName = profile.location;
  const countyName = profile.county;
  const description = profile.description
    ? profile.description.slice(0, 160)
    : `Discover ${businessName} — a furniture seller in ${locationName}, ${countyName}. Browse photos, contact details, and more on FurniMarket.`;

  const canonicalUrl = `${baseUrl}/${slugify(profile.county)}/${slugify(profile.subcounty)}/${slugify(profile.location)}/${profile.numericId}/${slugify(profile.businessName)}`;

  return {
    title: `${businessName} — Furniture Seller in ${locationName} | FurniMarket`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'profile',
      title: `${businessName} | FurniMarket`,
      description,
      url: canonicalUrl,
      siteName: 'FurniMarket',
      images: profile.media?.[0]
        ? [{ url: profile.media[0].url, width: 1200, height: 630, alt: profile.media[0].alt }]
        : [{ url: '/assets/images/app_logo.png', width: 1200, height: 630, alt: 'FurniMarket' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${businessName} | FurniMarket`,
      description,
      images: profile.media?.[0]?.url ? [profile.media[0].url] : ['/assets/images/app_logo.png'],
    },
  };
}

export default async function CatchAllCountyRoute({ params }: Props) {
  const { county, segments } = await params;

  let numericId: number | null = null;
  if (segments.length >= 2) {
    const maybeId = Number(segments[segments.length - 2]);
    if (!isNaN(maybeId) && maybeId > 0) numericId = maybeId;
  }
  if (numericId === null) {
    const maybeId = Number(segments[segments.length - 1]);
    if (!isNaN(maybeId) && maybeId > 0) numericId = maybeId;
  }

  const profile = numericId ? CLIENT_PROFILES.find((p) => p.numericId === numericId) : null;

  if (profile) {
    const canonicalCounty = slugify(profile.county);
    const canonicalSubcounty = slugify(profile.subcounty);
    const canonicalLocation = slugify(profile.location);
    const canonicalBusiness = slugify(profile.businessName);

    // New canonical URL format: /county/subcounty/location/numericId/business-name
    const isCanonical =
      county === canonicalCounty &&
      segments.length === 4 &&
      segments[0] === canonicalSubcounty &&
      segments[1] === canonicalLocation &&
      segments[2] === String(profile.numericId) &&
      segments[3] === canonicalBusiness;

    if (isCanonical) {
      return <ProfileDetailWrapper numericId={profile.numericId} />;
    }

    redirect(`/${canonicalCounty}/${canonicalSubcounty}/${canonicalLocation}/${profile.numericId}/${canonicalBusiness}`);
  }

  if (numericId) redirect(`/profile/${numericId}`);
  redirect('/');
}
