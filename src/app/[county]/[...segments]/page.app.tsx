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
  // numericId is segments[segments.length - 2] when business slug is last
  // OR segments[segments.length - 1] if it's numeric (old format fallback)
  let numericId: number | null = null;

  // Try new format: last segment is business slug, second-to-last is numericId
  if (segments.length >= 2) {
    const maybeId = Number(segments[segments.length - 2]);
    if (!isNaN(maybeId) && maybeId > 0) {
      numericId = maybeId;
    }
  }
  // Fallback: last segment is numericId (old format)
  if (numericId === null) {
    const maybeId = Number(segments[segments.length - 1]);
    if (!isNaN(maybeId) && maybeId > 0) {
      numericId = maybeId;
    }
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

  // Resolve numericId — support both new format (id before business slug) and old format (id last)
  let numericId: number | null = null;

  if (segments.length >= 2) {
    const maybeId = Number(segments[segments.length - 2]);
    if (!isNaN(maybeId) && maybeId > 0) {
      numericId = maybeId;
    }
  }
  if (numericId === null) {
    const maybeId = Number(segments[segments.length - 1]);
    if (!isNaN(maybeId) && maybeId > 0) {
      numericId = maybeId;
    }
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

    // Redirect to canonical URL
    redirect(`/${canonicalCounty}/${canonicalSubcounty}/${canonicalLocation}/${profile.numericId}/${canonicalBusiness}`);
  }

  // Fallback: redirect to profile page by id
  if (numericId) {
    redirect(`/profile/${numericId}`);
  }

  // Nothing found
  redirect('/');
}
