"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/constants/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className={cn("group block space-y-4", className)}
    >
      <div className="bg-charcoal/5 relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay or Badge can go here */}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-lg leading-tight group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
          <p className="text-sm font-medium">${product.price.toLocaleString()}</p>
        </div>
        <p className="text-muted-foreground text-xs uppercase tracking-wider">
          {product.category}
        </p>
      </div>
    </Link>
  );
};
