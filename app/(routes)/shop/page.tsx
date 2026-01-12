"use client";

import React, { useMemo, Suspense } from "react";
import { Container } from "@/components/shared/container";
import { FilterSidebar } from "./_components/filter-sidebar";
import { ProductCard } from "./_components/product-card";
import { PRODUCTS } from "@/constants/products";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/sheet";
import { Button } from "@/ui/button";
import { Route } from "next";
import { Icons } from "hugeicons-proxy";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategories = searchParams.getAll("category");
  const selectedPriceRange = searchParams.get("price");

  const clearFilters = () => {
    router.push(pathname as Route, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      let matchesPrice = true;
      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split("-").map(Number);
        matchesPrice = product.price >= min && product.price <= max;
      }

      return matchesCategory && matchesPrice;
    });
  }, [selectedCategories, selectedPriceRange]);

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 pt-16">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <FilterSidebar />
      </div>

      {/* Mobile Filter Trigger */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Icons.FilterHorizontalIcon className="size-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-1 flex-col p-8 md:px-12">
              <FilterSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {filteredProducts.length} results
          </p>
          {/* Sort dropdown could go here */}
        </div>

        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center text-center">
            <h3 className="font-serif text-lg">No products found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Try adjusting your filters to find what you&apos;re looking for.
            </p>
            <Button variant="link" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="py-12 md:py-24">
      <Container>
        <Suspense fallback={<div>Loading shop...</div>}>
          <ShopContent />
        </Suspense>
      </Container>
    </div>
  );
}
