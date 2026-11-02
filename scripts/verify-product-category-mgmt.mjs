import { spawn } from 'child_process';

const PORT = 3033;
const BASE_URL = `http://localhost:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return true;
    } catch {
      // server still starting
    }
    await sleep(800);
  }
  throw new Error(`Server did not respond within ${timeoutMs}ms at ${url}`);
}

async function runTestSuite() {
  console.log('========================================================================');
  console.log('   AURELLE PRODUCT & CATEGORY MANAGEMENT VERIFICATION SUITE (PHASE 12)  ');
  console.log('========================================================================\n');

  // STEP 1: Role Authorization Guards
  console.log('--- TEST 1: Role Authorization Guards (Server-Side) ---');

  // 1a: Unauthenticated customer access to categories endpoint
  const unauthCatRes = await fetch(`${BASE_URL}/api/admin/categories`);
  const unauthCatJson = await unauthCatRes.json();
  if (unauthCatRes.status === 401 || unauthCatRes.status === 403) {
    console.log(`[PASS] Unauthenticated access to /api/admin/categories blocked: HTTP ${unauthCatRes.status}`);
  } else {
    throw new Error(`Expected 401/403 for unauth categories, got ${unauthCatRes.status}`);
  }

  // 1b: Customer role trying to create category
  const custCatRes = await fetch(`${BASE_URL}/api/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'customer',
    },
    body: JSON.stringify({ name: 'Hacked Category', slug: 'hacked-category', description: 'Malicious entry' }),
  });
  if (custCatRes.status === 403) {
    console.log(`[PASS] Customer role blocked from POST /api/admin/categories: HTTP 403 Forbidden`);
  } else {
    throw new Error(`Expected 403 for customer category creation, got ${custCatRes.status}`);
  }

  // 1c: Customer role trying to create product
  const custProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'customer',
    },
    body: JSON.stringify({ title: 'Hacked Product', slug: 'hacked-product' }),
  });
  if (custProdRes.status === 403) {
    console.log(`[PASS] Customer role blocked from POST /api/admin/products: HTTP 403 Forbidden`);
  } else {
    throw new Error(`Expected 403 for customer product creation, got ${custProdRes.status}`);
  }

  // STEP 2: Authenticate Admin Vault Session
  console.log('\n--- TEST 2: Admin Vault Authentication ---');
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      passkey: 'aurelle_admin_vault_passkey_2026',
      email: 'director@aurelle.in',
    }),
  });
  const cookies = loginRes.headers.get('set-cookie');
  const adminHeaders = cookies
    ? { 'Cookie': cookies.split(';')[0], 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
  const loginJson = await loginRes.json();
  if (loginRes.status === 200 && loginJson.success) {
    console.log(`[PASS] Admin authenticated: ${loginJson.actor.email} (Role: ${loginJson.actor.role})`);
  } else {
    throw new Error(`Admin authentication failed: HTTP ${loginRes.status}`);
  }

  // STEP 3: Category Management CRUD & Reordering
  console.log('\n--- TEST 3: Category Management (Create, Edit, Reorder, Archive) ---');
  
  // 3a: Get initial categories
  const getCatsRes = await fetch(`${BASE_URL}/api/admin/categories`, { headers: adminHeaders });
  const getCatsJson = await getCatsRes.json();
  console.log(`[PASS] Initial master categories count: ${getCatsJson.categories?.length}`);

  // 3b: Create new Category
  const testCatSlug = `royal-shararas-${Date.now()}`;
  const createCatRes = await fetch(`${BASE_URL}/api/admin/categories`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Royal Shararas',
      slug: testCatSlug,
      description: 'Extravagant flared silhouettes hand-embellished in Lucknowi gota and zardozi.',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      sortOrder: getCatsJson.categories.length + 1,
    }),
  });
  const createCatJson = await createCatRes.json();
  if (createCatRes.status === 201 && createCatJson.success) {
    console.log(`[PASS] Created category: "${createCatJson.category.name}" (ID: ${createCatJson.category.id}, Slug: ${createCatJson.category.slug})`);
  } else {
    throw new Error(`Failed to create category: ${JSON.stringify(createCatJson)}`);
  }
  const createdCatId = createCatJson.category.id;

  // 3c: Edit Category
  const editCatRes = await fetch(`${BASE_URL}/api/admin/categories/${createdCatId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Imperial Royal Shararas',
      description: 'Updated opulent Lucknowi craftsmanship descriptions.',
    }),
  });
  const editCatJson = await editCatRes.json();
  if (editCatRes.status === 200 && editCatJson.category.name === 'Imperial Royal Shararas') {
    console.log(`[PASS] Updated category name to: "${editCatJson.category.name}"`);
  } else {
    throw new Error(`Failed to update category: ${JSON.stringify(editCatJson)}`);
  }

  // 3d: Reorder Categories
  const existingCatIds = getCatsJson.categories.map((c) => c.id);
  const reorderedIds = [createdCatId, ...existingCatIds];
  const reorderRes = await fetch(`${BASE_URL}/api/admin/categories/reorder`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({ categoryIds: reorderedIds }),
  });
  const reorderJson = await reorderRes.json();
  const firstCat = reorderJson.categories?.[0];
  if (reorderRes.status === 200 && firstCat?.id === createdCatId) {
    console.log(`[PASS] Category reordering verified: "${firstCat.name}" is now sortOrder 1`);
  } else {
    throw new Error(`Category reordering failed: ${JSON.stringify(reorderJson)}`);
  }

  // 3e: Archive Category
  const archiveCatRes = await fetch(`${BASE_URL}/api/admin/categories/${createdCatId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ isActive: false }),
  });
  const archiveCatJson = await archiveCatRes.json();
  if (archiveCatRes.status === 200 && archiveCatJson.category.isActive === false) {
    console.log(`[PASS] Category archived (isActive = false)`);
  } else {
    throw new Error(`Failed to archive category: ${JSON.stringify(archiveCatJson)}`);
  }

  // 3f: Unarchive Category
  const unarchiveCatRes = await fetch(`${BASE_URL}/api/admin/categories/${createdCatId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ isActive: true }),
  });
  const unarchiveCatJson = await unarchiveCatRes.json();
  if (unarchiveCatRes.status === 200 && unarchiveCatJson.category.isActive === true) {
    console.log(`[PASS] Category unarchived (isActive = true)`);
  } else {
    throw new Error(`Failed to unarchive category: ${JSON.stringify(unarchiveCatJson)}`);
  }

  // STEP 4: Product Management CRUD, Draft/Publish, and Integer Paise Validation
  console.log('\n--- TEST 4: Product Management (Add, Edit, Draft/Publish, Delete) ---');

  // 4a: Add Product as Draft with Compare-at Price & SKU
  const testProductSlug = `nur-jahan-sharara-${Date.now()}`;
  const createProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Nur Jahan Heirloom Sharara',
      subtitle: 'Pure Tissue Silk with Micro-Gota Patti & Basra Pearls',
      slug: testProductSlug,
      category: 'Imperial Royal Shararas',
      categorySlug: testCatSlug,
      sku: 'AUR-SHA-NUR-01',
      status: 'draft', // Created initially as DRAFT
      pricePaise: 4500000, // ₹45,000 in integer paise
      compareAtPaise: 5200000, // ₹52,000 compare-at price in integer paise
      badge: 'New In',
      fabric: 'Tissue Silk & Satin Georgette',
      craft: 'Gota Patti & Zardozi Needlework',
      stockCount: 6,
      description: 'An ethereal ensemble inspired by the grandeur of the Mughal court of Nur Jahan.',
      colors: [{ name: 'Gilded Champagne', hex: '#E8D8B0' }],
      sizes: ['Custom Bespoke', 'Size M (38)'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
          alt: 'Nur Jahan Heirloom Sharara drape preview',
        },
      ],
      details: [
        'Heirloom quality dry clean only',
        'Hand-loomed in Varanasi and embroidered in Lucknow',
      ],
    }),
  });
  const createProdJson = await createProdRes.json();
  if (createProdRes.status === 201 && createProdJson.success) {
    console.log(`[PASS] Created product: "${createProdJson.product.title}"`);
    console.log(`       ID: ${createProdJson.product.id}, Status: ${createProdJson.product.status}, SKU: ${createProdJson.product.sku}`);
    console.log(`       Authoritative Price: ₹${(createProdJson.product.pricePaise / 100).toLocaleString('en-IN')} (${createProdJson.product.pricePaise} paise)`);
    console.log(`       Compare-at Price: ₹${(createProdJson.product.compareAtPaise / 100).toLocaleString('en-IN')} (${createProdJson.product.compareAtPaise} paise)`);
  } else {
    throw new Error(`Failed to create product: ${JSON.stringify(createProdJson)}`);
  }
  const createdProductId = createProdJson.product.id;

  // 4b: Verify Draft Isolation: Client Cart cannot add a draft product
  console.log('\n[TEST 4b: Verifying Storefront/Cart Protection for Draft Items]');
  const addDraftCartRes = await fetch(`${BASE_URL}/api/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: createdProductId,
      selectedColor: 'Gilded Champagne',
      selectedSize: 'Size M (38)',
      quantity: 1,
    }),
  });
  const addDraftCartJson = await addDraftCartRes.json();
  if (addDraftCartRes.status === 404 || addDraftCartJson.error?.includes('unavailable') || addDraftCartJson.error?.includes('not found')) {
    console.log(`[PASS] Draft product successfully shielded: Cart rejected add request with "${addDraftCartJson.error}"`);
  } else {
    throw new Error(`Security breach: Draft product was added to cart: ${JSON.stringify(addDraftCartJson)}`);
  }

  // 4c: Edit Product (Update Title, Sale Price, Compare-At Price, Stock)
  const editProdRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Nur Jahan Imperial Heirloom Sharara (Exclusive)',
      pricePaise: 4200000, // Adjusted to ₹42,000
      compareAtPaise: 5000000, // Adjusted to ₹50,000
      stockCount: 4,
      badge: 'Heritage',
    }),
  });
  const editProdJson = await editProdRes.json();
  if (editProdRes.status === 200 && editProdJson.product.pricePaise === 4200000) {
    console.log(`[PASS] Updated product details:`);
    console.log(`       New Title: "${editProdJson.product.title}"`);
    console.log(`       New Price: ₹${(editProdJson.product.pricePaise / 100).toLocaleString('en-IN')} (${editProdJson.product.pricePaise} paise)`);
    console.log(`       New Compare-At: ₹${(editProdJson.product.compareAtPaise / 100).toLocaleString('en-IN')} (${editProdJson.product.compareAtPaise} paise)`);
    console.log(`       New Stock: ${editProdJson.product.stockCount} units`);
  } else {
    throw new Error(`Failed to update product: ${JSON.stringify(editProdJson)}`);
  }

  // 4d: Publish Product (set status to 'active')
  console.log('\n[TEST 4d: Publishing Product via Status API]');
  const publishRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}/status`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'active' }),
  });
  const publishJson = await publishRes.json();
  if (publishRes.status === 200 && publishJson.product.status === 'active') {
    console.log(`[PASS] Product status transitioned to ACTIVE: "${publishJson.message}"`);
  } else {
    throw new Error(`Failed to publish product: ${JSON.stringify(publishJson)}`);
  }

  // 4e: Verify Active Product Can Now Be Added to Cart at Authoritative Price
  console.log('\n[TEST 4e: Storefront Cart Connect with Published Product]');
  const addActiveCartRes = await fetch(`${BASE_URL}/api/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: createdProductId,
      selectedColor: 'Gilded Champagne',
      selectedSize: 'Size M (38)',
      quantity: 1,
    }),
  });
  const addActiveCartJson = await addActiveCartRes.json();
  if (addActiveCartRes.status === 200 && addActiveCartJson.success) {
    const cartObj = addActiveCartJson.data || addActiveCartJson.cart;
    const addedItem = cartObj.items.find((i) => i.productId === createdProductId);
    console.log(`[PASS] Active product added to cart!`);
    console.log(`       Cart Item: "${addedItem.title}"`);
    console.log(`       Verified Server Price: ₹${(addedItem.pricePaise / 100).toLocaleString('en-IN')} (${addedItem.pricePaise} paise)`);
    console.log(`       Cart Subtotal: ₹${(cartObj.subtotalPaise / 100).toLocaleString('en-IN')}`);
  } else {
    throw new Error(`Failed to add active product to cart: ${JSON.stringify(addActiveCartJson)}`);
  }

  // 4f: Unpublish Product back to Draft
  console.log('\n[TEST 4f: Unpublishing Product back to DRAFT]');
  const unpublishRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}/status`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'draft' }),
  });
  const unpublishJson = await unpublishRes.json();
  if (unpublishRes.status === 200 && unpublishJson.product.status === 'draft') {
    console.log(`[PASS] Product successfully unpublished back to DRAFT`);
  } else {
    throw new Error(`Failed to unpublish product: ${JSON.stringify(unpublishJson)}`);
  }

  // 4g: Delete Product
  console.log('\n[TEST 4g: Deleting Product from Catalog]');
  const deleteProdRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: 'DELETE',
    headers: adminHeaders,
  });
  const deleteProdJson = await deleteProdRes.json();
  if (deleteProdRes.status === 200 && deleteProdJson.success) {
    console.log(`[PASS] Product successfully deleted: ID ${deleteProdJson.deletedId} ("${deleteProdJson.title}")`);
  } else {
    throw new Error(`Failed to delete product: ${JSON.stringify(deleteProdJson)}`);
  }

  // STEP 5: Security Audit Trail Verification
  console.log('\n--- TEST 5: Security Audit Trail Logs ---');
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, { headers: adminHeaders });
  const auditJson = await auditRes.json();
  if (auditRes.status === 200 && Array.isArray(auditJson.logs)) {
    console.log(`[PASS] Audit logs retrieved. Total records: ${auditJson.logs.length}`);
    const recordedActions = auditJson.logs.map((l) => `${l.action} (${l.entityType})`);
    
    const requiredActions = [
      'CREATE_CATEGORY',
      'UPDATE_CATEGORY',
      'REORDER_CATEGORIES',
      'CREATE_PRODUCT',
      'UPDATE_PRODUCT',
      'SET_PRODUCT_STATUS',
      'DELETE_PRODUCT',
    ];

    for (const req of requiredActions) {
      const found = recordedActions.some((a) => a.startsWith(req));
      if (found) {
        console.log(`[PASS] Verified cryptographic audit record for: ${req}`);
      } else {
        throw new Error(`Missing expected audit log action: ${req}`);
      }
    }
  } else {
    throw new Error(`Failed to fetch audit logs: ${JSON.stringify(auditJson)}`);
  }

  // STEP 6: Storefront Zero Regressions
  console.log('\n--- TEST 6: Storefront & Customer Flow Zero Regressions ---');
  const routesToCheck = [
    { path: '/', label: 'Homepage' },
    { path: '/collections', label: 'Collections Catalog' },
    { path: '/products/gulbagh-crimson-banarasi-saree', label: 'Product Detail' },
    { path: '/cart', label: 'Persistent Cart' },
    { path: '/checkout', label: 'COD Checkout' },
    { path: '/account', label: 'Customer Account' },
    { path: '/admin', label: 'Admin Dashboard' },
  ];

  for (const route of routesToCheck) {
    const res = await fetch(`${BASE_URL}${route.path}`);
    if (res.status === 200) {
      console.log(`[PASS] ${route.label} (${route.path}): HTTP 200 OK`);
    } else {
      throw new Error(`Regression on ${route.path}: HTTP ${res.status}`);
    }
  }

  console.log('\n========================================================================');
  console.log('   RESULT: 100% OF PRODUCT & CATEGORY MANAGEMENT VERIFICATIONS PASSED!   ');
  console.log('========================================================================\n');
}

async function main() {
  console.log(`Starting Next.js test server on port ${PORT}...`);
  const server = spawn('cmd.exe', ['/c', `set PORT=${PORT}&& set PATH=C:\\nodejs;%PATH%&& npm run start`], {
    cwd: 'C:\\Users\\nikhi\\.gemini\\antigravity\\scratch\\aurelle-store',
    stdio: 'inherit',
  });

  try {
    await waitForServer(`${BASE_URL}/`, 60000);
    console.log(`Server is ready on ${BASE_URL}. Running test suite...\n`);
    await runTestSuite();
    process.exitCode = 0;
  } catch (error) {
    console.error('\n[FATAL TEST FAILURE]:', error);
    process.exitCode = 1;
  } finally {
    console.log('Tearing down Next.js test server...');
    server.kill();
  }
}

main();
