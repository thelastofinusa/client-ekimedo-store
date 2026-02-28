import React from "react";
import { Metadata } from "next";

import { siteConfig } from "@/site.config";
import { GallerySection } from "./_components/gallery.sec";
import { SplashScreen } from "@/components/shared/splash-screen";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { client } from "@/sanity/lib/client";
import { clientOptions } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Gallery",
  description: `Explore the gallery of ${siteConfig.title}—a curated archive of bridal, prom, and special-event looks captured across recent collections.`,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Our Gallery",
    siteName: siteConfig.title,
    description: `Explore the gallery of ${siteConfig.title}—a curated archive of bridal, prom, and special-event looks captured across recent collections.`,
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
    title: "Our Gallery",
    description: `Explore the gallery of ${siteConfig.title}—a curated archive of bridal, prom, and special-event looks captured across recent collections.`,
    images: ["/twitter-image.png"],
  },
};

export default async function GalleryPage() {
  const category = await client.fetch(CATEGORIES_QUERY, {}, clientOptions);

  return (
    <div className="flex-1 overflow-x-clip">
      <React.Suspense fallback={<SplashScreen />}>
        <GallerySection category={category} />
      </React.Suspense>
    </div>
  );
}
