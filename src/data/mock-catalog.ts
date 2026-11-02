export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface MockProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  categorySlug: string;
  pricePaise: number; // integer paise (₹28,500 = 2850000)
  compareAtPaise?: number;
  badge?: "New In" | "Bestseller" | "Heritage" | "Handcrafted";
  fabric: string;
  craft: string;
  colors: ProductColor[];
  sizes: string[];
  images: ProductImage[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  sku?: string;
  status?: "active" | "draft" | "archived";
}

export interface MasterCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  itemCount: number;
}

export const MOCK_CATEGORIES: MasterCategory[] = [
  {
    id: "cat-1",
    name: "Sarees",
    slug: "banarasi-sarees",
    description: "Varanasi Mulberry Katan, Kadwa weaves & antique zari drapes",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    sortOrder: 1,
    isActive: true,
    itemCount: 4,
  },
  {
    id: "cat-2",
    name: "Lehengas",
    slug: "bridal-lehengas",
    description: "Imperial bridal lehengas with authentic dabka and zardozi hand-embroidery",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
    sortOrder: 2,
    isActive: true,
    itemCount: 3,
  },
  {
    id: "cat-3",
    name: "Kurta Sets",
    slug: "kurta-sets",
    description: "Festive pure silk anarkalis, angrakhas & celebratory kurta silhouettes",
    imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
    sortOrder: 3,
    isActive: true,
    itemCount: 3,
  },
  {
    id: "cat-4",
    name: "Dupattas",
    slug: "chanderi-dupattas",
    description: "Artisanal silk dupattas featuring meenakari borders and hand-fringed hems",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
    sortOrder: 4,
    isActive: true,
    itemCount: 2,
  },
];

export interface CollectionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  itemCount: number;
  imageUrl: string;
}

