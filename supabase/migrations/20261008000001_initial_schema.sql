-- ========================================================================
-- AURELLE LUXURY STORE — PHASE 7 DATABASE FOUNDATION
-- Migration 01: Initial Schema, Constraints, Indexes & Paise Currency
-- ========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Customer Delivery Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'IN',
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Collections (Categories & Curated Drops)
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Products Master
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    fabric TEXT NOT NULL,
    craft TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    seo_title TEXT,
    seo_description TEXT,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Product Media Gallery
CREATE TABLE IF NOT EXISTS public.product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Product Variants (SKUs, Sizes, Colors, and Integer Paise Pricing)
CREATE TABLE IF NOT EXISTS public.variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    price_paise BIGINT NOT NULL CHECK (price_paise >= 0),
    compare_at_paise BIGINT CHECK (compare_at_paise IS NULL OR compare_at_paise >= price_paise),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Collection Products Junction
CREATE TABLE IF NOT EXISTS public.collection_products (
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, product_id)
);

-- 8. Carts
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_token TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT cart_owner_check CHECK (user_id IS NOT NULL OR anonymous_token IS NOT NULL)
);

-- 9. Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(cart_id, variant_id)
);

-- 10. Coupons & Promotional Privileges
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value BIGINT NOT NULL CHECK (discount_value > 0),
    min_order_paise BIGINT NOT NULL DEFAULT 0 CHECK (min_order_paise >= 0),
    max_discount_paise BIGINT CHECK (max_discount_paise IS NULL OR max_discount_paise > 0),
    usage_limit INT CHECK (usage_limit IS NULL OR usage_limit > 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    valid_from TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Orders (Immutable Snapshots & Integer Paise)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_email TEXT,
    guest_phone TEXT,
    currency TEXT NOT NULL DEFAULT 'INR',
    subtotal_paise BIGINT NOT NULL CHECK (subtotal_paise >= 0),
    shipping_paise BIGINT NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
    discount_paise BIGINT NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
    total_paise BIGINT NOT NULL CHECK (total_paise >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'RAZORPAY')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address_snapshot JSONB NOT NULL,
    coupon_code_snapshot TEXT,
    cancellation_reason TEXT,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Order Items (Snapshot of price, SKU, title at purchase)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.variants(id) ON DELETE SET NULL,
    title_snapshot TEXT NOT NULL,
    sku_snapshot TEXT NOT NULL,
    color_snapshot TEXT NOT NULL,
    size_snapshot TEXT NOT NULL,
    price_paise_snapshot BIGINT NOT NULL CHECK (price_paise_snapshot >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    image_snapshot TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Payments (Provider references & webhook tracking)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'cod')),
    provider_order_id TEXT,
    provider_payment_id TEXT,
    amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
    signature_verified BOOLEAN NOT NULL DEFAULT false,
    webhook_event_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Admin Audit Logs (Privileged mutations log)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ========================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_price_paise ON public.variants(price_paise);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_anonymous_token ON public.carts(anonymous_token);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_public_number ON public.orders(public_order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_webhook_event_id ON public.payments(webhook_event_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_actor_id ON public.admin_audit_logs(actor_id);
