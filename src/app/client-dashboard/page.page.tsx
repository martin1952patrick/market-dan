import React from 'react';
import type { Metadata } from 'next';
import ClientDashboardClient from './components/ClientDashboardClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ClientDashboardPage() {
  return <ClientDashboardClient />;
}
