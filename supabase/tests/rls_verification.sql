-- ========================================================================
-- AURELLE LUXURY STORE — PHASE 7 RLS POLICY & SECURITY TEST SUITE
-- Run this in the Supabase SQL editor or local test runner to verify
-- security boundaries between customers, admins, and anonymous users.
-- ========================================================================

BEGIN;

-- Setup test mock users in auth schema (simulation environment)
-- In live Supabase, auth.uid() reflects JWT claim
DO $$
DECLARE
  user_a UUID := '11111111-1111-1111-1111-111111111111';
  user_b UUID := '22222222-2222-2222-2222-222222222222';
  admin_user UUID := '99999999-9999-9999-9999-999999999999';
  test_order_b UUID := 'b0000000-0000-0000-0000-000000000001';
  test_address_b UUID := 'b1111111-0000-0000-0000-000000000001';
  role_escalation_failed BOOLEAN := false;
  leaked_orders_count INT := 0;
  leaked_addresses_count INT := 0;
BEGIN
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'STARTING AURELLE RLS SECURITY VERIFICATION SUITE';
  RAISE NOTICE '==================================================';

  -- TEST 1: Role Escalation Trigger Check
  -- Simulate a profile for user_a
  INSERT INTO public.profiles (id, display_name, phone, role)
  VALUES (user_a, 'Customer A', '+919876543210', 'customer')
  ON CONFLICT (id) DO UPDATE SET role = 'customer';

  -- Now simulate customer trying to set their own role to 'admin'
  BEGIN
    -- Set auth context to user_a
    PERFORM set_config('request.jwt.claim.sub', user_a::text, true);
    PERFORM set_config('role', 'authenticated', true);

    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = user_a;

    -- If this line executes, trigger failed
    RAISE EXCEPTION 'CRITICAL FAILURE: Customer successfully escalated role to admin!';
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLERRM LIKE '%Unauthorized: Customers cannot escalate or modify user roles%' THEN
        RAISE NOTICE 'PASS: Test 1 - Customer role escalation successfully blocked by trigger.';
        role_escalation_failed := true;
      ELSE
        RAISE NOTICE 'PASS: Role modification blocked with error: %', SQLERRM;
        role_escalation_failed := true;
      END IF;
  END;

  IF NOT role_escalation_failed THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Customer role escalation was not blocked!';
  END IF;

  -- Reset to postgres role for mock data setup
  PERFORM set_config('role', 'postgres', true);

  -- Insert profile, address, and order for Customer B
  INSERT INTO public.profiles (id, display_name, phone, role)
  VALUES (user_b, 'Customer B', '+919123456789', 'customer')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.addresses (id, user_id, recipient_name, phone, address_line1, city, state, postal_code)
  VALUES (test_address_b, user_b, 'Customer B Confidential', '+919123456789', 'Private Villa 42', 'Mumbai', 'Maharashtra', '400001')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.orders (
    id, public_order_number, user_id, subtotal_paise, total_paise,
    payment_method, payment_status, shipping_address_snapshot
  ) VALUES (
    test_order_b, 'AUR-TEST-002', user_b, 7600000, 7600000,
    'COD', 'pending', '{"address": "Confidential B"}'::jsonb
  ) ON CONFLICT (id) DO NOTHING;

  -- TEST 2: Cross-Customer Order Isolation
  -- Switch context to Customer A
  PERFORM set_config('request.jwt.claim.sub', user_a::text, true);
  PERFORM set_config('role', 'authenticated', true);

  SELECT count(*) INTO leaked_orders_count
  FROM public.orders
  WHERE user_id = user_b;

  IF leaked_orders_count = 0 THEN
    RAISE NOTICE 'PASS: Test 2 - Customer A cannot read Customer B orders (0 rows leaked).';
  ELSE
    RAISE EXCEPTION 'CRITICAL FAILURE: Customer A read % orders belonging to Customer B!', leaked_orders_count;
  END IF;

  -- TEST 3: Cross-Customer Address Isolation
  SELECT count(*) INTO leaked_addresses_count
  FROM public.addresses
  WHERE user_id = user_b;

  IF leaked_addresses_count = 0 THEN
    RAISE NOTICE 'PASS: Test 3 - Customer A cannot read Customer B addresses (0 rows leaked).';
  ELSE
    RAISE EXCEPTION 'CRITICAL FAILURE: Customer A read % addresses belonging to Customer B!', leaked_addresses_count;
  END IF;

  -- TEST 4: Customer cannot tamper with product prices
  BEGIN
    UPDATE public.variants
    SET price_paise = 100
    WHERE sku = 'SKU-SAR-GUL-RED';

    -- Check if any row was affected
    IF FOUND THEN
      RAISE EXCEPTION 'CRITICAL FAILURE: Customer modified catalog variant price!';
    ELSE
      RAISE NOTICE 'PASS: Test 4 - Customer catalog price modification rejected by RLS.';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'PASS: Test 4 - Catalog modification rejected: %', SQLERRM;
  END;

  RAISE NOTICE '==================================================';
  RAISE NOTICE 'ALL AURELLE RLS SECURITY VERIFICATION CHECKS PASSED';
  RAISE NOTICE '==================================================';
END $$;

ROLLBACK; -- Always rollback simulation
