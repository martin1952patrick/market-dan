'use client';
import React from 'react';
import PublicTopbar from '@/components/PublicTopbar';
import HeroSection from '@/app/components/HeroSection';
import FeaturedProfiles from '@/app/components/FeaturedProfiles';
import AllListings from '@/app/components/AllListings';
import BlogPreview from '@/app/components/BlogPreview';
import PublicFooter from '@/components/PublicFooter';

export default function PublicHomepage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />
      <main>
        <HeroSection />
        <FeaturedProfiles />
        <AllListings />
        <BlogPreview />
      </main>
      <PublicFooter />
    </div>
  );
}
