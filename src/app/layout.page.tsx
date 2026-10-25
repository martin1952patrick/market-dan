import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import '../styles/tailwind.css';
import { AppProvider } from '@/lib/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AgeConsentBanner from '@/components/AgeConsentBanner';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Nairobi Spot — Find Furniture Sellers Near You in Nairobi, Kenya',
    template: '%s | Nairobi Spot',
  },
  description:
    'Nairobi Spot connects furniture buyers with local sellers across Nairobi, Kiambu and Kajiado. Search by area or small location, view photos and videos, and contact sellers directly.',
  applicationName: 'Nairobi Spot',
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/assets/images/better-1792968923560.png', type: 'image/png' }],
    shortcut: '/assets/images/better-1792968923560.png',
    apple: '/assets/images/better-1792968923560.png',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Nairobi Spot',
    title: 'Nairobi Spot — Discover Local Furniture Sellers',
    description: 'Find local furniture sellers in Nairobi. Browse profiles, photos, and videos to discover your perfect piece.',
    images: [
      {
        url: '/assets/images/better-1792968923560.png',
        width: 1200,
        height: 630,
        alt: 'Nairobi Spot - Local Furniture Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nairobi Spot — Discover Local Furniture Sellers',
    description: 'Find local furniture sellers in Nairobi. Browse profiles, photos, and videos to discover your perfect piece.',
    images: ['/assets/images/better-1792968923560.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmMono.variable}`}>
      <head>
        <meta name="rating" content="adult" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Nairobi Spot',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              description: 'Local furniture marketplace connecting buyers with sellers in Nairobi',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/assets/images/better-1792968923560.png`,
            }),
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ffurniture2333back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body>
        <AuthProvider>
          <AppProvider>
            {children}
            <AgeConsentBanner />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
