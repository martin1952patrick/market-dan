'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Save, MapPin, X } from 'lucide-react';
import { useAppStore } from '@/lib/AppContext';
import type { NearbyPlace } from '@/lib/mockData';
import { Toaster, toast } from 'sonner';

export default function AdminNearbyPlaces() {
  const { locations, siteSettings, addNearbyPlace, updateNearbyPlace, deleteNearbyPlace } = useAppStore();
  const nearbyPlaces = siteSettings.nearbyPlaces ?? [];

  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id ?? '');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const filteredPlaces = nearbyPlaces.filter((p) => p.locationId === selectedLocationId);
  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const place: NearbyPlace = {
      id: `np-${Date.now()}`,
      name: newName.trim(),
      locationId: selectedLocationId,
      description: newDesc.trim() || undefined,
    };
    addNearbyPlace(place);
    setNewName('');
    setNewDesc('');
    toast.success(`"${place.name}" added as a nearby place for ${selectedLocation?.name}`);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateNearbyPlace(id, { name: editName.trim(), description: editDesc.trim() || undefined });
    setEditingId(null);
    toast.success('Nearby place updated');
  };

  const handleDelete = (id: string, name: string) => {
    deleteNearbyPlace(id);
    toast.success(`"${name}" removed`);
  };

  const startEdit = (place: NearbyPlace) => {
    setEditingId(place.id);
    setEditName(place.name);
    setEditDesc(place.description ?? '');
  };

  return (
    <div className="max-w-2xl">
      <Toaster position="bottom-right" richColors />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Nearby Places</h2>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Manage nearby places shown at the bottom of each location page. Select a location to edit its nearby places.
        </p>
      </div>

      {/* Location selector */}
      <div className="mb-5">
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Select Location</label>
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="input-base w-full pl-9 pr-4 py-2.5 text-sm appearance-none"
          >
            {locations.map((loc) => (
              <option key={`np-loc-${loc.id}`} value={loc.id}>{loc.name} ({loc.area})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add new */}
      <div className="rounded-xl border p-4 mb-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--foreground)' }}>
          Add Nearby Place for <span style={{ color: 'var(--primary)' }}>{selectedLocation?.name}</span>
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Place name e.g. Dagoretti Corner"
            className="input-base flex-1 px-3 py-2.5 text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Short description (optional)"
            className="input-base flex-1 px-3 py-2.5 text-sm"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0 disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-10" style={{ color: 'var(--muted-foreground)' }}>
            <MapPin size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No nearby places for {selectedLocation?.name} yet.</p>
            <p className="text-xs mt-1">Add some above.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Place Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'var(--card)' }}>
              {filteredPlaces.map((place, i) => (
                <tr key={`np-row-${place.id}`} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 1 ? 'rgba(237,232,225,0.3)' : undefined }}>
                  <td className="px-4 py-3">
                    {editingId === place.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-base px-2 py-1.5 text-sm w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{place.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === place.id ? (
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="input-base px-2 py-1.5 text-sm w-full"
                        placeholder="Description (optional)"
                      />
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{place.description ?? '—'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {editingId === place.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(place.id)}
                            className="p-1.5 rounded-lg"
                            style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
                            title="Save"
                            aria-label="Save edit"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg"
                            style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                            title="Cancel"
                            aria-label="Cancel edit"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(place)}
                            className="p-1.5 rounded-lg text-xs font-semibold px-2.5"
                            style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(place.id, place.name)}
                            className="p-1.5 rounded-lg"
                            style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                            title="Delete"
                            aria-label="Delete nearby place"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
