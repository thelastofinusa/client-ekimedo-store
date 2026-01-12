
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";

export const SuccessClient = () => {
  const clearCart = useAppStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <Icons.CheckmarkCircle02Icon className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="font-serif text-3xl text-charcoal">Payment Successful!</h1>
      <p className="max-w-md text-muted-foreground">
        Thank you for your purchase. We have received your order and will process it shortly.
        You will receive a confirmation email with your order details.
      </p>
      <div className="pt-6">
        <Link href="/shop">
          <Button size="lg" className="min-w-[200px]">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
