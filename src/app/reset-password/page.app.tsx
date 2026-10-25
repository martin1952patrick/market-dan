'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
      } else {
        await supabase.auth.signOut();
        setDone(true);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Could not update password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-md rounded-2xl border p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-6">
          <AppLogo size={32} />
          <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Nairobi Spot</span>
        </div>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle size={40} className="mx-auto mb-3" style={{ color: '#16A34A' }} />
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Password updated</h1>
            <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>You can now sign in with your new password.</p>
            <Link href="/client-dashboard" className="btn-primary inline-block px-6 py-3 text-sm">Go to Seller Sign In</Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Set a new password</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Choose a new password for your seller account.</p>

            {!ready && (
              <div className="rounded-lg p-3 text-sm mb-4" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                Open this page from the reset link in your email. If the link has expired, request a new one from the seller sign in page.
              </div>
            )}
            {error && (
              <div className="rounded-lg p-3 text-sm font-medium mb-4" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-base w-full pl-10 pr-10 py-3 text-sm"
                    placeholder="At least 8 characters"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="input-base w-full pl-10 pr-4 py-3 text-sm"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading || !ready} className="btn-primary py-3 text-sm w-full disabled:opacity-60">
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
