"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  Layers,
  Package,
  Boxes,
  FileText,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Archive,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Key,
  RefreshCw,
  Search,
  ExternalLink,
  X,
  Eye,
  EyeOff,
  FolderTree,
} from "lucide-react";

interface AdminStats {
  totalProducts: number;
  inStockProducts: number;
  lowStockProductsCount: number;
  outOfStockProductsCount: number;
  totalCollections: number;
}

interface ProductItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categorySlug: string;
  sku?: string;
  status?: "active" | "draft" | "archived";
  pricePaise: number;
  compareAtPaise?: number;
  badge?: string;
  fabric: string;
  craft: string;
  stockCount: number;
  inStock: boolean;
  description: string;
  details?: string[];
  images: Array<{ url: string; alt: string }>;
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  itemCount: number;
}

interface AuditLogEntry {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  createdAt: string;
}

export default function AdminDashboardPage() {
  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
  const [passkeyInput, setPasskeyInput] = React.useState("");
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isVerifyingAuth, setIsVerifyingAuth] = React.useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "products" | "categories" | "inventory" | "audit"
  >("overview");

  // Data States
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [lowStockAlerts, setLowStockAlerts] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AuditLogEntry[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(false);

  // Feedback Toast
  const [actionFeedback, setActionFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modals state
  const [isNewProductModalOpen, setIsNewProductModalOpen] = React.useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null);

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = React.useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null);

  // New Product Form States
  const [newTitle, setNewTitle] = React.useState("");
  const [newSlug, setNewSlug] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Sarees");
  const [newSku, setNewSku] = React.useState("");
  const [newPriceRupees, setNewPriceRupees] = React.useState("28500");
  const [newCompareAtRupees, setNewCompareAtRupees] = React.useState("");
  const [newFabric, setNewFabric] = React.useState("100% Pure Mulberry Silk");
  const [newCraft, setNewCraft] = React.useState("Handloom Zari Weave");
  const [newStock, setNewStock] = React.useState("5");
  const [newStatus, setNewStatus] = React.useState<"active" | "draft">("active");
  const [newDescription, setNewDescription] = React.useState("");
  const [newImageUrl, setNewImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
  );
  const [newSizes, setNewSizes] = React.useState("Unstitched (6.5m with Blouse)");
  const [newColorName, setNewColorName] = React.useState("Royal Crimson");
  const [newColorHex, setNewColorHex] = React.useState("#7A1C20");

  // Edit Product Form States
  const [editTitle, setEditTitle] = React.useState("");
  const [editSlug, setEditSlug] = React.useState("");
  const [editCategory, setEditCategory] = React.useState("");
  const [editSku, setEditSku] = React.useState("");
  const [editPriceRupees, setEditPriceRupees] = React.useState("");
  const [editCompareAtRupees, setEditCompareAtRupees] = React.useState("");
  const [editFabric, setEditFabric] = React.useState("");
  const [editCraft, setEditCraft] = React.useState("");
  const [editStock, setEditStock] = React.useState("");
  const [editStatus, setEditStatus] = React.useState<"active" | "draft" | "archived">("active");
  const [editDescription, setEditDescription] = React.useState("");
  const [editImageUrl, setEditImageUrl] = React.useState("");
  const [editSizes, setEditSizes] = React.useState("");
  const [editColorName, setEditColorName] = React.useState("");
  const [editColorHex, setEditColorHex] = React.useState("");

  // New Category Form States
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatSlug, setNewCatSlug] = React.useState("");
  const [newCatDescription, setNewCatDescription] = React.useState("");
  const [newCatImageUrl, setNewCatImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
  );

  // Edit Category Form States
  const [editCatName, setEditCatName] = React.useState("");
  const [editCatSlug, setEditCatSlug] = React.useState("");
  const [editCatDescription, setEditCatDescription] = React.useState("");
  const [editCatImageUrl, setEditCatImageUrl] = React.useState("");

  // Check existing session on load
  React.useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch("/api/admin/overview");
        if (res.ok) {
          setIsAdminAuthenticated(true);
          loadDashboardData();
        }
      } catch (err) {
        // Not authenticated
      }
    }
    checkExistingSession();
  }, []);

  const showFeedback = (type: "success" | "error", message: string) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 4500);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifyingAuth(true);

    try {
      const res = await fetch("/api/admin/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey: passkeyInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      setIsAdminAuthenticated(true);
      setPasskeyInput("");
      showFeedback("success", "Atelier Administrative Vault Unlocked");
      loadDashboardData();
    } catch (err: any) {
      setAuthError(err.message || "Invalid administrative credentials.");
    } finally {
      setIsVerifyingAuth(false);
    }
  };

  const handleAdminLogout = async () => {
    await fetch("/api/admin/auth/session", { method: "DELETE" });
    setIsAdminAuthenticated(false);
    setStats(null);
    setProducts([]);
  };

  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Overview
      const overviewRes = await fetch("/api/admin/overview");
      if (overviewRes.ok) {
        const overviewJson = await overviewRes.json();
        setStats(overviewJson.data.stats);
        setLowStockAlerts(overviewJson.data.lowStockAlerts);
        setAuditLogs(overviewJson.data.recentAuditLogs);
      }

      // 2. Products
      const prodRes = await fetch("/api/admin/products");
      if (prodRes.ok) {
        const prodJson = await prodRes.json();
        setProducts(prodJson.products || []);
      }

      // 3. Categories
      const catRes = await fetch("/api/admin/categories");
      if (catRes.ok) {
        const catJson = await catRes.json();
        setCategories(catJson.categories || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      showFeedback("error", "Failed to refresh dashboard data.");
    } finally {
      setIsLoadingData(false);
    }
  };

  // ========================================================================
  // PRODUCT ACTION HANDLERS
  // ========================================================================

  const handleToggleProductStatus = async (productId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "active" ? "draft" : "active";
    try {
      const res = await fetch(`/api/admin/products/${productId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Status update failed.");
      }

      showFeedback(
        "success",
        `Product marked as ${nextStatus === "active" ? "Published (Active on Storefront)" : "Unpublished (Draft)"}`
      );
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to update product status.");
    }
  };

  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${title}" from the atelier catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product.");
      }

      showFeedback("success", `Product "${title}" removed from catalog.`);
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to delete product.");
    }
  };

  const handleOpenEditProduct = (product: ProductItem) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditSlug(product.slug);
    setEditCategory(product.category);
    setEditSku(product.sku || "");
    setEditPriceRupees(String(product.pricePaise / 100));
    setEditCompareAtRupees(product.compareAtPaise ? String(product.compareAtPaise / 100) : "");
    setEditFabric(product.fabric);
    setEditCraft(product.craft);
    setEditStock(String(product.stockCount));
    setEditStatus(product.status || "active");
    setEditDescription(product.description);
    setEditImageUrl(product.images[0]?.url || "");
    setEditSizes(product.sizes.join(", "));
    setEditColorName(product.colors[0]?.name || "Original");
    setEditColorHex(product.colors[0]?.hex || "#000000");
    setIsEditProductModalOpen(true);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceRupeesNum = parseFloat(editPriceRupees);
    if (isNaN(priceRupeesNum) || priceRupeesNum <= 0) {
      showFeedback("error", "Valid price in Rupees is required.");
      return;
    }

    const pricePaise = Math.round(priceRupeesNum * 100);
    const compareAtPaise = editCompareAtRupees.trim()
      ? Math.round(parseFloat(editCompareAtRupees) * 100)
      : null;

    const stockNum = parseInt(editStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showFeedback("error", "Stock cannot be negative.");
      return;
    }

    const matchedCat = categories.find((c) => c.name.toLowerCase() === editCategory.toLowerCase());
    const categorySlug = matchedCat ? matchedCat.slug : editCategory.toLowerCase().replace(/\s+/g, "-");

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          slug: editSlug.trim().toLowerCase(),
          category: editCategory,
          categorySlug,
          sku: editSku.trim(),
          pricePaise,
          compareAtPaise,
          stockCount: stockNum,
          status: editStatus,
          fabric: editFabric.trim(),
          craft: editCraft.trim(),
          description: editDescription.trim(),
          sizes: editSizes.split(",").map((s) => s.trim()).filter(Boolean),
          colors: [{ name: editColorName.trim(), hex: editColorHex.trim() }],
          images: [
            {
              url: editImageUrl.trim(),
              alt: editTitle.trim(),
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product edits.");
      }

      showFeedback("success", `Product "${editTitle}" successfully updated.`);
      setIsEditProductModalOpen(false);
      setEditingProduct(null);
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to save product.");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceRupeesNum = parseFloat(newPriceRupees);
    if (isNaN(priceRupeesNum) || priceRupeesNum <= 0) {
      showFeedback("error", "Valid price in Rupees is required.");
      return;
    }

    const pricePaise = Math.round(priceRupeesNum * 100);
    const compareAtPaise = newCompareAtRupees.trim()
      ? Math.round(parseFloat(newCompareAtRupees) * 100)
      : undefined;

    const stockNum = parseInt(newStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showFeedback("error", "Stock cannot be negative.");
      return;
    }

    const matchedCat = categories.find((c) => c.name.toLowerCase() === newCategory.toLowerCase());
    const categorySlug = matchedCat ? matchedCat.slug : newCategory.toLowerCase().replace(/\s+/g, "-");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug: newSlug.trim().toLowerCase(),
          subtitle: "Handcrafted Varanasi Pure Silk",
          category: newCategory,
          categorySlug,
          sku: newSku.trim() || undefined,
          pricePaise,
          compareAtPaise,
          stockCount: stockNum,
          status: newStatus,
          fabric: newFabric.trim(),
          craft: newCraft.trim(),
          description: newDescription.trim() || `Exquisite handcrafted ${newTitle} from Varanasi.`,
          colors: [{ name: newColorName.trim(), hex: newColorHex.trim() }],
          sizes: newSizes.split(",").map((s) => s.trim()).filter(Boolean),
          images: [
            {
              url: newImageUrl.trim(),
              alt: newTitle.trim(),
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product.");
      }

      showFeedback("success", `Product "${newTitle}" created in master catalog.`);
      setIsNewProductModalOpen(false);
      setNewTitle("");
      setNewSlug("");
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to create product.");
    }
  };

  // Safe inventory stock adjustment
  const handleUpdateStock = async (productId: string, newStockCount: number) => {
    if (newStockCount < 0) {
      showFeedback("error", "Stock cannot be negative.");
      return;
    }

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          stockCount: newStockCount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update inventory.");
      }

      showFeedback("success", `Stock updated to ${newStockCount} units.`);
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to update inventory.");
    }
  };

  // ========================================================================
  // CATEGORY ACTION HANDLERS
  // ========================================================================

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug: newCatSlug.trim().toLowerCase(),
          description: newCatDescription.trim(),
          imageUrl: newCatImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create category.");
      }

      showFeedback("success", `Category "${newCatName}" added.`);
      setIsNewCategoryModalOpen(false);
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDescription("");
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to create category.");
    }
  };

  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatDescription(cat.description);
    setEditCatImageUrl(cat.imageUrl || "");
    setIsEditCategoryModalOpen(true);
  };

  const handleSaveEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCatName.trim(),
          slug: editCatSlug.trim().toLowerCase(),
          description: editCatDescription.trim(),
          imageUrl: editCatImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update category.");
      }

      showFeedback("success", `Category "${editCatName}" updated.`);
      setIsEditCategoryModalOpen(false);
      setEditingCategory(null);
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to update category.");
    }
  };

  const handleToggleCategoryArchive = async (cat: CategoryItem) => {
    const nextActive = !cat.isActive;
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update category archive state.");
      }

      showFeedback(
        "success",
        `Category "${cat.name}" marked as ${nextActive ? "Active" : "Archived"}.`
      );
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to toggle category archive state.");
    }
  };

  const handleReorderCategory = async (categoryId: string, direction: "up" | "down") => {
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === categories.length - 1) return;

    const newCategories = [...categories];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newCategories[index];
    newCategories[index] = newCategories[swapIndex];
    newCategories[swapIndex] = temp;

    const orderedIds = newCategories.map((c) => c.id);

    try {
      const res = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds: orderedIds }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Reorder failed.");
      }

      showFeedback("success", "Category order updated.");
      loadDashboardData();
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to reorder categories.");
    }
  };

  // ========================================================================
  // RENDER: Unauthenticated Vault Lock View
  // ========================================================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 py-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-stone-950 border border-stone-800 p-8 md:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-aurelle-burgundy/20 border border-aurelle-burgundy/50 text-aurelle-gold flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6" />
            </div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-aurelle-gold">
              Atelier Vault Protection
            </span>
            <h1 className="font-serif text-2xl text-stone-100">
              Administrator Console
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              Restricted to authorized atelier curators. Server-side role authorization guards all privileged endpoints.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider uppercase text-stone-300">
                Administrative Passkey
              </label>
              <Input
                type="password"
                placeholder="Enter vault passkey..."
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="bg-stone-900 border-stone-700 text-stone-100 focus:border-aurelle-gold font-mono"
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isVerifyingAuth}
              className="w-full py-3 bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink text-xs uppercase tracking-luxury transition-colors font-medium"
            >
              {isVerifyingAuth ? "Verifying Authority..." : "Unlock Vault"}
            </Button>
          </form>

          {/* Local Dev Helper (strictly disabled in production) */}
          {process.env.NODE_ENV !== "production" && (
            <div className="pt-4 border-t border-stone-800/80 text-center space-y-2">
              <p className="text-[10px] text-stone-500">
                [Local Dev Sandbox] Set <code className="text-stone-300">ADMIN_SECRET_KEY</code> in <code className="text-stone-300">.env.local</code> for production.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPasskeyInput("aurelle_admin_vault_passkey_2026");
                }}
                className="text-[11px] text-aurelle-gold hover:underline tracking-wider uppercase font-mono"
              >
                Fill Dev Passkey
              </button>
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              ← Return to Aurelle Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // RENDER: Authenticated Admin Dashboard
  // ========================================================================
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-stone-50 text-aurelle-ink pb-20">
      {/* Admin Top Banner */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg tracking-wider text-aurelle-cream font-semibold">
                  AURELLE
                </span>
                <span className="text-[10px] tracking-widest text-aurelle-gold font-mono uppercase">
                  Atelier Vault [Admin]
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-stone-400 hidden sm:inline font-mono">
                Operator: <span className="text-stone-200 font-semibold">admin@aurelle.in</span>
              </span>
              <button
                onClick={loadDashboardData}
                disabled={isLoadingData}
                className="p-1.5 text-stone-400 hover:text-stone-100 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
              </button>
              <Link
                href="/collections"
                target="_blank"
                className="inline-flex items-center gap-1 text-stone-300 hover:text-aurelle-gold transition-colors"
              >
                <span>Storefront Catalog</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-stone-100 transition-colors uppercase tracking-wider text-[11px]"
              >
                <LogOut className="w-3 h-3" />
                <span>Lock Vault</span>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`px-4 py-3 shadow-xl border text-xs flex items-center gap-2 ${
              actionFeedback.type === "success"
                ? "bg-emerald-900 border-emerald-700 text-emerald-100"
                : "bg-red-900 border-red-700 text-red-100"
            }`}
          >
            {actionFeedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-aurelle-border">
        <Container>
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-2.5 text-xs tracking-wider uppercase font-medium scrollbar-none">
            <button
              onClick={() => setActiveTab("overview")}
              className={`shrink-0 whitespace-nowrap pb-1.5 border-b-2 transition-all flex items-center gap-1.5 min-h-[38px] px-2 sm:px-1 ${
                activeTab === "overview"
                  ? "border-aurelle-burgundy text-aurelle-burgundy font-semibold"
                  : "border-transparent text-aurelle-muted hover:text-aurelle-ink"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`shrink-0 whitespace-nowrap pb-1.5 border-b-2 transition-all flex items-center gap-1.5 min-h-[38px] px-2 sm:px-1 ${
                activeTab === "products"
                  ? "border-aurelle-burgundy text-aurelle-burgundy font-semibold"
                  : "border-transparent text-aurelle-muted hover:text-aurelle-ink"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`shrink-0 whitespace-nowrap pb-1.5 border-b-2 transition-all flex items-center gap-1.5 min-h-[38px] px-2 sm:px-1 ${
                activeTab === "categories"
                  ? "border-aurelle-burgundy text-aurelle-burgundy font-semibold"
                  : "border-transparent text-aurelle-muted hover:text-aurelle-ink"
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`shrink-0 whitespace-nowrap pb-1.5 border-b-2 transition-all flex items-center gap-1.5 min-h-[38px] px-2 sm:px-1 ${
                activeTab === "inventory"
                  ? "border-aurelle-burgundy text-aurelle-burgundy font-semibold"
                  : "border-transparent text-aurelle-muted hover:text-aurelle-ink"
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Inventory</span>
              {stats && stats.lowStockProductsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                  {stats.lowStockProductsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`shrink-0 whitespace-nowrap pb-1.5 border-b-2 transition-all flex items-center gap-1.5 min-h-[38px] px-2 sm:px-1 ${
                activeTab === "audit"
                  ? "border-aurelle-burgundy text-aurelle-burgundy font-semibold"
                  : "border-transparent text-aurelle-muted hover:text-aurelle-ink"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>
          </div>
        </Container>
      </div>

      <Container className="pt-8">
        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ==================================================================== */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 border border-aurelle-border shadow-sm space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-aurelle-muted font-medium">
                  Total Products
                </span>
                <p className="text-3xl font-serif text-aurelle-ink">{products.length}</p>
                <p className="text-[11px] text-emerald-800">
                  {products.filter((p) => p.status === "active").length} Published active
                </p>
              </div>

              <div className="bg-white p-6 border border-aurelle-border shadow-sm space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-aurelle-muted font-medium">
                  Categories Active
                </span>
                <p className="text-3xl font-serif text-aurelle-ink">{categories.filter((c) => c.isActive).length}</p>
                <p className="text-[11px] text-aurelle-muted">{categories.length} total curated</p>
              </div>

              <div className="bg-white p-6 border border-aurelle-border shadow-sm space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-aurelle-muted font-medium">
                  Low Stock Warnings
                </span>
                <p className="text-3xl font-serif text-amber-700">{stats.lowStockProductsCount}</p>
                <p className="text-[11px] text-amber-900">≤ 3 pieces in atelier</p>
              </div>

              <div className="bg-white p-6 border border-aurelle-border shadow-sm space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-aurelle-muted font-medium">
                  Audit Records
                </span>
                <p className="text-3xl font-serif text-aurelle-ink">{auditLogs.length}</p>
                <p className="text-[11px] text-emerald-800">Server verified mutations</p>
              </div>
            </div>

            {/* Low stock alerts */}
            {lowStockAlerts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <span>Immediate Inventory Replenishment Recommended</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {lowStockAlerts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 border border-amber-300 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-aurelle-ink truncate max-w-[180px]">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-amber-800 font-mono">
                          Only {item.stockCount} left in atelier
                        </span>
                      </div>
                      <button
                        onClick={() => handleUpdateStock(item.id, item.stockCount + 5)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] uppercase font-bold tracking-wider"
                      >
                        +5 Stock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PRODUCTS CATALOG (COMPLETE MANAGEMENT) */}
        {/* ==================================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-aurelle-muted absolute left-3 top-3" />
                <Input
                  type="text"
                  placeholder="Search products by title, SKU, category, fabric..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>

              <Button
                onClick={() => setIsNewProductModalOpen(true)}
                className="bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink text-xs uppercase tracking-luxury font-medium"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Add Product</span>
              </Button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-aurelle-border shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-aurelle-border text-[11px] uppercase tracking-wider text-stone-600">
                  <tr>
                    <th className="py-3.5 px-4">Heirloom Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price / Compare-at</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurelle-border/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-aurelle-cream/10">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]?.url}
                            alt={p.title}
                            className="w-10 h-14 object-cover bg-stone-100 border border-aurelle-border shrink-0"
                          />
                          <div>
                            <p className="font-serif font-semibold text-aurelle-ink text-sm">
                              {p.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-aurelle-muted font-mono">
                              <span>SKU: {p.sku || "N/A"}</span>
                              <span>•</span>
                              <span>{p.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded text-[11px] font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-aurelle-ink text-sm">
                          {formatPrice(p.pricePaise)}
                        </span>
                        {p.compareAtPaise && p.compareAtPaise > p.pricePaise && (
                          <span className="block text-[10px] text-stone-400 line-through font-mono">
                            {formatPrice(p.compareAtPaise)}
                          </span>
                        )}
                        <span className="block text-[10px] text-stone-400 font-mono">
                          {p.pricePaise} paise
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-semibold ${
                            p.stockCount <= 3 ? "text-amber-700" : "text-aurelle-ink"
                          }`}
                        >
                          {p.stockCount} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.status === "draft" ? (
                          <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-semibold uppercase tracking-wider">
                            Draft (Hidden)
                          </span>
                        ) : p.status === "archived" ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-semibold uppercase tracking-wider">
                            Archived
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-semibold uppercase tracking-wider">
                            Active (Live)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleProductStatus(p.id, p.status)}
                          className={`px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                            p.status === "active"
                              ? "border-stone-300 text-stone-600 hover:bg-stone-100"
                              : "border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          }`}
                          title={p.status === "active" ? "Unpublish to Draft" : "Publish Live"}
                        >
                          {p.status === "active" ? "Draft" : "Publish"}
                        </button>

                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="px-2.5 py-1 bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink text-[11px] font-medium transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1 text-stone-400 hover:text-red-700 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: CATEGORIES MANAGEMENT (ADD / EDIT / REORDER / ARCHIVE) */}
        {/* ==================================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg text-aurelle-ink font-semibold">
                  Category Management
                </h3>
                <p className="text-xs text-aurelle-muted">
                  Organize drapes into curated categories, reorder showcase sequences, and archive collections.
                </p>
              </div>

              <Button
                onClick={() => setIsNewCategoryModalOpen(true)}
                className="bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink text-xs uppercase tracking-luxury font-medium"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Add Category</span>
              </Button>
            </div>

            <div className="bg-white border border-aurelle-border shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-aurelle-border text-[11px] uppercase tracking-wider text-stone-600">
                  <tr>
                    <th className="py-3.5 px-4">Order</th>
                    <th className="py-3.5 px-4">Category Name</th>
                    <th className="py-3.5 px-4">Slug</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Assigned Items</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurelle-border/60">
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-aurelle-cream/10">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-stone-700 w-5">
                            {cat.sortOrder}
                          </span>
                          <button
                            onClick={() => handleReorderCategory(cat.id, "up")}
                            disabled={idx === 0}
                            className="p-1 text-stone-400 hover:text-stone-900 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorderCategory(cat.id, "down")}
                            disabled={idx === categories.length - 1}
                            className="p-1 text-stone-400 hover:text-stone-900 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {cat.imageUrl && (
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-8 h-8 object-cover rounded border border-aurelle-border"
                            />
                          )}
                          <span className="font-semibold text-aurelle-ink font-serif text-sm">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-aurelle-muted">{cat.slug}</td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                        {cat.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-medium text-stone-800">
                          {cat.itemCount} items
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {cat.isActive ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-semibold uppercase">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-semibold uppercase">
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleCategoryArchive(cat)}
                          className={`px-2.5 py-1 text-[11px] font-medium border ${
                            cat.isActive
                              ? "border-stone-300 text-stone-600 hover:bg-stone-100"
                              : "border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          }`}
                        >
                          {cat.isActive ? "Archive" : "Unarchive"}
                        </button>
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: INVENTORY CONTROL */}
        {/* ==================================================================== */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 leading-relaxed">
              <strong>Transactional Inventory Safeguard:</strong> Negative inventory counts are rejected by server Zod validation. Modifying stock triggers an immediate cryptographically logged audit record.
            </div>

            <div className="bg-white border border-aurelle-border shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-aurelle-border text-[11px] uppercase tracking-wider text-stone-600">
                  <tr>
                    <th className="py-3.5 px-4">Item &amp; SKU</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Current Stock</th>
                    <th className="py-3.5 px-4">Stock Health</th>
                    <th className="py-3.5 px-4 text-right">Quick Stock Adjustments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurelle-border/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-aurelle-cream/10">
                      <td className="py-3 px-4">
                        <p className="font-serif font-semibold text-aurelle-ink">{p.title}</p>
                        <span className="font-mono text-[10px] text-aurelle-muted">
                          {p.sku || p.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-aurelle-muted">{p.category}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-base text-aurelle-ink">
                          {p.stockCount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.stockCount === 0 ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-900 text-[10px] font-bold">
                            Sold Out
                          </span>
                        ) : p.stockCount <= 3 ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold">
                            Critical (≤ 3 units)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateStock(p.id, Math.max(0, p.stockCount - 1))}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono font-bold text-xs"
                          title="Reduce Stock by 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleUpdateStock(p.id, p.stockCount + 1)}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono font-bold text-xs"
                          title="Increase Stock by 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleUpdateStock(p.id, p.stockCount + 5)}
                          className="px-2.5 py-1 bg-aurelle-cream/40 border border-aurelle-border hover:border-aurelle-gold text-aurelle-ink text-[11px] font-semibold"
                        >
                          +5 Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: AUDIT TRAIL */}
        {/* ==================================================================== */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="bg-stone-900 text-stone-200 p-4 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Immutable Privileged Audit Log</span>
              </div>
              <p className="text-[11px] text-stone-400">
                All price modifications, stock decrements, and product additions are cryptographically tracked with operator actor email, entity ID, and previous vs new states.
              </p>
            </div>

            <div className="bg-white border border-aurelle-border shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-aurelle-border text-[11px] uppercase tracking-wider text-stone-600">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Operator</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Target Entity</th>
                    <th className="py-3.5 px-4">Mutation Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-aurelle-border/60 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/60">
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-stone-800 font-semibold">{log.actorEmail}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-900 rounded font-bold text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {log.entityType} ({log.entityId})
                      </td>
                      <td className="py-3 px-4 text-[10px] text-stone-500 max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>

      {/* ==================================================================== */}
      {/* MODAL: ADD NEW PRODUCT */}
      {/* ==================================================================== */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white max-w-2xl w-full p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-aurelle-border pb-3">
              <h3 className="font-serif text-lg sm:text-xl text-aurelle-ink font-semibold">
                Add New Heirloom Product
              </h3>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-2 -mr-1 text-stone-400 hover:text-stone-800 min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Product Title *</label>
                  <Input
                    required
                    placeholder="e.g. Neelambari Banarasi Saree"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (!newSlug) {
                        setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">URL Slug *</label>
                  <Input
                    required
                    placeholder="neelambari-banarasi-saree"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Category Assignment *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-10 px-3 border border-aurelle-border bg-white text-base sm:text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">SKU Code</label>
                  <Input
                    placeholder="e.g. AUR-SAR-NLM-01"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Publishing Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full h-10 px-3 border border-aurelle-border bg-white text-base sm:text-xs"
                  >
                    <option value="active">Active (Published on Storefront)</option>
                    <option value="draft">Draft (Private, not on storefront)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Price (INR) *</label>
                  <Input
                    type="number"
                    required
                    placeholder="28500"
                    value={newPriceRupees}
                    onChange={(e) => setNewPriceRupees(e.target.value)}
                  />
                  <p className="text-[10px] text-aurelle-muted font-mono">
                    = {parseInt(newPriceRupees || "0", 10) * 100} integer paise
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Compare-at Price (INR)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 34000 (Optional)"
                    value={newCompareAtRupees}
                    onChange={(e) => setNewCompareAtRupees(e.target.value)}
                  />
                  <p className="text-[10px] text-aurelle-muted">Original MRP for strikethrough</p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Initial Stock *</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Fabric</label>
                  <Input
                    required
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Craft / Weave</label>
                  <Input
                    required
                    value={newCraft}
                    onChange={(e) => setNewCraft(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Size Variants (comma-separated)</label>
                  <Input
                    value={newSizes}
                    onChange={(e) => setNewSizes(e.target.value)}
                    placeholder="Unstitched, XS, S, M, L, XL"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Color Variant (Name &amp; Hex)</label>
                  <div className="flex gap-2">
                    <Input
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Royal Crimson"
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-10 h-10 border border-aurelle-border p-1 bg-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Primary Image URL</label>
                <Input
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed artisanal craft history, weaving technique, and draping notes..."
                  className="w-full p-2.5 border border-aurelle-border text-base sm:text-xs focus:outline-none focus:border-aurelle-gold"
                />
              </div>

              <div className="pt-3 border-t border-aurelle-border flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewProductModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink"
                >
                  Create Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ==================================================================== */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white max-w-2xl w-full p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-2xl space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-aurelle-border pb-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-aurelle-ink font-semibold">
                  Edit Product: {editingProduct.title}
                </h3>
                <span className="font-mono text-[10px] text-aurelle-muted">
                  ID: {editingProduct.id}
                </span>
              </div>
              <button
                onClick={() => setIsEditProductModalOpen(false)}
                className="p-2 -mr-1 text-stone-400 hover:text-stone-800 min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Product Title *</label>
                  <Input
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">URL Slug *</label>
                  <Input
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Category Assignment *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full h-10 px-3 border border-aurelle-border bg-white text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">SKU</label>
                  <Input
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Status *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full h-10 px-3 border border-aurelle-border bg-white text-xs font-semibold"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="draft">Draft (Unpublished)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Retail Price (INR) *</label>
                  <Input
                    type="number"
                    required
                    value={editPriceRupees}
                    onChange={(e) => setEditPriceRupees(e.target.value)}
                  />
                  <p className="text-[10px] text-aurelle-muted font-mono">
                    = {Math.round(parseFloat(editPriceRupees || "0") * 100)} integer paise
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Compare-at Price (INR)</label>
                  <Input
                    type="number"
                    value={editCompareAtRupees}
                    onChange={(e) => setEditCompareAtRupees(e.target.value)}
                  />
                  <p className="text-[10px] text-aurelle-muted">Original MRP</p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Stock Count *</label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Fabric</label>
                  <Input
                    value={editFabric}
                    onChange={(e) => setEditFabric(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Craft / Weave</label>
                  <Input
                    value={editCraft}
                    onChange={(e) => setEditCraft(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Size Variants</label>
                  <Input
                    value={editSizes}
                    onChange={(e) => setEditSizes(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Color Variant</label>
                  <div className="flex gap-2">
                    <Input
                      value={editColorName}
                      onChange={(e) => setEditColorName(e.target.value)}
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={editColorHex}
                      onChange={(e) => setEditColorHex(e.target.value)}
                      className="w-10 h-10 border border-aurelle-border p-1 bg-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Image URL</label>
                <Input
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 border border-aurelle-border text-xs focus:outline-none focus:border-aurelle-gold"
                />
              </div>

              <div className="pt-3 border-t border-aurelle-border flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditProductModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink"
                >
                  Save Product Edits
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD CATEGORY */}
      {/* ==================================================================== */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white max-w-md w-full p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-2xl space-y-4 sm:space-y-5">
            <div className="flex justify-between items-center border-b border-aurelle-border pb-3">
              <h3 className="font-serif text-lg sm:text-xl text-aurelle-ink font-semibold">
                Add Curated Category
              </h3>
              <button
                onClick={() => setIsNewCategoryModalOpen(false)}
                className="p-2 -mr-1 text-stone-400 hover:text-stone-800 min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Category Name *</label>
                <Input
                  required
                  placeholder="e.g. Brocade Jackets"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">URL Slug *</label>
                <Input
                  required
                  placeholder="brocade-jackets"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Artisanal handwoven silk brocade jackets tailored for royals..."
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  className="w-full p-2.5 border border-aurelle-border text-base sm:text-xs focus:outline-none focus:border-aurelle-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Cover Image URL</label>
                <Input
                  value={newCatImageUrl}
                  onChange={(e) => setNewCatImageUrl(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-aurelle-border flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink"
                >
                  Create Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: EDIT CATEGORY */}
      {/* ==================================================================== */}
      {isEditCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white max-w-md w-full p-4 sm:p-6 md:p-8 border border-aurelle-border shadow-2xl space-y-4 sm:space-y-5">
            <div className="flex justify-between items-center border-b border-aurelle-border pb-3">
              <h3 className="font-serif text-lg sm:text-xl text-aurelle-ink font-semibold">
                Edit Category: {editingCategory.name}
              </h3>
              <button
                onClick={() => setIsEditCategoryModalOpen(false)}
                className="p-2 -mr-1 text-stone-400 hover:text-stone-800 min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Category Name *</label>
                <Input
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">URL Slug *</label>
                <Input
                  required
                  value={editCatSlug}
                  onChange={(e) => setEditCatSlug(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editCatDescription}
                  onChange={(e) => setEditCatDescription(e.target.value)}
                  className="w-full p-2.5 border border-aurelle-border text-xs focus:outline-none focus:border-aurelle-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Cover Image URL</label>
                <Input
                  value={editCatImageUrl}
                  onChange={(e) => setEditCatImageUrl(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-aurelle-border flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditCategoryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-aurelle-burgundy text-aurelle-cream hover:bg-aurelle-gold hover:text-aurelle-ink"
                >
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
