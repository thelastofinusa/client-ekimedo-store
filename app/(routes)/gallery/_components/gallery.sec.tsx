"use client";

import * as React from "react";
import { HeroComp } from "./hero.comp";
import { ShotsComp } from "./shots.comp";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES_QUERYResult, GALLERY_QUERYResult } from "@/sanity.types";
import { START_YEAR_KEY } from "@/lib/constants/keys";

interface Props {
  gallery: GALLERY_QUERYResult;
  category: CATEGORIES_QUERYResult;
}

export const GallerySection: React.FC<Props> = ({ gallery, category }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories: CATEGORIES_QUERYResult = React.useMemo(
    () => [
      { _id: "all", name: "All", slug: "all" },
      ...category.filter((c) => c.name && c.slug),
    ],
    [category],
  );

  const categoryParam = searchParams.get("category") ?? "";
  const yearParam = searchParams.get("year") ?? "";

  const activeCategory =
    categories.find((c) => c.slug === categoryParam)?.slug ?? "";

  const years = React.useMemo(() => {
    let maxYear = START_YEAR_KEY;

    gallery.forEach((item) => {
      if (!item.year) return;

      const year = Number(item.year.slice(0, 4));
      if (year > maxYear) {
        maxYear = year;
      }
    });

    const range: string[] = [];

    for (let y = maxYear; y >= START_YEAR_KEY; y--) {
      range.push(String(y));
    }

    return ["All", ...range];
  }, [gallery]);

  const activeYear = years.includes(yearParam) ? yearParam : "";

  const setActiveCategory = React.useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams);

      if (slug === "all") {
        params.delete("category");
      } else {
        params.set("category", slug.toLowerCase().replace(" ", "-"));
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const setActiveYear = React.useCallback(
    (year: string) => {
      const params = new URLSearchParams(searchParams);

      if (year.toLowerCase() === "all") {
        params.delete("year");
      } else {
        params.set("year", year);
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const filteredItems = React.useMemo(
    () =>
      gallery.filter((item) => {
        const categoryMatch =
          !activeCategory ||
          item.category?.slug ===
            activeCategory.toLowerCase().replace(" ", "-");

        const yearMatch =
          !activeYear || (item.year && item.year.slice(0, 4) === activeYear);

        return categoryMatch && yearMatch;
      }),
    [gallery, activeCategory, activeYear],
  );

  const heroCompProps = React.useMemo(
    () => ({
      years,
      categories,
      activeCategory,
      setActiveCategory,
      activeYear,
      setActiveYear,
    }),
    [
      activeCategory,
      activeYear,
      categories,
      setActiveCategory,
      setActiveYear,
      years,
    ],
  );

  return (
    <React.Fragment>
      <HeroComp {...heroCompProps} />
      <ShotsComp shots={filteredItems} />
    </React.Fragment>
  );
};
