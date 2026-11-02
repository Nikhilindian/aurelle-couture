-- ========================================================================
-- AURELLE LUXURY STORE — PHASE 7 DATABASE FOUNDATION
-- Migration 03: Safe Seed Catalog & Promotional Coupons (Zero PII)
-- ========================================================================

-- 1. Insert Collections
INSERT INTO public.collections (id, slug, name, description, image_url, sort_order, is_active)
VALUES
  ('c0000001-0000-0000-0000-000000000001', 'banarasi-sarees', 'Varanasi Heritage Sarees', 'Pure Katan silk woven with real gold and silver kadwa zari.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80', 1, true),
  ('c0000001-0000-0000-0000-000000000002', 'bridal-lehengas', 'Imperial Bridal Lehengas', 'Heirloom zardozi, hand-cut resham, and velvet masterworks.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80', 2, true),
  ('c0000001-0000-0000-0000-000000000003', 'kurta-sets', 'Festive Anarkalis & Sets', 'Airy chanderi and tissue organza for celebratory afternoons.', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80', 3, true),
  ('c0000001-0000-0000-0000-000000000004', 'chanderi-dupattas', 'Artisanal Silk Dupattas', 'Fine gossamer silk with meenakari borders and hand-fringed hems.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Products
INSERT INTO public.products (id, slug, title, subtitle, description, category, category_slug, fabric, craft, status, is_new_arrival, is_bestseller)
VALUES
  ('p0000001-0000-0000-0000-000000000001', 'gulbagh-crimson-banarasi-saree', 'Gulbagh Crimson Katan Saree', 'Pure Varanasi Mulberry Silk with Handwoven Antique Zari', 'A celebration of classical Varanasi artistry, the Gulbagh saree features jaal bootis meticulously woven on pit looms over 24 days.', 'Sarees', 'banarasi-sarees', '100% Pure Katan Mulberry Silk', 'Kadwa Handloom Weave', 'active', true, true),
  ('p0000001-0000-0000-0000-000000000002', 'noor-zafira-bridal-lehenga', 'Noor Zafira Zardozi Lehenga', 'Deep Wine Silk Velvet with Handcrafted Dabka Embroidery', 'Crafted for the discerning bride, the Noor Zafira lehenga features 16 kalis richly embroidered with heritage dabka and cutdana motifs.', 'Lehengas', 'bridal-lehengas', 'Pure Micro Velvet & Silk Organza', 'Pita & Dabka Hand Embroidery', 'active', true, false),
  ('p0000001-0000-0000-0000-000000000003', 'kesar-mehra-anarkali-set', 'Kesar Mehra Silk Anarkali Set', 'Chanderi Silk with Mukaish Highlights & Gotta Patti Hem', 'An effortlessly fluid 3-piece silhouette featuring a kalidar anarkali, churidar, and an ethereal hand-printed organza dupatta.', 'Kurta Sets', 'kurta-sets', 'Pure Handloom Chanderi & Mulmul', 'Hand Mukaish & Marodi Embroidery', 'active', false, true),
  ('p0000001-0000-0000-0000-000000000004', 'nilambari-tissue-silk-saree', 'Nilambari Tissue Silk Saree', 'Metallic Gold Tissue with Midnight Indigo Resham Weave', 'A masterwork of subtle opulence, this tissue silk drape plays effortlessly with evening light.', 'Sarees', 'banarasi-sarees', 'Silk Tissue with Pure Gold Resham', 'Kadhwa Weave Technique', 'active', true, true),
  ('p0000001-0000-0000-0000-000000000005', 'padmavati-emerald-jangla-saree', 'Padmavati Emerald Jangla Saree', 'All-Over Floral Jangla Brocade on Pure Katan Silk', 'The Jangla weave is the pinnacle of Banarasi craftsmanship. Featuring intertwining vine scrollwork woven with fine gold wire.', 'Sarees', 'banarasi-sarees', 'Pure Katan Silk', 'Jangla Meenakari Handloom', 'active', false, false),
  ('p0000001-0000-0000-0000-000000000006', 'maharani-blush-rose-lehenga', 'Maharani Blush Rose Lehenga', 'Raw Silk with Seed Pearls and Fine Kashmiri Tilla Work', 'An ethereal pastel ensemble adorned with delicate flora motifs rendered in micro seed pearls and silver tilla embroidery.', 'Lehengas', 'bridal-lehengas', 'Raw Silk & Soft French Tulle', 'Tilla & Seed Pearl Embroidery', 'active', true, false),
  ('p0000001-0000-0000-0000-000000000007', 'roopmati-peacock-angrakha-set', 'Roopmati Peacock Angrakha Set', 'Heritage Silk Chanderi with Dori & Gota Tie-Up Closure', 'The royal Angrakha crossover silhouette cut in breezy handloom Chanderi silk, embellished with vintage latkans and delicate gota wire.', 'Kurta Sets', 'kurta-sets', 'Chanderi Silk & Pure Cotton Mul', 'Angrakha Overlap & Gota Patti', 'active', false, true),
  ('p0000001-0000-0000-0000-000000000008', 'chandrika-patan-patola-dupatta', 'Chandrika Patan Patola Silk Dupatta', 'Double Ikkat Pure Mulberry Silk with Traditional Geometric Motifs', 'An heirloom statement dupatta created using the intricate resist-dyeing double ikkat technique.', 'Dupattas', 'chanderi-dupattas', '100% Pure Mulberry Silk', 'Double Ikkat Resham Weave', 'active', false, false),
  ('p0000001-0000-0000-0000-000000000009', 'shahi-darbar-royal-velvet-lehenga', 'Shahi Darbar Royal Navy Lehenga', 'Heavy Silk Velvet with Antique Marodi & Zardozi Architecture', 'An opulent couture masterpiece inspired by royal court arches. Woven with metallic bullion wires and raised zardozi motifs.', 'Lehengas', 'bridal-lehengas', 'Royal Micro Velvet & Pure Silk Dupion', 'Marodi & Hand Zardozi Work', 'active', false, true),
  ('p0000001-0000-0000-0000-000000000010', 'varanasi-gold-tissue-dupatta', 'Varanasi Gold Tissue Sheer Dupatta', 'Fine Metallic Zari Warp with Floral Jaal Meenakari Borders', 'The ideal accent for festive celebrations, this tissue dupatta catches twilight luminescence with radiant metallic elegance.', 'Dupattas', 'chanderi-dupattas', 'Tissue Silk & Metallic Zari', 'Kadhwa Weft Border', 'active', true, true),
  ('p0000001-0000-0000-0000-000000000011', 'sitara-ivory-sharara-set', 'Sitara Ivory Pearl Sharara Set', 'Mulberry Georgette with Chikankari & Mukaish Highlights', 'A classical Lucknowi chikankari silhouette detailed with 32 distinct shadow-work stitches and sprinkled with hand-hammered mukaish.', 'Kurta Sets', 'kurta-sets', 'Pure Viscose Georgette & Shantoon', 'Lucknowi Hand Chikankari & Mukaish', 'active', true, false),
  ('p0000001-0000-0000-0000-000000000012', 'amrit-rani-tanchoi-saree', 'Amrit Rani Pink Tanchoi Saree', 'Dual-Tone Mulberry Silk with Paisley Jamawar Weave', 'Tanchoi involves intricate silk-on-silk weaving that produces an embossed satin relief texture, remarkably supple and drape-friendly.', 'Sarees', 'banarasi-sarees', '100% Pure Mulberry Silk', 'Tanchoi Jamawar Weave', 'active', false, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Product Variants with Integer Paise
INSERT INTO public.variants (product_id, sku, size, color_name, color_hex, price_paise, compare_at_paise, stock_quantity, is_active)
VALUES
  ('p0000001-0000-0000-0000-000000000001', 'SKU-SAR-GUL-RED', 'Unstitched', 'Crimson Red', '#7A1C20', 2850000, 3400000, 5, true),
  ('p0000001-0000-0000-0000-000000000001', 'SKU-SAR-GUL-GRN', 'Unstitched', 'Emerald Green', '#1A4329', 2850000, 3400000, 3, true),
  ('p0000001-0000-0000-0000-000000000002', 'SKU-LEH-NOOR-WINE-M', 'M', 'Deep Wine', '#4A1521', 7600000, 8800000, 3, true),
  ('p0000001-0000-0000-0000-000000000002', 'SKU-LEH-NOOR-WINE-CUST', 'Custom Tailored', 'Deep Wine', '#4A1521', 7600000, 8800000, 2, true),
  ('p0000001-0000-0000-0000-000000000003', 'SKU-KUR-KESAR-GLD-S', 'S', 'Mustard Gold', '#D4A340', 1950000, 2300000, 4, true),
  ('p0000001-0000-0000-0000-000000000003', 'SKU-KUR-KESAR-GLD-M', 'M', 'Mustard Gold', '#D4A340', 1950000, 2300000, 4, true),
  ('p0000001-0000-0000-0000-000000000004', 'SKU-SAR-NILAM-NVY', 'Unstitched', 'Royal Navy', '#162544', 3200000, 3750000, 4, true),
  ('p0000001-0000-0000-0000-000000000005', 'SKU-SAR-PADMA-GRN', 'Unstitched', 'Emerald Green', '#1A4329', 4200000, 4900000, 2, true),
  ('p0000001-0000-0000-0000-000000000006', 'SKU-LEH-MAHAR-PNK-M', 'M', 'Blush Pink', '#D9A5B3', 6800000, 7900000, 4, true),
  ('p0000001-0000-0000-0000-000000000007', 'SKU-KUR-ROOP-TEA-M', 'M', 'Peacock Teal', '#165B66', 1650000, 1950000, 6, true),
  ('p0000001-0000-0000-0000-000000000008', 'SKU-DUP-CHAND-PAT', 'Free Size', 'Crimson Red', '#7A1C20', 1250000, 1500000, 7, true),
  ('p0000001-0000-0000-0000-000000000009', 'SKU-LEH-SHAHI-NVY', 'M', 'Royal Navy', '#162544', 8900000, 10500000, 0, false),
  ('p0000001-0000-0000-0000-000000000010', 'SKU-DUP-VARAN-GLD', 'Free Size', 'Champagne Gold', '#CDB38B', 850000, 1100000, 11, true),
  ('p0000001-0000-0000-0000-000000000011', 'SKU-KUR-SITARA-IVR-M', 'M', 'Ivory Pearl', '#F5F1E9', 2450000, 2900000, 5, true),
  ('p0000001-0000-0000-0000-000000000012', 'SKU-SAR-AMRIT-RNK', 'Unstitched', 'Rani Pink', '#B8255F', 2600000, 3100000, 6, true)
ON CONFLICT (sku) DO NOTHING;

-- 4. Insert Promotional Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_paise, max_discount_paise, is_active)
VALUES
  ('AURELLE10', 'percentage', 10, 500000, 500000, true),   -- 10% off, min order ₹5k, max discount ₹5k
  ('ROYALTY15', 'percentage', 15, 2000000, 1500000, true), -- 15% off, min order ₹20k, max discount ₹15k
  ('FESTIVE20', 'percentage', 20, 5000000, 2500000, true)  -- 20% off, min order ₹50k, max discount ₹25k
ON CONFLICT (code) DO NOTHING;
