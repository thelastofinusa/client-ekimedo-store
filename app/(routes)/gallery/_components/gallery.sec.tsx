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
  category: CATEGORIES_QUERYResult;
  galleries: GALLERY_QUERYResult;
}> = ({ category, galleries }) => {
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

  const paramCategory =
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

  const filteredGalleries = React.useMemo(() => {
    if (!paramCategory || paramCategory === "all") {
      return galleries;
    }

    return galleries.filter(
      (gallery) => gallery.category?.slug === paramCategory,
    );
  }, [galleries, paramCategory]);

  return (
    <React.Fragment>
      <HeroComp
        title="Our Gallery"
        comp={
          <div className="grid w-full max-w-sm grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <Select
                value={paramCategory}
                onValueChange={(e) => setActiveCategory(e)}
              >
                <SelectTrigger className="text-background w-full bg-transparent">
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

      <ShotsComp shots={filteredGalleries} />
    </React.Fragment>
  );
};
