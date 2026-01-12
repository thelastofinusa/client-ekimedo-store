"use client";

import React from "react";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterSidebarProps {
  className?: string;
  closeSheet?: () => void;
}

const CATEGORIES = ["Bridal", "Prom", "Couture"];
const PRICE_RANGES = [
  { label: "Under $1,000", value: "0-1000" },
  { label: "$1,000 - $3,000", value: "1000-3000" },
  { label: "$3,000 - $5,000", value: "3000-5000" },
  { label: "Above $5,000", value: "5000-10000" },
];

export const FilterSidebar = ({ className, closeSheet }: FilterSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current state from URL
  const selectedCategories = searchParams.getAll("category");
  const selectedPrice = searchParams.get("price");

  const createQueryString = (name: string, value: string, type: "append" | "set" | "delete") => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (type === "append") {
        if (params.getAll(name).includes(value)) {
            params.delete(name, value);
        } else {
            params.append(name, value);
        }
    } else if (type === "set") {
        if (params.get(name) === value) {
            params.delete(name);
        } else {
            params.set(name, value);
        }
    } else if (type === "delete") {
        params.delete(name);
    }
    
    return params.toString();
  };

  const onCategoryChange = (category: string) => {
    router.push((pathname + "?" + createQueryString("category", category, "append")) as any, { scroll: false });
  };

  const onPriceChange = (value: string) => {
    router.push((pathname + "?" + createQueryString("price", value, "set")) as any, { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname as any, { scroll: false });
    closeSheet?.();
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Filters</h2>
        <Button
          variant="outline"
          size="xs"
          onClick={clearFilters}
        >
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm uppercase tracking-wider">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <button
                    onClick={() => onCategoryChange(category)}
                    className="flex items-center gap-2 group"
                  >
                    <div
                      className={cn(
                        "size-4 border border-input rounded-sm flex items-center justify-center transition-colors",
                        selectedCategories.includes(category)
                          ? "bg-primary border-primary text-primary-foreground"
                          : "group-hover:border-primary"
                      )}
                    >
                      {selectedCategories.includes(category) && (
                         <svg
                         width="10"
                         height="10"
                         viewBox="0 0 10 10"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg"
                         className="fill-current"
                       >
                         <path d="M8.75 2.5L3.75 7.5L1.25 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                      )}
                    </div>
                    <Label className="cursor-pointer font-normal">
                      {category}
                    </Label>
                  </button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm uppercase tracking-wider">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {PRICE_RANGES.map((range, idx) => {
                const isSelected = selectedPrice === range.value;
                return (
                  <div key={idx} className="flex items-center gap-2">
                     <button
                        onClick={() => onPriceChange(range.value)}
                        className={cn(
                          "text-sm transition-colors hover:text-primary",
                          isSelected ? "font-medium text-primary" : "text-muted-foreground"
                        )}
                      >
                        {range.label}
                      </button>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
