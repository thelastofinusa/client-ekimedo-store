export const NAVIGATIONS = {
  HEADER: [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Shop",
      path: "/shop",
    },
    {
      label: "Gallery",
      path: "/gallery",
    },
    {
      label: "About",
      path: "/about",
    },
    {
      label: "Testimonials",
      path: "/testimonials",
    },
    {
      label: "Contact",
      path: "/contact",
    },
  ],
  FOOTER: [
    {
      title: "Collections",
      routes: [
        {
          label: "Bridal",
          path: "/category/bridal",
        },
        {
          label: "Prom",
          path: "/category/prom",
        },
        {
          label: "Couture",
          path: "/category/special-events",
        },
        {
          label: "Archive",
          path: "/gallery",
        },
      ],
    },
    {
      title: "Maison",
      routes: [
        {
          label: "Our Story",
          path: "/about",
        },
        {
          label: "Consultation",
          path: "/consultation",
        },
        {
          label: "Testimonials",
          path: "/testimonials",
        },
        {
          label: "Let's Talk",
          path: "/contact",
        },
      ],
    },
    {
      title: "Inquiries",
      routes: [
        {
          label: "info.e22fashion@gmail.com",
          path: "mailto:info.e22fashion@gmail.com",
          newTab: true,
        },
        {
          label: "202-907-4865",
          path: "tel:202-907-4865",
          newTab: true,
        },
        {
          label: "Capitol Heights, Maryland",
          path: "/",
          newTab: true,
        },
      ],
    },
  ],
};

export const DRESSES = [
  // Bridal
  {
    id: "bridal-001",
    name: "Aurora",
    category: "bridal",
    priceRange: "$3,500 - $5,000",
    description:
      "A timeless A-line silhouette with hand-embroidered lace details and a cathedral train.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594552072238-6d4e9b0d6f0e?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["US 0", "US 2", "US 4", "US 6", "US 8", "US 10", "US 12"],
    colors: ["Ivory", "Champagne", "Blush"],
    deliveryTime: "4 to 6 weeks",
  },
  {
    id: "bridal-002",
    name: "Seraphina",
    category: "bridal",
    priceRange: "$4,200 - $6,000",
    description:
      "A modern ballgown featuring Chantilly lace and hand-beaded bodice with illusion neckline.",
    image:
      "https://images.unsplash.com/photo-1594552072238-6d4e9b0d6f0e?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594552072238-6d4e9b0d6f0e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["US 0", "US 2", "US 4", "US 6", "US 8", "US 10", "US 12"],
    colors: ["Ivory", "White", "Off-White"],
    deliveryTime: "6 to 8 weeks",
  },
  {
    id: "bridal-003",
    name: "Celestine",
    category: "bridal",
    priceRange: "$3,800 - $5,500",
    description:
      "Minimalist sheath gown with structured bodice and flowing silk crepe skirt.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["US 0", "US 2", "US 4", "US 6", "US 8", "US 10"],
    colors: ["Ivory", "Champagne"],
    deliveryTime: "4 to 6 weeks",
  },
  {
    id: "bridal-004",
    name: "Evangeline",
    category: "bridal",
    priceRange: "$5,000 - $7,000",
    description:
      "Romantic mermaid silhouette with intricate floral appliqués and delicate tulle overlay.",
    image:
      "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=1000&auto=format&fit=crop",
    sizes: ["US 0", "US 2", "US 4", "US 6", "US 8", "US 10", "US 12", "US 14"],
    colors: ["Ivory", "Blush", "Champagne"],
    deliveryTime: "6 to 8 weeks",
  },

  // Prom
  {
    id: "prom-001",
    name: "Midnight Sonata",
    category: "prom",
    priceRange: "$800 - $1,200",
    description:
      "Dramatic velvet gown with plunging neckline and flowing chiffon train.",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Blue", "Emerald", "Ruby Red"],
    deliveryTime: "3 to 4 weeks",
  },
  {
    id: "prom-002",
    name: "Starlight",
    category: "prom",
    priceRange: "$650 - $950",
    description:
      "Elegant A-line silhouette with beaded bodice and layered tulle skirt.",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blush Pink", "Lavender", "Sky Blue"],
    deliveryTime: "2 to 3 weeks",
  },
  {
    id: "prom-003",
    name: "Radiance",
    category: "prom",
    priceRange: "$900 - $1,400",
    description:
      "Contemporary two-piece with crop top and high-slit skirt in luxe satin.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Champagne Gold", "Rose Gold", "Silver"],
    deliveryTime: "3 to 4 weeks",
  },

  // Special Events
  {
    id: "special-001",
    name: "Nocturne",
    category: "special-events",
    priceRange: "$1,200 - $1,800",
    description:
      "Sophisticated cocktail dress with asymmetrical neckline and draped silk bodice.",
    image:
      "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1000&auto=format&fit=crop",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Wine"],
    deliveryTime: "2 to 3 weeks",
  },
  {
    id: "special-002",
    name: "Enchantment",
    category: "special-events",
    priceRange: "$1,500 - $2,200",
    description:
      "Floor-length evening gown with hand-beaded cape and silk charmeuse slip.",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Emerald", "Sapphire", "Amethyst"],
    deliveryTime: "4 to 5 weeks",
  },
  {
    id: "special-003",
    name: "Luminance",
    category: "special-events",
    priceRange: "$950 - $1,400",
    description:
      "Modern midi dress with structured shoulders and sculptural silhouette.",
    image:
      "https://images.unsplash.com/photo-1581791534721-e599df4417fb?q=80&w=1000&auto=format&fit=crop",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Champagne", "Dove Grey"],
    deliveryTime: "2 to 3 weeks",
  },
];

