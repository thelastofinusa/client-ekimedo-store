import * as React from "react";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "@/ui/sonner";
import { Header } from "@/components/shared/header";
import { CartProvider } from "@/components/providers/cart.provider";
import { Footer } from "@/components/shared/footer";
import { SanityLive } from "@/sanity/lib/live";

export default function RoutesLayout(
  props: Readonly<{ children: React.ReactNode }>,
) {
  return (
    <ClerkProvider>
      <NextTopLoader showSpinner={false} />
      <CartProvider>
        <React.Fragment>
          <Header />
          {props.children}
          <Footer />
        </React.Fragment>
        <Toaster position="top-center" />
      </CartProvider>
      <Analytics />
      <SanityLive />
    </ClerkProvider>
  );
}
