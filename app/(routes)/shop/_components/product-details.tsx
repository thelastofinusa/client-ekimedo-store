"use client";
import Link from "next/link";
import { Route } from "next";
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
        <div className="flex flex-1 flex-col gap-4">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={product.name ?? "Product image"}
              width={600}
              height={800}
              quality={100}
              className="h-auto w-full object-contain"
              priority
            />
          ) : (
            <div className="flex aspect-3/4 h-full w-full items-center justify-center overflow-hidden bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid flex-1 grid-cols-3 gap-4 md:grid-cols-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-3/4 cursor-pointer overflow-hidden border transition-all ${
                    selectedImage === img ? "border-2" : "border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                  {selectedImage === img && (
                    <div className="absolute inset-0 border-2 border-black" />
                  )}
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

        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl md:text-3xl">{product.name}</h2>
          <p className="flex items-center gap-3 text-base font-medium md:text-lg">
            <span>
              Price:{" "}
              <span className="font-mono">{formatPrice(product?.price)}</span>
            </span>
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : (
              <StockBadge productId={product._id} stock={stock} />
            )}
          </p>

          <pre className="text-muted-foreground font-sans text-base leading-relaxed whitespace-pre-wrap">
            {product.description}
          </pre>
        </div>

        <div className="flex flex-col gap-8">
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
                            "ring-ring mb-2 size-7 cursor-pointer rounded-full ring-1 transition-all focus:outline-none",
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
          <p className="text-muted-foreground text-center font-mono text-sm">
            This takes 4-6 weeks to ship out. <br /> Complementary alteration is
            included.
          </p>
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs font-medium tracking-wider uppercase">
              Consultation
            </p>
            <p className="text-muted-foreground text-sm">
              Looking for custom modifications? Start a consultation with our
              artisans to refine this design.
            </p>
            <Link
              href={"/consultation" as Route}
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "mt-4 w-full",
              })}
            >
              Start Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
