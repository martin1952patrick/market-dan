'use client';
import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';


export default function HeroSection() {
  const { locations, setSearchLocation, siteSettings } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMoreLocations, setShowMoreLocations] = useState(false);

  const filtered = searchQuery.length > 0
    ? locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.area.toLowerCase().includes(searchQuery.toLowerCase()))
    : locations.slice(0, 6);

  const handleSelect = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    setSearchLocation(name);
    setTimeout(() => {
      document.getElementById('all-listings')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSearchClick = () => {
    handleSelect(searchQuery);
  };

  // Popular locations — first 5 shown, rest in "More"
  const popularAreas = ['Kinoo', 'Westlands', 'Karen', 'Thika', 'Ruiru'];
  const moreAreas = locations
    .map(l => l.name)
    .filter(n => !popularAreas.includes(n))
    .slice(0, 20);

  const microLocations = siteSettings?.microLocations ?? [];

  return (
    <section className="hero-gradient relative">
      {/* Decorative background — overflow hidden applied here only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 60%), radial-gradient(circle at 80% 20%, #FAF8F5 0%, transparent 50%)' }} />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: 'rgba(245,166,35,0.2)', color: '#F5A623' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {locations.length} Locations Across Nairobi & Kiambu
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-4" style={{ color: '#FAF8F5' }}>
            Find Furniture Sellers
            <span className="block" style={{ color: '#F5A623' }}>Near You</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl" style={{ color: 'rgba(250,248,245,0.75)' }}>
            Browse local furniture businesses by location. View photos, videos, and descriptions — then contact sellers directly.
          </p>

          <div className="relative max-w-xl">
            <div className="flex items-center rounded-xl overflow-visible shadow-xl" style={{ backgroundColor: 'var(--card)' }}>
              <MapPin size={18} className="ml-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
                placeholder="Search by area — e.g. Kinoo, Westlands…"
                className="flex-1 px-3 py-4 text-sm bg-transparent outline-none"
                style={{ color: 'var(--foreground)' }}
              />
              <button
                className="btn-primary m-1.5 px-5 py-2.5 text-sm flex items-center gap-2"
                onClick={handleSearchClick}
              >
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-modal border overflow-hidden z-50" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                  {searchQuery ? 'Matching Areas' : 'Popular Areas'}
                </div>
                {filtered.map((loc) => (
                  <button
                    key={`suggestion-${loc.id}`}
                    onMouseDown={() => handleSelect(loc.name)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={14} style={{ color: 'var(--primary)' }} />
                      <span>{loc.name}</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{loc.area}</span>
                    </span>
                    <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      {loc.profileCount}
                    </span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>No matching areas found</div>
                )}
              </div>
            )}
          </div>

          {/* Popular locations row */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="text-xs font-medium" style={{ color: 'rgba(250,248,245,0.5)' }}>Popular:</span>
            {popularAreas.map((area) => (
              <button
                key={`popular-${area}`}
                onClick={() => handleSelect(area)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{ backgroundColor: 'rgba(250,248,245,0.12)', color: 'rgba(250,248,245,0.8)' }}
              >
                {area}
              </button>
            ))}

            {/* More button — expands to show more locations */}
            <div className="relative">
              <button
                onClick={() => setShowMoreLocations((v) => !v)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all"
                style={{
                  backgroundColor: showMoreLocations ? '#DC2626' : 'rgba(250,248,245,0.18)',
                  color: showMoreLocations ? '#FFFFFF' : 'rgba(250,248,245,0.9)',
                }}
              >
                <span>More</span>
                <ChevronDown
                  size={11}
                  className="transition-transform duration-200"
                  style={{ transform: showMoreLocations ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {showMoreLocations && (
                <div
                  className="absolute left-0 top-full mt-1.5 rounded-xl border shadow-modal overflow-hidden z-[100]"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', minWidth: 180, maxHeight: 280, overflowY: 'auto' }}
                >
                  <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>More Locations</p>
                  </div>
                  {moreAreas.length > 0 ? moreAreas.map((area) => (
                    <button
                      key={`more-loc-${area}`}
                      onMouseDown={() => { handleSelect(area); setShowMoreLocations(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <MapPin size={13} style={{ color: 'var(--primary)' }} />
                      {area}
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>No additional locations</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Types dropdown — row below Popular */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs font-medium" style={{ color: 'rgba(250,248,245,0.5)' }}>Types:</span>
            <TypesDropdown onSelectType={(type) => {
              setTimeout(() => {
                document.getElementById('all-listings')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('furni-type-select', { detail: type }));
              }
            }} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--background))' }} />
    </section>
  );
}

function TypesDropdown({ onSelectType }: { onSelectType: (type: string) => void }) {
  const [selectedType, setSelectedType] = useState('All Types');
  const [open, setOpen] = useState(false);

  const types = ['All Types', 'Full Set', 'Partial Set', 'Standalone'];

  const handleSelect = (type: string) => {
    setSelectedType(type);
    setOpen(false);
    onSelectType(type);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all"
        style={{
          backgroundColor: selectedType !== 'All Types' ? '#F5A623' : 'rgba(250,248,245,0.18)',
          color: selectedType !== 'All Types' ? '#1C1410' : 'rgba(250,248,245,0.9)',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedType}</span>
        <ChevronDown
          size={12}
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 rounded-xl border shadow-modal overflow-hidden z-[100]"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', minWidth: 150 }}
          role="listbox"
        >
          {types.map((type) => (
            <button
              key={`type-dd-${type}`}
              onMouseDown={() => handleSelect(type)}
              className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted flex items-center justify-between"
              style={{
                color: selectedType === type ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: selectedType === type ? 'rgba(194,105,42,0.08)' : 'transparent',
              }}
              role="option"
              aria-selected={selectedType === type}
            >
              {type}
              {selectedType === type && (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}