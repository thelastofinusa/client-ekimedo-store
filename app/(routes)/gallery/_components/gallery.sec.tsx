"use client";

import * as React from "react";
import { HeroComp } from "./hero.comp";
import { ShotsComp } from "./shots.comp";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES_QUERYResult, GALLERY_QUERYResult } from "@/sanity.types";

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

  const activeCategory =
    categories.find((c) => c.slug === categoryParam)?.slug ?? "";

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

  const filteredItems = React.useMemo(
    () =>
      gallery.filter((item) => {
        const categoryMatch =
          !activeCategory ||
          item.category?.slug ===
            activeCategory.toLowerCase().replace(" ", "-");

        return categoryMatch;
      }),
    [gallery, activeCategory],
  );

  const heroCompProps = React.useMemo(
    () => ({
      categories,
      activeCategory,
      setActiveCategory,
    }),
    [activeCategory, categories, setActiveCategory],
  );

  return (
    <React.Fragment>
      <HeroComp {...heroCompProps} />
      <ShotsComp shots={filteredItems} />
    </React.Fragment>
  );
};
