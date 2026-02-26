"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard } from "@/components/shared/product-card";
import { PRODUCT_QUERYResult } from "@/sanity.types";

export const Recommended: React.FC<{ products: PRODUCT_QUERYResult }> = ({
  products,
}) => {
  return (
    <motion.div
      layout
      className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8"
    >
      <AnimatePresence mode="popLayout">
        {products.slice(0, 4).map((product, idx) => (
          <ProductCard key={`${product._id}-${idx}`} product={product} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
