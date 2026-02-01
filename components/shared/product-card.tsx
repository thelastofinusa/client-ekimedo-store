import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/ui/button";
import { formatPrice } from "@/lib/utils";
import { StockBadge } from "./stock-badge";
import { Badge } from "@/ui/badge";
import Link from "next/link";
import { PRODUCT_QUERYResult } from "@/sanity.types";

interface Props {
  product: PRODUCT_QUERYResult[number];
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="group block cursor-pointer"
      >
        <div className="bg-secondary relative mb-4 aspect-3/4 overflow-hidden border shadow-sm">
          <Image
            src={product?.images?.[0] ?? ""}
            alt={product.name ?? ""}
            fill
            priority
            quality={100}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle Hover Reveal */}
          <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {isOutOfStock ? (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium shadow-lg"
            >
              Out of Stock
            </Badge>
          ) : (
            <StockBadge
              productId={product._id.toString()}
              stock={stock}
              className="absolute top-3 right-3"
            />
          )}

          {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 z-30 flex w-full translate-y-4 items-end justify-between p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Button size="sm" variant={"secondary"}>
                View Product
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <h3 className="mb-1 font-serif text-base transition-opacity group-hover:opacity-60 sm:text-lg">
              {product.name}
            </h3>
            <span className="text-lg font-medium">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-neutral-500">
            {product?.category?.name}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};