export const MOCK_COLLECTIONS: CollectionItem[] = [
  {
    id: "col-1",
    slug: "banarasi-sarees",
    title: "Varanasi Heritage Sarees",
    subtitle: "Pure Katan silk woven with real gold & silver kadwa zari",
    itemCount: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "col-2",
    slug: "bridal-lehengas",
    title: "Imperial Bridal Lehengas",
    subtitle: "Heirloom zardozi, hand-cut resham, and velvet masterworks",
    itemCount: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "col-3",
    slug: "kurta-sets",
    title: "Festive Anarkalis & Sets",
    subtitle: "Airy chanderi and tissue organza for celebratory afternoons",
    itemCount: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "col-4",
    slug: "chanderi-dupattas",
    title: "Artisanal Silk Dupattas",
    subtitle: "Fine gossamer silk with meenakari borders and hand-fringed hems",
    itemCount: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "prod-1",
    slug: "gulbagh-crimson-banarasi-saree",
    title: "Gulbagh Crimson Katan Saree",
    subtitle: "Pure Varanasi Mulberry Silk with Handwoven Antique Zari",
    category: "Sarees",
    categorySlug: "banarasi-sarees",
    pricePaise: 2850000,
    compareAtPaise: 3400000,
    badge: "New In",
    fabric: "100% Pure Katan Mulberry Silk",
    craft: "Kadwa Handloom Weave",
    colors: [
      { name: "Crimson Red", hex: "#7A1C20" },
      { name: "Emerald Green", hex: "#1A4329" },
    ],
    sizes: ["Unstitched (6.5m with Blouse)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
        alt: "Gulbagh Crimson Katan Silk Saree drape",
      },
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
        alt: "Intricate zari pallu detailing",
      },
    ],
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    reviewsCount: 38,
    description: "A celebration of classical Varanasi artistry, the Gulbagh saree features jaal bootis meticulously woven on pit looms over 24 days.",
    details: ["Certified Silk Mark India label included", "Includes 1 meter running blouse piece", "Dry clean only"],
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: "prod-2",
    slug: "noor-zafira-bridal-lehenga",
    title: "Noor Zafira Zardozi Lehenga",
    subtitle: "Deep Wine Silk Velvet with Handcrafted Dabka Embroidery",
    category: "Lehengas",
    categorySlug: "bridal-lehengas",
    pricePaise: 7600000,
    compareAtPaise: 8800000,
    badge: "Heritage",
    fabric: "Pure Micro Velvet & Silk Organza",
    craft: "Pita & Dabka Hand Embroidery",
    colors: [
      { name: "Deep Wine", hex: "#4A1521" },
      { name: "Royal Navy", hex: "#162544" },
    ],
    sizes: ["S", "M", "L", "Custom Tailored"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
        alt: "Noor Zafira Velvet Bridal Lehenga",
      },
      {
        url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        alt: "Back detail of lehenga blouse",
      },
    ],
    inStock: true,
    stockCount: 3,
    rating: 5.0,
    reviewsCount: 19,
    description: "Crafted for the discerning bride, the Noor Zafira lehenga features 16 kalis richly embroidered with heritage dabka and cutdana motifs.",
    details: ["Custom blouse measurements accommodated", "Double dupatta included: Velvet + Organza", "Bridal preservation box"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-3",
    slug: "kesar-mehra-anarkali-set",
    title: "Kesar Mehra Silk Anarkali Set",
    subtitle: "Chanderi Silk with Mukaish Highlights & Gotta Patti Hem",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    pricePaise: 1950000,
    compareAtPaise: 2300000,
    badge: "Bestseller",
    fabric: "Pure Handloom Chanderi & Mulmul",
    craft: "Hand Mukaish & Marodi Embroidery",
    colors: [
      { name: "Mustard Gold", hex: "#D4A340" },
      { name: "Ivory Pearl", hex: "#F5F1E9" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
        alt: "Kesar Mehra Chanderi Anarkali Set",
      },
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewsCount: 42,
    description: "An effortlessly fluid 3-piece silhouette featuring a kalidar anarkali, churidar, and an ethereal hand-printed organza dupatta.",
    details: ["3-Piece Set: Kurta, Churidar, Dupatta", "Pure mulmul lining", "Concealed side zipper"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-4",
    slug: "nilambari-tissue-silk-saree",
    title: "Nilambari Tissue Silk Saree",
    subtitle: "Metallic Gold Tissue with Midnight Indigo Resham Weave",
    category: "Sarees",
    categorySlug: "banarasi-sarees",
    pricePaise: 3200000,
    compareAtPaise: 3750000,
    badge: "Handcrafted",
    fabric: "Silk Tissue with Pure Gold Resham",
    craft: "Kadhwa Weave Technique",
    colors: [
      { name: "Royal Navy", hex: "#162544" },
      { name: "Champagne Gold", hex: "#CDB38B" },
    ],
    sizes: ["Unstitched (6.5m with Blouse)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
        alt: "Nilambari Tissue Silk Saree",
      },
    ],
    inStock: true,
    stockCount: 4,
    rating: 4.9,
    reviewsCount: 27,
    description: "A masterwork of subtle opulence, this tissue silk drape plays effortlessly with evening light. Featuring delicate flora motifs.",
    details: ["Metallic golden sheen", "Brocade blouse piece included", "Certified handloom weave"],
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: "prod-5",
    slug: "padmavati-emerald-jangla-saree",
    title: "Padmavati Emerald Jangla Saree",
    subtitle: "All-Over Floral Jangla Brocade on Pure Katan Silk",
    category: "Sarees",
    categorySlug: "banarasi-sarees",
    pricePaise: 4200000,
    compareAtPaise: 4900000,
    badge: "Heritage",
    fabric: "Pure Katan Silk",
    craft: "Jangla Meenakari Handloom",
    colors: [
      { name: "Emerald Green", hex: "#1A4329" },
      { name: "Crimson Red", hex: "#7A1C20" },
    ],
    sizes: ["Unstitched (6.5m with Blouse)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
        alt: "Padmavati Emerald Jangla Saree drape",
      },
    ],
    inStock: true,
    stockCount: 2,
    rating: 5.0,
    reviewsCount: 14,
    description: "The Jangla weave is the pinnacle of Banarasi craftsmanship. Featuring intertwining vine scrollwork woven with fine gold wire and meenakari resham highlights.",
    details: ["Requires 35 days of dedicated pit-loom weaving", "Hand-twisted pure silk threads", "Dry clean only"],
    isNewArrival: false,
    isBestseller: false,
  },
  {
    id: "prod-6",
    slug: "maharani-blush-rose-lehenga",
    title: "Maharani Blush Rose Lehenga",
    subtitle: "Raw Silk with Seed Pearls and Fine Kashmiri Tilla Work",
    category: "Lehengas",
    categorySlug: "bridal-lehengas",
    pricePaise: 6800000,
    compareAtPaise: 7900000,
    badge: "New In",
    fabric: "Raw Silk & Soft French Tulle",
    craft: "Tilla & Seed Pearl Embroidery",
    colors: [
      { name: "Blush Pink", hex: "#D9A5B3" },
      { name: "Ivory Pearl", hex: "#F5F1E9" },
    ],
    sizes: ["XS", "S", "M", "L", "Custom Tailored"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
        alt: "Maharani Blush Rose Couture Lehenga",
      },
    ],
    inStock: true,
    stockCount: 4,
    rating: 4.9,
    reviewsCount: 22,
    description: "An ethereal pastel ensemble adorned with delicate flora motifs rendered in micro seed pearls and silver tilla embroidery.",
    details: ["Lightweight voluminous can-can skirt", "Semi-sheer sweetheart blouse", "Embroidered scalloped veil"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-7",
    slug: "roopmati-peacock-angrakha-set",
    title: "Roopmati Peacock Angrakha Set",
    subtitle: "Heritage Silk Chanderi with Dori & Gota Tie-Up Closure",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    pricePaise: 1650000,
    compareAtPaise: 1950000,
    badge: "Handcrafted",
    fabric: "Chanderi Silk & Pure Cotton Mul",
    craft: "Angrakha Overlap & Gota Patti",
    colors: [
      { name: "Peacock Teal", hex: "#165B66" },
      { name: "Mustard Gold", hex: "#D4A340" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
        alt: "Roopmati Peacock Angrakha Set",
      },
    ],
    inStock: true,
    stockCount: 6,
    rating: 4.7,
    reviewsCount: 31,
    description: "The royal Angrakha crossover silhouette cut in breezy handloom Chanderi silk, embellished with vintage latkans and delicate gota wire.",
    details: ["Functional side tie-up closure", "Includes matching straight pants", "Contrast hand-block printed dupatta"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-8",
    slug: "chandrika-patan-patola-dupatta",
    title: "Chandrika Patan Patola Silk Dupatta",
    subtitle: "Double Ikkat Pure Mulberry Silk with Traditional Geometric Motifs",
    category: "Dupattas",
    categorySlug: "chanderi-dupattas",
    pricePaise: 1250000,
    compareAtPaise: 1500000,
    badge: "Heritage",
    fabric: "100% Pure Mulberry Silk",
    craft: "Double Ikkat Resham Weave",
    colors: [
      { name: "Crimson Red", hex: "#7A1C20" },
      { name: "Mustard Gold", hex: "#D4A340" },
    ],
    sizes: ["Free Size (2.5m x 1m)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
        alt: "Chandrika Patan Patola Dupatta",
      },
    ],
    inStock: true,
    stockCount: 7,
    rating: 4.9,
    reviewsCount: 18,
    description: "An heirloom statement dupatta created using the intricate resist-dyeing double ikkat technique. Drapes with peerless majesty over any solid kurta or lehenga.",
    details: ["Length: 2.5 meters", "Finished with hand-rolled tassels", "Reversible identical pattern on both sides"],
    isNewArrival: false,
    isBestseller: false,
  },
  {
    id: "prod-9",
    slug: "shahi-darbar-royal-velvet-lehenga",
    title: "Shahi Darbar Royal Navy Lehenga",
    subtitle: "Heavy Silk Velvet with Antique Marodi & Zardozi Architecture",
    category: "Lehengas",
    categorySlug: "bridal-lehengas",
    pricePaise: 8900000,
    compareAtPaise: 10500000,
    badge: "Heritage",
    fabric: "Royal Micro Velvet & Pure Silk Dupion",
    craft: "Marodi & Hand Zardozi Work",
    colors: [
      { name: "Royal Navy", hex: "#162544" },
      { name: "Deep Wine", hex: "#4A1521" },
    ],
    sizes: ["S", "M", "L", "Custom Tailored"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
        alt: "Shahi Darbar Royal Navy Velvet Lehenga",
      },
    ],
    inStock: false, // Out of stock example for filter verification
    stockCount: 0,
    rating: 5.0,
    reviewsCount: 9,
    description: "An opulent couture masterpiece inspired by royal court arches. Woven with metallic bullion wires and raised zardozi motifs.",
    details: ["Currently made-to-order (4-6 weeks lead time)", "Bespoke styling appointment included", "Specialist bridal packaging"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-10",
    slug: "varanasi-gold-tissue-dupatta",
    title: "Varanasi Gold Tissue Sheer Dupatta",
    subtitle: "Fine Metallic Zari Warp with Floral Jaal Meenakari Borders",
    category: "Dupattas",
    categorySlug: "chanderi-dupattas",
    pricePaise: 850000,
    compareAtPaise: 1100000,
    badge: "Handcrafted",
    fabric: "Tissue Silk & Metallic Zari",
    craft: "Kadhwa Weft Border",
    colors: [
      { name: "Champagne Gold", hex: "#CDB38B" },
      { name: "Ivory Pearl", hex: "#F5F1E9" },
    ],
    sizes: ["Free Size (2.5m x 1m)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
        alt: "Varanasi Gold Tissue Dupatta",
      },
    ],
    inStock: true,
    stockCount: 11,
    rating: 4.8,
    reviewsCount: 29,
    description: "The ideal accent for festive celebrations, this tissue dupatta catches twilight luminescence with radiant metallic elegance.",
    details: ["Featherweight 180 grams", "Hand-finished scalloped edge", "Silk Mark certification"],
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: "prod-11",
    slug: "sitara-ivory-sharara-set",
    title: "Sitara Ivory Pearl Sharara Set",
    subtitle: "Mulberry Georgette with Chikankari & Mukaish Highlights",
    category: "Kurta Sets",
    categorySlug: "kurta-sets",
    pricePaise: 2450000,
    compareAtPaise: 2900000,
    badge: "New In",
    fabric: "Pure Viscose Georgette & Shantoon",
    craft: "Lucknowi Hand Chikankari & Mukaish",
    colors: [
      { name: "Ivory Pearl", hex: "#F5F1E9" },
      { name: "Blush Pink", hex: "#D9A5B3" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
        alt: "Sitara Ivory Pearl Sharara Set",
      },
    ],
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    reviewsCount: 34,
    description: "A classical Lucknowi chikankari silhouette detailed with 32 distinct shadow-work stitches and sprinkled with hand-hammered mukaish metallic flakes.",
    details: ["Flared sharara pants with elasticated waistband", "Short peplum kurta with sweetheart neckline", "Chiffon dupatta included"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-12",
    slug: "amrit-rani-tanchoi-saree",
    title: "Amrit Rani Pink Tanchoi Saree",
    subtitle: "Dual-Tone Mulberry Silk with Paisley Jamawar Weave",
    category: "Sarees",
    categorySlug: "banarasi-sarees",
    pricePaise: 2600000,
    compareAtPaise: 3100000,
    badge: "Bestseller",
    fabric: "100% Pure Mulberry Silk",
    craft: "Tanchoi Jamawar Weave",
    colors: [
      { name: "Rani Pink", hex: "#B8255F" },
      { name: "Crimson Red", hex: "#7A1C20" },
    ],
    sizes: ["Unstitched (6.5m with Blouse)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
        alt: "Amrit Rani Pink Tanchoi Saree",
      },
    ],
    inStock: true,
    stockCount: 6,
    rating: 4.8,
    reviewsCount: 25,
    description: "Tanchoi involves intricate silk-on-silk weaving that produces an embossed satin relief texture, remarkably supple and drape-friendly.",
    details: ["Soft satin hand-feel", "Includes solid matching blouse with woven border", "Pure Silk Mark verified"],
    isNewArrival: false,
    isBestseller: true,
  },
];
