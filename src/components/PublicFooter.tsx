import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t mt-16" style={{ backgroundColor: '#1C1410', borderColor: '#2D1E14', color: '#C9B8A8' }}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={32} />
              <span className="font-bold text-xl" style={{ color: '#FAF8F5' }}>Nairobi Spot</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#9A8878' }}>
              Nairobi&apos;s local furniture marketplace. Connecting buyers with trusted sellers in your neighbourhood since 2024.
            </p>
            <div className="flex flex-col gap-2 text-sm" style={{ color: '#9A8878' }}>
              <span className="flex items-center gap-2"><MapPin size={14} />Nairobi, Kenya</span>
              <span className="flex items-center gap-2"><Phone size={14} />+254 700 000 000</span>
              <span className="flex items-center gap-2"><Mail size={14} />hello@nairobispot.com</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: '#FAF8F5', letterSpacing: '0.08em' }}>Browse</h4>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: '#9A8878' }}>
              {['All Listings', 'Featured Sellers', 'By Location', 'New Arrivals', 'Blog']?.map((item) => (
                <li key={`footer-browse-${item}`}><Link href="/" className="hover:text-amber-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: '#FAF8F5', letterSpacing: '0.08em' }}>Sellers</h4>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: '#9A8878' }}>
              {['Create Listing', 'Seller Login', 'Manage Profile', 'Upgrade Plan', 'Help Centre']?.map((item) => (
                <li key={`footer-sellers-${item}`}><Link href="/client-dashboard" className="hover:text-amber-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: '#FAF8F5', letterSpacing: '0.08em' }}>Popular Areas</h4>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: '#9A8878' }}>
              {['Westlands', 'Kinoo', 'Karen', 'Thika', 'Eastleigh', 'Kasarani']?.map((area) => (
                <li key={`footer-area-${area}`}><Link href="/" className="hover:text-amber-400 transition-colors">{area}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ borderColor: '#2D1E14', color: '#6B5648' }}>
          <span>© 2026 Nairobi Spot Kenya. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
            <Link href="/admin-dashboard" className="hover:text-amber-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}