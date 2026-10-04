'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';


export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      {/* Login / Create Account — visible between logo and hamburger */}
      <Link
        href="/client-dashboard"
        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
        style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}
      >
        Login
      </Link>
      <Link
        href="/client-dashboard"
        className="text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
        style={{ backgroundColor: '#F5A623', color: '#1C1410' }}
      >
        Register
      </Link>

      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg transition-colors text-white"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 top-16 z-40 flex flex-col p-6 gap-4 overflow-y-auto"
          style={{ backgroundColor: '#000000' }}
        >
          <Link href="/" className="text-base font-medium py-2 border-b border-gray-800 text-white" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/#all-listings" className="text-base font-medium py-2 border-b border-gray-800 text-gray-300" onClick={() => setOpen(false)}>
            All Furniture
          </Link>
          <Link href="/blogs" className="text-base font-medium py-2 border-b border-gray-800 text-gray-300" onClick={() => setOpen(false)}>
            Blogs
          </Link>
          <Link href="/faq" className="text-base font-medium py-2 border-b border-gray-800 text-gray-300" onClick={() => setOpen(false)}>
            FAQ
          </Link>
          <Link href="/terms" className="text-base font-medium py-2 border-b border-gray-800 text-gray-300" onClick={() => setOpen(false)}>
            Terms &amp; Privacy
          </Link>
          <Link href="/contact" className="text-base font-medium py-2 border-b border-gray-800 text-gray-300" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <Link href="/about" className="text-base font-medium py-2 border-b border-gray-800 text-gray-300" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/client-dashboard" className="btn-primary px-4 py-3 text-sm text-center mt-2" onClick={() => setOpen(false)}>
            List Your Business
          </Link>
          <Link href="/client-dashboard" className="btn-secondary px-4 py-3 text-sm text-center" onClick={() => setOpen(false)}>
            Seller Login
          </Link>
        </div>
      )}
    </div>
  );
}