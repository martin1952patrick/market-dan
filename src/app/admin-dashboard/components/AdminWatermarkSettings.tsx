'use client';
import React, { useEffect, useState } from 'react';
import { Droplets, Check } from 'lucide-react';
import { toast } from 'sonner';
import { dbService } from '@/lib/services/dbService';
import {
  DEFAULT_WATERMARK_SETTINGS,
  WATERMARK_POSITIONS,
  WATERMARK_SETTINGS_KEY,
  WATERMARK_TEXT,
  WatermarkPosition,
  WatermarkSettings,
  normalizeWatermarkSettings,
  positionToFlex,
  setCachedWatermarkSettings,
} from '@/lib/watermark';

const PREVIEW_IMAGE =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=70';

export default function AdminWatermarkSettings() {
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_WATERMARK_SETTINGS);
  const [saved, setSaved] = useState<WatermarkSettings>(DEFAULT_WATERMARK_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    dbService.fetchSetting<Partial<WatermarkSettings>>(WATERMARK_SETTINGS_KEY).then((s) => {
      if (cancelled) return;
      const n = normalizeWatermarkSettings(s);
      setSettings(n);
      setSaved(n);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasChanges = settings.opacity !== saved.opacity || settings.position !== saved.position;
  const flex = positionToFlex(settings.position);

  const handleSave = async () => {
    setSaving(true);
    const err = await dbService.saveSetting(WATERMARK_SETTINGS_KEY, settings);
    setSaving(false);
    if (err) {
      toast.error('Could not save watermark settings', { description: err });
      return;
    }
    setSaved(settings);
    setCachedWatermarkSettings(settings);
    toast.success('Watermark settings saved');
  };

  return (
    <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(14,165,233,0.12)', color: '#0284C7' }}>
          <Droplets size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Watermark Settings</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Preview the &quot;{WATERMARK_TEXT}&quot; watermark and adjust its opacity and position on listing photos.
          </p>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-lg mb-4"
        style={{ aspectRatio: '16 / 9', backgroundColor: 'var(--muted)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PREVIEW_IMAGE} alt="Sample furniture photo used to preview the watermark" className="absolute inset-0 w-full h-full object-cover" />
        <div className="pointer-events-none select-none absolute inset-0 flex p-[4%]" style={flex} aria-hidden="true">
          <span
            className="font-bold whitespace-nowrap text-2xl sm:text-3xl"
            style={{
              color: `rgba(255,255,255,${settings.opacity})`,
              textShadow: '0 1px 4px rgba(0,0,0,0.55)',
              fontFamily: 'sans-serif',
              transform: 'rotate(-10deg)',
            }}
          >
            {WATERMARK_TEXT}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="flex items-center justify-between text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
            <span>Opacity</span>
            <span style={{ color: 'var(--muted-foreground)' }}>{Math.round(settings.opacity * 100)}%</span>
          </label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={Math.round(settings.opacity * 100)}
            onChange={(e) => setSettings((p) => ({ ...p, opacity: Number(e.target.value) / 100 }))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Position</label>
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            {WATERMARK_POSITIONS.map((p) => {
              const active = settings.position === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, position: p.value as WatermarkPosition }))}
                  className="px-2 py-2 rounded-lg text-xs font-medium border transition-all"
                  style={
                    active
                      ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--primary-foreground)' }
                      : { backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }
                  }
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Applies to all photos shown on the site and to newly uploaded photos. Photos uploaded earlier keep the watermark baked into the file.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!loaded || saving || !hasChanges}
          className="btn-primary px-5 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 self-start"
        >
          {saving ? 'Saving…' : <><Check size={15} /> Save watermark settings</>}
        </button>
      </div>
    </div>
  );
}
