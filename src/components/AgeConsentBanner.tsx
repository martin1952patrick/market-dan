'use client';
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'age_consent_v1';

export default function AgeConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored) return;

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (/bot|crawl|spider|slurp|googlebot|bingbot|lighthouse|facebookexternalhit/i.test(ua)) return;

    const timer = window.setTimeout(() => setVisible(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  const save = (value: 'accepted' | 'rejected') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
    setVisible(false);
    if (value === 'rejected') {
      window.location.href = 'https://www.google.com';
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="false"
      aria-labelledby="age-consent-title"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border shadow-2xl p-4 sm:p-5"
        style={{ backgroundColor: 'var(--card, #ffffff)', borderColor: 'var(--border, #e5e7eb)' }}
      >
        <h2 id="age-consent-title" className="text-base font-bold mb-1.5" style={{ color: '#DC2626' }}>
          Adults Only (18+)
        </h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--foreground, #1c1410)' }}>
          This site is for people over 18 years old who are of legal consent age, understand what they do, and are
          responsible for the agreements they make with other people, and who have the legal right to make their own decisions.
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => save('rejected')}
            className="px-5 py-2.5 rounded-lg text-sm font-bold border"
            style={{ borderColor: 'var(--border, #e5e7eb)', color: 'var(--foreground, #1c1410)', backgroundColor: 'transparent' }}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => save('accepted')}
            className="px-5 py-2.5 rounded-lg text-sm font-bold"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
