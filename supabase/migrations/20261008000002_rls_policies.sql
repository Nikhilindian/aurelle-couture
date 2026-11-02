-- ========================================================================
-- AURELLE LUXURY STORE — PHASE 7 DATABASE FOUNDATION
-- Migration 02: Row Level Security (RLS Default-Deny) & Role Hardening
-- ========================================================================

-- 1. Enable RLS on every table (Default-Deny)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Helper Security Function: Check if caller is verified admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 3. Security Trigger: Prevent customer from self-promoting to 'admin' role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Allow change ONLY if caller is already a verified admin OR running as service_role
    IF current_user = 'service_role' OR public.is_admin() THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'Unauthorized: Customers cannot escalate or modify user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trigger_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- ========================================================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================================================

-- A. PROFILES
-- Customer can read own profile; Admin can read all
CREATE POLICY "profiles_select_owner_or_admin" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Customer can update own display_name / phone
CREATE POLICY "profiles_update_owner" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- B. ADDRESSES
-- Customer can CRUD only their own addresses
CREATE POLICY "addresses_select_owner_or_admin" ON public.addresses
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "addresses_insert_owner" ON public.addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "addresses_update_owner" ON public.addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "addresses_delete_owner" ON public.addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- C. CATALOG READ ACCESS (Collections, Products, Media, Variants)
-- Public can view active catalog items; Admins view all
CREATE POLICY "collections_public_select" ON public.collections
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "products_public_select" ON public.products
  FOR SELECT
  USING (status = 'active' OR public.is_admin());

CREATE POLICY "product_media_public_select" ON public.product_media
  FOR SELECT
  USING (true);

CREATE POLICY "variants_public_select" ON public.variants
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "collection_products_public_select" ON public.collection_products
  FOR SELECT
  USING (true);

-- CATALOG ADMIN MUTATIONS
CREATE POLICY "collections_admin_all" ON public.collections
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_all" ON public.products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "product_media_admin_all" ON public.product_media
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "variants_admin_all" ON public.variants
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "collection_products_admin_all" ON public.collection_products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- D. CARTS & CART ITEMS
CREATE POLICY "carts_select_owner_or_admin" ON public.carts
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "carts_insert_owner" ON public.carts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "carts_update_owner" ON public.carts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "carts_delete_owner" ON public.carts
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "cart_items_select_owner" ON public.cart_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "cart_items_insert_owner" ON public.cart_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_update_owner" ON public.cart_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "cart_items_delete_owner" ON public.cart_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
      AND carts.user_id = auth.uid()
    )
  );

-- E. COUPONS
-- Public can view active coupons for validation; Admin can manage
CREATE POLICY "coupons_public_select" ON public.coupons
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "coupons_admin_all" ON public.coupons
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- F. ORDERS & ORDER ITEMS
-- Customer can ONLY read their own orders; Admin can read all
CREATE POLICY "orders_select_owner_or_admin" ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Order insertion and update are restricted to server-side service role; admin can view
CREATE POLICY "orders_admin_update" ON public.orders
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "order_items_select_owner_or_admin" ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- G. PAYMENTS
CREATE POLICY "payments_select_owner_or_admin" ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = payments.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- H. ADMIN AUDIT LOGS
-- Only verified admins can view audit logs
CREATE POLICY "admin_audit_logs_select_admin" ON public.admin_audit_logs
  FOR SELECT
  USING (public.is_admin());
