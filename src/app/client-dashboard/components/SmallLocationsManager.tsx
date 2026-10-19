'use client';
import React, { useState } from 'react';
import { MapPin, Plus, X, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ClientProfile } from '@/lib/mockData';
import { useAppStore } from '@/lib/AppContext';

interface Props {
  profile: ClientProfile;
}

export default function SmallLocationsManager({ profile }: Props) {
  const { updateClientProfile } = useAppStore();
  const [smallLocations, setSmallLocations] = useState<string[]>(profile.smallLocations ?? []);
  const [input, setInput] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const addLocation = () => {
    const value = input.trim().replace(/\s+/g, ' ');
    if (!value) return;
    if (smallLocations.some((s) => s.toLowerCase() === value.toLowerCase())) {
      toast.error(`"${value}" is already added`);
      return;
    }
    setSmallLocations((prev) => [...prev, value]);
    setInput('');
    setDirty(true);
    setSaved(false);
  };

  const removeLocation = (name: string) => {
    setSmallLocations((prev) => prev.filter((s) => s !== name));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    updateClientProfile(profile.id, { smallLocations });
    setDirty(false);
    setSaved(true);
    toast.success('Small locations saved', {
      description: 'They now appear on your public profile and in search.',
    });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Small Locations</h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Add the small areas, stages or estates you serve near <strong>{profile.location || 'your area'}</strong>.
        </p>
      </div>

      <div className="rounded-xl border p-4 sm:p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}>
            <MapPin size={15} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Add a small location</h3>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
          Buyers searching these places will find your profile. They are shown on your public profile under your main location as &quot;Also serving&quot;.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLocation();
              }
            }}
            className="input-base flex-1 px-3 py-2.5 text-sm"
            placeholder="e.g. 87 Junction"
            maxLength={60}
          />
          <button type="button" onClick={addLocation} className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5">
            <Plus size={15} /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 min-h-[2rem]">
          {smallLocations.map((loc) => (
            <span
              key={`sl-manager-${loc}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'rgba(194,105,42,0.1)', color: 'var(--primary)' }}
            >
              <MapPin size={11} />
              {loc}
              <button type="button" onClick={() => removeLocation(loc)} aria-label={`Remove ${loc}`} className="hover:opacity-70">
                <X size={12} />
              </button>
            </span>
          ))}
          {smallLocations.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>No small locations added yet.</p>
          )}
        </div>

        {dirty && (
          <p className="text-xs mt-3 font-medium" style={{ color: '#D97706' }}>● Unsaved changes — click Save Small Locations</p>
        )}

        <div className="mt-5 pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saved ? <CheckCircle size={15} /> : <Save size={15} />}
            {saved ? 'Saved' : 'Save Small Locations'}
          </button>
        </div>
      </div>
    </div>
  );
}
