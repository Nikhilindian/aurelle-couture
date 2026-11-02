import { z } from "zod";
import crypto from "crypto";
import {
  MOCK_PRODUCTS,
  MOCK_COLLECTIONS,
  MOCK_CATEGORIES,
  MockProduct,
  CollectionItem,
  MasterCategory,
} from "@/data/mock-catalog";
import { getServiceSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";
import { AdminActor } from "@/lib/server/admin-auth";

// ========================================================================
// VALIDATION SCHEMAS
// ========================================================================

export const AdminCreateProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  subtitle: z.string().max(200).optional().default(""),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  category: z.string().min(2),
  categorySlug: z.string().min(2),
  sku: z.string().max(50).optional(),
  status: z.enum(["active", "draft", "archived"]).optional().default("active"),
  pricePaise: z.number().int().positive("Price must be a positive integer in paise"),
  compareAtPaise: z.number().int().positive().nullable().optional(),
  badge: z.enum(["New In", "Bestseller", "Heritage", "Handcrafted"]).nullable().optional(),
  fabric: z.string().min(2),
  craft: z.string().min(2),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).min(1, "At least one color required"),
  sizes: z.array(z.string()).min(1, "At least one size required"),
  images: z.array(z.object({ url: z.string().url(), alt: z.string() })).min(1, "At least one image required"),
  stockCount: z.number().int().min(0, "Stock cannot be negative"),
  description: z.string().min(10),
  details: z.array(z.string()).optional().default([]),
});

export const AdminUpdateProductSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  subtitle: z.string().max(200).optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  category: z.string().optional(),
  categorySlug: z.string().optional(),
  sku: z.string().max(50).optional(),
  status: z.enum(["active", "draft", "archived"]).optional(),
  pricePaise: z.number().int().positive().optional(),
  compareAtPaise: z.number().int().positive().nullable().optional(),
  badge: z.enum(["New In", "Bestseller", "Heritage", "Handcrafted"]).nullable().optional(),
  fabric: z.string().optional(),
  craft: z.string().optional(),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).optional(),
  sizes: z.array(z.string()).optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string() })).optional(),
  stockCount: z.number().int().min(0).optional(),
  inStock: z.boolean().optional(),
  description: z.string().optional(),
  details: z.array(z.string()).optional(),
});

export const AdminUpdateInventorySchema = z.object({
  productId: z.string().min(1),
  stockCount: z.number().int().min(0, "Inventory stock count must be greater than or equal to 0"),
  inStock: z.boolean().optional(),
});

export const AdminCreateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(3),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().min(1).optional(),
});

export const AdminUpdateCategorySchema = z.object({
  name: z.string().min(2).max(80).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const AdminReorderCategorySchema = z.object({
  categoryIds: z.array(z.string()).min(1, "At least one category ID required"),
});

export const AdminCreateCollectionSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  subtitle: z.string().max(200).optional().default(""),
  imageUrl: z.string().url("Valid image URL required"),
});

export const AdminUpdateCollectionSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  subtitle: z.string().max(200).optional(),
  imageUrl: z.string().url().optional(),
  itemCount: z.number().int().min(0).optional(),
});

// ========================================================================
// AUDIT LOG SYSTEM
// ========================================================================

export interface AdminAuditEntry {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: "product" | "variant" | "collection" | "category" | "inventory" | "media";
  entityId: string;
  details: Record<string, any>;
  createdAt: string;
}

