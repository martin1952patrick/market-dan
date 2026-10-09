'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Eye, Search, X, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { getProfileUrl } from '@/lib/mockData';
import type { ListingTier } from '@/lib/mockData';

const MAIN_CATEGORIES = ['All', 'Sofas', 'Bedroom', 'Dining Sets', 'Office', "Children\'s"];
const OTHER_CATEGORIES = ['Outdoor', 'Custom Orders', 'Budget-Friendly', 'Luxury'];
const ALL_CATEGORIES = [...MAIN_CATEGORIES, ...OTHER_CATEGORIES];

const SUB_CATEGORY_OPTIONS = ['Full Set', 'Partial Set', 'Standalone'];
const TYPE_OPTIONS = ['All Types', 'Full Set', 'Partial Set', 'Standalone'];

// Categories that support sub-options
const CATEGORIES_WITH_SUBS = ['Sofas', 'Bedroom', 'Dining Sets', 'Office', "Children\'s"];

const TIER_CONFIG: Record<NonNullable<ListingTier>, { label: string; bg: string; text: string; ribbonPos: 'top-left' | 'bottom-right' }> = {
  elite: { label: 'Elite', bg: '#D4AF37', text: '#1C1410', ribbonPos: 'bottom-right' },
  spotlight: { label: 'Spotlight', bg: '#E91E8C', text: '#FFFFFF', ribbonPos: 'bottom-right' },
  premium: { label: 'Premium Top', bg: '#D4AF37', text: '#1C1410', ribbonPos: 'bottom-right' },
  standard: { label: 'Standard', bg: '#1C1410', text: '#FFFFFF', ribbonPos: 'top-left' },
};

