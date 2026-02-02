"use client";
import { Route } from "next";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
import { Button } from "@/ui/button";
import { useIsMobile } from "@/hooks/mobile";
import { Icons } from "hugeicons-proxy";
import {
  CATEGORIES_QUERYResult,
  PRODUCT_COLOR_QUERYResult,
} from "@/sanity.types";
import { cn } from "@/lib/utils";

const priceRangeFilters = [
  { name: "Under $500", slug: "0-500" },
  { name: "$500 - $1,000", slug: "500-1000" },
  { name: "$1,000 - $3,000", slug: "1000-3000" },
  { name: "$3,000 - $5,000", slug: "3000-5000" },
  { name: "Above $5,000", slug: "5000-999999" },
];

interface Props {
  categories: CATEGORIES_QUERYResult;
  colors: PRODUCT_COLOR_QUERYResult;
}

export const Filters: React.FC<Props> = ({ categories, colors }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile } = useIsMobile();

  // Memoized params
  const { categoriesValue, colorsValue, priceValue, hasActiveFilters } =
    React.useMemo(() => {
      const categoriesValue = searchParams.getAll("category");
      const colorsValue = searchParams.getAll("color");
      const priceValue = searchParams.get("price");

      return {
        categoriesValue,
        colorsValue,
        priceValue,
        hasActiveFilters:
          !!priceValue || categoriesValue.length > 0 || colorsValue.length > 0,
      };
    }, [searchParams]);

  const pushParams = React.useCallback(
    (params: URLSearchParams) => {
      router.push(`${pathname}?${params.toString()}` as Route, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const clearFilters = React.useCallback(() => {
    router.push(pathname as Route, { scroll: false });
  }, [router, pathname]);

  const toggleParam = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      pushParams(params);
    },
    [searchParams, pushParams],
  );

  const content = (
    <div className="flex h-max w-full flex-col gap-8 md:sticky md:top-26 md:w-64 lg:top-32">
      <div className="flex flex-col gap-8">
        {categories.length > 0 && (
          <FilterSection title="Categories" length={categories.length}>
            {categories.map((category) => {
              const isSelected = categoriesValue.includes(category.slug!);

              return (
                <div
                  key={category.slug}
                  className={cn(
                    "hover:text-primary cursor-pointer text-sm transition-colors",
                    isSelected
                      ? "text-primary font-medium"
                      : "text-muted-foreground",
                  )}
                  onClick={() => toggleParam("category", category.slug!)}
                >
                  {isSelected && <span className="mr-3">✓</span>}
                  <span>{category.name}</span>
                </div>
              );
            })}
          </FilterSection>
        )}

        {colors.length > 0 && (
          <FilterSection title="Colors" length={colors.length}>
            {colors.map((color) => {
              const name = color.name as string;
              const isSelected = colorsValue.includes(name);

              return (
                <div
                  key={color.hex}
                  className={cn(
                    "hover:text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors",
                    isSelected
                      ? "text-primary font-medium"
                      : "text-muted-foreground",
                  )}
                  onClick={() => toggleParam("color", name)}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  <span className={cn(isSelected && "font-medium")}>
                    {name}
                  </span>
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color.hex as string }}
                  />
                </div>
              );
            })}
          </FilterSection>
        )}

        <FilterSection title="Price Range" length={priceRangeFilters.length}>
          {priceRangeFilters.map((option) => {
            const isSelected = priceValue === option.slug;

            return (
              <div
                key={option.slug}
                className={cn(
                  "hover:text-primary cursor-pointer text-sm transition-colors",
                  isSelected
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}
                onClick={() => toggleParam("price", option.slug)}
              >
                {isSelected && <span className="mr-3">✓</span>}
                <span>{option.name}</span>
              </div>
            );
          })}
        </FilterSection>
      </div>

      {hasActiveFilters && (
        <Button
          className="w-max"
          size="sm"
          variant="outline"
          onClick={clearFilters}
        >
          <span>Clear</span>
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="bg-background sticky top-24 z-50 w-max"
          >
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="mb-4">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col overflow-y-auto px-6 md:px-8">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return content;
};

const FilterSection = ({
  title,
  length,
  children,
}: {
  title: string;
  length: number;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-4">
    <p className="text-foreground flex items-center gap-2 text-sm font-normal">
      <span>{title}</span> <span>-</span>{" "}
      <span className="font-mono text-sm font-semibold">{length}</span>
    </p>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);
