import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import MobileMenu from '@/components/MobileMenu';

export default function PublicTopbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppLogo size={36} />
          <span className="font-bold text-xl tracking-tight text-white">
            FurniMarket
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:text-amber-400"
          >
            Home
          </Link>
          <Link
            href="/#all-listings"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-amber-400"
          >
            All Furniture
          </Link>
          <Link
            href="/blogs"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-amber-400"
          >
            Blogs
          </Link>
          <Link
            href="/faq"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-amber-400"
          >
            FAQ
          </Link>
          <Link
            href="/terms"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-amber-400"
          >
            Terms &amp; Privacy
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-amber-400"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-amber-400"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/client-dashboard"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-amber-400 hover:text-amber-300"
            style={{ backgroundColor: 'rgba(251,191,36,0.1)' }}
          >
            Seller Login
          </Link>
          <Link
            href="/client-dashboard"
            className="btn-primary px-4 py-2 text-sm"
          >
            List Your Business
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}