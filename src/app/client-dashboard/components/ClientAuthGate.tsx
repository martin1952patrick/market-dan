'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';

import {
  ClientProfile,
  getProfileUrl,
} from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import { createClient } from '@/lib/supabase/client';

interface AuthGateProps {
  onAuth: (email: string) => void;
}

type Mode = 'login' | 'register' | 'forgot';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function ClientAuthGate({ onAuth }: AuthGateProps) {
  const { clients, addClient, updateClientPassword } = useAppStore();
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [registeredUrl, setRegisteredUrl] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    const email = resetEmail.trim();
    if (!email) {
      setResetError('Please enter your email address.');
      return;
    }
    if (resetNewPassword.length < 8) {
      setResetError('New password must be at least 8 characters.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    const seller = clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (!seller) {
      setResetError('No seller account was found with this email address.');
      return;
    }
    setLoading(true);
    updateClientPassword(seller.id, resetNewPassword);
    setResetNewPassword('');
    setResetConfirmPassword('');
    setResetMessage('Your password has been changed. You can now sign in with your new password.');
    loginForm.setValue('email', seller.email);
    loginForm.setValue('password', '');
    setLoading(false);
    setTimeout(() => {
      setMode('login');
      setResetMessage('');
    }, 1800);
  };

  const handleLoginSubmit = async (data: LoginForm) => {
    setLoading(true);
    setAuthError('');
    const match = clients.find(
      (c) => c.email.toLowerCase() === data.email.toLowerCase() && c.password === data.password
    );
    let authedEmail: string | null = null;
    try {
      const supabase = createClient();
      const { data: signIn, error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (!error && signIn?.user) authedEmail = signIn.user.email ?? data.email;
      if (error && match) {
        // Existing seller without a Supabase account yet: create one so their changes sync to the database
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { full_name: match.name, role: 'seller' } },
        });
        const retry = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
        if (!retry.error) authedEmail = data.email;
      }
    } catch {
      // Fall through to local match below
    }
    const profileForAuth = authedEmail
      ? clients.find((c) => c.email.toLowerCase() === authedEmail!.toLowerCase())
      : null;
    if (profileForAuth) {
      onAuth(profileForAuth.email);
    } else if (match) {
      onAuth(match.email);
    } else {
      setAuthError('Incorrect email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async (data: RegisterForm) => {
    setLoading(true);
    {
      const existing = clients.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
      if (existing) {
        registerForm.setError('email', { message: 'This email is already registered. Please sign in.' });
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { full_name: data.name, role: 'seller' } },
        });
        if (signUpError) {
          registerForm.setError('email', { message: signUpError.message });
          setLoading(false);
          return;
        }
        await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      } catch (e: any) {
        registerForm.setError('email', { message: e?.message ?? 'Could not create account' });
        setLoading(false);
        return;
      }

      const maxId = Math.max(...clients.map((c) => c.numericId), 0);
      const newNumericId = maxId + 1;
      const newId = `client-${String(newNumericId).padStart(3, '0')}`;

      const newClient: ClientProfile = {
        id: newId,
        numericId: newNumericId,
        name: data.name,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
        phone: '',
        county: '',
        road: '',
        location: '',
        subLocation: '',
        description: '',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        avatarAlt: `${data.name} profile photo`,
        media: [],
        uploadLimit: 4,
        photoLimit: 3,
        videoLimit: 1,
        status: 'active' as const,
        hidden: false,
        featured: false,
        featuredOrder: null,
        joinedDate: new Date().toISOString().split('T')[0],
        categories: [],
        views: 0,
      };

      addClient(newClient);

      setRegisteredUrl(getProfileUrl(newClient));

      setLoading(false);
      onAuth(data.email);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #F5A623 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-12">
            <AppLogo size={40} />
            <span className="text-2xl font-bold" style={{ color: '#FAF8F5' }}>Nairobi Spot</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: '#FAF8F5' }}>
            Grow your furniture<br />business online
          </h2>
          <p className="text-lg" style={{ color: 'rgba(250,248,245,0.7)' }}>
            Create a free listing, upload photos and videos, and get discovered by thousands of buyers in your area.
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-4">
          {[
            { label: 'Active Sellers', value: '71' },
            { label: 'Locations Covered', value: '12' },
            { label: 'Monthly Views', value: '14K+' },
            { label: 'Free to List', value: '100%' },
          ].map((stat) => (
            <div key={`auth-stat-${stat.label}`} className="rounded-xl p-4" style={{ backgroundColor: 'rgba(250,248,245,0.1)' }}>
              <div className="text-2xl font-bold mb-0.5" style={{ color: '#F5A623' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: 'rgba(250,248,245,0.65)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <AppLogo size={32} />
            <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Nairobi Spot</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              {mode === 'login' ? 'Welcome back' : mode === 'forgot' ? 'Reset your password' : 'Create your listing'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {mode === 'login' ? 'Sign in to manage your profile' : mode === 'forgot' ? 'Enter your email and choose a new password' : 'Set up your seller profile in minutes'}
            </p>
          </div>

          {mode === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-5">
              {resetError && (
                <div className="rounded-lg p-3 text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>{resetError}</div>
              )}
              {resetMessage && (
                <div className="rounded-lg p-3 text-sm font-medium" style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>{resetMessage}</div>
              )}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="input-base w-full pl-10 pr-4 py-3 text-sm" placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} className="input-base w-full pl-10 pr-10 py-3 text-sm" placeholder="At least 8 characters" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Confirm New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} className="input-base w-full pl-10 pr-4 py-3 text-sm" placeholder="Repeat new password" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-3 text-sm w-full disabled:opacity-60">
                {loading ? 'Saving…' : 'Change Password'}
              </button>
              <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <button type="button" onClick={() => { setMode('login'); setResetError(''); setResetMessage(''); }} className="font-semibold transition-colors" style={{ color: 'var(--primary)' }}>Back to sign in</button>
              </p>
            </form>
          ) : mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="flex flex-col gap-5">
              {authError && (
                <div className="rounded-lg p-3 text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input type="email" {...loginForm.register('email', { required: 'Email is required' })} className="input-base w-full pl-10 pr-4 py-3 text-sm" placeholder="your@email.com" />
                </div>
                {loginForm.formState.errors.email && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{loginForm.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input type={showPassword ? 'text' : 'password'} {...loginForm.register('password', { required: 'Password is required' })} className="input-base w-full pl-10 pr-10 py-3 text-sm" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && <p className="text-xs mt-1.5" style={{ color: '#DC2626' }}>{loginForm.formState.errors.password.message}</p>}
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => { setResetEmail(loginForm.getValues('email') ?? ''); setMode('forgot'); }}
                    className="text-xs font-semibold transition-colors"
                    style={{ color: 'var(--primary)' }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-3 text-sm w-full mt-1 disabled:opacity-60">
                {loading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <><LogIn size={16} /> Sign In</>}
              </button>

              <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                No listing yet?{' '}
                <button type="button" onClick={() => setMode('register')} className="font-semibold transition-colors" style={{ color: 'var(--primary)' }}>Create one free</button>
              </p>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Username</label>
                  <input type="text" {...registerForm.register('name', { required: 'Username is required' })} className="input-base w-full px-3 py-3 text-sm" placeholder="jamesmwangi" />
                  {registerForm.formState.errors.name && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{registerForm.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Business Name</label>
                  <input type="text" {...registerForm.register('businessName', { required: 'Business name is required' })} className="input-base w-full px-3 py-3 text-sm" placeholder="Mwangi Furniture Works" />
                  {registerForm.formState.errors.businessName && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{registerForm.formState.errors.businessName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Email Address</label>
                <input type="email" {...registerForm.register('email', { required: 'Email is required' })} className="input-base w-full px-3 py-3 text-sm" placeholder="you@yourbusiness.co.ke" />
                {registerForm.formState.errors.email && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{registerForm.formState.errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} {...registerForm.register('password', { required: 'Password required', minLength: { value: 8, message: 'Minimum 8 characters' } })} className="input-base w-full px-3 pr-10 py-3 text-sm" placeholder="At least 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} aria-label="Toggle password">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{registerForm.formState.errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...registerForm.register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === registerForm.getValues('password') || 'Passwords do not match',
                  })}
                  className="input-base w-full px-3 py-3 text-sm"
                  placeholder="Repeat your password"
                />
                {registerForm.formState.errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{registerForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <div>
                <label className="flex items-start gap-2.5 text-sm cursor-pointer" style={{ color: 'var(--muted-foreground)' }}>
                  <input
                    type="checkbox"
                    {...registerForm.register('acceptTerms', { required: 'You must accept the Privacy Policy and Terms & Conditions' })}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>
                    {' '}and{' '}
                    <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: 'var(--primary)' }}>Terms &amp; Conditions</Link>
                  </span>
                </label>
                {registerForm.formState.errors.acceptTerms && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{registerForm.formState.errors.acceptTerms.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 py-3 text-sm w-full mt-1 disabled:opacity-60">
                {loading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <><UserPlus size={16} /> Create Listing</>}
              </button>

              <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Already have a listing?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-semibold transition-colors" style={{ color: 'var(--primary)' }}>Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}