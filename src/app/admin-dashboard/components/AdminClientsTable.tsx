'use client';
import React, { useState, useMemo } from 'react';
import { Search, Trash2, Pin, PinOff, MinusCircle, CheckCircle2, ChevronUp, ChevronDown, SlidersHorizontal, Plus, Minus, AlertCircle, EyeOff, Eye, ExternalLink, ShieldCheck, ShieldOff, Crown, Check, Edit2, Phone } from 'lucide-react';
import { ProfileStatus, ListingTier } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import AppImage from '@/components/ui/AppImage';
import { Toaster, toast } from 'sonner';
import { getProfileUrl } from '@/lib/mockData';
import Link from 'next/link';
import AdminSellerEditor from './AdminSellerEditor';
import AdminCreateSeller from './AdminCreateSeller';

const TIER_OPTIONS: { value: ListingTier; label: string; bg: string; text: string }[] = [
  { value: 'elite', label: 'Elite', bg: '#D4AF37', text: '#1C1410' },
  { value: 'spotlight', label: 'Spotlight', bg: '#E91E8C', text: '#FFFFFF' },
  { value: 'premium', label: 'Premium', bg: '#7C3AED', text: '#FFFFFF' },
  { value: 'standard', label: 'Standard', bg: '#1C1410', text: '#FFFFFF' },
  { value: null, label: 'None', bg: '#E5E7EB', text: '#6B7280' },
];

