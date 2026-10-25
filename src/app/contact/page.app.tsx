'use client';
import React, { useState } from 'react';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Contact Us</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted-foreground)' }}>We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                <Mail size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Email</p>
                <a href="mailto:hello@nairobispot.com" className="text-sm" style={{ color: 'var(--primary)' }}>hello@nairobispot.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                <Phone size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Phone</p>
                <a href="tel:+254700000000" className="text-sm" style={{ color: 'var(--primary)' }}>+254 700 000 000</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
                <MapPin size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Location</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <CheckCircle size={40} className="mb-4" style={{ color: '#16A34A' }} />
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Message Sent!</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-base w-full px-3 py-2.5 text-sm"
                    placeholder="James Mwangi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-base w-full px-3 py-2.5 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-base w-full px-3 py-2.5 text-sm resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button type="submit" className="btn-primary px-6 py-2.5 text-sm flex items-center justify-center gap-2">
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
