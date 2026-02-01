"use client";
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/empty";
import { ProductCard } from "@/components/shared/product-card";
import { Icons } from "hugeicons-proxy";
import { PRODUCT_COLOR_QUERYResult, PRODUCT_QUERYResult } from "@/sanity.types";

interface Props {
  products: PRODUCT_QUERYResult;
}

export const ProductGrid: React.FC<Props> = ({ products }) => {
  const searchParams = useSearchParams();

  // Filter products based on URL parameters
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Filter by categories
    const categories = searchParams.getAll("category");
    if (categories.length > 0) {
      filtered = filtered.filter((product) => {
        // category is a single object with slug property
        const productCategory = product.category?.slug;
        return productCategory ? categories.includes(productCategory) : false;
      });
    }

    // Filter by colors (MULTI SELECT)
    const colors = searchParams.getAll("color");
    if (colors.length > 0) {
      filtered = filtered.filter((product) => {
        const productColors = product.colors;

        if (!productColors || productColors.length === 0) return false;

        return productColors.some((color) =>
          colors.includes(color.name as string),
        );
      });
    }

    // Filter by price range
    const priceRange = searchParams.get("price");
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        return price >= min && price <= max;
      });
    }

    return filtered;
  }, [products, searchParams]);

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center">
        <p className="text-foreground text-sm font-normal">
          Showing <strong>{filteredProducts.length}</strong> results
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 lg:gap-y-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={`${product._id}-${idx}`} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center text-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icons.ProductLoadingIcon />
              </EmptyMedia>
              <EmptyTitle>No Product Found</EmptyTitle>
              <EmptyDescription>
                There are no products matching your filters.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}
    </div>
  );
};
