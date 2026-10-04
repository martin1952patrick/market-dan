'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Shield, Copy, CheckCheck } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';

interface Props {
  onAuth: () => void;
}

interface AdminLoginForm {
  email: string;
  password: string;
}

const ADMIN_CREDS = { email: 'admin@furnimarket.co.ke', password: 'Admin@Furni2026' };

export default function AdminAuthGate({ onAuth }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'email' | 'password' | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdminLoginForm>();

  const handleCopy = (field: 'email' | 'password') => {
    navigator.clipboard.writeText(field === 'email' ? ADMIN_CREDS.email : ADMIN_CREDS.password);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const onSubmit = (data: AdminLoginForm) => {
    setLoading(true);
    setError('');
    // Backend integration: POST /api/admin/auth/login
    setTimeout(() => {
      if (data.email === ADMIN_CREDS.email && data.password === ADMIN_CREDS.password) {
        onAuth();
      } else {
        setError('Invalid credentials — use the demo admin account below to sign in');
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <AppLogo size={40} />
            <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>FurniMarket</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
            <Shield size={13} />
            Admin Access Only
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Admin Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sign in with your administrator credentials</p>
        </div>

        <div className="rounded-2xl border p-8 shadow-card" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg p-3 text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                Admin Email
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-base w-full px-3 py-3 text-sm"
                placeholder="admin@furnimarket.co.ke"
              />
              {errors.email && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="input-base w-full px-3 pr-10 py-3 text-sm"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--muted-foreground)' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 py-3 text-sm w-full disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <><Shield size={16} /> Sign In as Admin</>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-xl border p-4" style={{ backgroundColor: 'rgba(194,105,42,0.04)', borderColor: 'rgba(194,105,42,0.2)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--primary)' }}>Demo Admin Credentials</p>
            <div className="flex flex-col gap-2 mb-3">
              {[
                { label: 'Email', value: ADMIN_CREDS.email, field: 'email' as const },
                { label: 'Password', value: ADMIN_CREDS.password, field: 'password' as const },
              ].map((item) => (
                <div key={`admin-cred-${item.field}`} className="flex items-center justify-between gap-2">
                  <span className="text-xs w-16 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>{item.label}:</span>
                  <code className="text-xs font-mono flex-1 truncate" style={{ color: 'var(--foreground)' }}>{item.value}</code>
                  <button
                    onClick={() => handleCopy(item.field)}
                    className="p-1 rounded flex-shrink-0"
                    style={{ color: 'var(--primary)' }}
                    aria-label={`Copy ${item.label}`}
                  >
                    {copied === item.field ? <CheckCheck size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setValue('email', ADMIN_CREDS.email); setValue('password', ADMIN_CREDS.password); }}
              className="w-full text-xs font-semibold py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(194,105,42,0.12)', color: 'var(--primary)' }}
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}