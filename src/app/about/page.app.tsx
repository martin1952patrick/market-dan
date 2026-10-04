'use client';
import React from 'react';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';
import { Users, MapPin, Star, ShieldCheck } from 'lucide-react';

const STATS = [
  { label: 'Furniture Sellers', value: '500+', icon: <Users size={22} /> },
  { label: 'Locations Covered', value: '30+', icon: <MapPin size={22} /> },
  { label: 'Happy Buyers', value: '10,000+', icon: <Star size={22} /> },
  { label: 'Verified Listings', value: '450+', icon: <ShieldCheck size={22} /> },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>About FurniMarket</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted-foreground)' }}>Connecting furniture buyers with local sellers across Kenya.</p>

        <div className="rounded-xl border p-8 mb-10" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Our Mission</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
            FurniMarket was built to make it easy for Kenyans to discover quality furniture sellers in their local area. Whether you&apos;re looking for a custom sofa, a new bed frame, or a complete dining set, we connect you with trusted local craftsmen and furniture shops near you.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            We believe in supporting local businesses. By listing on FurniMarket, furniture sellers get a professional online presence and reach thousands of buyers searching for exactly what they offer — all without the complexity of building their own website.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS?.map((stat) => (
            <div key={`stat-${stat?.label}`} className="rounded-xl border p-5 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                {stat?.icon}
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{stat?.value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{stat?.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Why Choose FurniMarket?</h2>
          <ul className="flex flex-col gap-3">
            {[
              'Browse hundreds of local furniture sellers in one place',
              'Filter by location, furniture type, and price range',
              'View real photos and videos of furniture before buying',
              'Contact sellers directly — no middlemen',
              'Support local Kenyan craftsmen and businesses',
              'New listings added daily from across Kenya',
            ]?.map((item, i) => (
              <li key={`why-${i}`} className="flex items-start gap-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
