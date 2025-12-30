"use client";

import * as React from "react";
import { HeroComp } from "./hero.comp";
import { ShotsComp } from "./shots.comp";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, GALLERY_ITEMS, YEARS } from "@/constants";

export const GallerySection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get(
    "category",
  ) as (typeof CATEGORIES)[number];
  const yearParam = searchParams.get("year") as (typeof YEARS)[number];

  const activeCategory =
    CATEGORIES.find(
      (c) => c.toLowerCase().replace(" ", "-") === categoryParam,
    ) ?? "";

  const activeYear = YEARS.find((y) => y === yearParam) ?? "";

  const setActiveCategory = React.useCallback(
    (value: (typeof CATEGORIES)[number]) => {
      const params = new URLSearchParams(searchParams);
      if (value === "All") {
        params.delete("category");
      } else {
        params.set("category", value.toLowerCase().replace(" ", "-"));
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const setActiveYear = React.useCallback(
    (value: (typeof YEARS)[number]) => {
      const params = new URLSearchParams(searchParams);
      if (value === "All") {
        params.delete("year");
      } else {
        params.set("year", value);
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const categoryMatch =
      !activeCategory ||
      item.category === activeCategory.toLowerCase().replace(" ", "-");

    const yearMatch = !activeYear || item.year === activeYear;

    return categoryMatch && yearMatch;
  });

  const heroCompProps = React.useMemo(
    () => ({
      years: YEARS,
      categories: CATEGORIES,
      activeCategory,
      setActiveCategory,
      activeYear,
      setActiveYear,
    }),
    [activeCategory, activeYear, setActiveCategory, setActiveYear],
  );

  return (
    <React.Fragment>
      <HeroComp {...heroCompProps} />
      <ShotsComp shots={filteredItems} />
    </React.Fragment>
  );
};
