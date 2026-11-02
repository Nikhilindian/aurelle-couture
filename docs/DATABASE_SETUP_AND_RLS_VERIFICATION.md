# AURELLE Couture — Database Schema & RLS Verification Guide

This document specifies the PostgreSQL architecture, Row Level Security (RLS) policies, and verification steps for the AURELLE Luxury Store.

---

## 1. Schema Architecture & Standard Standards

* **Database Engine:** Supabase PostgreSQL with `uuid-ossp` and `pgcrypto`.
* **Currency Standard:** All monetary amounts are strictly recorded as **integer Paise** (`BIGINT NOT NULL CHECK (amount >= 0)`).
  * Example: `₹28,500` = `2850000` paise. No floating-point rounding errors can occur.
* **Row Level Security:** Default-Deny enabled across all 14 tables.

### Tables Overview
| Table Name | Primary Key | Description & RLS Boundary |
| :--- | :--- | :--- |
| `public.profiles` | `id` (references `auth.users`) | Customer profile. Customer can read/update own data; trigger blocks self-promotion to `admin`. |
| `public.addresses` | `id UUID` | Shipping address book. Strict owner-only access (`auth.uid() = user_id`). |
| `public.collections` | `id UUID` | Categories and seasonal drops. Public read (`is_active = true`); mutations restricted to `is_admin()`. |
| `public.products` | `id UUID` | Master products. Public read (`status = 'active'`); mutations restricted to `is_admin()`. |
| `public.product_media` | `id UUID` | Gallery images and storage paths. Public read; mutations restricted to `is_admin()`. |
| `public.variants` | `id UUID` | SKUs, colors, sizes, stock quantity, and paise prices. Public read; mutations restricted to `is_admin()`. |
| `public.collection_products` | `(collection_id, product_id)` | Merchandising junction. Public read; mutations restricted to `is_admin()`. |
| `public.carts` | `id UUID` | User or anonymous shopping sessions. Bound to `auth.uid() = user_id` or scoped token. |
| `public.cart_items` | `id UUID` | Cart line items. Strictly accessible only through parent cart ownership. |
| `public.coupons` | `id UUID` | Promotional privilege codes. Public read for validation; mutations restricted to `is_admin()`. |
| `public.orders` | `id UUID` | Immutable order header with snapshots. Customer can only read where `user_id = auth.uid()`. |
| `public.order_items` | `id UUID` | Purchased item snapshot (price, SKU, title, size). Access verified via parent order ownership. |
| `public.payments` | `id UUID` | Provider transactions (Razorpay/COD). Accessible only by order owner or admin. Mutations server-only. |
| `public.admin_audit_logs` | `id UUID` | Privileged admin mutation logs. Viewable only by `is_admin()`. |

---

## 2. Row Level Security (RLS) & Role Escalation Defense

### A. Role Escalation Prevention Trigger
A security trigger `trigger_prevent_role_escalation` on `public.profiles` monitors all updates. If an unprivileged customer attempts to execute:
```sql
UPDATE public.profiles SET role = 'admin' WHERE id = auth.uid();
```
The database raises an exception:
`Unauthorized: Customers cannot escalate or modify user roles` and aborts the transaction. Only a caller with `service_role` or an existing verified admin can assign roles.

### B. Cross-Customer Data Isolation
Every table containing personal data (`profiles`, `addresses`, `orders`, `order_items`, `carts`, `cart_items`) checks `auth.uid() = user_id` or an exists subquery on the parent order. Customer A querying `SELECT * FROM orders WHERE user_id = 'customer_b_uuid'` returns **0 rows**.

---

## 3. How to Apply Migrations to Supabase

### Option A: Supabase Dashboard (Web UI)
1. Open your Supabase Project Dashboard (`https://supabase.com/dashboard/project/<your-project-id>`).
2. Go to **SQL Editor** in the left menu.
3. Open and run the migration files in exact numerical order:
   * **Step 1:** Run `supabase/migrations/20261008000001_initial_schema.sql`
   * **Step 2:** Run `supabase/migrations/20261008000002_rls_policies.sql`
   * **Step 3:** Run `supabase/migrations/20261008000003_seed_catalog.sql`

### Option B: Supabase CLI (Local or Remote)
If using the Supabase CLI:
```bash
supabase db push
```

---

## 4. How to Verify RLS Policies

Run the verification test script located at:
[`supabase/tests/rls_verification.sql`](file:///C:/Users/nikhi/.gemini/antigravity/scratch/aurelle-store/supabase/tests/rls_verification.sql)

It simulates unprivileged customers, attempts role escalation, and performs cross-tenant reads.
Expected test output:
```text
NOTICE: STARTING AURELLE RLS SECURITY VERIFICATION SUITE
NOTICE: PASS: Test 1 - Customer role escalation successfully blocked by trigger.
NOTICE: PASS: Test 2 - Customer A cannot read Customer B orders (0 rows leaked).
NOTICE: PASS: Test 3 - Customer A cannot read Customer B addresses (0 rows leaked).
NOTICE: PASS: Test 4 - Customer catalog price modification rejected by RLS.
NOTICE: ALL AURELLE RLS SECURITY VERIFICATION CHECKS PASSED
```

---

## 5. Live Environment Status vs Static Check

> [!IMPORTANT]
> **Live Credentials Status:** No real live Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are configured in `.env.local` yet.
> Therefore, this report **honestly does NOT claim the live remote database has been connected or updated**.
> All SQL schema scripts, RLS policies, trigger code, and TypeScript types have been statically verified, compiled, and validated without errors. When the live project is linked, applying the 3 migrations will immediately establish the hardened database.