export default function AllListings() {
  const { clients, locations, searchLocation, setSearchLocation, clientsPerPage, siteSettings } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with hero search
  useEffect(() => {
    if (searchLocation) {
      setSelectedLocation(searchLocation);
      setCurrentPage(1);
    }
  }, [searchLocation]);

  // Listen for type selection from HeroSection
  useEffect(() => {
    const handler = (e: Event) => {
      const type = (e as CustomEvent).detail as string;
      setSelectedType(type);
      setCurrentPage(1);
    };
    window.addEventListener('furni-type-select', handler);
    return () => window.removeEventListener('furni-type-select', handler);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLocation, selectedCategory, selectedSubCategory, selectedType, searchText, clientsPerPage]);

  // Reset sub-category when main category changes
  useEffect(() => {
    setSelectedSubCategory('All');
  }, [selectedCategory]);

  const showSubCategories = CATEGORIES_WITH_SUBS.includes(selectedCategory);

  // Include active + dormant (dormant show with restricted card), exclude suspended/draft/hidden
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
      const typeMatch =
        selectedType === 'All Types' ||
        p?.subCategories?.includes(selectedType);
      const textMatch = searchText === '' ||
        p?.businessName?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        p?.location?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
        p?.description?.toLowerCase()?.includes(searchText?.toLowerCase());
      return locMatch && catMatch && subCatMatch && typeMatch && textMatch;
    }) ?? [];

    // Pinned/featured sellers appear at top, sorted by featuredOrder
    const pinned = results?.filter((p) => p?.featured && p?.status === 'active')?.sort((a, b) => (a?.featuredOrder ?? 99) - (b?.featuredOrder ?? 99));
    const rest = results?.filter((p) => !(p?.featured && p?.status === 'active'));
    return [...pinned, ...rest];
  }, [selectedLocation, selectedCategory, selectedSubCategory, selectedType, searchText, visibleProfiles, showSubCategories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / clientsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * clientsPerPage, safePage * clientsPerPage);

  const clearAll = () => {
    setSelectedLocation('All');
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedType('All Types');
    setSearchText('');
    setSearchLocation('');
    setCurrentPage(1);
  };

  // Nearby places for selected location
  const nearbyPlaces = useMemo(() => {
    if (selectedLocation === 'All') return [];
    const loc = locations.find((l) => l.name === selectedLocation);
    if (!loc) return [];
    return (siteSettings?.nearbyPlaces ?? []).filter((p) => p.locationId === loc.id);
  }, [selectedLocation, locations, siteSettings]);

  return (
    <section id="all-listings" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            {siteSettings?.siteHeading || 'Find Furniture Sellers Near You'}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {filtered?.length} seller{filtered?.length !== 1 ? 's' : ''} found
            {selectedLocation !== 'All' ? <span style={{ color: '#DC2626' }}> in {selectedLocation}</span> : ''}
            {totalPages > 1 && ` · Page ${safePage} of ${totalPages}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border p-4 mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
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

        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_CATEGORIES?.slice(0, 6)?.map((cat) => (
            <button
              key={`cat-chip-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--muted)',
                color: selectedCategory === cat ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {(selectedLocation !== 'All' || selectedCategory !== 'All' || selectedSubCategory !== 'All' || selectedType !== 'All Types' || searchText) && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Types dropdown row — always visible below popular locations, all options shown inline */}
      <div className="rounded-xl border px-4 py-3 mb-4 flex items-center gap-2 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>Types:</span>
        {TYPE_OPTIONS.map((type) => (
          <button
            key={`type-filter-${type}`}
            onClick={() => setSelectedType(type)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap"
            style={{
              backgroundColor: selectedType === type ? 'var(--primary)' : 'var(--background)',
              borderColor: selectedType === type ? 'var(--primary)' : 'var(--border)',
              color: selectedType === type ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Sub-category filter — shown only for Sofas, Bedroom, Dining Sets, Office, Children's */}
      {showSubCategories && (
        <div className="rounded-xl border px-4 py-3 mb-6 flex items-center gap-2 flex-wrap" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
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

      {/* Grid */}
      {filtered?.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--muted)' }}>
            <Search size={24} style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>No sellers found in {selectedLocation === 'All' ? 'this search' : selectedLocation}</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Try a different location or category, or clear your filters.</p>
          <button onClick={clearAll} className="btn-primary px-5 py-2.5 text-sm">
            Show All Listings
          </button>
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
                  key={`listing-${profile?.id}`}
                  className={`card-hover rounded-xl overflow-hidden border group ${isDormant ? 'opacity-70' : ''}`}
                  style={{ backgroundColor: 'var(--card)', borderColor: isDormant ? 'rgba(220,38,38,0.3)' : 'var(--border)' }}
                >
                  {isDormant ? (
                    <div className="relative overflow-hidden h-32 sm:h-44">
                      <AppImage
                        src={profile?.media?.[0]?.url || '/assets/images/no_image.png'}
                        alt={profile?.media?.[0]?.alt ?? `${profile?.businessName} furniture`}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover grayscale"
                      />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(28,20,16,0.45)' }}>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(220,38,38,0.9)', color: '#fff' }}>
                          <Lock size={10} />
                          Dormant
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium" style={{ backgroundColor: 'rgba(28,20,16,0.65)', color: '#FAF8F5' }}>
                        <MapPin size={10} />
                        {profile?.location}
                      </div>
                    </div>
                  ) : (
                    <Link href={profileUrl} className="block relative overflow-hidden h-32 sm:h-44">
                      <AppImage
                        src={profile?.media?.[0]?.url || '/assets/images/no_image.png'}
                        alt={profile?.media?.[0]?.alt ?? `${profile?.businessName} furniture`}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* VIP ribbon — red diagonal top-right */}
                      {profile?.tier === 'elite' && (
                        <div
                          className="absolute top-0 right-0 overflow-hidden"
                          style={{ width: 72, height: 72, pointerEvents: 'none' }}
                        >
                          <div
                            className="absolute flex items-center justify-center font-black text-xs tracking-wide"
                            style={{
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              width: 100,
                              top: 18,
                              right: -26,
                              transform: 'rotate(45deg)',
                              padding: '3px 0',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                            }}
                          >
                            VIP
                          </div>
                        </div>
                      )}

                      {/* Verified ribbon — blue diagonal bottom-left */}
                      {profile?.verified && (
                        <div
                          className="absolute bottom-0 left-0 overflow-hidden"
                          style={{ width: 90, height: 90, pointerEvents: 'none' }}
                        >
                          <div
                            className="absolute flex items-center justify-center font-black text-xs tracking-wide"
                            style={{
                              backgroundColor: '#1D4ED8',
                              color: '#FFFFFF',
                              width: 130,
                              bottom: 18,
                              left: -32,
                              transform: 'rotate(45deg)',
                              padding: '3px 0',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                            }}
                          >
                            VERIFIED
                          </div>
                        </div>
                      )}

                      {/* Premium Top ribbon — gold diagonal bottom-right */}
                      {(profile?.tier === 'premium' || profile?.tier === 'spotlight') && (
                        <div
                          className="absolute bottom-0 right-0 overflow-hidden"
                          style={{ width: 90, height: 90, pointerEvents: 'none' }}
                        >
                          <div
                            className="absolute flex items-center justify-center font-black text-xs tracking-wide leading-tight text-center"
                            style={{
                              backgroundColor: profile?.tier === 'premium' ? '#D4AF37' : '#E91E8C',
                              color: profile?.tier === 'premium' ? '#1C1410' : '#FFFFFF',
                              width: 130,
                              bottom: 18,
                              right: -32,
                              transform: 'rotate(-45deg)',
                              padding: '3px 0',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                            }}
                          >
                            {profile?.tier === 'premium' ? 'PREMIUM TOP' : 'SPOTLIGHT'}
                          </div>
                        </div>
                      )}

                      {/* Standard — circle badge top-left */}
                      {profile?.tier === 'standard' && (
                        <div
                          className="absolute top-2 left-2 w-10 h-10 rounded-full flex items-center justify-center text-center"
                          style={{
                            backgroundColor: '#1C1410',
                            color: '#FFFFFF',
                            fontSize: 8,
                            fontWeight: 800,
                            lineHeight: 1.1,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                          }}
                        >
                          STD
                        </div>
                      )}

                      {/* Featured star — only if no tier badge at top-left */}
                      {profile?.featured && !profile?.tier && (
                        <div className="absolute top-2 left-2">
                          <span className="featured-ribbon text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#1C1410' }}>
                            ★ Featured
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium" style={{ backgroundColor: 'rgba(28,20,16,0.65)', color: '#FAF8F5' }}>
                        <MapPin size={10} />
                        {profile?.location}
                      </div>
                    </Link>
                  )}
                  <div className="p-2.5 sm:p-4">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <Link href={isDormant ? '#' : profileUrl} className={isDormant ? 'pointer-events-none' : ''}>
                        <AppImage
                          src={profile?.avatar}
                          alt={profile?.avatarAlt}
                          width={32}
                          height={32}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link href={isDormant ? '#' : profileUrl} className={isDormant ? 'pointer-events-none' : ''}>
                          <h3 className="font-semibold text-xs sm:text-sm truncate" style={{ color: 'var(--foreground)' }}>{profile?.businessName}</h3>
                        </Link>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed line-clamp-2 mb-2 sm:mb-3 hidden sm:block" style={{ color: 'var(--muted-foreground)' }}>
                      {profile?.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                      {profile?.categories?.slice(0, 1)?.map((cat) => (
                        <span key={`listing-cat-${profile?.id}-${cat}`} className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(194,105,42,0.08)', color: 'var(--primary)' }}>
                          {cat}
                        </span>
                      ))}
                      {profile?.subCategories?.slice(0, 1)?.map((sub) => (
                        <span key={`listing-sub-${profile?.id}-${sub}`} className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(29,78,216,0.08)', color: '#1D4ED8' }}>
                          {sub}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <Eye size={11} />
                        <span className="hidden sm:inline">{profile?.views?.toLocaleString()}</span>
                        <span className="sm:hidden">{profile?.views && profile?.views >= 1000 ? `${(profile?.views / 1000)?.toFixed(1)}k` : profile?.views}</span>
                      </span>
                      {isDormant ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg cursor-not-allowed" style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>
                          Dormant
                        </span>
                      ) : (
                        <Link href={profileUrl} className="text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                          See More →
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>…</span>
                    ) : (
                      <button
                        key={`page-${item}`}
                        onClick={() => setCurrentPage(item as number)}
                        className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                        style={safePage === item
                          ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }
                          : { backgroundColor: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }
                        }
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Nearby places — shown when a specific location is selected */}
      {selectedLocation !== 'All' && nearbyPlaces.length > 0 && (
        <div className="mt-10 rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
              Nearby Places in {selectedLocation}
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {nearbyPlaces.map((place) => (
              <button
                key={`nearby-${place.id}`}
                onClick={() => {
                  setSearchLocation(place.name);
                  setSelectedLocation(place.name);
                }}
                className="flex flex-col items-start px-4 py-3 rounded-xl border transition-all card-hover text-left"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
              >
                <span className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  <MapPin size={12} style={{ color: 'var(--primary)' }} />
                  {place.name}
                </span>
                {place.description && (
                  <span className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{place.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* We Also Serve — micro locations shown below nearby places when a location is selected */}
      {selectedLocation !== 'All' && (siteSettings?.microLocations ?? []).length > 0 && (
        <div className="mt-6 rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
              We Also Serve
            </h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            Areas near {selectedLocation} where you can also find furniture sellers:
          </p>
          <div className="flex flex-wrap gap-3">
            {(siteSettings?.microLocations ?? []).map((ml) => (
              <button
                key={`micro-serve-${ml.id}`}
                onClick={() => {
                  setSearchLocation(ml.name);
                  setSelectedLocation(ml.name);
                }}
                className="flex flex-col items-start px-4 py-3 rounded-xl border transition-all card-hover text-left"
                style={{ backgroundColor: 'rgba(245,166,35,0.06)', borderColor: 'rgba(245,166,35,0.3)' }}
              >
                <span className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  <MapPin size={12} style={{ color: 'var(--primary)' }} />
                  {ml.name}
                </span>
                {ml.description && (
                  <span className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{ml.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}