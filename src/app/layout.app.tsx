import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import '../styles/tailwind.css';
import { AppProvider } from '@/lib/AppContext';

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
  title: 'FurniMarket — Discover Local Furniture Sellers Near You',
  description:
    'FurniMarket connects Nairobi furniture buyers with local sellers. Browse profiles by location, view photos and videos, and find your perfect piece today.',
  icons: {
    icon: [{ url: '/assets/images/Screenshot_6-9-2026_114941_-1788684740614.jpeg', type: 'image/jpeg' }],
    shortcut: '/assets/images/Screenshot_6-9-2026_114941_-1788684740614.jpeg',
    apple: '/assets/images/Screenshot_6-9-2026_114941_-1788684740614.jpeg',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'FurniMarket',
    title: 'FurniMarket — Discover Local Furniture Sellers',
    description: 'Find local furniture sellers in Nairobi. Browse profiles, photos, and videos to discover your perfect piece.',
    images: [
      {
        url: '/assets/images/app_logo.png',
        width: 1200,
        height: 630,
        alt: 'FurniMarket - Local Furniture Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FurniMarket — Discover Local Furniture Sellers',
    description: 'Find local furniture sellers in Nairobi. Browse profiles, photos, and videos to discover your perfect piece.',
    images: ['/assets/images/app_logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'FurniMarket',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              description: 'Local furniture marketplace connecting buyers with sellers in Nairobi',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/assets/images/app_logo.png`,
            }),
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ffurniture2333back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.20" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