// Memory store for audit logs
const auditLogsStore: AdminAuditEntry[] = [
  {
    id: "log-seed-1",
    actorId: "admin-system",
    actorEmail: "admin@aurelle.in",
    action: "SYSTEM_INITIALIZED",
    entityType: "product",
    entityId: "catalog-master",
    details: { initialProductsCount: MOCK_PRODUCTS.length },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

/**
 * Audit log privileged administrator actions
 */
export async function logAdminAction(
  actor: AdminActor,
  action: string,
  entityType: AdminAuditEntry["entityType"],
  entityId: string,
  details: Record<string, any>
): Promise<AdminAuditEntry> {
  const entry: AdminAuditEntry = {
    id: crypto.randomUUID(),
    actorId: actor.id,
    actorEmail: actor.email,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date().toISOString(),
  };

  auditLogsStore.unshift(entry);
  if (auditLogsStore.length > 200) {
    auditLogsStore.pop();
  }

  // Persist to Supabase admin_audit_logs if available
  const supabase = getServiceSupabase();
  if (isServerSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from("admin_audit_logs").insert({
        id: entry.id,
        actor_id: actor.id === "admin-vault-master" ? null : actor.id,
        actor_email: actor.email,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        details: entry.details,
      });
    } catch (e) {
      console.warn("DB audit log error:", e);
    }
  }

  return entry;
}

export function getAdminAuditLogs(limit = 50): AdminAuditEntry[] {
  return auditLogsStore.slice(0, limit);
}

// ========================================================================
// PRODUCT MANAGEMENT
// ========================================================================

export function getAdminProducts(): MockProduct[] {
  // Ensure default status is assigned if not set
  return MOCK_PRODUCTS.map((p) => ({
    ...p,
    status: p.status || "active",
    sku: p.sku || `AUR-${p.category.slice(0, 3).toUpperCase()}-${p.slug.slice(0, 4).toUpperCase()}`,
  }));
}

export function getAdminProductById(id: string): MockProduct | null {
  const p = MOCK_PRODUCTS.find((item) => item.id === id || item.slug === id);
  if (!p) return null;
  return {
    ...p,
    status: p.status || "active",
    sku: p.sku || `AUR-${p.category.slice(0, 3).toUpperCase()}-${p.slug.slice(0, 4).toUpperCase()}`,
  };
}

export async function createAdminProduct(
  actor: AdminActor,
  data: z.infer<typeof AdminCreateProductSchema>
): Promise<MockProduct> {
  const existing = MOCK_PRODUCTS.find((p) => p.slug === data.slug);
  if (existing) {
    throw new Error(`A product with slug "${data.slug}" already exists.`);
  }

  const generatedSku =
    data.sku || `AUR-${data.category.slice(0, 3).toUpperCase()}-${data.slug.slice(0, 4).toUpperCase()}`;

  const newProduct: MockProduct = {
    id: "prod-" + (MOCK_PRODUCTS.length + 1),
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle || "",
    category: data.category,
    categorySlug: data.categorySlug,
    sku: generatedSku,
    status: data.status || "active",
    pricePaise: data.pricePaise,
    compareAtPaise: data.compareAtPaise ?? undefined,
    badge: data.badge ?? undefined,
    fabric: data.fabric,
    craft: data.craft,
    colors: data.colors,
    sizes: data.sizes,
    images: data.images,
    inStock: data.stockCount > 0,
    stockCount: data.stockCount,
    rating: 5.0,
    reviewsCount: 1,
    description: data.description,
    details: data.details || [],
    isNewArrival: true,
  };

  MOCK_PRODUCTS.unshift(newProduct);

  await logAdminAction(actor, "CREATE_PRODUCT", "product", newProduct.id, {
    title: newProduct.title,
    slug: newProduct.slug,
    sku: newProduct.sku,
    category: newProduct.category,
    pricePaise: newProduct.pricePaise,
    compareAtPaise: newProduct.compareAtPaise,
    stockCount: newProduct.stockCount,
    status: newProduct.status,
  });

  return newProduct;
}

export async function updateAdminProduct(
  actor: AdminActor,
  productId: string,
  updates: z.infer<typeof AdminUpdateProductSchema>
): Promise<MockProduct> {
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === productId);
  if (index === -1) {
    throw new Error(`Product not found with ID "${productId}".`);
  }

  const current = MOCK_PRODUCTS[index];
  const updated: MockProduct = {
    ...current,
    ...updates,
    badge: updates.badge === null ? undefined : (updates.badge ?? current.badge),
    compareAtPaise: updates.compareAtPaise === null ? undefined : (updates.compareAtPaise ?? current.compareAtPaise),
    status: updates.status ?? current.status ?? "active",
    inStock: updates.stockCount !== undefined ? updates.stockCount > 0 : (updates.inStock ?? current.inStock),
  };

  MOCK_PRODUCTS[index] = updated;

  await logAdminAction(actor, "UPDATE_PRODUCT", "product", productId, {
    changedFields: Object.keys(updates),
    updates,
    previous: {
      pricePaise: current.pricePaise,
      compareAtPaise: current.compareAtPaise,
      stockCount: current.stockCount,
      title: current.title,
      status: current.status,
      category: current.category,
    },
  });

  return updated;
}

