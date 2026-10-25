-- Seller messages: visitor "Contact this seller" messages delivered to the seller dashboard

CREATE TABLE IF NOT EXISTS public.seller_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seller_messages_seller_id ON public.seller_messages(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_messages_created_at ON public.seller_messages(created_at DESC);

-- Helper: does the current user own the given seller listing? (SECURITY DEFINER avoids RLS recursion on sellers)
CREATE OR REPLACE FUNCTION public.owns_seller(target_seller_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.sellers s
    WHERE s.id = target_seller_id
    AND (
        s.owner_id = auth.uid()
        OR lower(s.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
    )
)
$$;

ALTER TABLE public.seller_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_can_send_seller_messages" ON public.seller_messages;
CREATE POLICY "anyone_can_send_seller_messages" ON public.seller_messages
FOR INSERT TO public WITH CHECK (
    char_length(message) > 0 AND char_length(sender_email) > 3
);

DROP POLICY IF EXISTS "sellers_read_own_messages" ON public.seller_messages;
CREATE POLICY "sellers_read_own_messages" ON public.seller_messages
FOR SELECT TO authenticated USING (public.owns_seller(seller_id) OR public.is_admin_from_auth());

DROP POLICY IF EXISTS "sellers_update_own_messages" ON public.seller_messages;
CREATE POLICY "sellers_update_own_messages" ON public.seller_messages
FOR UPDATE TO authenticated
USING (public.owns_seller(seller_id) OR public.is_admin_from_auth())
WITH CHECK (public.owns_seller(seller_id) OR public.is_admin_from_auth());

DROP POLICY IF EXISTS "sellers_delete_own_messages" ON public.seller_messages;
CREATE POLICY "sellers_delete_own_messages" ON public.seller_messages
FOR DELETE TO authenticated USING (public.owns_seller(seller_id) OR public.is_admin_from_auth());
