'use client';
import React, { useState } from 'react';
import { Settings, Shuffle, Users, Check, Clock, Type, Globe } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import { Toaster, toast } from 'sonner';

const SHUFFLE_OPTIONS = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '4 hours', value: 240 },
  { label: '12 hours', value: 720 },
  { label: '24 hours', value: 1440 },
];

const PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

export default function AdminSettings() {
  const { shuffleIntervalMinutes, clientsPerPage, setShuffleInterval, setClientsPerPage, siteSettings, updateSiteSettings } = useAppStore();
  const [localShuffle, setLocalShuffle] = useState(shuffleIntervalMinutes);
  const [localPerPage, setLocalPerPage] = useState(clientsPerPage);
  const [localHeading, setLocalHeading] = useState(siteSettings?.siteHeading ?? 'Find Furniture Sellers Near You');
  const [localMetaTitle, setLocalMetaTitle] = useState(siteSettings?.metaTitle ?? 'FurniMarket Kenya — Find Furniture Sellers Near You');

  const handleSave = () => {
    setShuffleInterval(localShuffle);
    setClientsPerPage(localPerPage);
    updateSiteSettings({ siteHeading: localHeading?.trim() || 'Find Furniture Sellers Near You', metaTitle: localMetaTitle?.trim() || 'FurniMarket Kenya' });
    toast?.success('Settings saved — changes are live across the site');
  };

  const hasChanges =
    localShuffle !== shuffleIntervalMinutes ||
    localPerPage !== clientsPerPage ||
    localHeading !== siteSettings?.siteHeading ||
    localMetaTitle !== siteSettings?.metaTitle;

  return (
    <div className="max-w-2xl">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Site Settings</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Control how listings are displayed and shuffled across the site. Changes apply immediately.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Site Heading & Meta Title */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(29,78,216,0.12)', color: '#1D4ED8' }}>
              <Type size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Page Heading &amp; Meta Title</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                The main heading shown above all listings, and the browser tab/SEO meta title.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                <Type size={12} className="inline mr-1" />
                Listings Section Heading
              </label>
              <input
                type="text"
                value={localHeading}
                onChange={(e) => setLocalHeading(e?.target?.value)}
                placeholder="Find Furniture Sellers Near You"
                className="input-base w-full px-3 py-2.5 text-sm"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Displayed as the H2 heading above the listings grid on the homepage.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                <Globe size={12} className="inline mr-1" />
                Meta Title (Browser Tab / SEO)
              </label>
              <input
                type="text"
                value={localMetaTitle}
                onChange={(e) => setLocalMetaTitle(e?.target?.value)}
                placeholder="FurniMarket Kenya — Find Furniture Sellers Near You"
                className="input-base w-full px-3 py-2.5 text-sm"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Shown in the browser tab and used by search engines. Keep under 60 characters for best SEO.</p>
            </div>
          </div>
        </div>

        {/* Shuffle interval */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#D97706' }}>
              <Shuffle size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Featured Listings Shuffle Interval</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Pinned/featured listings randomly reorder at this interval. Keeps the homepage fresh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
            <Clock size={14} style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Current: <strong style={{ color: 'var(--foreground)' }}>{SHUFFLE_OPTIONS?.find(o => o?.value === shuffleIntervalMinutes)?.label ?? `${shuffleIntervalMinutes} min`}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {SHUFFLE_OPTIONS?.map((opt) => (
              <button
                key={`shuffle-${opt?.value}`}
                onClick={() => setLocalShuffle(opt?.value)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border"
                style={localShuffle === opt?.value
                  ? { backgroundColor: 'rgba(245,166,35,0.15)', borderColor: '#D97706', color: '#D97706' }
                  : { backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
                }
              >
                {localShuffle === opt?.value && <Check size={13} />}
                {opt?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clients per page */}
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
              <Users size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Listings Per Page</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                How many seller listings appear per page in All Listings. Applies site-wide.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
            <Users size={14} style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Current: <strong style={{ color: 'var(--foreground)' }}>{clientsPerPage} per page</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PER_PAGE_OPTIONS?.map((count) => (
              <button
                key={`perpage-${count}`}
                onClick={() => setLocalPerPage(count)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border"
                style={localPerPage === count
                  ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--primary-foreground)' }
                  : { backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
                }
              >
                {localPerPage === count && <Check size={13} />}
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Settings size={15} style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {hasChanges ? <span style={{ color: '#D97706' }}>● Unsaved changes</span> : 'All settings saved'}
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Check size={15} /> Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}
