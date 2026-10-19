'use client';
import React, { useEffect, useState } from 'react';
import { MessageCircle, Check, Send } from 'lucide-react';
import { toast } from 'sonner';
import { dbService, DEFAULT_WHATSAPP_SETTINGS, WhatsAppSettings } from '@/lib/services/dbService';

export default function AdminWhatsAppSettings() {
  const [settings, setSettings] = useState<WhatsAppSettings>(DEFAULT_WHATSAPP_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    dbService.fetchSetting<WhatsAppSettings>('whatsapp_notifications').then((s) => {
      if (cancelled) return;
      if (s) setSettings({ ...DEFAULT_WHATSAPP_SETTINGS, ...s });
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, []);

  const update = <K extends keyof WhatsAppSettings>(key: K, value: WhatsAppSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const err = await dbService.saveSetting('whatsapp_notifications', settings);
    setSaving(false);
    if (err) {
      toast.error('Could not save WhatsApp settings', { description: err });
      return;
    }
    toast.success('WhatsApp notification settings saved');
  };

  const preview = settings.messageTemplate
    .replace(/{{seller_name}}/g, 'James')
    .replace(/{{business_name}}/g, 'Mwangi Furniture Works')
    .replace(/{{tier}}/g, 'Premium');

  return (
    <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(37,211,102,0.15)', color: '#16A34A' }}>
          <MessageCircle size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>WhatsApp Subscription Notifications</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Edit the sender name, message and number used when a seller&apos;s subscription ends.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          <input type="checkbox" checked={settings.enabled} onChange={(e) => update('enabled', e.target.checked)} />
          Send automatic WhatsApp message when a subscription expires
        </label>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Sender / business name</label>
          <input
            type="text"
            value={settings.senderName}
            onChange={(e) => update('senderName', e.target.value)}
            placeholder="Nairobi Spot"
            className="input-base w-full px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>WhatsApp sender number</label>
          <input
            type="tel"
            value={settings.adminNumber}
            onChange={(e) => update('adminNumber', e.target.value)}
            placeholder="+2547XXXXXXXX"
            className="input-base w-full px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>Message sellers receive</label>
          <textarea
            value={settings.messageTemplate}
            onChange={(e) => update('messageTemplate', e.target.value)}
            rows={4}
            className="input-base w-full px-3 py-2.5 text-sm resize-none"
          />
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Placeholders: {'{{seller_name}}'}, {'{{business_name}}'}, {'{{tier}}'}
          </p>
        </div>

        <div className="rounded-lg p-3 text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
          <p className="font-semibold mb-1">Preview — from {settings.senderName || 'Nairobi Spot'}</p>
          <p>{preview}</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!loaded || saving}
          className="btn-primary px-5 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 self-start"
        >
          {saving ? 'Saving…' : <><Check size={15} /> Save WhatsApp settings</>}
        </button>
      </div>
    </div>
  );
}
