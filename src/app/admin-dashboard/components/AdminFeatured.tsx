'use client';
import React from 'react';
import { Star, Pin, PinOff, ArrowUp, ArrowDown, Info, Shuffle, Settings } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import AppImage from '@/components/ui/AppImage';
import { Toaster, toast } from 'sonner';

const MAX_FEATURED = 6;

const SHUFFLE_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hr', value: 60 },
  { label: '2 hrs', value: 120 },
  { label: '4 hrs', value: 240 },
];

export default function AdminFeatured() {
  const { clients, togglePin, moveFeaturedUp, moveFeaturedDown, shuffleIntervalMinutes, setShuffleInterval } = useAppStore();

  const featured = clients
    .filter((c) => c.featured && c.status === 'active')
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

  const eligible = clients.filter((c) => !c.featured && c.status === 'active');

  const unpin = (id: string) => {
    togglePin(id);
    toast.success('Seller removed from featured section');
  };

  const pin = (id: string) => {
    if (featured.length >= MAX_FEATURED) {
      toast.error(`Featured slots full — remove a seller first (max ${MAX_FEATURED})`);
      return;
    }
    togglePin(id);
    toast.success('Seller pinned to featured section');
  };

  return (
    <div className="max-w-screen-lg">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Featured Slots</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Featured sellers appear at the top of the homepage with a gold ribbon. Up to {MAX_FEATURED} slots available.
        </p>
      </div>

      {/* Slot usage */}
      <div className="rounded-xl border p-5 mb-4 flex items-center gap-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex gap-2">
          {Array.from({ length: MAX_FEATURED }).map((_, i) => (
            <div
              key={`slot-indicator-${i + 1}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: i < featured.length ? 'rgba(245,166,35,0.2)' : 'var(--muted)',
                color: i < featured.length ? '#D97706' : 'var(--muted-foreground)',
              }}
            >
              {i < featured.length ? <Star size={16} className="fill-current" /> : <span className="text-xs font-mono">{i + 1}</span>}
            </div>
          ))}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
            {featured.length} / {MAX_FEATURED} slots used
          </p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {MAX_FEATURED - featured.length} slot{MAX_FEATURED - featured.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {featured.length >= MAX_FEATURED && (
          <div className="flex items-center gap-2 ml-auto px-3 py-2 rounded-lg" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            <Info size={14} />
            <span className="text-xs font-medium">All slots full — unpin a seller to add another</span>
          </div>
        )}
      </div>

      {/* Shuffle interval control */}
      <div className="rounded-xl border p-5 mb-6" style={{ backgroundColor: 'rgba(245,166,35,0.04)', borderColor: 'rgba(245,166,35,0.25)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Shuffle size={15} style={{ color: '#D97706' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Auto-Shuffle Interval</span>
          <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#D97706' }}>
            Active: {SHUFFLE_OPTIONS.find(o => o.value === shuffleIntervalMinutes)?.label ?? `${shuffleIntervalMinutes} min`}
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
          Featured listings randomly reorder at this interval. Keeps the homepage fresh for returning visitors.
        </p>
        <div className="flex flex-wrap gap-2">
          {SHUFFLE_OPTIONS.map((opt) => (
            <button
              key={`shuffle-opt-${opt.value}`}
              onClick={() => { setShuffleInterval(opt.value); toast.success(`Shuffle interval set to ${opt.label}`); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              style={shuffleIntervalMinutes === opt.value
                ? { backgroundColor: 'rgba(245,166,35,0.2)', borderColor: '#D97706', color: '#D97706' }
                : { backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
              }
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => toast.info('More options available in Settings tab')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1"
            style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <Settings size={11} /> More
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currently featured */}
        <div>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Star size={15} className="text-accent fill-accent" />
            Currently Featured ({featured.length})
          </h3>
          <div className="flex flex-col gap-3">
            {featured.length === 0 ? (
              <div className="rounded-xl border p-8 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <Star size={24} className="mx-auto mb-2 opacity-30" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>No featured sellers yet</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Pin sellers from the list on the right to feature them on the homepage.</p>
              </div>
            ) : (
              featured.map((client, i) => (
                <div
                  key={`featured-slot-${client.id}`}
                  className="rounded-xl border p-4 flex items-center gap-3"
                  style={{ backgroundColor: 'rgba(245,166,35,0.06)', borderColor: 'rgba(245,166,35,0.3)' }}
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: 'var(--accent)', color: '#1C1410' }}>
                    {i + 1}
                  </span>
                  <AppImage src={client.avatar} alt={client.avatarAlt} width={40} height={40} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{client.businessName}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{client.location}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => moveFeaturedUp(client.id)} disabled={i === 0} className="p-1.5 rounded-lg transition-colors disabled:opacity-30" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)' }} aria-label="Move up"><ArrowUp size={13} /></button>
                    <button onClick={() => moveFeaturedDown(client.id)} disabled={i === featured.length - 1} className="p-1.5 rounded-lg transition-colors disabled:opacity-30" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)' }} aria-label="Move down"><ArrowDown size={13} /></button>
                    <button onClick={() => unpin(client.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#D97706', backgroundColor: '#FEF3C7' }} title="Remove from featured section" aria-label="Unpin seller"><PinOff size={13} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Eligible to feature */}
        <div>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Pin size={15} style={{ color: 'var(--muted-foreground)' }} />
            Eligible Sellers ({eligible.length})
          </h3>
          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin pr-1">
            {eligible.length === 0 ? (
              <div className="rounded-xl border p-6 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>All active sellers are currently featured.</p>
              </div>
            ) : (
              eligible.map((client) => (
                <div key={`eligible-${client.id}`} className="rounded-xl border p-3.5 flex items-center gap-3 transition-colors hover:bg-muted/40" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <AppImage src={client.avatar} alt={client.avatarAlt} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{client.businessName}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{client.location} · {client.views.toLocaleString()} views</p>
                  </div>
                  <button
                    onClick={() => pin(client.id)}
                    disabled={featured.length >= MAX_FEATURED}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
                    style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#D97706' }}
                    title={featured.length >= MAX_FEATURED ? 'Featured slots are full' : 'Pin to featured section'}
                  >
                    <Pin size={12} /> Pin
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}