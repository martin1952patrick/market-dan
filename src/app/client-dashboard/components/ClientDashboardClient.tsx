'use client';
import React, { useState } from 'react';
import ClientAuthGate from './ClientAuthGate';
import ClientMainDashboard from './ClientMainDashboard';

export default function ClientDashboardClient() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  if (!authenticated) {
    return <ClientAuthGate onAuth={(email) => { setAuthenticated(true); setCurrentUser(email); }} />;
  }

  return <ClientMainDashboard userEmail={currentUser} onLogout={() => setAuthenticated(false)} />;
}