/**
 * Toggle product publishing status: active (published), draft (unpublished), or archived
 */
export async function setProductStatus(
  actor: AdminActor,
  productId: string,
  status: "active" | "draft" | "archived"
): Promise<MockProduct> {
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === productId);
  if (index === -1) {
    throw new Error(`Product not found with ID "${productId}".`);
  }

  const current = MOCK_PRODUCTS[index];
  const previousStatus = current.status || "active";
  current.status = status;

  await logAdminAction(actor, "SET_PRODUCT_STATUS", "product", productId, {
    productTitle: current.title,
    previousStatus,
    newStatus: status,
  });

  return current;
}

/**
 * Delete or safely archive a product from master catalog
 */
export async function deleteAdminProduct(
  actor: AdminActor,
  productId: string
): Promise<{ success: boolean; deletedId: string; title: string }> {
  const index = MOCK_PRODUCTS.findIndex((p) => p.id === productId);
  if (index === -1) {
    throw new Error(`Product not found with ID "${productId}".`);
  }

  const product = MOCK_PRODUCTS[index];
  MOCK_PRODUCTS.splice(index, 1);

  await logAdminAction(actor, "DELETE_PRODUCT", "product", productId, {
    productTitle: product.title,
    slug: product.slug,
    pricePaise: product.pricePaise,
  });

  return { success: true, deletedId: productId, title: product.title };
}

// ========================================================================
// SAFE INVENTORY MANAGEMENT
// ========================================================================

export async function updateAdminInventory(
  actor: AdminActor,
  payload: z.infer<typeof AdminUpdateInventorySchema>
): Promise<{ product: MockProduct; previousStock: number; newStock: number }> {
  const product = MOCK_PRODUCTS.find((p) => p.id === payload.productId);
  if (!product) {
    throw new Error(`Product not found with ID "${payload.productId}".`);
  }

  const previousStock = product.stockCount;
  const newStock = payload.stockCount;

  product.stockCount = newStock;
  product.inStock = payload.inStock !== undefined ? payload.inStock : newStock > 0;

  await logAdminAction(actor, "UPDATE_INVENTORY", "inventory", product.id, {
    productTitle: product.title,
    previousStock,
    newStock,
    inStock: product.inStock,
    diff: newStock - previousStock,
  });

  return { product, previousStock, newStock };
}

// ========================================================================
// CATEGORY MANAGEMENT
// ========================================================================

