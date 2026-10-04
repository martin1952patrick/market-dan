'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Eye, Search, X, Lock, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { getProfileUrl } from '@/lib/mockData';
import type { ListingTier } from '@/lib/mockData';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';

const MAIN_CATEGORIES = ['All', 'Sofas', 'Bedroom', 'Dining Sets', 'Office', "Children\'s"];
const SUB_CATEGORY_OPTIONS = ['Full Set', 'Partial Set', 'Standalone'];
const CATEGORIES_WITH_SUBS = ['Sofas', 'Bedroom', 'Dining Sets', 'Office', "Children\'s"];

const TIER_CONFIG: Record<NonNullable<ListingTier>, { label: string; bg: string; text: string }> = {
  elite: { label: 'Elite', bg: '#D4AF37', text: '#1C1410' },
  spotlight: { label: 'Spotlight', bg: '#E91E8C', text: '#FFFFFF' },
  premium: { label: 'Premium', bg: '#7C3AED', text: '#FFFFFF' },
  standard: { label: 'Standard', bg: '#1C1410', text: '#FFFFFF' },
};

export default function FurniturePage() {
  const { clients, locations, searchLocation, setSearchLocation, clientsPerPage, siteSettings } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchLocation) {
      setSelectedLocation(searchLocation);
      setCurrentPage(1);
    }
  }, [searchLocation]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLocation, selectedCategory, selectedSubCategory, searchText, clientsPerPage]);

  useEffect(() => {
    setSelectedSubCategory('All');
  }, [selectedCategory]);

  const showSubCategories = CATEGORIES_WITH_SUBS.includes(selectedCategory);

  const visibleProfiles = clients?.filter((p) => {
    if (p?.hidden) return false;
    return p?.status === 'active' || p?.status === 'dormant';
  });

  const filtered = useMemo(() => {
    const results = visibleProfiles?.filter((p) => {
      const locMatch = selectedLocation === 'All' || p?.location === selectedLocation;
      const catMatch = selectedCategory === 'All' || p?.categories?.includes(selectedCategory);
      const subCatMatch =
        selectedSubCategory === 'All' ||
        !showSubCategories ||
        p?.subCategories?.includes(selectedSubCategory);
      const textMatch = searchText === '' ||
        p?.businessName?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        p?.location?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        p?.description?.toLowerCase()?.includes(searchText?.toLowerCase());
      return locMatch && catMatch && subCatMatch && textMatch;
    }) ?? [];

    const pinned = results?.filter((p) => p?.featured && p?.status === 'active')?.sort((a, b) => (a?.featuredOrder ?? 99) - (b?.featuredOrder ?? 99));
    const rest = results?.filter((p) => !(p?.featured && p?.status === 'active'));
    return [...pinned, ...rest];
  }, [selectedLocation, selectedCategory, selectedSubCategory, searchText, visibleProfiles, showSubCategories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / clientsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * clientsPerPage, safePage * clientsPerPage);

  const clearAll = () => {
    setSelectedLocation('All');
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSearchText('');
    setSearchLocation('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />

      {/* Page Header */}
      <div className="py-10 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #1C1410 0%, #3D2B1F 100%)' }}>
        <div className="max-w-screen-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: 'rgba(245,166,35,0.2)', color: '#F5A623' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            All Furniture Sellers
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#FAF8F5' }}>
            Browse Furniture by Category
          </h1>
          <p className="text-base" style={{ color: 'rgba(250,248,245,0.7)' }}>
            Find sofas, bedroom sets, dining tables, office furniture, children's pieces and more from local sellers.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={`cat-tab-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all border-2"
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--card)',
                borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border)',
                color: selectedCategory === cat ? 'var(--primary-foreground)' : 'var(--foreground)',
                boxShadow: selectedCategory === cat ? '0 2px 8px rgba(194,105,42,0.3)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-category filter */}
        {showSubCategories && (
          <div className="rounded-xl border px-4 py-3 mb-4 flex items-center gap-2 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold mr-1" style={{ color: 'var(--muted-foreground)' }}>Set type:</span>
            {['All', ...SUB_CATEGORY_OPTIONS].map((sub) => (
              <button
                key={`sub-cat-${sub}`}
                onClick={() => setSelectedSubCategory(sub)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                style={{
                  backgroundColor: selectedSubCategory === sub ? 'rgba(194,105,42,0.15)' : 'var(--background)',
                  borderColor: selectedSubCategory === sub ? 'var(--primary)' : 'var(--border)',
                  color: selectedSubCategory === sub ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                {sub === 'All' ? 'All Types' : sub}
              </button>
            ))}
          </div>
        )}

        {/* Search & Location Filter */}
        <div className="rounded-xl border p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e?.target?.value)}
              placeholder="Search by name or description…"
              className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
            />
          </div>
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
            <select
              value={selectedLocation}
              onChange={(e) => { setSelectedLocation(e?.target?.value); setSearchLocation(e?.target?.value === 'All' ? '' : e?.target?.value); }}
              className="input-base pl-8 pr-8 py-2.5 text-sm appearance-none cursor-pointer"
            >
              <option value="All">All Locations</option>
              {locations?.map((loc) => (
                <option key={`filter-loc-${loc?.id}`} value={loc?.name}>{loc?.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              {filtered?.length} seller{filtered?.length !== 1 ? 's' : ''} found
            </span>
            {(selectedLocation !== 'All' || selectedCategory !== 'All' || selectedSubCategory !== 'All' || searchText) && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {filtered?.length} seller{filtered?.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            {selectedLocation !== 'All' ? ` · ${selectedLocation}` : ''}
            {totalPages > 1 && ` · Page ${safePage} of ${totalPages}`}
          </p>
        </div>

        {/* Grid */}
        {filtered?.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--muted)' }}>
              <Search size={24} style={{ color: 'var(--muted-foreground)' }} />
            </div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>No sellers found</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Try a different category or location, or clear your filters.</p>
            <button onClick={clearAll} className="btn-primary px-5 py-2.5 text-sm">Show All Listings</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-5">
              {paginated?.map((profile) => {
                const isDormant = profile?.status === 'dormant';
                const profileUrl = getProfileUrl(profile);
                const tierKey = profile?.tier as NonNullable<ListingTier> | undefined;
                const tierCfg = tierKey ? TIER_CONFIG[tierKey] : null;
                return (
                  <div
                    key={`furniture-card-${profile?.id}`}
                    className={`rounded-2xl border overflow-hidden transition-all duration-200 group flex flex-col ${isDormant ? 'opacity-70' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {isDormant ? (
                        <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                          <Lock size={28} style={{ color: 'var(--muted-foreground)' }} className="mb-2" />
                          <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Listing Inactive</p>
                        </div>
                      ) : (
                        <AppImage
                          src={profile?.media?.[0]?.url || profile?.avatar}
                          alt={profile?.media?.[0]?.alt || profile?.avatarAlt}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      {tierCfg && !isDormant && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: tierCfg.bg, color: tierCfg.text }}>
                          {tierCfg.label}
                        </div>
                      )}
                      {profile?.verified && !isDormant && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1D4ED8' }}>
                          <ShieldCheck size={13} style={{ color: '#fff' }} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm sm:text-base leading-tight mb-1 line-clamp-1" style={{ color: 'var(--foreground)' }}>
                        {profile?.businessName}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin size={12} style={{ color: 'var(--primary)' }} className="flex-shrink-0" />
                        <span className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{profile?.location}</span>
                      </div>
                      {profile?.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {profile?.categories?.slice(0, 2)?.map((cat) => (
                            <span key={`cat-badge-${profile?.id}-${cat}`} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                          <Eye size={12} />
                          <span className="text-xs">{profile?.views?.toLocaleString()}</span>
                        </div>
                        {isDormant ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(107,114,128,0.1)', color: '#6B7280' }}>
                            Inactive
                          </span>
                        ) : (
                          <Link
                            href={profileUrl}
                            className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-40"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: safePage === page ? 'var(--primary)' : 'var(--card)',
                        color: safePage === page ? 'var(--primary-foreground)' : 'var(--foreground)',
                        border: `1px solid ${safePage === page ? 'var(--primary)' : 'var(--border)'}`,
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-40"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
