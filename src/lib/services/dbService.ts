'use client';

import { createClient } from '@/lib/supabase/client';
import { ClientProfile, SiteSettings } from '@/lib/mockData';

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  return false;
}

export interface WhatsAppSettings {
  enabled: boolean;
  senderName: string;
  adminNumber: string;
  messageTemplate: string;
}

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  enabled: false,
  senderName: 'Nairobi Spot',
  adminNumber: '',
  messageTemplate:
    'Hello {{seller_name}}, this is Nairobi Spot. Your {{tier}} subscription for {{business_name}} has expired. Please renew to keep your listing visible.',
};

export interface ReportInput {
  sellerId: string;
  sellerName: string;
  phone: string;
  email: string;
  message: string;
  proofFile?: File | null;
}

// DB row <-> ClientProfile (full profile stored in `data` JSONB, key columns mirrored for querying)
function rowToProfile(row: any): ClientProfile {
  const data = (row?.data ?? {}) as Partial<ClientProfile>;
  return {
    ...(data as ClientProfile),
    id: row.id,
    numericId: row.numeric_id,
    email: row.email,
    name: row.name ?? data.name ?? '',
    businessName: row.business_name ?? data.businessName ?? '',
    phone: row.phone ?? data.phone ?? '',
    status: (row.status ?? data.status ?? 'active') as ClientProfile['status'],
    hidden: row.hidden ?? false,
    featured: row.featured ?? false,
    verified: row.verified ?? false,
    tier: (row.tier ?? data.tier ?? null) as ClientProfile['tier'],
    views: row.views ?? data.views ?? 0,
    media: data.media ?? [],
  };
}

function profileToRow(p: ClientProfile, ownerId?: string | null) {
  // Never store plaintext passwords in the database - Supabase Auth holds credentials
  const { password: _omit, ...safeProfile } = p;
  return {
    id: p.id,
    numeric_id: p.numericId,
    ...(ownerId ? { owner_id: ownerId } : {}),
    email: p.email,
    name: p.name,
    business_name: p.businessName,
    phone: p.phone ?? '',
    data: { ...safeProfile, password: '' },
    status: p.status,
    hidden: !!p.hidden,
    featured: !!p.featured,
    verified: !!p.verified,
    tier: p.tier ?? null,
    views: p.views ?? 0,
  };
}

export const dbService = {
  async fetchSellers(): Promise<ClientProfile[] | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.from('sellers').select('*').order('numeric_id', { ascending: true });
      if (error) {
        if (isSchemaError(error)) throw error;
        console.log('fetchSellers error:', error.message);
        return null;
      }
      return (data ?? []).map(rowToProfile);
    } catch (e: any) {
      console.log('fetchSellers failed:', e?.message);
      return null;
    }
  },

  async upsertSeller(profile: ClientProfile): Promise<void> {
    const supabase = createClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('sellers')
        .upsert(profileToRow(profile, user?.id ?? null), { onConflict: 'id' });
      if (error) console.log('upsertSeller error:', error.message);
    } catch (e: any) {
      console.log('upsertSeller failed:', e?.message);
    }
  },

  async deleteSeller(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('sellers').delete().eq('id', id);
      if (error) console.log('deleteSeller error:', error.message);
    } catch (e: any) {
      console.log('deleteSeller failed:', e?.message);
    }
  },

  async upsertSubscription(profile: ClientProfile): Promise<void> {
    const pkg = profile.visibilityPackage;
    if (!pkg) return;
    const supabase = createClient();
    try {
      const { data: existing } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('seller_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      const payload = {
        seller_id: profile.id,
        tier: pkg.tier,
        start_date: pkg.startDate,
        end_date: pkg.endDate,
        duration_days: pkg.durationDays,
        set_by_admin: !!pkg.setByAdmin,
        expiry_notified_at: null as string | null,
      };
      const { error } = existing?.id
        ? await supabase.from('subscriptions').update(payload).eq('id', existing.id)
        : await supabase.from('subscriptions').insert(payload);
      if (error) console.log('upsertSubscription error:', error.message);
    } catch (e: any) {
      console.log('upsertSubscription failed:', e?.message);
    }
  },

  async fetchSetting<T>(key: string): Promise<T | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.from('admin_settings').select('value').eq('key', key).maybeSingle();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return (data?.value as T) ?? null;
    } catch (e: any) {
      console.log('fetchSetting failed:', e?.message);
      return null;
    }
  },

  async saveSetting(key: string, value: unknown): Promise<string | null> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('admin_settings').upsert({ key, value }, { onConflict: 'key' });
      return error ? error.message : null;
    } catch (e: any) {
      return e?.message ?? 'Failed to save setting';
    }
  },

  async fetchSiteSettings(): Promise<Partial<SiteSettings> | null> {
    return dbService.fetchSetting<Partial<SiteSettings>>('site_settings');
  },

  async saveSiteSettings(settings: SiteSettings): Promise<void> {
    const err = await dbService.saveSetting('site_settings', settings);
    if (err) console.log('saveSiteSettings error:', err);
  },

  async uploadListingMedia(file: File, sellerId: string): Promise<string | null> {
    const supabase = createClient();
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${sellerId}/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from('listing-media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (error) {
        console.log('uploadListingMedia error:', error.message);
        return null;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from('listing-media').getPublicUrl(path);
      return publicUrl;
    } catch (e: any) {
      console.log('uploadListingMedia failed:', e?.message);
      return null;
    }
  },

  async submitReport(input: ReportInput): Promise<{ ok: boolean; error?: string }> {
    const supabase = createClient();
    try {
      let proofPath: string | null = null;
      if (input.proofFile) {
        const safeName = input.proofFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        proofPath = `${input.sellerId}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from('report-proofs')
          .upload(proofPath, input.proofFile, { contentType: input.proofFile.type, upsert: false });
        if (upErr) return { ok: false, error: `Proof upload failed: ${upErr.message}` };
      }
      const { error } = await supabase.from('reports').insert({
        seller_id: input.sellerId,
        seller_name: input.sellerName,
        reporter_phone: input.phone,
        reporter_email: input.email,
        message: input.message,
        proof_url: proofPath,
        proof_name: input.proofFile?.name ?? null,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Failed to submit report' };
    }
  },

  async fetchReports(): Promise<any[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (error) {
        console.log('fetchReports error:', error.message);
        return [];
      }
      return data ?? [];
    } catch {
      return [];
    }
  },

  async updateReportStatus(id: string, status: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('reports').update({ status }).eq('id', id);
    if (error) console.log('updateReportStatus error:', error.message);
  },

  async getReportProofUrl(path: string): Promise<string | null> {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from('report-proofs').createSignedUrl(path, 3600);
    if (error) return null;
    return data?.signedUrl ?? null;
  },
};
