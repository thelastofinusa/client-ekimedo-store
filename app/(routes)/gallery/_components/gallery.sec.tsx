"use client";

import * as React from "react";
import { ShotsComp } from "./shots.comp";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { HeroComp } from "@/components/shared/hero";
import { CATEGORIES_QUERYResult, GALLERY_QUERYResult } from "@/sanity.types";

export const GallerySection: React.FC<{
  gallery: GALLERY_QUERYResult;
  category: CATEGORIES_QUERYResult;
}> = ({ gallery, category }) => {
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

  return (
    <React.Fragment>
      <HeroComp
        title="Our Gallery"
        comp={
          <div className="grid w-full max-w-sm grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                Occasion
              </span>

              <Select
                value={activeCategory}
                onValueChange={(e) => setActiveCategory(e)}
              >
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((year) => (
                      <SelectItem key={year._id} value={year.slug!}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        }
      />
      <ShotsComp shots={filteredItems} />
    </React.Fragment>
  );
};
