"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { useAppStore } from "@/lib/store";
import { Icons } from "hugeicons-proxy";
import { Container } from "@/components/shared/container";
import { Button, buttonVariants } from "@/ui/button";

export const CartComp = () => {
  const { cart, removeFromCart } = useAppStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.dress.price * item.quantity,
      0,
    );
  }, [cart]);

  const onCheckout = async () => {
    if (!isSignedIn) {
      window.location.href = "/sign-in?redirect_url=/cart";
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Something went wrong");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong during checkout.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
                          {item.selectedColor
                            ? ` / ${item.selectedColor}`
                            : null}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          removeFromCart(
                            item.dress.id,
                            item.selectedSize,
                            item.selectedColor,
                          )
                        }
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove item"
                      >
                        <Icons.Delete02Icon className="size-4" />
                      </Button>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-[10px] tracking-widest uppercase opacity-40">
                        {item.dress.deliveryTime
                          ? `Delivery: ${item.dress.deliveryTime}`
                          : ""}
                      </p>
                      <div className="text-right">
                        <span className="text-charcoal block text-sm font-medium">
                          ${(item.dress.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-muted-foreground block text-xs">
                            {item.quantity} x $
                            {item.dress.price.toLocaleString()}
                          </span>
                        )}
                      </div>
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
                    <span>
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      Item(s)
                    </span>
                  </div>
                  <div className="text-right text-lg font-medium">
                    ${subtotal.toLocaleString()}
                  </div>
                </div>

                <Button
                  onClick={onCheckout}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Icons.Loading03Icon className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : isSignedIn ? (
                    "Proceed to Checkout"
                  ) : (
                    "Sign in to Checkout"
                  )}
                </Button>
                <div className="flex justify-center">
                  <Link
                    href="/consultation"
                    className="text-muted-foreground hover:text-charcoal text-xs underline underline-offset-4"
                  >
                    Or Schedule a Consultation
                  </Link>
                </div>
                <p className="text-center text-[10px] leading-relaxed opacity-40">
                  Secure checkout powered by Stripe.
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
