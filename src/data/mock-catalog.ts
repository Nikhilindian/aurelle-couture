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
  category: "Clothing" | "Jewellery" | "Kids" | string;
  subCategory?: string;
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
    name: "Clothing",
    slug: "clothing",
    description: "Varanasi Mulberry Katan, Kadwa weaves, bespoke lehengas & festive anarkalis",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
    sortOrder: 1,
    isActive: true,
    itemCount: 12,
  },
  {
    id: "cat-2",
    name: "Jewellery",
    slug: "jewellery",
    description: "Heirloom 22K gold dipped jadau polki, temple nakas, and antique meenakari jewels",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
    sortOrder: 2,
    isActive: true,
    itemCount: 4,
  },
  {
    id: "cat-3",
    name: "Kids",
    slug: "kids",
    description: "Royal miniature sherwanis, pure pattu pavadas, and festive brocade sets",
    imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80",
    sortOrder: 3,
    isActive: true,
    itemCount: 4,
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
    id: "col-all",
    slug: "all",
    title: "All Collections",
    subtitle: "Every handcrafted masterpiece across couture, heirloom jewels & kids",
    itemCount: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "col-clothing",
    slug: "clothing",
    title: "Couture Silhouettes",
    subtitle: "Varanasi Katan sarees, imperial bridal lehengas, and festive anarkalis",
    itemCount: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "col-jewellery",
    slug: "jewellery",
    title: "Heirloom Jewellery",
    subtitle: "22K gold dipped jadau polki, temple nakas, and antique meenakari",
    itemCount: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "col-kids",
    slug: "kids",
    title: "Royal Kids Festive",
    subtitle: "Pure banarasi silk kurtas, pattu pavadas, and festive miniature couture",
    itemCount: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80",
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  // ================= 1. CLOTHING =================
  {
    id: "prod-1",
    slug: "gulbagh-crimson-banarasi-saree",
    title: "Gulbagh Crimson Katan Saree",
    subtitle: "Pure Varanasi Mulberry Silk with Handwoven Antique Zari",
    category: "Clothing",
    subCategory: "Sarees",
    categorySlug: "clothing",
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
    category: "Clothing",
    subCategory: "Lehengas",
    categorySlug: "clothing",
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
        alt: "Handcrafted zardozi blouse detail",
      },
    ],
    inStock: true,
    stockCount: 3,
    rating: 5.0,
    reviewsCount: 19,
    description: "Crafted for the royal bride, this bespoke lehenga features 16 kalis with raised marodi needlework, accompanied by dual sheer dupattas.",
    details: ["Includes custom blouse stitching consultation", "Dual dupattas: velvet veil + organza trail", "Signature Aurelle trunk storage"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-3",
    slug: "kesar-mehra-anarkali-set",
    title: "Kesar Mehra Festive Anarkali Set",
    subtitle: "Mustard Gold Chanderi Silk with Gota Patti & Zardozi",
    category: "Clothing",
    subCategory: "Kurta Sets",
    categorySlug: "clothing",
    pricePaise: 2200000,
    compareAtPaise: 2650000,
    badge: "Handcrafted",
    fabric: "Pure Chanderi Silk & Cotton Mul",
    craft: "Jaipuri Gota Patti",
    colors: [
      { name: "Mustard Gold", hex: "#D4A340" },
      { name: "Blush Pink", hex: "#D9A5B3" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
        alt: "Kesar Mehra Chanderi Anarkali silhouette",
      },
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewsCount: 22,
    description: "Evoking haldi and festive sunshine, this flared anarkali features hand-tucked gota ribbons and comes with tailored silk trousers and organza dupatta.",
    details: ["Flared 48-inch kalidar kurta", "Matching churidar with elasticated back", "Feather-light organza dupatta"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-4",
    slug: "chandrika-tissue-silk-saree",
    title: "Chandrika Moonlit Tissue Saree",
    subtitle: "Silver-Gold Metallic Luster with Hand-Cut Floral Borders",
    category: "Clothing",
    subCategory: "Sarees",
    categorySlug: "clothing",
    pricePaise: 3100000,
    compareAtPaise: 3600000,
    badge: "New In",
    fabric: "Metallic Tissue Warp with Pure Silk Weft",
    craft: "Meenakari Jamdani",
    colors: [
      { name: "Champagne Gold", hex: "#CDB38B" },
      { name: "Silver Moonlight", hex: "#E0E0E0" },
    ],
    sizes: ["Unstitched (6.5m with Blouse)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
        alt: "Chandrika Moonlit Tissue Saree",
      },
    ],
    inStock: true,
    stockCount: 4,
    rating: 4.9,
    reviewsCount: 15,
    description: "An ethereal sheer drape capturing iridescent light. Handwoven on historic Banaras looms with ultra-fine metallic filaments.",
    details: ["Weight: 520 grams", "Includes self-embossed brocade blouse", "Ships in velvet protective pouch"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-5",
    slug: "mehrunissa-jamawar-saree",
    title: "Mehrunissa Jamawar Silk Saree",
    subtitle: "Heirloom Pashmina-Inspired Floral Weave in Royal Emerald",
    category: "Clothing",
    subCategory: "Sarees",
    categorySlug: "clothing",
    pricePaise: 3450000,
    compareAtPaise: 3950000,
    badge: "Heritage",
    fabric: "100% Pure Mulberry Silk",
    craft: "Tanchoi & Jamawar Weave",
    colors: [
      { name: "Emerald Green", hex: "#1A4329" },
      { name: "Royal Navy", hex: "#162544" },
    ],
    sizes: ["Unstitched (6.5m with Blouse)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
        alt: "Mehrunissa Jamawar Silk Saree in Emerald",
      },
    ],
    inStock: true,
    stockCount: 2,
    rating: 5.0,
    reviewsCount: 11,
    description: "Inspired by Kashmiri paisleys and Persian gardens, the Mehrunissa saree takes over 30 days of meticulous loom coordination.",
    details: ["Silk Mark certified", "Heavy pallu with antique gold zari fringe", "Professional dry clean recommended"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-6",
    slug: "zeenat-royal-bridal-lehenga",
    title: "Zeenat Royal Crimson Bridal Lehenga",
    subtitle: "Handloom Raw Silk with Gilded Dabka & Marodi Borders",
    category: "Clothing",
    subCategory: "Lehengas",
    categorySlug: "clothing",
    pricePaise: 8400000,
    compareAtPaise: 9500000,
    badge: "Heritage",
    fabric: "Handwoven Raw Silk & Tissue",
    craft: "Zardozi, Marodi & Mukaish",
    colors: [
      { name: "Crimson Red", hex: "#7A1C20" },
    ],
    sizes: ["S", "M", "L", "Custom Tailored"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
        alt: "Zeenat Royal Bridal Lehenga",
      },
    ],
    inStock: true,
    stockCount: 2,
    rating: 5.0,
    reviewsCount: 14,
    description: "A testament to regal Indian grandiosity. Designed with monumental elephant & lotus motifs hand-embroidered with authentic gold bullion wire.",
    details: ["Bespoke blouse design with personalized monogram option", "Includes custom cancan underskirt", "White glove concierge delivery"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-7",
    slug: "roshni-chanderi-kurta-set",
    title: "Roshni Blush Silk Chanderi Set",
    subtitle: "Pastel Elegance with Handcrafted Zari Bootis & Dupatta",
    category: "Clothing",
    subCategory: "Kurta Sets",
    categorySlug: "clothing",
    pricePaise: 1950000,
    compareAtPaise: 2300000,
    badge: "New In",
    fabric: "Pure Chanderi Silk",
    craft: "Hand-Block & Zari Booti",
    colors: [
      { name: "Blush Pink", hex: "#D9A5B3" },
      { name: "Ivory Pearl", hex: "#F5F1E9" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
        alt: "Roshni Blush Silk Kurta Set",
      },
    ],
    inStock: true,
    stockCount: 7,
    rating: 4.7,
    reviewsCount: 18,
    description: "Effortlessly poised for intimate festive dinners. Soft pastel blush silk accented by understated metallic gold dots.",
    details: ["Includes straight-fit silk trousers", "Fine woven Chanderi dupatta included", "Butter cotton lining for absolute comfort"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-8",
    slug: "sitara-patola-silk-dupatta",
    title: "Sitara Royal Blue Patola Dupatta",
    subtitle: "Patan-Style Double Ikkat Pure Silk with Floral Geometric Jaal",
    category: "Clothing",
    subCategory: "Dupattas",
    categorySlug: "clothing",
    pricePaise: 1400000,
    compareAtPaise: 1750000,
    badge: "Handcrafted",
    fabric: "100% Pure Mulberry Silk",
    craft: "Double Ikkat Patola Weave",
    colors: [
      { name: "Royal Navy", hex: "#162544" },
      { name: "Crimson Red", hex: "#7A1C20" },
    ],
    sizes: ["Free Size (2.5m x 1m)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
        alt: "Sitara Royal Blue Patola Dupatta",
      },
    ],
    inStock: true,
    stockCount: 6,
    rating: 4.9,
    reviewsCount: 20,
    description: "An heirloom statement dupatta created using the intricate resist-dyeing double ikkat technique.",
    details: ["Length: 2.5 meters", "Finished with hand-rolled tassels", "Reversible identical pattern on both sides"],
    isNewArrival: false,
    isBestseller: false,
  },
  {
    id: "prod-9",
    slug: "shahi-darbar-royal-velvet-lehenga",
    title: "Shahi Darbar Royal Navy Lehenga",
    subtitle: "Heavy Silk Velvet with Antique Marodi & Zardozi Architecture",
    category: "Clothing",
    subCategory: "Lehengas",
    categorySlug: "clothing",
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
    inStock: true,
    stockCount: 3,
    rating: 5.0,
    reviewsCount: 9,
    description: "An opulent couture masterpiece inspired by royal court arches. Woven with metallic bullion wires and raised zardozi motifs.",
    details: ["Currently made-to-order (3-4 weeks lead time)", "Bespoke styling appointment included", "Specialist bridal packaging"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-10",
    slug: "varanasi-gold-tissue-dupatta",
    title: "Varanasi Gold Tissue Sheer Dupatta",
    subtitle: "Fine Metallic Zari Warp with Floral Jaal Meenakari Borders",
    category: "Clothing",
    subCategory: "Dupattas",
    categorySlug: "clothing",
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
    category: "Clothing",
    subCategory: "Kurta Sets",
    categorySlug: "clothing",
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
    category: "Clothing",
    subCategory: "Sarees",
    categorySlug: "clothing",
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

  // ================= 2. JEWELLERY =================
  {
    id: "prod-13",
    slug: "padmavati-jadau-polki-choker",
    title: "Padmavati Jadau Polki Choker Set",
    subtitle: "Handcrafted 22K Gold Dipped with Uncut Polki, Russian Emeralds & Basra Pearls",
    category: "Jewellery",
    subCategory: "Chokers",
    categorySlug: "jewellery",
    pricePaise: 6400000,
    compareAtPaise: 7500000,
    badge: "Heritage",
    fabric: "22K Gold Plated Brass & Sterling Silver",
    craft: "Jadau & Kundan Enameling",
    colors: [
      { name: "Antique Gold", hex: "#D4AF37" },
      { name: "Emerald Green", hex: "#1A4329" },
    ],
    sizes: ["Adjustable Dori Choker + Earrings"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
        alt: "Padmavati Jadau Polki Choker Set",
      },
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
        alt: "Detail of uncut polki diamonds and emerald drops",
      },
    ],
    inStock: true,
    stockCount: 4,
    rating: 5.0,
    reviewsCount: 24,
    description: "An imperial heirloom choker set crafted in Jaipur. Features open-set polki stones, deep Russian emerald clusters, and reverse red meenakari detailing.",
    details: ["Hallmarked 92.5 silver base with 24K gold foil setting", "Includes matching statement earrings", "Delivered in suede velvet jewel box"],
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: "prod-14",
    slug: "surya-temple-ruby-coin-haar",
    title: "Surya Temple Ruby Coin Haar",
    subtitle: "Antique Matte Gold Finish with Carved Lakshmi Medallions & Burma Rubies",
    category: "Jewellery",
    subCategory: "Necklaces",
    categorySlug: "jewellery",
    pricePaise: 4800000,
    compareAtPaise: 5600000,
    badge: "Handcrafted",
    fabric: "Hallmarked Silver Alloy with 24K Matte Gilding",
    craft: "Nakas Hand-Carved Temple Jewellery",
    colors: [
      { name: "Matte Temple Gold", hex: "#CDB38B" },
      { name: "Burma Ruby", hex: "#7A1C20" },
    ],
    sizes: ["24-inch Long Haar with Extension Chain"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=900&q=80",
        alt: "Surya Temple Ruby Coin Long Haar",
      },
    ],
    inStock: true,
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 19,
    description: "Inspired by ancient Chola temple architecture. Hand-sculpted coins depicting Goddess Lakshmi, punctuated with pigeon-blood red rubies.",
    details: ["Authentic Nakas repoussé technique", "Skin-safe hypoallergenic gold plating", "Lifetime polish warranty certificate"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-15",
    slug: "navratna-royal-peacock-chandbalis",
    title: "Navratna Royal Peacock Chandbalis",
    subtitle: "Nine Sacred Gemstones with Hand-Strung Seed Pearls & Minakari Backing",
    category: "Jewellery",
    subCategory: "Earrings",
    categorySlug: "jewellery",
    pricePaise: 3200000,
    compareAtPaise: 3800000,
    badge: "New In",
    fabric: "Gold Gilded Silver with Certified Navratnas",
    craft: "Meenakari & Piroi Craft",
    colors: [
      { name: "Multi-Gemstone", hex: "#D4A340" },
      { name: "Ivory Pearl", hex: "#F5F1E9" },
    ],
    sizes: ["Length: 3.2 inches"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
        alt: "Navratna Peacock Chandbali Earrings",
      },
    ],
    inStock: true,
    stockCount: 7,
    rating: 4.8,
    reviewsCount: 31,
    description: "Chandbalis shaped like dancing crescent peacocks, encrusted with the 9 planetary stones (Navratna) and rimmed with microscopic freshwater seed pearls.",
    details: ["Weight: 28 grams per earring", "Comfortable Bombay screw back", "Certificate of gem authenticity included"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-16",
    slug: "rajwada-filigree-kundan-kada-pair",
    title: "Rajwada Filigree Kundan Kada Pair",
    subtitle: "Openable Bangle Pair with Floral Open-Setting Kundan & Red Enamel Inlay",
    category: "Jewellery",
    subCategory: "Bangles",
    categorySlug: "jewellery",
    pricePaise: 4200000,
    compareAtPaise: 4900000,
    badge: "Handcrafted",
    fabric: "22K Gold Dipped Brass & Enamel",
    craft: "Open-Setting Kundan & Meena",
    colors: [
      { name: "Royal Gold", hex: "#D4AF37" },
      { name: "Crimson Red", hex: "#7A1C20" },
    ],
    sizes: ["2.4 (Small)", "2.6 (Medium)", "2.8 (Large)"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=80",
        alt: "Rajwada Filigree Kundan Kada Pair",
      },
    ],
    inStock: true,
    stockCount: 5,
    rating: 4.9,
    reviewsCount: 15,
    description: "A pair of substantial royal kadas that clasp securely with antique screw locks. Features floral kundan medallions and scarlet lac work.",
    details: ["Sold as a pair (2 bangles)", "Side-hinged screw clasp for universal wrist fit", "Tarnish-resistant clear e-coating"],
    isNewArrival: false,
    isBestseller: true,
  },

  // ================= 3. KIDS =================
  {
    id: "prod-17",
    slug: "nawabzada-brocade-kurta-dhoti-set",
    title: "Nawabzada Brocade Kurta & Dhoti Set",
    subtitle: "Pure Banarasi Silk Zari Kurta with Pre-Stitched Ivory Silk Dhoti",
    category: "Kids",
    subCategory: "Boys Festive",
    categorySlug: "kids",
    pricePaise: 1450000,
    compareAtPaise: 1750000,
    badge: "New In",
    fabric: "100% Pure Katan Brocade & Mulberry Silk",
    craft: "Benarasi Zari Weave",
    colors: [
      { name: "Mustard Gold", hex: "#D4A340" },
      { name: "Royal Navy", hex: "#162544" },
    ],
    sizes: ["2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y", "10-12 Y"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80",
        alt: "Nawabzada Brocade Kurta & Dhoti Set for Boys",
      },
    ],
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewsCount: 28,
    description: "Designed for royal little princes for Diwali, weddings, and celebrations. Features itch-free pure mulmul cotton inner lining.",
    details: ["100% soft organic cotton inner lining", "Pre-pleated elasticated dhoti for easy dressing", "Handmade potli buttons"],
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: "prod-18",
    slug: "chhoti-maharani-pattu-pavada-set",
    title: "Chhoti Maharani Pattu Pavada Set",
    subtitle: "Pure Kanchipuram Silk Skirt with Hand-Embroidered Velvet Choli",
    category: "Kids",
    subCategory: "Girls Lehengas",
    categorySlug: "kids",
    pricePaise: 1800000,
    compareAtPaise: 2150000,
    badge: "Heritage",
    fabric: "Pure Mulberry Silk & Cotton Lining",
    craft: "Kanchipuram Temple Border Weave",
    colors: [
      { name: "Rani Pink", hex: "#B8255F" },
      { name: "Mustard Gold", hex: "#D4A340" },
    ],
    sizes: ["2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y", "10-12 Y"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80",
        alt: "Chhoti Maharani Pattu Pavada Lehenga for Girls",
      },
    ],
    inStock: true,
    stockCount: 6,
    rating: 5.0,
    reviewsCount: 42,
    description: "Traditional South Indian heirloom pattu pavada woven in Kanchipuram with pure gold zari borders, paired with a soft velvet blouse.",
    details: ["Expandable 2-inch side seams for growth", "Double soft cotton mul lining", "Includes matching organza dupatta"],
    isNewArrival: false,
    isBestseller: true,
  },
  {
    id: "prod-19",
    slug: "shehzada-miniature-zardozi-sherwani",
    title: "Shehzada Miniature Zardozi Sherwani",
    subtitle: "Hand-Embroidered Raw Silk Achkan with Antique Metal Buttons",
    category: "Kids",
    subCategory: "Boys Sherwanis",
    categorySlug: "kids",
    pricePaise: 2200000,
    compareAtPaise: 2600000,
    badge: "Handcrafted",
    fabric: "Pure Raw Silk with Soft Cotton Muslin Lining",
    craft: "Zardozi Hand Embroidery",
    colors: [
      { name: "Ivory Pearl", hex: "#F5F1E9" },
      { name: "Deep Wine", hex: "#4A1521" },
    ],
    sizes: ["3-4 Y", "5-6 Y", "7-8 Y", "9-10 Y", "11-12 Y"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80",
        alt: "Shehzada Miniature Zardozi Sherwani Set",
      },
    ],
    inStock: true,
    stockCount: 4,
    rating: 4.9,
    reviewsCount: 17,
    description: "An authentic miniature bespoke sherwani set including royal achkan, tailored churidar, and brocade pocket square.",
    details: ["Soft muslin lining protects delicate skin", "Front metal button placket with hidden snap closures", "Matching churidar included"],
    isNewArrival: true,
    isBestseller: false,
  },
  {
    id: "prod-20",
    slug: "gauri-festive-organza-anarkali-set",
    title: "Gauri Festive Organza Anarkali Set",
    subtitle: "Lightweight Rose Pink Tissue Anarkali with Gota Patti & Net Dupatta",
    category: "Kids",
    subCategory: "Girls Anarkalis",
    categorySlug: "kids",
    pricePaise: 1650000,
    compareAtPaise: 1950000,
    badge: "New In",
    fabric: "Pure Tissue Organza with Butter Silk Lining",
    craft: "Gota Patti Handwork",
    colors: [
      { name: "Blush Pink", hex: "#D9A5B3" },
      { name: "Champagne Gold", hex: "#CDB38B" },
    ],
    sizes: ["2-3 Y", "4-5 Y", "6-7 Y", "8-9 Y", "10-12 Y"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=900&q=80",
        alt: "Gauri Festive Organza Anarkali Set for Girls",
      },
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewsCount: 22,
    description: "Twirl-worthy lightweight festive anarkali that little princesses can dance in comfortably all evening.",
    details: ["Ultra-soft butter crepe lining", "Gota patti borders with mirror-work accents", "Lightweight soft net dupatta"],
    isNewArrival: true,
    isBestseller: false,
  },
];
