'use client';
import React, { useState } from 'react';
import { X, Eye, EyeOff, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import type { ClientProfile } from '@/lib/mockData';

interface Props {
  onClose: () => void;
}

const EMPTY_FORM = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  password: '',
  county: '',
  subcounty: '',
  division: '',
  location: '',
  subLocation: '',
  road: '',
  description: '',
};

export default function AdminCreateSeller({ onClose }: Props) {
  const { addClient, clients } = useAppStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [created, setCreated] = useState(false);

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    else if (clients.some((c) => c.email.toLowerCase() === form.email.toLowerCase())) e.email = 'Email already exists';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.password.trim()) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const maxNumericId = clients.reduce((max, c) => Math.max(max, c.numericId ?? 0), 0);
    const newClient: ClientProfile = {
      id: `client-${Date.now()}`,
      numericId: maxNumericId + 1,
      name: form.name.trim(),
      businessName: form.businessName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      phone: form.phone.trim(),
      county: form.county.trim(),
      subcounty: form.subcounty.trim(),
      division: form.division.trim(),
      location: form.location.trim(),
      subLocation: form.subLocation.trim(),
      road: form.road.trim(),
      description: form.description.trim() || `${form.businessName} — quality furniture seller.`,
      avatar: '',
      avatarAlt: `${form.businessName} profile photo`,
      media: [],
      uploadLimit: 4,
      photoLimit: 3,
      videoLimit: 1,
      status: 'pending',
      hidden: false,
      featured: false,
      featuredOrder: null,
      joinedDate: new Date().toISOString().split('T')[0],
      categories: [],
      views: 0,
    };
    addClient(newClient);
    setCreated(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const field = (
    label: string,
    key: keyof typeof EMPTY_FORM,
    type: string = 'text',
    required = false
  ) => (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted-foreground)' }}>
        {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
      </label>
      {key === 'description' ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
          rows={3}
          className="input-base w-full px-3 py-2 text-sm resize-none"
          placeholder="Brief description of the business…"
        />
      ) : key === 'password' ? (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={form[key]}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            className="input-base w-full px-3 py-2 text-sm pr-10"
            placeholder="Min. 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted-foreground)' }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
          className="input-base w-full px-3 py-2 text-sm"
        />
      )}
      {errors[key] && (
        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#DC2626' }}>
          <AlertCircle size={11} /> {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.7)' }}>
      <div className="rounded-2xl border shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b sticky top-0 z-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.15)', color: 'var(--primary)' }}>
              <UserPlus size={18} />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: 'var(--foreground)' }}>Create Seller Account</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Admin-created seller profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {created ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(22,163,74,0.1)' }}>
              <CheckCircle2 size={32} style={{ color: '#16A34A' }} />
            </div>
            <p className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Seller Account Created!</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <strong>{form.businessName}</strong> has been added. They can log in with their email and password.
            </p>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Account info */}
            <div>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {field('Full Name', 'name', 'text', true)}
                {field('Business Name', 'businessName', 'text', true)}
                {field('Email Address', 'email', 'email', true)}
                {field('Phone Number', 'phone', 'tel', true)}
                {field('Password', 'password', 'password', true)}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Location Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {field('County', 'county')}
                {field('Sub-County', 'subcounty')}
                {field('Division', 'division')}
                {field('Location / Area', 'location', 'text', true)}
                {field('Sub-Location', 'subLocation')}
                {field('Road', 'road')}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>Business Description</h3>
              {field('Description (optional)', 'description')}
            </div>

            <div className="rounded-xl p-3 text-xs" style={{ backgroundColor: 'rgba(194,105,42,0.08)', color: 'var(--primary)' }}>
              <strong>Note:</strong> The account will be created with <strong>Pending</strong> status. Activate it from the Manage Clients table when ready.
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1 py-3 text-sm">Cancel</button>
              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                <UserPlus size={16} />
                Create Seller Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
