"use client";
import Link from "next/link";
import { Route } from "next";
import * as React from "react";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { ButtonGroup } from "@/ui/button-group";
import { Button, buttonVariants } from "@/ui/button";
import {
  useCartActions,
  useCartItem,
} from "@/components/providers/cart.provider";
import { PRODUCT_QUERYResult } from "@/sanity.types";
import { StockBadge } from "@/components/shared/stock-badge";
import { toast } from "sonner";
import { Notify } from "@/components/shared/notify";
import { Badge } from "@/ui/badge";

interface Props {
  product: PRODUCT_QUERYResult[number];
}

export const ProductDetails: React.FC<Props> = ({ product }) => {
  const { addItem, updateQuantity } = useCartActions();
  const cartItem = useCartItem(product._id);

  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedColor, setSelectedColor] = React.useState<string>("");

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const quantityInCart = cartItem?.quantity ?? 0;
  const isAtMax = quantityInCart >= stock;

  const handleAdd = () => {
    if (quantityInCart < stock) {
      addItem(
        {
          productId: product._id,
          name: product.name!,
          price: product.price!,
          image: product.images?.[0]!,
        },
        1,
      );
      toast.custom(() => (
        <Notify type="success" title={`${product.name} added successfully.`} />
      ));
    }
  };

  return (
    <div className="flex flex-col-reverse gap-8 md:flex-row lg:gap-12">
      <div className="flex h-max flex-1 gap-4 md:w-1/2 lg:w-max">
        <div className="flex flex-1 flex-col gap-4">
          <Image
            src={product.images?.[0]!}
            alt={product.name ?? ""}
            width={600}
            height={800}
            quality={100}
            className="h-auto w-full object-contain"
            priority
          />

          <div className="grid flex-1 grid-cols-2 gap-4">
            {product?.images?.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-3/4 flex-1 overflow-hidden"
              >
                <Image
                  src={img || ""}
                  alt={`${product.name} ${idx + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="top-28 h-max w-full space-y-8 md:sticky md:w-1/2 lg:max-w-lg">
        <div className="space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl">{product.name}</h2>
          <p className="flex items-center gap-3 text-lg font-medium md:text-xl">
            <span>Price: ${product?.price?.toLocaleString()}</span>
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <StockBadge productId={product._id} stock={stock} />
            )}
          </p>
        </div>

        <div className="space-y-8">
          <p className="text-muted-foreground text-base leading-relaxed">
            {product.description}
          </p>

          {/* Colors */}
          {product?.colors && product?.colors?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-wider uppercase">
                Color: {selectedColor || "Select"}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    size="sm"
                    variant={selectedColor === color ? "default" : "outline"}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div className="flex flex-col gap-2">
            <span className="text-xs tracking-wider uppercase">
              Size: {selectedSize || "Select"}
            </span>
            <div className="flex flex-wrap gap-2">
              {product?.sizes?.map((size) => (
                <Button
                  key={size}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  variant={selectedSize === size ? "default" : "outline"}
                  className={selectedSize === size ? "pointer-events-none" : ""}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <ButtonGroup
            orientation="horizontal"
            aria-label="Media controls"
            className="h-fit w-full gap-1"
          >
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAdd}
              disabled={
                isAtMax ||
                !selectedSize ||
                ((product?.colors?.length ?? 0) > 0 && !selectedColor)
              }
            >
              <span>{isOutOfStock ? "Out of stock" : "Add to Cart"}</span>
            </Button>
          </ButtonGroup>
        </div>

        <div className="border-t pt-6">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="details"
          >
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm tracking-wider uppercase">
                Product Details
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-muted-foreground list-inside list-disc space-y-1 pt-2">
                  {product.details?.map((detail, idx) => (
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
            <AccordionItem value="consultation">
              <AccordionTrigger className="text-sm tracking-wider uppercase">
                Consultation
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground pt-2">
                  Looking for custom modifications? Start a consultation with
                  our artisans to refine this design.
                </p>
                <Link
                  href={"/consultation" as Route}
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "mt-3 w-full",
                  })}
                >
                  Start Consultation
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
