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
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { useIsMobile } from "@/hooks/mobile";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Icons } from "hugeicons-proxy";
import {
  CATEGORIES_QUERYResult,
  PRODUCT_COLOR_QUERYResult,
} from "@/sanity.types";
import { ScrollArea } from "@/ui/scroll-area";

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
  const { isMobile } = useIsMobile();
  const searchParams = useSearchParams();
  const categoriesValue = searchParams.getAll("category");
  const colorsValue = searchParams.getAll("color");
  const priceValue = searchParams.get("price");

  const hasActiveFilters =
    !!priceValue || categoriesValue.length > 0 || colorsValue.length > 0;

  const clearFilters = () => {
    router.push(pathname as Route, { scroll: false });
  };

  const handleFilterChange = (
    filterId: string,
    value: string,
    isMultiple: boolean,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (isMultiple) {
      // For multiple selections, toggle the value
      const values = params.getAll(filterId);
      if (values.includes(value)) {
        params.delete(filterId);
        values
          .filter((v) => v !== value)
          .forEach((v) => params.append(filterId, v));
      } else {
        params.append(filterId, value);
      }
    } else {
      // For single selection, replace the value
      if (params.get(filterId) === value) {
        params.delete(filterId);
      } else {
        params.set(filterId, value);
      }
    }

    router.push(`${pathname}?${params.toString()}` as Route, { scroll: false });
  };

  const renderCategoryFilters = () => {
    if (!categories.length) return null;

    return (
      <div className="flex flex-col gap-2">
        {categories.map((category) => {
          const isChecked = categoriesValue.includes(category.slug!);
          return (
            <div key={category.slug} className="flex items-center gap-2.5">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() =>
                  handleFilterChange("category", category.slug!, true)
                }
                id={`category-${category.slug}`}
              />
              <Label
                htmlFor={`category-${category.slug}`}
                className="cursor-pointer text-sm"
              >
                {category.name}
              </Label>
            </div>
          );
        })}
      </div>
    );
  };

  const renderColorFilters = () => {
    if (!colors.length) return null;

    return (
      <div className="flex flex-col gap-2">
        {colors.map((color) => {
          const isChecked = colorsValue.includes(color.name as string);

          return (
            <div key={color.hex} className="flex items-center gap-2.5">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() =>
                  handleFilterChange("color", color.name as string, true)
                }
                id={`color-${color.name}`}
              />
              <Label
                htmlFor={`color-${color.name}`}
                className="flex cursor-pointer items-center gap-1.5"
              >
                <span
                  className="size-3 rounded-full border"
                  style={{ backgroundColor: color.hex as string }}
                />
                <span className="text-sm">{color.name}</span>
              </Label>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPriceFilters = () => {
    return (
      <RadioGroup
        value={priceValue || ""}
        onValueChange={(value) => handleFilterChange("price", value, false)}
        className="flex flex-col gap-2"
      >
        {priceRangeFilters.map((option) => (
          <div key={option.slug} className="flex items-center gap-2.5">
            <RadioGroupItem value={option.slug} id={`price-${option.slug}`} />
            <Label
              htmlFor={`price-${option.slug}`}
              className="cursor-pointer text-sm"
            >
              {option.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const content = () => (
    <div className="flex h-max w-full flex-col gap-8 md:sticky md:top-26 md:w-64 lg:top-32">
      <div className="flex items-center gap-3">
        {hasActiveFilters && (
          <Button size="icon-xs" variant="outline" onClick={clearFilters}>
            <Icons.Cancel01Icon />
            <span className="sr-only">Clear All</span>
          </Button>
        )}
        <p className="font-serif text-2xl font-medium">Filters</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground font-serif text-sm italic">
              Categories
            </p>
            <ScrollArea className="max-h-[320px] overflow-y-auto">
              {renderCategoryFilters()}
            </ScrollArea>
          </div>
        )}

        {/* Colors Filter */}
        {colors.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground font-serif text-sm italic">
              Colors
            </p>
            <ScrollArea className="max-h-[320px] overflow-y-auto">
              {renderColorFilters()}
            </ScrollArea>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground font-serif text-sm italic">
            Price Range
          </p>
          <ScrollArea className="max-h-[320px] overflow-y-auto">
            {renderPriceFilters()}
          </ScrollArea>
        </div>
      </div>
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
          <div className="flex flex-1 flex-col px-8">{content()}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return content();
};
