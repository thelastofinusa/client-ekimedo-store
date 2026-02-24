import React from "react";
import { HeroComp } from "./_components/hero.comp";
import { InquireForm } from "./_components/inquire-form";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Make An Inquiry",
  description:
    "Bring your dream dress to life. Our bespoke service creates one-of-a-kind pieces tailored perfectly to your vision and measurements.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Custom Orders",
    siteName: siteConfig.title,
    description:
      "Bring your dream dress to life. Our bespoke service creates one-of-a-kind pieces tailored perfectly to your vision and measurements.",
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
    title: "Custom Orders",
    description:
      "Bring your dream dress to life. Our bespoke service creates one-of-a-kind pieces tailored perfectly to your vision and measurements.",
    images: ["/twitter-image.png"],
  },
};

export default function CustomOrders() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <InquireForm />
    </div>
  );
}
