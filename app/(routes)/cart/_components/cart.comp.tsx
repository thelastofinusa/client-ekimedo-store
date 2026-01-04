"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useAppStore } from "@/lib/store";
import { Icons } from "hugeicons-proxy";
import { Container } from "@/components/shared/container";
import { Button, buttonVariants } from "@/ui/button";

export const CartComp = () => {
  const { cart, removeFromCart } = useAppStore();

  return (
    <div className="pb-24 lg:pb-32">
      <Container size="sm">
        {cart.length === 0 ? (
          <div className="border-charcoal/5 border-y py-24 text-center">
            <p className="mb-8 font-serif text-lg opacity-40">
              Your cart is currently empty.
            </p>
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-20 lg:flex-row">
            {/* Items List */}
            <div className="flex-1 space-y-12">
              {cart.map((item, idx) => (
                <div
                  key={`${item.dress.id}-${idx}`}
                  className="border-charcoal/5 group flex gap-8 border-b pb-12"
                >
                  <div className="bg-charcoal/5 relative h-44 w-32 shrink-0 overflow-hidden">
                    <Image
                      src={
                        item.dress.image ||
                        "/placeholder.svg?height=400&width=300"
                      }
                      alt={item.dress.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-charcoal mb-2 font-serif text-2xl">
                          {item.dress.name}
                        </h3>
                        <p className="text-[10px] tracking-widest uppercase opacity-40">
                          {item.selectedSize}
                          {item.selectedColor ? ` / ${item.selectedColor}` : null}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => removeFromCart(item.dress.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove item"
                      >
                        <Icons.Delete02Icon className="size-4" />
                      </Button>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-[10px] tracking-widest uppercase opacity-40">
                        {item.dress.deliveryTime ? `Delivery: ${item.dress.deliveryTime}` : ""}
                      </p>
                      <span className="text-charcoal text-sm font-medium">
                        {item.dress.priceRange ?? `$${(item.dress.price || 0).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="w-full space-y-12 lg:w-96">
              <div className="bg-background space-y-10 border p-10 shadow-xs">
                <h2 className="text-charcoal font-serif text-2xl">Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs tracking-widest uppercase opacity-60">
                    <span>Subtotal</span>
                    <span>Custom Pricing</span>
                  </div>
                  <div className="flex justify-between text-xs tracking-widest uppercase opacity-60">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="border-charcoal/10 text-charcoal flex justify-between border-t pt-4 font-serif text-xl">
                    <span>Total</span>
                    <span>{cart.length} Item(s)</span>
                  </div>
                </div>

                <Link
                  href="/consultation"
                  className={buttonVariants({
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  Schedule Consultation
                </Link>
                <p className="text-center text-[10px] leading-relaxed opacity-40">
                  All purchases require a consultation to ensure perfect fit and
                  customization.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] tracking-widest uppercase opacity-40">
                  Secure Payment
                </h4>
                <div className="flex gap-4 opacity-40">
                  <div className="bg-charcoal/10 h-6 w-10 rounded" />
                  <div className="bg-charcoal/10 h-6 w-10 rounded" />
                  <div className="bg-charcoal/10 h-6 w-10 rounded" />
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
