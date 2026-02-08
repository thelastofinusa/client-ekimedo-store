import * as React from "react";
import { CheckoutItems } from "./_components/checkout-items";
import { Container } from "@/components/shared/container";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout your items",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Checkout",
    siteName: siteConfig.title,
    description: "Checkout your items",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout",
    description: "Checkout your items",
    images: ["/twitter-image.png"],
  },
};

export default function CheckoutPage() {
  return (
    <div className="py-28 lg:py-36">
      <Container size="sm">
        <CheckoutItems />
      </Container>
    </div>
  );
}
