"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/ui/button";
import { Container } from "@/components/shared/container";
import { Icons } from "hugeicons-proxy";

export default function CancelPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <Container
        size="sm"
        className="flex flex-col items-center justify-center space-y-8"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Icons.CancelCircleIcon className="h-10 w-10 text-red-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-charcoal font-serif text-3xl font-bold md:text-4xl">
            Checkout Cancelled
          </h1>
          <p className="text-muted-foreground">
            Your payment process was cancelled. No charges were made to your
            account.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/cart"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Return to Cart
          </Link>
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Continue Shopping
          </Link>
        </div>
      </Container>
    </div>
  );
}
