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

const productsFilter: Array<{
  name: string;
  id: string;
  type: "multiple" | "single";
  options: {
    name: string;
    slug: string;
  }[];
}> = [
  {
    name: "Categories",
    id: "category",
    type: "multiple",
    options: [
      { name: "Bridal", slug: "bridal" },
      { name: "Prom", slug: "prom" },
      { name: "Special Event", slug: "special-event" },
    ],
  },
  {
    name: "Price Range",
    id: "price",
    type: "single",
    options: [
      { name: "Under $1,000", slug: "0-1000" },
      { name: "$1,000 - $3,000", slug: "1000-3000" },
      { name: "$3,000 - $5,000", slug: "3000-5000" },
      { name: "Above $5,000", slug: "5000-10000" },
    ],
  },
];

export const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useIsMobile();
  const searchParams = useSearchParams();

  const clearFilters = () => {
    router.push(pathname as Route, { scroll: false });
  };

  const renderFilterContent = (filter: (typeof productsFilter)[0]) => {
    if (filter.type === "multiple") {
      const selectedValues = searchParams.getAll(filter.id);

      return (
        <div className="flex flex-col gap-3">
          {filter.options.map((option) => {
            const isChecked = selectedValues.includes(option.slug);
            return (
              <div key={option.slug} className="flex items-center gap-2.5">
                <Checkbox
                  checked={isChecked}
                  id={`${filter.id}-${option.slug}`}
                />
                <Label
                  htmlFor={`${filter.id}-${option.slug}`}
                  className="cursor-pointer text-sm"
                >
                  {option.name}
                </Label>
              </div>
            );
          })}
        </div>
      );
    } else {
      const selectedValue = searchParams.get(filter.id);

      return (
        <RadioGroup value={selectedValue || ""} className="flex flex-col gap-3">
          {filter.options.map((option) => (
            <div key={option.slug} className="flex items-center gap-2.5">
              <RadioGroupItem
                value={option.slug}
                id={`${filter.id}-${option.slug}`}
              />
              <Label
                htmlFor={`${filter.id}-${option.slug}`}
                className="cursor-pointer text-sm"
              >
                {option.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }
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
        {productsFilter.map((filter) => (
          <div key={filter.id} className="flex flex-col gap-4">
            <p className="text-muted-foreground font-serif text-sm italic">
              {filter.name}
            </p>
            {renderFilterContent(filter)}
          </div>
        ))}
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
