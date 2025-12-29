"use client";

import * as React from "react";
import { HeroComp } from "./_components/hero.comp";
import { ShotsComp } from "./_components/shots.comp";

export const YEARS = ["All", "2026", "2025", "2024", "2023", "2022"];
export const CATEGORIES = ["All", "Bridal", "Prom", "Special Events"];

export const GALLERY_ITEMS = [
  {
    id: "g1",
    year: "2024",
    category: "bridal",
    title: "The Ethereal Collection",
    image: "/collections/bridal.avif",
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
    year: "2023",
    category: "special-events",
    title: "Metamorphosis",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g4",
    year: "2023",
    category: "bridal",
    title: "Heritage Lace",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g5",
    year: "2022",
    category: "prom",
    title: "Velvet Dreams",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "g6",
    year: "2024",
    category: "prom",
    title: "The Ethereal Collection",
    image: "/collections/prom.avif",
  },
  {
    id: "g7",
    year: "2026",
    category: "bridal",
    title: "Heritage Lace",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g8",
    year: "2026",
    category: "special-events",
    title: "The Ethereal Collection",
    image: "/collections/special-events.avif",
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] =
    React.useState<(typeof CATEGORIES)[number]>("All");
  const [activeYear, setActiveYear] =
    React.useState<(typeof YEARS)[number]>("All");

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const categoryMatch =
      activeCategory === "All" ||
      item.category === activeCategory.toLowerCase().replace(" ", "-");
    const yearMatch = activeYear === "All" || item.year === activeYear;
    return categoryMatch && yearMatch;
  });

  const heroCompProps = React.useMemo(
    () => ({
      years: YEARS,
      categories: CATEGORIES,
      activeCategory,
      setActiveCategory: setActiveCategory,
      activeYear,
      setActiveYear: setActiveYear,
    }),
    [activeCategory, activeYear],
  );

  return (
    <div className="bg-foreground text-background flex-1 overflow-x-clip">
      <HeroComp {...heroCompProps} />
      <ShotsComp shots={filteredItems} />
    </div>
  );
}
