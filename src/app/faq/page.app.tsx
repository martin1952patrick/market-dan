'use client';
import React from 'react';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';

const FAQS = [
  {
    q: 'How do I list my furniture business on Nairobi Spot?',
    a: 'Click "List Your Business" in the top navigation, create an account, and fill in your business details including photos, location, and furniture categories. Your listing goes live immediately after saving.',
  },
  {
    q: 'How much does it cost to list my business?',
    a: 'A seller subscription costs KES 1,500 per month, paid via M-Pesa. You can renew anytime from your dashboard.',
  },
  {
    q: 'What types of furniture can I list?',
    a: 'You can list any type of furniture including sofas, beds, dining tables, wardrobes, office furniture, shelves, outdoor furniture, and more. Select the relevant categories when setting up your profile.',
  },
  {
    q: 'How do buyers contact me?',
    a: 'Your phone number and contact details are displayed on your public listing. Buyers can call or message you directly.',
  },
  {
    q: 'Can I upload photos and videos of my furniture?',
    a: 'Yes! You can upload up to 3 photos and 1 video from your dashboard under "Media & Photos". Need more? Contact support and we can raise your limit to 6 photos and 2 videos.',
  },
  {
    q: 'How do I update my listing information?',
    a: 'Log in to your seller dashboard and click "Edit Profile". Changes are reflected on your public listing immediately after saving.',
  },
  {
    q: 'What areas does Nairobi Spot cover?',
    a: 'Nairobi Spot currently covers Nairobi, Kiambu, and Kajiado counties, with plans to expand to more counties across Kenya.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel your subscription from your dashboard settings. Your listing will remain active until the end of the current billing period.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Frequently Asked Questions</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted-foreground)' }}>Everything you need to know about Nairobi Spot.</p>

        <div className="flex flex-col gap-6">
          {FAQS?.map((faq, i) => (
            <div key={`faq-${i}`} className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--foreground)' }}>{faq?.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{faq?.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Still have questions?</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>Our team is happy to help. Reach out to us directly.</p>
          <a
            href="/contact"
            className="btn-primary px-6 py-2.5 text-sm inline-block"
          >
            Contact Us
          </a>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
