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
  PRODUCT_QUERYResult,
} from "@/sanity.types";
import { cn } from "@/lib/utils";

const priceRangeFilters = [
  { name: "Under $500", slug: "0-500" },
  { name: "$500 - $1,000", slug: "500-1000" },
  { name: "$1,000 - $3,000", slug: "1000-3000" },
  { name: "$3,000 - $5,000", slug: "3000-5000" },
  { name: "Above $5,000", slug: "5000-999999" },
];

const sizeFilters = [
  { name: "0-2 (XS)", value: "0-2 (XS)" },
  { name: "4-6 (S)", value: "4-6 (S)" },
  { name: "8-10 (M)", value: "8-10 (M)" },
  { name: "12-14 (L)", value: "12-14 (L)" },
  { name: "16-18 (XL)", value: "16-18 (XL)" },
];

interface Props {
  categories: CATEGORIES_QUERYResult;
  colors: PRODUCT_COLOR_QUERYResult;
  products: PRODUCT_QUERYResult;
}

export const Filters: React.FC<Props> = ({ categories, colors, products }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile } = useIsMobile();

  // Memoized params
  const {
    categoriesValue,
    colorsValue,
    sizesValue,
    priceValue,
    hasActiveFilters,
  } = React.useMemo(() => {
    const categoriesValue = searchParams.getAll("category");
    const colorsValue = searchParams.getAll("color");
    const sizesValue = searchParams.getAll("size");
    const priceValue = searchParams.get("price");

    return {
      categoriesValue,
      colorsValue,
      sizesValue,
      priceValue,
      hasActiveFilters:
        !!priceValue ||
        categoriesValue.length > 0 ||
        colorsValue.length > 0 ||
        sizesValue.length > 0,
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

  const getProductCount = React.useCallback(
    (type: "category" | "color" | "size" | "price", value: string) => {
      if (!products) return 0;
      return products.filter((product) => {
        switch (type) {
          case "category":
            return product.category?.slug === value;
          case "color":
            return product.colors?.some((c) => c.name === value);
          case "size":
            return product.sizes?.includes(value);
          case "price":
            const [min, max] = value.split("-").map(Number);
            return (product.price || 0) >= min && (product.price || 0) < max;
          default:
            return false;
        }
      }).length;
    },
    [products],
  );

  const content = (
    <div className="flex h-max w-full flex-col gap-8 md:sticky md:top-26 md:w-64 lg:top-32">
      <div className="flex flex-col gap-8">
        {categories.length > 0 && (
          <FilterSection title="Categories">
            {categories.map((category) => {
              const isSelected = categoriesValue.includes(category.slug!);
              const count = getProductCount("category", category.slug!);

              return (
                <div
                  key={category.slug}
                  className={cn(
                    "hover:text-primary flex cursor-pointer items-center justify-between text-sm transition-colors",
                    isSelected
                      ? "text-primary font-medium"
                      : "text-muted-foreground",
                  )}
                  onClick={() => toggleParam("category", category.slug!)}
                >
                  <div className="flex items-center gap-2">
                    {isSelected && <span>✓</span>}
                    <span>{category.name}</span>
                    <span>({count})</span>
                  </div>
                </div>
              );
            })}
          </FilterSection>
        )}

        <FilterSection title="Price Range">
          {priceRangeFilters.map((option) => {
            const isSelected = priceValue === option.slug;
            const count = getProductCount("price", option.slug);

            return (
              <div
                key={option.slug}
                className={cn(
                  "hover:text-primary flex cursor-pointer items-center justify-between text-sm transition-colors",
                  isSelected
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}
                onClick={() => toggleParam("price", option.slug)}
              >
                <div className="flex items-center gap-2">
                  {isSelected && <span>✓</span>}
                  <span>{option.name}</span>
                  <span>({count})</span>
                </div>
              </div>
            );
          })}
        </FilterSection>

        {colors.length > 0 && (
          <FilterSection title="Colors">
            {[...colors]
              .sort((a, b) =>
                (a.name as string).localeCompare(b.name as string),
              )
              .map((color) => {
                const name = color.name as string;
                const isSelected = colorsValue.includes(name);
                const count = getProductCount("color", name);

                return (
                  <div
                    key={color.hex}
                    className={cn(
                      "hover:text-primary flex cursor-pointer items-center justify-between gap-2 text-sm transition-colors",
                      isSelected
                        ? "text-primary font-medium"
                        : "text-muted-foreground",
                    )}
                    onClick={() => toggleParam("color", name)}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && <span>✓</span>}
                      <div className="flex items-center gap-2">
                        <span
                          className="mt-px size-2.5 rounded-full"
                          style={{ backgroundColor: color.hex as string }}
                        />
                        <span className={cn(isSelected && "font-medium")}>
                          {name}
                        </span>
                      </div>
                      <span>({count})</span>
                    </div>
                  </div>
                );
              })}
          </FilterSection>
        )}

        <FilterSection title="Sizes">
          {sizeFilters.map((size) => {
            const isSelected = sizesValue.includes(size.value);
            const count = getProductCount("size", size.value);

            return (
              <div
                key={size.value}
                className={cn(
                  "hover:text-primary flex cursor-pointer items-center justify-between text-sm transition-colors",
                  isSelected
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}
                onClick={() => toggleParam("size", size.value)}
              >
                <div className="flex items-center gap-2">
                  {isSelected && <span>✓</span>}
                  <span>{size.name}</span>
                  <span>({count})</span>
                </div>
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
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-4">
    <p className="text-foreground flex items-center gap-2 text-sm font-normal">
      <span>{title}</span>
    </p>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);
