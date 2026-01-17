import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/ui/button";
import { PRODUCT_QUERYResult } from "@/sanity.types";
import { formatPrice } from "@/lib/utils";
import { StockBadge } from "./stock-badge";
import { Badge } from "@/ui/badge";

interface Props {
  product: PRODUCT_QUERYResult[number];
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="bg-secondary relative mb-4 aspect-3/4 overflow-hidden border shadow-sm">
          <Image
            src={product.images?.[0]!}
            alt={product.name ?? ""}
            fill
            priority
            quality={100}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle Hover Reveal */}
          <div className="bg-primary/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium shadow-lg"
            >
              Out of Stock
            </Badge>
          )}

          <div className="absolute bottom-0 left-0 flex w-full translate-y-4 items-end justify-between p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-6">
            <Button
              size="sm"
              variant={"outline"}
              className="bg-background/90 hover:bg-background/80 h-7 backdrop-blur-sm"
            >
              View Details
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="mb-1 font-serif text-base transition-opacity group-hover:opacity-60 sm:text-lg">
              {product.name}
            </h3>
            <span className="mt-1 text-sm font-medium tracking-tight opacity-80">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
              {product?.category?.name}
            </p>
            <StockBadge productId={product._id} stock={product.stock ?? 0} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
