'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MapPin, Check, X, AlertCircle } from 'lucide-react';
import { MicroLocation } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';
import { Toaster, toast } from 'sonner';

export default function AdminMicroLocations() {
  const { siteSettings, addMicroLocation, updateMicroLocation, deleteMicroLocation } = useAppStore();
  const microLocations = siteSettings?.microLocations ?? [];

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const loc: MicroLocation = {
      id: `ml-${newName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || undefined,
    };
    addMicroLocation(loc);
    toast.success(`${loc.name} added to micro locations`);
    setNewName('');
    setNewDesc('');
    setShowAdd(false);
  };

  const startEdit = (loc: MicroLocation) => {
    setEditingId(loc.id);
    setEditName(loc.name);
    setEditDesc(loc.description ?? '');
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateMicroLocation(id, { name: editName.trim(), description: editDesc.trim() || undefined });
    toast.success('Micro location updated');
    setEditingId(null);
  };

  const confirmDelete = (id: string) => setDeleteTarget(id);

  const executeDelete = () => {
    if (!deleteTarget) return;
    const loc = microLocations.find((l) => l.id === deleteTarget);
    deleteMicroLocation(deleteTarget);
    toast.success(`${loc?.name ?? 'Location'} removed`);
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-2xl">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Micro Locations</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Small serving areas shown on the homepage after Popular and Nearby sections — e.g. Uthiru, Kabete, Muguga.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-3" style={{ backgroundColor: 'rgba(194,105,42,0.08)', border: '1px solid rgba(194,105,42,0.2)' }}>
        <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--foreground)' }}>Where these appear</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            These micro locations are displayed on the homepage in a dedicated "We Also Serve" section, appearing after the Popular and Nearby locations rows. Visitors can click them to filter listings.
          </p>
        </div>
      </div>

      {/* Add button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          {microLocations.length} micro location{microLocations.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
        >
          <Plus size={15} /> Add Micro Location
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border p-5 mb-5" style={{ backgroundColor: 'rgba(194,105,42,0.05)', borderColor: 'rgba(194,105,42,0.3)' }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--foreground)' }}>Add New Micro Location</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Location Name *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-base w-full px-3 py-2 text-sm"
                placeholder="e.g. Uthiru"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Description (optional)</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="input-base w-full px-3 py-2 text-sm"
                placeholder="e.g. Small area along Waiyaki Way"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check size={14} /> Save Location
            </button>
            <button onClick={() => { setShowAdd(false); setNewName(''); setNewDesc(''); }} className="btn-secondary px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {microLocations.length === 0 ? (
        <div className="rounded-xl border p-10 text-center" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
          <MapPin size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
          <p className="font-semibold text-sm mb-1" style={{ color: 'var(--foreground)' }}>No micro locations yet</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Add small serving areas like Uthiru, Kabete, Muguga to show visitors you cover those areas too.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider grid grid-cols-12 gap-3" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            <span className="col-span-4">Name</span>
            <span className="col-span-5">Description</span>
            <span className="col-span-3 text-right">Actions</span>
          </div>
          {microLocations.map((loc, i) => (
            <div
              key={`ml-row-${loc.id}`}
              className="border-t px-4 py-3.5 grid grid-cols-12 gap-3 items-center transition-colors hover:bg-muted/40"
              style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 1 ? 'rgba(237,232,225,0.25)' : 'var(--card)' }}
            >
              {editingId === loc.id ? (
                <>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input-base w-full px-2 py-1.5 text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="input-base w-full px-2 py-1.5 text-sm"
                      placeholder="Description (optional)"
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button onClick={() => saveEdit(loc.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                      <X size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-4 flex items-center gap-2">
                    <MapPin size={14} style={{ color: 'var(--primary)' }} className="flex-shrink-0" />
                    <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{loc.name}</span>
                  </div>
                  <div className="col-span-5">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{loc.description || '—'}</span>
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button onClick={() => startEdit(loc)} className="p-1.5 rounded-lg" style={{ color: 'var(--muted-foreground)', backgroundColor: 'var(--muted)' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => confirmDelete(loc.id)} className="p-1.5 rounded-lg" style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(28,20,16,0.6)' }}>
          <div className="rounded-2xl border p-6 max-w-sm w-full shadow-modal" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Remove micro location?</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <strong>{microLocations.find((l) => l.id === deleteTarget)?.name}</strong> will be removed from the homepage. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-2.5 text-sm font-semibold rounded-lg" style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
