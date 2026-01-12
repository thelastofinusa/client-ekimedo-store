export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: "Bridal" | "Prom" | "Couture";
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  details: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Ethereal Silk Gown",
    slug: "ethereal-silk-gown",
    price: 3500,
    category: "Bridal",
    description:
      "A masterpiece of silk and lace, designed for the modern bride who values elegance and comfort. This gown features a flowing silhouette and intricate hand-stitched details.",
    images: [
      "/collections/bridal.avif",
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1287&auto=format&fit=crop",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "White"],
    details: [
      "100% Silk Charmeuse",
      "Hand-embroidered lace bodice",
      "Invisible zipper closure",
      "Made to measure available",
    ],
  },
  {
    id: "2",
    name: "Midnight Velvet Dress",
    slug: "midnight-velvet-dress",
    price: 1200,
    category: "Prom",
    description:
      "Stun the crowd in this luxurious velvet dress. The deep midnight blue hue and off-shoulder design create a look of timeless glamour.",
    images: [
      "/collections/prom.avif",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1324&auto=format&fit=crop",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Midnight Blue", "Black", "Burgundy"],
    details: [
      "Premium Velvet fabric",
      "Off-shoulder neckline",
      "High slit detail",
      "Fully lined",
    ],
  },
  {
    id: "3",
    name: "Avant-Garde Structure",
    slug: "avant-garde-structure",
    price: 5000,
    category: "Couture",
    description:
      "For the bold and the beautiful. This structural piece defies convention with its architectural lines and unexpected textures.",
    images: [
      "/collections/special-events.avif",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1287&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Gold", "Silver"],
    details: [
      "Metallic brocade",
      "Structured corset bodice",
      "Asymmetrical hem",
      "Runway piece",
    ],
  },
  {
    id: "4",
    name: "Lace Mermaid Gown",
    slug: "lace-mermaid-gown",
    price: 4200,
    category: "Bridal",
    description:
      "Hugging every curve, this mermaid gown flares out at the knees for a dramatic entrance. Covered in delicate floral lace.",
    images: [
      "https://images.unsplash.com/photo-1765229280504-f5ef711eab98?q=80&w=1287&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1765229279443-f9eec8ba945b?q=80&w=1287&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1765229277457-dd2f9f259f17?q=80&w=1287&auto=format&fit=crop",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Champagne", "Ivory"],
    details: [
      "Chantilly lace overlay",
      "Sweetheart neckline",
      "Cathedral train",
      "Built-in bustier",
    ],
  },
  {
    id: "5",
    name: "Scarlet Chiffon Dream",
    slug: "scarlet-chiffon-dream",
    price: 950,
    category: "Prom",
    description:
      "Float through the night in layers of scarlet chiffon. The ruched bodice and flowing skirt make this dress perfect for dancing.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1383&auto=format&fit=crop",
      "/collections/prom.avif",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Scarlet", "Pink", "Lavender"],
    details: [
      "Silk Chiffon",
      "Ruched bodice",
      "A-line silhouette",
      "Spaghetti straps",
    ],
  },
  {
    id: "6",
    name: "Royal Ballgown",
    slug: "royal-ballgown",
    price: 6000,
    category: "Couture",
    description:
      "Fit for royalty. This voluminous ballgown features layers of tulle and hand-beaded crystals for ultimate opulence.",
    images: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop",
      "/collections/special-events.avif",
    ],
    sizes: ["S", "M", "L", "Custom"],
    colors: ["Royal Blue", "Emerald"],
    details: [
      "Tulle and Satin",
      "Swarovski crystal embellishments",
      "Voluminous skirt",
      "Custom sizing required",
    ],
  },
];
