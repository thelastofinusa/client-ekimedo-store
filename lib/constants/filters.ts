export const YEARS = [
  "All",
  ...Array.from({ length: 2025 - 2020 + 1 }, (_, i) => (2025 - i).toString()),
];
export const CATEGORIES = ["All", "Bridal", "Prom", "Special Events"];

export const GALLERY_ITEMS = [
  {
    id: "g1",
    year: "2023",
    category: "bridal",
    title: "Heritage Lace",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g5",
    year: "2023",
    category: "prom",
    title: "Velvet Dreams",
    image:
      "https://images.unsplash.com/photo-1525020017919-9428db8b3e75?q=80&w=3089&auto=format&fit=crop",
  },
  {
    id: "g2",
    year: "2024",
    category: "prom",
    title: "Midnight Gala",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g3",
    year: "2024",
    category: "bridal",
    title: "The Ethereal Collection",
    image: "/collections/bridal.avif",
  },
  {
    id: "g4",
    year: "2024",
    category: "prom",
    title: "The Ethereal Collection",
    image: "/collections/prom.avif",
  },
];
