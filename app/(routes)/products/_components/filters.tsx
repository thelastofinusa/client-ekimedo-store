"use client";
import { Route } from "next";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";

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
import { client } from "@/sanity/lib/client";

const priceRangeFilters = [
  { name: "Under $500", slug: "0-500" },
  { name: "$500 - $1,000", slug: "500-1000" },
  { name: "$1,000 - $3,000", slug: "1000-3000" },
  { name: "$3,000 - $5,000", slug: "3000-5000" },
  { name: "Above $5,000", slug: "5000-999999" },
];

export const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useIsMobile();
  const searchParams = useSearchParams();
  const [categories, setCategories] = React.useState<
    Array<{ _id: string; name: string; slug: string }>
  >([]);

  // Fetch categories from Sanity
  React.useEffect(() => {
    const fetchCategories = async () => {
      const result = await client.fetch(CATEGORIES_QUERY);
      setCategories(result as typeof categories);
    };
    fetchCategories();
  }, []);

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
    const selectedValues = searchParams.getAll("category");

    return (
      <div className="flex flex-col gap-3">
        {categories.map((category) => {
          const isChecked = selectedValues.includes(category.slug);
          return (
            <div key={category.slug} className="flex items-center gap-2.5">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() =>
                  handleFilterChange("category", category.slug, true)
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

  const renderPriceFilters = () => {
    const selectedValue = searchParams.get("price");

    return (
      <RadioGroup
        value={selectedValue || ""}
        onValueChange={(value) => handleFilterChange("price", value, false)}
        className="flex flex-col gap-3"
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
      <div className="flex items-center justify-between">
        <p className="hidden font-serif text-2xl font-medium md:flex">
          Filters
        </p>
        <Button size="sm" variant="outline" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground font-serif text-sm italic">
              Categories
            </p>
            {renderCategoryFilters()}
          </div>
        )}

        {/* Price Range Filter */}
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground font-serif text-sm italic">
            Price Range
          </p>
          {renderPriceFilters()}
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
          <div className="flex flex-1 flex-col p-8 py-4 md:px-12 md:py-6">
            {content()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return content();
};
