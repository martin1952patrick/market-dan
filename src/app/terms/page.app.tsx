'use client';
import React from 'react';
import PublicTopbar from '@/components/PublicTopbar';
import PublicFooter from '@/components/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <PublicTopbar />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Terms &amp; Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--muted-foreground)' }}>Last updated: September 2026</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Terms of Service</h2>
          <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            <p>Welcome to Nairobi Spot. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>1. Use of the Platform</h3>
            <p>Nairobi Spot is a marketplace that connects furniture buyers with local sellers in Kenya. You may use the platform to browse listings, contact sellers, and list your furniture business. You agree not to misuse the platform or use it for any unlawful purpose.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>2. Seller Listings</h3>
            <p>Sellers are responsible for the accuracy of their listings. Nairobi Spot does not verify the quality, safety, or legality of items listed. All transactions are between buyers and sellers directly.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>3. Subscriptions &amp; Payments</h3>
            <p>Seller subscriptions are billed monthly at KES 1,500. Payments are processed via M-Pesa. Subscriptions auto-renew unless cancelled before the renewal date. Refunds are not provided for partial months.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>4. Prohibited Content</h3>
            <p>You may not post false, misleading, or fraudulent listings. Nairobi Spot reserves the right to remove any listing or suspend any account that violates these terms.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>5. Limitation of Liability</h3>
            <p>Nairobi Spot is not liable for any damages arising from the use of the platform, including disputes between buyers and sellers. Use the platform at your own risk.</p>
          </div>
        </section>

        <div className="border-t my-10" style={{ borderColor: 'var(--border)' }} />

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Privacy Policy</h2>
          <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            <p>Your privacy is important to us. This policy explains how Nairobi Spot collects, uses, and protects your personal information.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>1. Information We Collect</h3>
            <p>We collect information you provide when registering or creating a listing, including your name, email address, phone number, and business details. We also collect usage data such as pages visited and search queries.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>2. How We Use Your Information</h3>
            <p>We use your information to operate the platform, display your listing to potential buyers, process payments, and send you important account notifications. We do not sell your personal data to third parties.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>3. Data Security</h3>
            <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong password and keep your login credentials confidential.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>4. Cookies</h3>
            <p>Nairobi Spot uses cookies to improve your browsing experience and analyse site traffic. You can disable cookies in your browser settings, though this may affect some functionality.</p>
            <h3 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>5. Contact Us</h3>
            <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:privacy@nairobispot.com" className="underline" style={{ color: 'var(--primary)' }}>privacy@nairobispot.com</a>.</p>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
