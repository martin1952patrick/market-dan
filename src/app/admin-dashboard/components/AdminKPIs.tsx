'use client';
import React from 'react';
import { Users, MapPin, Star, Image, AlertTriangle, FileText } from 'lucide-react';
import { WEEKLY_REGISTRATIONS, LOCATION_DISTRIBUTION } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import dynamic from 'next/dynamic';

const RegistrationsChart = dynamic(() => import('./charts/RegistrationsChart'), { ssr: false });
const LocationChart = dynamic(() => import('./charts/LocationChart'), { ssr: false });

export default function AdminKPIs() {
  const { clients, locations, blogPosts } = useAppStore();

  const totalClients = clients?.length ?? 0;
  const active = clients?.filter((p) => p?.status === 'active')?.length ?? 0;
  const featured = clients?.filter((p) => p?.featured)?.length ?? 0;
  const pending = clients?.filter((p) => p?.status === 'pending')?.length ?? 0;
  const suspended = clients?.filter((p) => p?.status === 'suspended')?.length ?? 0;
  const totalMedia = clients?.reduce((sum, p) => sum + (p?.media?.length ?? 0), 0) ?? 0;
  const locCount = locations?.length ?? 0;
  const publishedPosts = blogPosts?.filter((p) => p?.status === 'published')?.length ?? 0;
  const totalPosts = blogPosts?.length ?? 0;

  const kpis = [
    { id: 'kpi-total', label: 'Total Clients', value: totalClients?.toString(), change: `${active} active · ${pending} pending`, positive: true, icon: <Users size={18} />, color: '#16A34A', bg: '#DCFCE7' },
    { id: 'kpi-featured', label: 'Featured Slots', value: `${featured}/6`, change: `${Math.max(0, 6 - featured)} slot${Math.max(0, 6 - featured) !== 1 ? 's' : ''} available`, positive: true, icon: <Star size={18} />, color: '#D97706', bg: '#FEF3C7' },
    { id: 'kpi-locations', label: 'Locations', value: locCount?.toString(), change: 'Across 3 counties', positive: true, icon: <MapPin size={18} />, color: '#2563EB', bg: '#DBEAFE' },
    { id: 'kpi-blog', label: 'Blog Posts', value: totalPosts?.toString(), change: `${publishedPosts} published`, positive: true, icon: <FileText size={18} />, color: '#7C3AED', bg: '#EDE9FE' },
    { id: 'kpi-media', label: 'Total Media', value: totalMedia?.toString(), change: 'Images & videos', positive: true, icon: <Image size={18} />, color: '#0891B2', bg: '#CFFAFE' },
    { id: 'kpi-pending', label: 'Pending Review', value: pending?.toString(), change: 'Needs approval', positive: false, icon: <AlertTriangle size={18} />, color: '#DC2626', bg: '#FEE2E2' },
  ];

  return (
    <div className="max-w-screen-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Marketplace Overview</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Live data — reflects all changes made in this session</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpis?.map((kpi) => (
          <div key={kpi?.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider leading-tight" style={{ color: 'var(--muted-foreground)' }}>{kpi?.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: kpi?.bg, color: kpi?.color }}>{kpi?.icon}</div>
            </div>
            <p className="text-2xl font-bold tabular-nums mb-1" style={{ color: 'var(--foreground)' }}>{kpi?.value}</p>
            <p className="text-xs font-medium" style={{ color: kpi?.positive ? '#16A34A' : '#DC2626' }}>{kpi?.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>New Registrations (Weekly)</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Seller sign-ups over the past 10 weeks</p>
          <RegistrationsChart data={WEEKLY_REGISTRATIONS} />
        </div>
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Profiles by Location</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Distribution of active listings across areas</p>
          <LocationChart data={LOCATION_DISTRIBUTION} />
        </div>
      </div>

      <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Listing Status Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active', count: active, cls: 'badge-active' },
            { label: 'Pending', count: pending, cls: 'badge-pending' },
            { label: 'Suspended', count: suspended, cls: 'badge-suspended' },
            { label: 'Draft', count: clients?.filter((p) => p?.status === 'draft')?.length ?? 0, cls: 'badge-draft' },
          ]?.map((s) => (
            <div key={`status-${s?.label}`} className="rounded-xl p-4 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s?.cls}`}>{s?.label}</span>
              <p className="text-2xl font-bold tabular-nums mt-2" style={{ color: 'var(--foreground)' }}>{s?.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}