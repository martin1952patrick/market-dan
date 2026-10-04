'use client';
import React, { useState } from 'react';
import AdminAuthGate from './AdminAuthGate';
import AdminMainPanel from './AdminMainPanel';

export default function AdminDashboardClient() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AdminAuthGate onAuth={() => setAuthenticated(true)} />;
  }

  return <AdminMainPanel onLogout={() => setAuthenticated(false)} />;
}