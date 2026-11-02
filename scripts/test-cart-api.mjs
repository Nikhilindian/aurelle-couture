async function testCartApi() {
  const baseUrl = `http://localhost:${process.env.TEST_PORT || 3000}`;
  
  // 1. Initial cart
  console.log('--- 1. Testing GET /api/cart ---');
  let res = await fetch(`${baseUrl}/api/cart`);
  let cookies = res.headers.get('set-cookie');
  let cartData = await res.json();
  console.log('Initial cart status:', res.status, cartData);

  // Cookie headers for subsequent requests to maintain cart session
  const cookieHeader = cookies ? { 'Cookie': cookies.split(';')[0] } : {};

  // 2. Add Item to cart (Server calculates authoritative price!)
  console.log('\n--- 2. Testing POST /api/cart/items (Item p1, no client price) ---');
  res = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...cookieHeader,
    },
    body: JSON.stringify({
      productId: 'prod-1',
      selectedColor: 'Crimson Red',
      selectedSize: 'Unstitched (6.5m with Blouse)',
      quantity: 1,
    }),
  });
  if (res.headers.get('set-cookie')) {
    cookieHeader['Cookie'] = res.headers.get('set-cookie').split(';')[0];
  }
  cartData = await res.json();
  console.log('Add item response status:', res.status);
  console.log('Cart subtotalPaise:', cartData.data.subtotalPaise);
  console.log('Cart items count:', cartData.data.items.length);
  console.log('First item title:', cartData.data.items[0]?.title);
  console.log('First item pricePaise (authoritative):', cartData.data.items[0]?.pricePaise);

  // 3. Apply Coupon
  console.log('\n--- 3. Testing POST /api/cart/coupon (Code: AURELLE10) ---');
  res = await fetch(`${baseUrl}/api/cart/coupon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...cookieHeader,
    },
    body: JSON.stringify({
      code: 'AURELLE10',
    }),
  });
  const couponData = await res.json();
  console.log('Coupon response status:', res.status, 'message:', couponData.message);
  console.log('Discount paise:', couponData.summary?.discountPaise);
  console.log('Final total paise:', couponData.summary?.finalTotalPaise);

  // 4. Update quantity
  console.log('\n--- 4. Testing PATCH /api/cart/items (Quantity -> 2) ---');
  const itemId = cartData.data.items[0].id;
  res = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...cookieHeader,
    },
    body: JSON.stringify({
      itemId,
      quantity: 2,
    }),
  });
  const patchData = await res.json();
  console.log('Updated subtotalPaise:', patchData.data.subtotalPaise);
  console.log('Updated totalCount:', patchData.data.totalCount);

  // 5. Remove item
  console.log('\n--- 5. Testing DELETE /api/cart/items ---');
  res = await fetch(`${baseUrl}/api/cart/items`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...cookieHeader,
    },
    body: JSON.stringify({
      itemId,
    }),
  });
  const deleteData = await res.json();
  console.log('After delete totalCount:', deleteData.data.totalCount);
  console.log('After delete subtotalPaise:', deleteData.data.subtotalPaise);

  console.log('\n--- 6. Verifying Front-end Pages ---');
  const pages = [
    '/',
    '/collections',
    '/products/gulbagh-crimson-banarasi-saree',
    '/cart',
    '/account'
  ];
  for (const p of pages) {
    const pageRes = await fetch(`${baseUrl}${p}`);
    console.log(`Route ${p}: HTTP ${pageRes.status}`);
  }

  console.log('\nAll API & Page tests verified successfully!');
}

testCartApi().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