export default function AdminClientsTable() {
  const { clients, togglePin, toggleStatus, toggleHidden, deleteClient, setMediaLimits, toggleVerified, setClientTier } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProfileStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'name' | 'views' | 'joinedDate' | 'uploadLimit'>('joinedDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [limitTarget, setLimitTarget] = useState<{ id: string | 'all'; photos: number; videos: number } | null>(null);
  const [newPhotos, setNewPhotos] = useState(3);
  const [newVideos, setNewVideos] = useState(1);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [showCreateSeller, setShowCreateSeller] = useState(false);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    return clients
      .filter((c) => {
        const textMatch =
          search === '' ||
          c.businessName.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase()) ||
          (c.phone ?? '').replace(/\s/g, '').toLowerCase().includes(search.replace(/\s/g, '').toLowerCase());
        const statusMatch = statusFilter === 'all' || c.status === statusFilter;
        return textMatch && statusMatch;
      })
      .sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';
        if (sortField === 'name') { aVal = a.businessName; bVal = b.businessName; }
        if (sortField === 'views') { aVal = a.views; bVal = b.views; }
        if (sortField === 'joinedDate') { aVal = a.joinedDate; bVal = b.joinedDate; }
        if (sortField === 'uploadLimit') { aVal = a.uploadLimit; bVal = b.uploadLimit; }
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [clients, search, statusFilter, sortField, sortDir]);

  const handleTogglePin = (id: string) => {
    const client = clients.find((c) => c.id === id);
    togglePin(id);
    toast.success(client?.featured ? 'Seller unpinned from featured' : 'Seller pinned to featured section');
  };

  const handleToggleStatus = (id: string, newStatus: ProfileStatus) => {
    toggleStatus(id, newStatus);
    toast.success(`Listing status updated to ${newStatus}`);
  };

  const handleToggleHidden = (id: string) => {
    const client = clients.find((c) => c.id === id);
    toggleHidden(id);
    toast.success(client?.hidden ? 'Client is now visible to buyers' : 'Client hidden from buyers');
  };

  const handleToggleVerified = (id: string) => {
    const client = clients.find((c) => c.id === id);
    toggleVerified(id);
    toast.success(client?.verified ? 'Verified badge removed' : 'Verified badge added — now visible on listing');
  };

  const handleSetTier = (id: string, tier: ListingTier) => {
    setClientTier(id, tier);
    const label = TIER_OPTIONS.find((t) => t.value === tier)?.label ?? 'None';
    toast.success(tier ? `Tier set to ${label}` : 'Tier removed from listing');
  };

  const confirmDelete = (id: string) => setDeleteTarget(id);

  const executeDelete = () => {
    if (!deleteTarget) return;
    deleteClient(deleteTarget);
    toast.success('Client listing removed from marketplace');
    setDeleteTarget(null);
  };

  const openLimitModal = (id: string | 'all', photos: number, videos: number) => {
    setLimitTarget({ id, photos, videos });
    setNewPhotos(photos);
    setNewVideos(videos);
  };

  const applyLimit = () => {
    if (!limitTarget) return;
    setMediaLimits(limitTarget.id, newPhotos, newVideos);
    toast.success(
      limitTarget.id === 'all'
        ? `All sellers can now upload ${newPhotos} photos and ${newVideos} video${newVideos !== 1 ? 's' : ''}`
        : `Limit updated to ${newPhotos} photos and ${newVideos} video${newVideos !== 1 ? 's' : ''}`
    );
    setLimitTarget(null);
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className="inline-flex flex-col ml-1" style={{ color: sortField === field ? 'var(--primary)' : 'var(--muted-foreground)' }}>
      <ChevronUp size={10} style={{ marginBottom: -3 }} />
      <ChevronDown size={10} />
    </span>
  );

  const statusBadge = (status: ProfileStatus) => {
    const map: Record<ProfileStatus, string> = {
      active: 'badge-active',
      pending: 'badge-pending',
      suspended: 'badge-suspended',
      draft: 'badge-draft',
      dormant: 'badge-suspended',
    };
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? 'badge-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const editClient = editTarget ? clients.find((c) => c.id === editTarget) : null;

  return (
    <div className="max-w-screen-xl">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Manage Clients</h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {clients.length} total sellers — control status, upload limits, featured placement, verified badge, tier, and full account editing
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => openLimitModal('all', 6, 2)}
          className="btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Limits for All</span>
        </button>
        <button
          onClick={() => setShowCreateSeller(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 transition-all"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Create Seller</span>
          <span className="sm:hidden">New</span>
        </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or location…"
            className="input-base w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={15} style={{ color: 'var(--muted-foreground)' }} />
          {(['all', 'active', 'pending', 'suspended', 'draft'] as const).map((s) => (
            <button
              key={`status-filter-${s}`}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
              style={{
                backgroundColor: statusFilter === s ? 'var(--primary)' : 'var(--muted)',
                color: statusFilter === s ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 200 }}>
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Seller <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 130 }}>
                  <span className="flex items-center gap-1"><Phone size={11} /> Phone</span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 100 }}>Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 100 }}>Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 80 }}>
                  <button onClick={() => handleSort('uploadLimit')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Limit <SortIcon field="uploadLimit" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 80 }}>Media</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 80 }}>
                  <button onClick={() => handleSort('views')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Views <SortIcon field="views" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 90 }}>Featured</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 90 }}>Verified</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 130 }}>Tier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 90 }}>
                  <button onClick={() => handleSort('joinedDate')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    Joined <SortIcon field="joinedDate" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 160 }}>Actions</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: 80 }}>Profile</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'var(--card)' }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-14" style={{ color: 'var(--muted-foreground)' }}>
                    <Search size={24} className="mx-auto mb-2 opacity-40" />
                    <p className="font-medium">No clients match this filter</p>
                  </td>
                </tr>
              ) : (
                filtered.map((client, i) => (
                  <tr
                    key={`client-row-${client.id}`}
                    className="border-t transition-colors hover:bg-muted/50"
                    style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 1 ? 'rgba(237,232,225,0.3)' : undefined }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <AppImage src={client.avatar} alt={client.avatarAlt} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{client.businessName}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>{client.phone || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{client.location}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative group inline-block">
                        {statusBadge(client.status)}
                        <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block rounded-lg border shadow-modal overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', minWidth: 130 }}>
                          {(['active', 'pending', 'suspended', 'dormant'] as ProfileStatus[]).filter((s) => s !== client.status).map((s) => (
                            <button
                              key={`status-change-${client.id}-${s}`}
                              onClick={() => handleToggleStatus(client.id, s)}
                              className="w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-muted capitalize"
                              style={{ color: 'var(--foreground)' }}
                            >
                              Set {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openLimitModal(client.id, client.photoLimit ?? 3, client.videoLimit ?? 1)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-colors"
                        style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
                        title="Adjust upload limit"
                      >
                        {client.photoLimit ?? 3} photos, {client.videoLimit ?? 1} video{(client.videoLimit ?? 1) !== 1 ? 's' : ''}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm tabular-nums font-mono" style={{ color: 'var(--foreground)' }}>
                        {client.media.length}/{(client.photoLimit ?? 3) + (client.videoLimit ?? 1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm tabular-nums font-mono" style={{ color: 'var(--foreground)' }}>{client.views.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePin(client.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: client.featured ? 'rgba(245,166,35,0.15)' : 'var(--muted)',
                          color: client.featured ? '#D97706' : 'var(--muted-foreground)',
                        }}
                        title={client.featured ? 'Unpin from featured' : 'Pin to featured'}
                      >
                        {client.featured ? <><Pin size={11} /> Pinned</> : <><PinOff size={11} /> Pin</>}
                      </button>
                    </td>

                    {/* Verified toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleVerified(client.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: client.verified ? 'rgba(29,78,216,0.12)' : 'var(--muted)',
                          color: client.verified ? '#1D4ED8' : 'var(--muted-foreground)',
                        }}
                        title={client.verified ? 'Remove verified badge' : 'Mark as verified'}
                      >
                        {client.verified ? <><ShieldCheck size={11} /> Verified</> : <><ShieldOff size={11} /> Verify</>}
                      </button>
                    </td>

                    {/* Tier selector */}
                    <td className="px-4 py-3">
                      <div className="relative group inline-block">
                        <button
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border"
                          style={client.tier
                            ? {
                                backgroundColor: TIER_OPTIONS.find(t => t.value === client.tier)?.bg ?? 'var(--muted)',
                                color: TIER_OPTIONS.find(t => t.value === client.tier)?.text ?? 'var(--foreground)',
                                borderColor: 'transparent',
                              }
                            : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
                          }
                          title="Set listing tier"
                        >
                          <Crown size={11} />
                          {client.tier ? TIER_OPTIONS.find(t => t.value === client.tier)?.label : 'No Tier'}
                        </button>
                        <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block rounded-lg border shadow-modal overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', minWidth: 120 }}>
                          {TIER_OPTIONS.map((opt) => (
                            <button
                              key={`tier-${client.id}-${opt.label}`}
                              onClick={() => handleSetTier(client.id, opt.value)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold transition-colors hover:opacity-80 flex items-center gap-2"
                              style={{ backgroundColor: opt.bg, color: opt.text }}
                            >
                              {client.tier === opt.value && <Check size={10} />}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>{client.joinedDate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {/* Edit seller button */}
                        <button
                          onClick={() => setEditTarget(client.id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
                          title="Edit seller account"
                          aria-label="Edit seller"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleHidden(client.id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ backgroundColor: client.hidden ? '#FEF3C7' : '#F3F4F6', color: client.hidden ? '#D97706' : '#6B7280' }}
                          title={client.hidden ? 'Unhide — make visible to buyers' : 'Hide from buyers'}
                          aria-label={client.hidden ? 'Unhide client' : 'Hide client'}
                        >
                          {client.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(client.id, client.status === 'active' ? 'suspended' : 'active')}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ backgroundColor: client.status === 'active' ? '#FEF3C7' : '#DCFCE7', color: client.status === 'active' ? '#D97706' : '#16A34A' }}
                          title={client.status === 'active' ? 'Suspend listing' : 'Activate listing'}
                          aria-label={client.status === 'active' ? 'Suspend' : 'Activate'}
                        >
                          {client.status === 'active' ? <MinusCircle size={14} /> : <CheckCircle2 size={14} />}
                        </button>
                        <button
                          onClick={() => confirmDelete(client.id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                          title="Delete client"
                          aria-label="Delete client"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={getProfileUrl(client)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
                        title={`View ${client.businessName} public profile`}
                      >
                        <ExternalLink size={12} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload limit modal */}
      {limitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>
              {limitTarget.id === 'all' ? 'Upload Limit — All Sellers' : 'Adjust Upload Limit'}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Default is 3 photos and 1 video. Sellers who want more can be raised to 6 photos and 2 videos.
            </p>
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => { setNewPhotos(3); setNewVideos(1); }}
                className="btn-secondary flex-1 py-2 text-xs"
              >
                Standard (3 + 1)
              </button>
              <button
                onClick={() => { setNewPhotos(6); setNewVideos(2); }}
                className="btn-secondary flex-1 py-2 text-xs"
              >
                Extended (6 + 2)
              </button>
            </div>
            <p className="text-xs font-semibold mb-2 text-center" style={{ color: 'var(--muted-foreground)' }}>Photos</p>
            <div className="flex items-center justify-center gap-4 mb-5">
              <button
                onClick={() => setNewPhotos((v) => Math.max(1, v - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                aria-label="Decrease photos limit"
              >
                <Minus size={16} />
              </button>
              <span className="text-3xl font-bold tabular-nums w-12 text-center" style={{ color: 'var(--foreground)' }}>{newPhotos}</span>
              <button
                onClick={() => setNewPhotos((v) => Math.min(20, v + 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                aria-label="Increase photos limit"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs font-semibold mb-2 text-center" style={{ color: 'var(--muted-foreground)' }}>Videos</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setNewVideos((v) => Math.max(0, v - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                aria-label="Decrease videos limit"
              >
                <Minus size={16} />
              </button>
              <span className="text-3xl font-bold tabular-nums w-12 text-center" style={{ color: 'var(--foreground)' }}>{newVideos}</span>
              <button
                onClick={() => setNewVideos((v) => Math.min(20, v + 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                aria-label="Increase videos limit"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setLimitTarget(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={applyLimit} className="btn-primary flex-1 py-2.5 text-sm">Apply Limit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Delete this client?</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <strong>{clients.find((c) => c.id === deleteTarget)?.businessName}</strong> will be permanently removed from the marketplace.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-2.5 text-sm font-semibold rounded-lg" style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}>
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seller editor modal */}
      {editClient && (
        <AdminSellerEditor
          client={editClient}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Create seller modal */}
      {showCreateSeller && (
        <AdminCreateSeller onClose={() => setShowCreateSeller(false)} />
      )}
    </div>
  );
}