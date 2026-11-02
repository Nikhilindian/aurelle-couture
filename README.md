# AURELLE — Luxury Heritage Indian E-Commerce Atelier

> An ultra-luxury Indian ethnic couture e-commerce platform inspired by high-end references (Tanisha Fabrics / Simmi Collection), built with Next.js 14 App Router, TypeScript, Tailwind CSS, integer paise currency standards, and PostgreSQL / Supabase RLS.

---

## 🏛️ Architecture & Core Principles

1. **Integer Paise Currency Standard**:
   - All financial operations (catalog prices, discounts, subtotal, shipping, and grand totals) are strictly stored and computed in integer **Paise** (`BIGINT NOT NULL CHECK (amount >= 0)`).
   - ₹1 = 100 paise (e.g. ₹28,500 = `2850000` paise). This completely eliminates floating-point rounding errors.

2. **Server-Authoritative Pricing**:
   - The client/browser is completely untrusted for monetary calculations.
   - Client sends only `{ productId, selectedColor, selectedSize, quantity }`. The server validates catalog prices, current stock limits, and active promotions independently.

3. **Cash on Delivery (COD) Mode**:
   - **Active Payment Mode**: Cash on Delivery (COD) is the active and verified transaction method.
   - Customers review an authoritative order breakdown, input delivery instructions, and confirm orders with zero prepayment risk.
   - **Online Payments Notice**: Online payment gateways (Razorpay, credit/debit cards, net banking, UPI SDKs, and webhook signature verification) are **intentionally deferred** and will be integrated in a future phase. No live card charges or online gateways are executed in this environment.

4. **Duplicate Submission Protection (Idempotency)**:
   - Every checkout attempt is locked with an `idempotencyKey`. Double-clicks or rapid resubmissions return the existing order without creating duplicate orders or double-reserving stock.

5. **Opaque Order Identifiers & Receipt Privacy Guard**:
   - Order IDs are non-sequential cryptographic UUIDs (e.g., `e121e7f3-d8e3-47b6-b5f1-80f061856bbc`).
   - Public order numbers use alphanumeric masked codes (e.g., `AUR-2610-658899`).
   - Order receipt pages (`/order-success/[orderId]`) require session authorization or an authentic `receiptToken`. Unauthorized visitors or attackers guessing order IDs receive a strict `404 / Access Denied`, protecting customer name, phone, address, and purchased items.

6. **PostgreSQL & Row-Level Security (RLS)**:
   - Full migration suite in `supabase/migrations/` with 14 tables.
   - Default-Deny RLS policies ensuring customers can only access their own profile, addresses, and orders.
   - Role escalation defense triggers preventing customers from promoting themselves to admin.

7. **Protected Admin Vault & Inventory Control (Phase 12)**:
   - **Server-Side Role Guard**: Every admin endpoint verifies administrative authority on the server. Customers receiving an explicit `403 Forbidden`.
   - **Zod Validated Mutations**: Products, collections, and inventory updates are validated before persisting.
   - **Safe Inventory Control**: Non-negative stock counts enforced; stock <= 3 triggers low-stock alerts.
   - **Immutable Security Audit Log**: Privileged operations (price changes, inventory adjustments, product additions) are cryptographically logged with actor email and mutation diffs.
   - **Deferred Scopes**: Online payments (Phase 11) and Admin Order Management remain deferred as planned.

---

## 📂 Project Structure

```
aurelle-store/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Homepage (Editorial Hero, Collections, New Arrivals)
│   │   ├── collections/                 # Faceted catalog browsing & filters
│   │   ├── products/[slug]/             # Product detail view with gallery & size guide
│   │   ├── cart/                        # Dedicated shopping bag page
│   │   ├── checkout/                    # Atelier Checkout (Address, Notes, COD confirmation)
│   │   ├── order-success/[orderId]/     # Protected order confirmation & receipt
│   │   ├── account/                     # Customer portal (Profile, Addresses CRUD, Orders)
│   │   ├── admin/                       # Protected Atelier Administration Vault
│   │   └── api/
│   │       ├── admin/                   # Privileged admin endpoints (overview, products, inventory, collections, audit-logs)
│   │       ├── cart/                    # Authoritative server cart endpoints (GET, POST, PATCH, DELETE)
│   │       ├── cart/coupon/             # Authoritative coupon validation endpoint
│   │       └── checkout/order/          # Authoritative order creation & receipt API
│   ├── components/                      # Reusable brand design system & widgets
│   ├── context/                         # CartContext, AuthContext
│   ├── data/                            # Master mock catalog & artisan collections
│   ├── lib/
│   │   ├── server/                      # Server-side admin-auth.ts, admin-service.ts, cart-service.ts, order-service.ts
│   │   ├── supabase/                    # Client & Server Supabase connectors
│   │   └── utils.ts                     # formatPrice (paise -> ₹) & helpers
│   └── types/                           # database.types.ts
├── supabase/
│   ├── migrations/                      # 3 PostgreSQL migration files (Schema, RLS, Seed)
│   └── tests/                           # rls_verification.sql test suite
├── scripts/
│   ├── test-cart-api.mjs                # Cart & pricing engine verification script
│   └── test-checkout-api.mjs            # Checkout, COD, idempotency & security test suite
└── README.md
```

---

## 🚀 Running & Verifying the Application

### Prerequisites
- Node.js `v18+` (Tested on Node `v24.20.0`)
- npm `v9+` (Tested on npm `11.19.0`)

### Setup & Run
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run TypeScript typecheck
npm run typecheck

# 3. Build for production
npm run build

# 4. Start production server on port 3000
npm run start
```

### Running Automated Test Suites
With the Next.js server running:
```bash
# Test Phase 9 Server-Authoritative Cart & Pricing
node scripts/test-cart-api.mjs

# Test Phase 10 Checkout, COD, Idempotency, and Receipt Security
node scripts/test-checkout-api.mjs

# Test Phase 12 Protected Admin Dashboard, Role Authorization & Audit Trail
node scripts/verify-phase12-admin.mjs
```

---

## 🔒 Security & Privacy Guarantees

- **No Client Price Manipulation**: Even if a request payload includes custom price fields, the server ignores them and looks up the canonical database/catalog price.
- **Stock Depletion Prevention**: Orders exceeding available inventory or containing out-of-stock items are rejected with an explicit `400 Bad Request`.
- **Customer PII Shield**: Receipt endpoints verify session tokens before rendering customer addresses or names. Strangers guessing order IDs are blocked with `404 Not Found`.
- **No Inadvertent Charges**: Live payment gateways (e.g. Razorpay) are not active; no real-world cards or bank accounts will ever be debited.
