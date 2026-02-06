"use client";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import Image from "next/image";

import { Badge } from "@/ui/badge";
import {
  useCartActions,
  useProductTotalQuantity,
} from "@/components/providers/cart.provider";
import { Notify } from "@/components/shared/notify";
import { Button, buttonVariants } from "@/ui/button";
import { PRODUCT_QUERYResult } from "@/sanity.types";
import { StockBadge } from "@/components/shared/stock-badge";
import { Icons } from "hugeicons-proxy";
import { cn, formatPrice } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

interface Props {
  product: PRODUCT_QUERYResult[number];
}

interface SizeChart {
  size: string;
  numeric: string;
  bust: string;
  waist: string;
  hip: string;
}

const sizeChart: SizeChart[] = [
  {
    size: "XS",
    numeric: "0-2",
    bust: "32-33 / 81-84",
    waist: "24-25 / 61-64",
    hip: "34-35 / 86-89",
  },
  {
    size: "S",
    numeric: "4-6",
    bust: "34-35 / 86-89",
    waist: "26-27 / 66-69",
    hip: "36-37 / 91-94",
  },
  {
    size: "M",
    numeric: "8-10",
    bust: "36-37 / 91-94",
    waist: "28-29 / 71-74",
    hip: "38-39 / 96-99",
  },
  {
    size: "L",
    numeric: "12-14",
    bust: "38.5-40 / 98-101",
    waist: "30.5-32 / 77-81",
    hip: "40.5-42 / 103-107",
  },
  {
    size: "XL",
    numeric: "16-18",
    bust: "41.5-43 / 105-109",
    waist: "33.5-35 / 85-89",
    hip: "44.5-46 / 113-117",
  },
];

export const ProductDetails: React.FC<Props> = ({ product }) => {
  const { addItem } = useCartActions();
  const quantityInCart = useProductTotalQuantity(product._id);

  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [selectedColor, setSelectedColor] = React.useState<string>("");

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const isAtMax = quantityInCart >= stock;

  const images = (product.images ?? []).filter(Boolean) as string[];

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  // Fallback image in case no images are available
  const displayImage = selectedImage || images[0] || "/placeholder-image.jpg";

  const handleAdd = () => {
    if (quantityInCart < stock) {
      addItem(
        {
          productId: product._id,
          name: product.name!,
          price: product.price!,
          image: selectedImage ?? images[0] ?? "",
          selectedSize,
          selectedColor,
        },
        1,
      );
      toast.custom(() => (
        <Notify
          type="success"
          title={`${product.name} added`}
          description={`${selectedSize ? `Size: ${selectedSize}` : ""} ${selectedColor ? `, Color: ${selectedColor}` : ""}`}
        />
      ));
    }
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row lg:gap-12">
      <div className="flex h-max flex-1 gap-4 md:w-1/2 lg:w-max">
        <div className="flex flex-1 flex-col gap-5">
          <div className="relative overflow-hidden rounded-xl border bg-neutral-50">
            <Image
              src={displayImage}
              alt={product.name ?? "Product image"}
              width={600}
              height={800}
              quality={100}
              priority
              className="h-auto w-full object-contain transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    "relative aspect-3/4 overflow-hidden rounded-md border bg-neutral-50 transition",
                    selectedImage === img
                      ? "ring-2 ring-neutral-900"
                      : "hover:ring-1 hover:ring-neutral-400",
                  )}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="top-28 h-max w-full space-y-8 md:sticky md:w-1/2 lg:max-w-lg">
        <nav className="mb-8 hidden items-center text-sm text-neutral-500 md:flex">
          <Link
            href="/shop"
            className="transition-colors hover:text-neutral-900"
          >
            Products
          </Link>
          <Icons.ArrowRight01Icon className="mx-1 size-4" />
          <span className="truncate font-medium text-neutral-900">
            {product.name}
          </span>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl md:text-3xl">{product.name}</h2>
          <p className="flex items-center gap-3 text-base font-medium md:text-xl">
            <span>
              Price: <span>{formatPrice(product?.price)}</span>
            </span>
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <StockBadge productId={product._id} stock={stock} />
            )}
          </p>

          <pre className="font-sans text-base leading-relaxed font-light whitespace-pre-wrap">
            {product.description}
          </pre>
        </div>

        <div className="flex flex-col gap-6">
          {/* Colors */}
          {product?.colors && product?.colors?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-wider uppercase">
                Color: {selectedColor || "Select"}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  if (!color || !color.name || !color.value) return null;
                  return (
                    <Tooltip key={color.name}>
                      <TooltipTrigger asChild>
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name || "")}
                          className={cn(
                            "ring-ring size-7 cursor-pointer rounded-full ring-1 transition-all focus:outline-none",
                            {
                              "ring-ring ring-2 ring-offset-2":
                                selectedColor === color.name,
                            },
                          )}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                          type="button"
                        />
                      </TooltipTrigger>
                      <TooltipContent align="start" side="bottom">
                        <p>{color.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product?.sizes && product?.sizes?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-wider uppercase">
                Size: {selectedSize ?? "Select"}
              </span>
              <div className="flex flex-wrap gap-2">
                {product?.sizes?.map((size) => (
                  <Button
                    key={size}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={cn(
                      "font-mono text-xs! font-normal tracking-normal",
                      selectedSize === size ? "pointer-events-none" : "",
                    )}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            size="xl"
            className="w-full"
            onClick={handleAdd}
            disabled={
              isAtMax ||
              ((product?.sizes?.length ?? 0) > 0 && !selectedSize) ||
              ((product?.colors?.length ?? 0) > 0 && !selectedColor)
            }
          >
            <span>{isOutOfStock ? "Out of stock" : "Add to Cart"}</span>
          </Button>
        </div>

        <div className="mt-6 mb-6">
          <p className="text-sm font-semibold">
            Estimate delivery: 4-6 weeks. Complementary alteration is included.
          </p>
        </div>

        <div className="mt-6 border-t pt-6">
          <p className="text-sm text-neutral-600">
            Looking for custom modifications? Start a consultation with our
            artisans to refine this design.
          </p>

          <Link
            href="/consultation"
            className={buttonVariants({
              variant: "outline",
              className: "mt-4",
            })}
          >
            Start Consultation
          </Link>
        </div>
      </div>
    </div>
  );
};
