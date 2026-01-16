"use client";
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/empty";
import { Button } from "@/ui/button";
import { ProductType } from "@/lib/constants/products";
import { ProductCard } from "@/components/shared/product-card";
import { Icons } from "hugeicons-proxy";
import { PRODUCT_QUERYResult } from "@/sanity.types";

interface Props {
  products: PRODUCT_QUERYResult;
}

export const ProductGrid: React.FC<Props> = ({ products }) => {
  const searchParams = useSearchParams();

  // Filter products based on URL parameters
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    return filtered;
  }, [searchParams]);

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
          className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
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
