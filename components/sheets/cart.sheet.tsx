"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
import { useAppStore } from "@/lib/store";
import { Button, buttonVariants } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { toast } from "sonner";
import { Notify } from "../shared/notify";
import Image from "next/image";
import { Icons } from "hugeicons-proxy";

interface CompProps {
  children: React.ReactNode;
}

export const CartSheet: React.FC<CompProps> = ({ children }) => {
  const { cart, clearCart, addToCart, removeFromCart } = useAppStore();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle
            onClick={() => {
              toast.custom(() => {
                return (
                  <Notify
                    type="success"
                    title={`"${cart.length + 1}" product(s) added to cart`}
                  />
                );
              });
              addToCart({
                dress: {
                  id: String(Math.random() * Date.now()),
                  name: "First item added",
                  price: 500,
                  category: "bridal",
                  image: "/collections/bridal.avif",
                },
                selectedSize: "2xl",
                quantity: 2,
              });
            }}
          >
            Your Selection
          </SheetTitle>
        </SheetHeader>

        {cart.length > 0 ? (
          <ScrollArea className="h-[800px] px-4 sm:px-6 md:px-8">
            {cart.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                key={`${item.dress.id}-${item.selectedSize}`}
                className="group flex gap-6 border-b py-6 last-of-type:border-b-0"
              >
                <div className="bg-foreground/5 relative aspect-[0.9] w-24 overflow-hidden">
                  <Image
                    src={item.dress.image || "/placeholder.svg"}
                    alt={item.dress.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <h4 className="font-serif text-sm">{item.dress.name}</h4>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => removeFromCart(item.dress.id)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove item"
                    >
                      <Icons.Cancel01Icon className="size-3" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
                    {item.dress.category} — {item.selectedSize}
                  </p>
                  <p className="mt-2 font-serif text-xs">
                    ${(item.dress.price || 0).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground font-serif text-sm">
                The atelier is empty.
              </p>
              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    Browse Collection
                  </Link>
                </SheetClose>
                <Button
                  onClick={() => {
                    toast.custom(() => {
                      return (
                        <Notify
                          type="success"
                          title={`"${cart.length + 1}" product(s) added to cart`}
                        />
                      );
                    });
                    addToCart({
                      dress: {
                        id: "10",
                        name: "First item added",
                        price: 500,
                        category: "bridal",
                        image: "/collections/bridal.avif",
                      },
                      selectedSize: "2xl",
                      quantity: 2,
                    });
                  }}
                >
                  Quickly add to cart
                </Button>
              </div>
            </div>
          </div>
        )}

        <SheetFooter className="bg-card gap-4">
          <div className="flex items-center justify-between">
            <p className="max-w-[220px] text-sm leading-relaxed opacity-60">
              Subtotal
            </p>
            <p className="max-w-[220px] text-sm leading-relaxed opacity-60">
              ${cart.map((item) => item.dress.price)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            {cart.length > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  clearCart();
                  toast.custom(() => {
                    return (
                      <Notify
                        type="success"
                        title="Successfully cleared cart"
                      />
                    );
                  });
                }}
                className="flex-1"
              >
                <span>Clear Cart</span>
              </Button>
            )}
            <SheetClose asChild>
              <Link
                href="/cart"
                aria-disabled={cart.length === 0}
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className:
                    "flex-1 aria-disabled:pointer-events-none aria-disabled:opacity-50",
                })}
              >
                <span>View Cart</span>
              </Link>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
