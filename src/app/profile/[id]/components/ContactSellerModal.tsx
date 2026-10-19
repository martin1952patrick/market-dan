'use client';
import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { dbService } from '@/lib/services/dbService';

interface Props {
  sellerId: string;
  sellerName: string;
  onClose: () => void;
}

export default function ContactSellerModal({ sellerId, sellerName, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !message.trim()) {
      setError('Please enter your email and a message.');
      return;
    }
    setSubmitting(true);
    const res = await dbService.sendSellerMessage({
      sellerId,
      senderEmail: email.trim(),
      message: message.trim(),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not send your message. Please try again.');
      return;
    }
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(28,20,16,0.7)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Contact seller"
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Contact this seller</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Your message goes straight to {sellerName}&apos;s dashboard.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close contact form" style={{ color: 'var(--muted-foreground)' }}>
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center text-center py-6 gap-3">
            <CheckCircle size={44} style={{ color: '#16A34A' }} />
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Message sent</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              The seller will see your message and can reply to your email.
            </p>
            <button onClick={onClose} className="btn-primary px-5 py-2.5 text-sm mt-2">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg p-3 text-sm font-medium" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Your email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-base w-full px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Write your message to the seller…"
                className="input-base w-full px-3 py-2.5 text-sm resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center justify-center gap-2 py-3 text-sm w-full disabled:opacity-60"
            >
              {submitting ? 'Sending…' : <><Send size={15} /> Send message</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
