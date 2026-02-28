"use client";
import React from "react";
import confetti from "canvas-confetti";

import { Icons } from "hugeicons-proxy";
import { Container } from "@/components/shared/container";
import { useCartActions } from "@/components/providers/cart.provider";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/ui/badge";
import { getOrderStatus } from "@/lib/constants/status";
import Link from "next/link";
import { buttonVariants } from "@/ui/button";

interface Props {
  session: {
    id: string;
    customerEmail?: string | null;
    customerName?: string | null;
    amountTotal?: number | null;
    paymentStatus: string;
    shippingAddress?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
    lineItems?: {
      name?: string | null;
      quantity?: number | null;
      amount: number;
    }[];
  };
}

export const SuccessCard: React.FC<Props> = ({ session }) => {
  const { clearCart } = useCartActions();

  // Clear cart on mount
  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  const address = session.shippingAddress;

  const status = getOrderStatus(session.paymentStatus);
  const StatusIcon = Icons[status.icon];

  React.useEffect(() => {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  return (
    <div className="md:py-8 lg:py-16">
      <Container size="xs" className="flex max-w-2xl flex-col gap-10">
        <div className="mx-auto flex flex-col gap-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Icons.CheckmarkCircle03Icon className="size-5 text-green-600 sm:size-6 md:size-7" />
            <h1 className="font-sans text-xl font-bold sm:text-2xl md:text-3xl">
              Order Confirmed
            </h1>
          </div>
          <p className="mx-auto max-w-lg text-sm">
            Thank you for your purchase. We&apos;ve sent a confirmation to{" "}
            <strong>{session.customerEmail}</strong>
          </p>
        </div>

        <section className="bg-card group border-border block h-auto overflow-hidden border shadow-xs">
          <p className="border-b p-6 text-xs font-medium tracking-widest uppercase md:px-8">
            Order Details
          </p>

          <div className="border-b px-6 md:px-8">
            <div className="flex flex-1 flex-col py-6">
              {/* Items */}
              {session.lineItems && session.lineItems.length > 0 && (
                <div className="space-y-3">
                  {session.lineItems.map((item) => (
                    <div
                      key={`${item.name}-${item.quantity}-${item.amount}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {formatPrice(item.amount / 100)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {formatPrice((session.amountTotal ?? 0) / 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {address && (
            <div className="border-b p-6 md:px-8">
              <p className="text-xs font-medium tracking-widest uppercase">
                Shipping To
              </p>

              <div className="mt-4 space-y-0.5 text-sm">
                {session.customerName && <p>{session.customerName}</p>}
                {address.line1 && <p>{address.line1}</p>}
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {[address.city, address.state, address.postal_code]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {address.country && <p>{address.country}</p>}
              </div>
            </div>
          )}

          <div className="border-b p-6 md:px-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Icons.PackageIcon className="size-4" />
                <p className="text-xs font-medium tracking-widest uppercase">
                  Payment Status:
                </p>
              </div>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <Badge
                  className={cn(
                    "flex items-center gap-1 border",
                    status.className,
                  )}
                >
                  <StatusIcon
                    className={cn(
                      "size-3.5!",
                      status.value === "pending" && "animate-spin",
                    )}
                  />
                  <span className="font-sans text-xs font-medium">
                    {status.label}
                  </span>
                </Badge>
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "bg-card!",
            })}
          >
            <span>View Your Orders</span>
          </Link>
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            <span>Continue Shopping</span>
          </Link>
        </div>
      </Container>
    </div>
  );
};
