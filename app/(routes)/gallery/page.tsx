import React from "react";
import type { Metadata } from "next";

import { siteConfig } from "@/config/site.config";
import { GallerySection } from "./_components/gallery.sec";
import { SplashScreen } from "@/components/shared/splash-screen";

export const metadata: Metadata = {
  title: "Archive Gallery",
  description: `Explore the gallery of ${siteConfig.title}—a curated archive of bridal, prom, and special-event looks captured across recent collections.`,
};

export default function Gallery() {
  return (
    <div className="bg-foreground text-background flex-1 overflow-x-clip">
      <React.Suspense fallback={<SplashScreen />}>
        <GallerySection />
      </React.Suspense>
    </div>
  );
}
