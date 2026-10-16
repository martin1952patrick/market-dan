'use client';
import React, { useState, useRef } from 'react';
import { X, Upload, Send, Paperclip, CheckCircle } from 'lucide-react';
import { dbService } from '@/lib/services/dbService';

interface Props {
  sellerId: string;
  sellerName: string;
  onClose: () => void;
}

const MAX_PROOF_MB = 10;

export default function ReportListingModal({ sellerId, sellerName, onClose }: Props) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_PROOF_MB * 1024 * 1024) {
      setError(`Proof file must be under ${MAX_PROOF_MB}MB`);
      e.target.value = '';
      return;
    }
    setError('');
    setProof(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your phone number, email and message.');
      return;
    }
    setSubmitting(true);
    const res = await dbService.submitReport({
      sellerId,
      sellerName,
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      proofFile: proof,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not submit your report. Please try again.');
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
      aria-label="Report listing"
    >
      <div
        className="w-full max-w-md rounded-2xl border p-6 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Report this listing</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {sellerName} — our team will follow up using your contact details.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close report form" style={{ color: 'var(--muted-foreground)' }}>
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center text-center py-6 gap-3">
            <CheckCircle size={44} style={{ color: '#16A34A' }} />
            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Report submitted</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Thank you. Nairobi Spot will review your complaint and follow up.
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
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Your phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="input-base w-full px-3 py-2.5 text-sm"
                required
              />
            </div>
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
                rows={4}
                placeholder="Describe your complaint…"
                className="input-base w-full px-3 py-2.5 text-sm resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                Proof (screenshot, photo or document)
              </label>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 border-dashed text-sm font-medium"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
              >
                {proof ? <><Paperclip size={15} /> {proof.name}</> : <><Upload size={15} /> Upload proof file</>}
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center justify-center gap-2 py-3 text-sm w-full disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : <><Send size={15} /> Submit report</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