export const dresses = DRESSES;

export const BUDGET_TIERS = [
  {
    id: "tier-1",
    name: "Essential",
    range: "$500 - $1,500",
    description:
      "Quality craftsmanship with classic designs and beautiful fabrics.",
    features: [
      "Premium fabrics",
      "Standard customization",
      "2-3 fittings",
      "4-6 week delivery",
    ],
    exampleDresses: DRESSES.filter(
      (d) => d.id.includes("prom-002") || d.id.includes("special-003"),
    ),
  },
  {
    id: "tier-2",
    name: "Signature",
    range: "$1,500 - $3,500",
    description:
      "Refined elegance with intricate detailing and enhanced customization.",
    features: [
      "Luxury fabrics",
      "Enhanced customization",
      "3-4 fittings",
      "Hand-finished details",
      "3-5 week delivery",
    ],
    exampleDresses: DRESSES.filter(
      (d) => d.id.includes("prom-003") || d.id.includes("special-002"),
    ),
  },
  {
    id: "tier-3",
    name: "Couture",
    range: "$3,500 - $7,000+",
    description:
      "Bespoke luxury with the finest materials and complete creative freedom.",
    features: [
      "Finest imported fabrics",
      "Fully bespoke design",
      "Unlimited fittings",
      "Hand-beaded embellishments",
      "Rush delivery available",
    ],
    exampleDresses: DRESSES.filter((d) => d.category === "bridal"),
  },
];

export const HERO_SLIDES = [
  {
    id: 1,
    label: "FOR/HER",
    number: "01",
    title: "NOSTALGIA",
    description:
      "Morbi volutpat tortor sit amet leo pretium, ut scelerisque nunc fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing varius magna in dolor maximus accumsan.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1594552072238-6d4e9b0d6f0e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    label: "FOR/HER",
    number: "02",
    title: "ELEGANCE",
    description:
      "Timeless sophistication meets contemporary design. Experience the art of bespoke couture tailored to your vision.",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    label: "FOR/HER",
    number: "03",
    title: "RADIANCE",
    description:
      "Illuminate every moment with designs that capture the essence of refined luxury and modern grace.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
    imageLarge:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1200&auto=format&fit=crop",
  },
];

export const budgetTiers = BUDGET_TIERS;
export const heroSlides = HERO_SLIDES;

export const FAQS_CONTENT = [
  {
    title: "Do you take Aso Ebi?",
    content:
      "No. We do not take Aso Ebi. We are a family-owned business and do not sell any products that contain Aso Ebi.",
  },
  {
    title: "Do you accept fabric?",
    content:
      "No. We do not accept fabric. We use only natural fibers to ensure the quality and sustainability of our products.",
  },
  {
    title: "How far in advance should one book?",
    content:
      "Evening and reception dress 2-4 months; wedding dress 4-8 months.\n\nEvening and Reception dress made less than 2 months of event date and Wedding dresses made less than 4 months are considered Rush Orders. There will be an additional charge of 15% of total quote for Rush Orders.",
  },
  {
    title: "Where are you located?",
    content: "We are located at Capitol Heights, Maryland",
  },
  {
    title: "Do you Ship internationally?",
    content: "We ship internationally to most countries.",
  },
  {
    title: "Do you style or dress brides on the day of their wedding?",
    content:
      "Day of service out of state: provide hotel and flight, transportation and service fee of $200 per day in state: $100 per hour.",
  },
  {
    title: "What are your store hours?",
    content: "Store hours: Tuesday - Friday 10am-6pm; Saturday 10am-4pm.",
  },
  {
    title: "What are your Payment Methods?",
    content: "Payment plans: Zelle, card payments, PayPal.",
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Kiaira",
    role: "Reception Dress",
    content:
      "If you’re looking to get a dress made by Eki… stop looking and just DO IT! when I tell you she executes I mean that! she does what needs to be done. I gave her a photo of what I was looking for and she made it 10x better. Customer service is everything. 😍 She’s so detail oriented and a perfectionist. My dress was beautiful, beyond what I expected.",
    rating: 4,
    date: "May 2024",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    asset: "Teen Vogue",
    workAssets: [
      "https://ekie22fashion.com/index.php?gf-download=2023%2F05%2F49B7E4DE-9E0C-4C3E-9971-D77B069509F7.jpeg&form-id=2&field-id=7&hash=0191dde97288225473c356fc496dc7941e38a25118334eeec3bf00b9d2e5eaab",
      "https://ekie22fashion.com/index.php?gf-download=2023%2F05%2F3D63C797-C188-485A-A159-556E57804C9D.jpeg&form-id=2&field-id=7&hash=b8f07c1ec2cce3e3b71b030befe052659e9bad9a286a655ecb9f6811f487d4b9",
      "https://ekie22fashion.com/index.php?gf-download=2023%2F05%2FC1177658-7C6B-43E9-A465-2A02DABD4B30.jpeg&form-id=2&field-id=7&hash=8fe501c858cb10f11e7e2c932c4d03aaf8b4ab8e1e4cebcc7fbb5ade793bd861",
    ],
  },
];