export function getAdminCategories(): MasterCategory[] {
  // Compute item count per category dynamically
  return MOCK_CATEGORIES.map((cat) => {
    const count = MOCK_PRODUCTS.filter(
      (p) => p.categorySlug === cat.slug || p.category.toLowerCase() === cat.name.toLowerCase()
    ).length;
    return {
      ...cat,
      itemCount: count,
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getActiveCategories(): MasterCategory[] {
  return getAdminCategories().filter((c) => c.isActive);
}

export async function createAdminCategory(
  actor: AdminActor,
  data: z.infer<typeof AdminCreateCategorySchema>
): Promise<MasterCategory> {
  const existing = MOCK_CATEGORIES.find((c) => c.slug === data.slug);
  if (existing) {
    throw new Error(`A category with slug "${data.slug}" already exists.`);
  }

  const maxOrder = MOCK_CATEGORIES.reduce((max, c) => Math.max(max, c.sortOrder), 0);
  const newCategory: MasterCategory = {
    id: "cat-" + (MOCK_CATEGORIES.length + 1),
    name: data.name,
    slug: data.slug,
    description: data.description,
    imageUrl:
      data.imageUrl ||
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    sortOrder: data.sortOrder || maxOrder + 1,
    isActive: true,
    itemCount: 0,
  };

  MOCK_CATEGORIES.push(newCategory);

  await logAdminAction(actor, "CREATE_CATEGORY", "category", newCategory.id, {
    name: newCategory.name,
    slug: newCategory.slug,
    sortOrder: newCategory.sortOrder,
  });

  return newCategory;
}

export async function updateAdminCategory(
  actor: AdminActor,
  categoryId: string,
  updates: z.infer<typeof AdminUpdateCategorySchema>
): Promise<MasterCategory> {
  const index = MOCK_CATEGORIES.findIndex((c) => c.id === categoryId);
  if (index === -1) {
    throw new Error(`Category not found with ID "${categoryId}".`);
  }

  const current = MOCK_CATEGORIES[index];
  const updated: MasterCategory = {
    ...current,
    ...updates,
  };

  MOCK_CATEGORIES[index] = updated;

  await logAdminAction(actor, "UPDATE_CATEGORY", "category", categoryId, {
    changedFields: Object.keys(updates),
    updates,
    previous: {
      name: current.name,
      slug: current.slug,
      isActive: current.isActive,
    },
  });

  return updated;
}

/**
 * Reorder categories according to array order
 */
export async function reorderAdminCategories(
  actor: AdminActor,
  categoryIds: string[]
): Promise<MasterCategory[]> {
  categoryIds.forEach((id, index) => {
    const cat = MOCK_CATEGORIES.find((c) => c.id === id);
    if (cat) {
      cat.sortOrder = index + 1;
    }
  });

  await logAdminAction(actor, "REORDER_CATEGORIES", "category", "batch", {
    orderedIds: categoryIds,
  });

  return getAdminCategories();
}

/**
 * Toggle category archive state
 */
export async function toggleCategoryArchive(
  actor: AdminActor,
  categoryId: string,
  isActive: boolean
): Promise<MasterCategory> {
  const index = MOCK_CATEGORIES.findIndex((c) => c.id === categoryId);
  if (index === -1) {
    throw new Error(`Category not found with ID "${categoryId}".`);
  }

  const current = MOCK_CATEGORIES[index];
  current.isActive = isActive;

  await logAdminAction(actor, "TOGGLE_CATEGORY_ARCHIVE", "category", categoryId, {
    categoryName: current.name,
    isActive,
  });

  return current;
}

// ========================================================================
// COLLECTION MANAGEMENT
// ========================================================================

export function getAdminCollections(): CollectionItem[] {
  return MOCK_COLLECTIONS;
}

export async function createAdminCollection(
  actor: AdminActor,
  data: z.infer<typeof AdminCreateCollectionSchema>
): Promise<CollectionItem> {
  const existing = MOCK_COLLECTIONS.find((c) => c.slug === data.slug);
  if (existing) {
    throw new Error(`Collection with slug "${data.slug}" already exists.`);
  }

  const newCollection: CollectionItem = {
    id: "col-" + (MOCK_COLLECTIONS.length + 1),
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle || "",
    imageUrl: data.imageUrl,
    itemCount: 0,
  };

  MOCK_COLLECTIONS.push(newCollection);

  await logAdminAction(actor, "CREATE_COLLECTION", "collection", newCollection.id, {
    title: newCollection.title,
    slug: newCollection.slug,
  });

  return newCollection;
}

export async function updateAdminCollection(
  actor: AdminActor,
  collectionId: string,
  updates: z.infer<typeof AdminUpdateCollectionSchema>
): Promise<CollectionItem> {
  const index = MOCK_COLLECTIONS.findIndex((c) => c.id === collectionId);
  if (index === -1) {
    throw new Error(`Collection not found with ID "${collectionId}".`);
  }

  const current = MOCK_COLLECTIONS[index];
  const updated: CollectionItem = {
    ...current,
    ...updates,
  };

  MOCK_COLLECTIONS[index] = updated;

  await logAdminAction(actor, "UPDATE_COLLECTION", "collection", collectionId, {
    changedFields: Object.keys(updates),
    updates,
  });

  return updated;
}
