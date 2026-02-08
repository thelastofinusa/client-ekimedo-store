import React from "react";
import { Metadata } from "next";

import { siteConfig } from "@/site.config";
import { GallerySection } from "./_components/gallery.sec";
import { SplashScreen } from "@/components/shared/splash-screen";
import { sanityFetch } from "@/sanity/lib/live";
import { GALLERY_QUERY } from "@/sanity/queries/gallery";
import { CATEGORIES_QUERYResult, GALLERY_QUERYResult } from "@/sanity.types";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";

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
  const galleryResult = await sanityFetch({
    query: GALLERY_QUERY,
  });
  const categoryResult = await sanityFetch({
    query: CATEGORIES_QUERY,
  });

  const gallery: GALLERY_QUERYResult =
    galleryResult.data as GALLERY_QUERYResult;
  const category: CATEGORIES_QUERYResult =
    categoryResult.data as CATEGORIES_QUERYResult;

  return (
    <div className="bg-foreground text-background flex-1 overflow-x-clip py-28 lg:py-36">
      <React.Suspense fallback={<SplashScreen />}>
        <GallerySection gallery={gallery} category={category} />
      </React.Suspense>
    </div>
  );
}
