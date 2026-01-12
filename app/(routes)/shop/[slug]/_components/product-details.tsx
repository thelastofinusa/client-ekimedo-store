"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/constants/products";
import { useAppStore } from "@/lib/store";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Notify } from "@/components/shared/notify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { Icons } from "hugeicons-proxy";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { addToCart } = useAppStore();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart({
      dress: {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.images[0],
      },
      selectedSize,
      selectedColor,
      quantity: 1,
    });

    toast.custom(() => (
      <Notify type="success" title={`Added ${product.name} to cart`} />
    ));
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Images */}
      <div className="space-y-4">
        <div className="bg-charcoal/5 relative aspect-3/4 w-full overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {product.images.slice(1).map((img, idx) => (
            <div
              key={idx}
              className="bg-charcoal/5 relative aspect-3/4 overflow-hidden"
            >
              <Image
                src={img}
                alt={`${product.name} ${idx + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="sticky top-24 h-fit space-y-10">
        <div className="space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl">{product.name}</h1>
          <p className="text-xl font-medium">
            ${product.price.toLocaleString()}
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs tracking-wider uppercase">
                Color: {selectedColor || "Select"}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "border px-4 py-2 text-sm transition-all",
                      selectedColor === color
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:border-primary",
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs tracking-wider uppercase">
                Size: {selectedSize || "Select"}
              </span>
              <button className="text-xs underline underline-offset-4">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center border text-sm transition-all",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:border-primary",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={
              !selectedSize || (product.colors.length > 0 && !selectedColor)
            }
          >
            Add to Cart
          </Button>

          <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
            <Icons.Tick02Icon className="size-4" />
            <span>Free shipping on orders over $500</span>
          </div>
        </div>

        <div className="border-t pt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm tracking-wider uppercase">
                Product Details
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 pt-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm tracking-wider uppercase">
                Shipping & Returns
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground pt-2">
                  We offer worldwide shipping. Please allow 3-5 business days
                  for processing. Returns are accepted within 14 days of
                  delivery for unworn items with tags attached.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
