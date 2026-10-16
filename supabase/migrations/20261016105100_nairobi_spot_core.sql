-- Nairobi Spot core schema: user_profiles, sellers, subscriptions, reports, admin_settings, notifications

-- 1. Types
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('admin', 'seller');

DROP TYPE IF EXISTS public.report_status CASCADE;
CREATE TYPE public.report_status AS ENUM ('open', 'reviewing', 'resolved', 'dismissed');

-- 2. Core tables
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role public.app_role NOT NULL DEFAULT 'seller'::public.app_role,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.sellers (
    id TEXT PRIMARY KEY,
    numeric_id INTEGER NOT NULL UNIQUE,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    business_name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active',
    hidden BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT false,
    tier TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    tier TEXT NOT NULL DEFAULT 'standard',
    start_date DATE,
    end_date DATE,
    duration_days INTEGER DEFAULT 30,
    set_by_admin BOOLEAN DEFAULT false,
    expiry_notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
    seller_name TEXT DEFAULT '',
    reporter_phone TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    message TEXT NOT NULL,
    proof_url TEXT,
    proof_name TEXT,
    status public.report_status NOT NULL DEFAULT 'open'::public.report_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
    channel TEXT NOT NULL DEFAULT 'whatsapp',
    to_number TEXT,
    body TEXT,
    status TEXT NOT NULL DEFAULT 'queued',
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_sellers_owner_id ON public.sellers(owner_id);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON public.sellers(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_seller_id ON public.subscriptions(seller_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON public.subscriptions(end_date);
CREATE INDEX IF NOT EXISTS idx_reports_seller_id ON public.reports(seller_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_notification_log_seller_id ON public.notification_log(seller_id);

-- 4. Functions (before policies)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $func$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (au.raw_user_meta_data->>'role' = 'admin'
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$func$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'seller')::public.app_role
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$func$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

-- 6. Policies
-- user_profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles" ON public.user_profiles
FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_user_profiles" ON public.user_profiles;
CREATE POLICY "admin_full_access_user_profiles" ON public.user_profiles
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- sellers: public read, owner or admin write
DROP POLICY IF EXISTS "public_can_read_sellers" ON public.sellers;
CREATE POLICY "public_can_read_sellers" ON public.sellers
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "owners_insert_sellers" ON public.sellers;
CREATE POLICY "owners_insert_sellers" ON public.sellers
FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() OR public.is_admin_from_auth());

DROP POLICY IF EXISTS "owners_update_sellers" ON public.sellers;
CREATE POLICY "owners_update_sellers" ON public.sellers
FOR UPDATE TO authenticated
USING (owner_id = auth.uid() OR public.is_admin_from_auth())
WITH CHECK (owner_id = auth.uid() OR public.is_admin_from_auth());

DROP POLICY IF EXISTS "admin_delete_sellers" ON public.sellers;
CREATE POLICY "admin_delete_sellers" ON public.sellers
FOR DELETE TO authenticated USING (public.is_admin_from_auth());

-- Views counter: allow anyone to bump views via RPC instead of open update
-- subscriptions: admin full, seller read own via function-free subquery on sellers is avoided
DROP POLICY IF EXISTS "admin_full_access_subscriptions" ON public.subscriptions;
CREATE POLICY "admin_full_access_subscriptions" ON public.subscriptions
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

DROP POLICY IF EXISTS "public_can_read_subscriptions" ON public.subscriptions;
CREATE POLICY "public_can_read_subscriptions" ON public.subscriptions
FOR SELECT TO public USING (true);

-- reports: anyone can submit, only admin can read/manage
DROP POLICY IF EXISTS "anyone_can_submit_reports" ON public.reports;
CREATE POLICY "anyone_can_submit_reports" ON public.reports
FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_reports" ON public.reports;
CREATE POLICY "admin_read_reports" ON public.reports
FOR SELECT TO authenticated USING (public.is_admin_from_auth());

DROP POLICY IF EXISTS "admin_update_reports" ON public.reports;
CREATE POLICY "admin_update_reports" ON public.reports
FOR UPDATE TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

DROP POLICY IF EXISTS "admin_delete_reports" ON public.reports;
CREATE POLICY "admin_delete_reports" ON public.reports
FOR DELETE TO authenticated USING (public.is_admin_from_auth());

-- admin_settings: public read, admin write
DROP POLICY IF EXISTS "public_can_read_admin_settings" ON public.admin_settings;
CREATE POLICY "public_can_read_admin_settings" ON public.admin_settings
FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_write_admin_settings" ON public.admin_settings;
CREATE POLICY "admin_write_admin_settings" ON public.admin_settings
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- notification_log: admin only
DROP POLICY IF EXISTS "admin_full_access_notification_log" ON public.notification_log;
CREATE POLICY "admin_full_access_notification_log" ON public.notification_log
FOR ALL TO authenticated USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- 7. Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS trg_sellers_touch ON public.sellers;
CREATE TRIGGER trg_sellers_touch BEFORE UPDATE ON public.sellers
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_admin_settings_touch ON public.admin_settings;
CREATE TRIGGER trg_admin_settings_touch BEFORE UPDATE ON public.admin_settings
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 8. Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-media', 'listing-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('report-proofs', 'report-proofs', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_listing_media" ON storage.objects;
CREATE POLICY "public_read_listing_media" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'listing-media');

DROP POLICY IF EXISTS "auth_upload_listing_media" ON storage.objects;
CREATE POLICY "auth_upload_listing_media" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'listing-media');

DROP POLICY IF EXISTS "auth_update_listing_media" ON storage.objects;
CREATE POLICY "auth_update_listing_media" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'listing-media') WITH CHECK (bucket_id = 'listing-media');

DROP POLICY IF EXISTS "auth_delete_listing_media" ON storage.objects;
CREATE POLICY "auth_delete_listing_media" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'listing-media');

DROP POLICY IF EXISTS "anyone_upload_report_proofs" ON storage.objects;
CREATE POLICY "anyone_upload_report_proofs" ON storage.objects
FOR INSERT TO public WITH CHECK (bucket_id = 'report-proofs');

DROP POLICY IF EXISTS "admin_read_report_proofs" ON storage.objects;
CREATE POLICY "admin_read_report_proofs" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'report-proofs' AND public.is_admin_from_auth());

-- 9. Default admin settings (WhatsApp sender name, message template, number)
INSERT INTO public.admin_settings (key, value)
VALUES (
    'whatsapp_notifications',
    jsonb_build_object(
        'enabled', false,
        'senderName', 'Nairobi Spot',
        'adminNumber', '',
        'messageTemplate', 'Hello {{seller_name}}, this is Nairobi Spot. Your {{tier}} subscription for {{business_name}} has expired. Please renew to keep your listing visible.'
    )
)
ON CONFLICT (key) DO NOTHING;

-- 10. Admin account (auth user + profile created by trigger)
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@nairobispot.co.ke') THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
            created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at, email_change_token_new, email_change,
            email_change_sent_at, email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at, phone, phone_change,
            phone_change_token, phone_change_sent_at
        ) VALUES (
            admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
            'admin@nairobispot.co.ke', crypt('Admin@Nairobi2026', gen_salt('bf', 10)), now(), now(), now(),
            jsonb_build_object('full_name', 'Nairobi Spot Admin', 'role', 'admin'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[], 'role', 'admin'),
            false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Admin seed skipped: %', SQLERRM;
END $$;
