import { Suspense } from "react";
import { Container } from "@/shared/container";
import { Filters } from "./_components/filters";
import { ProductGrid } from "./_components/product-grid";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_QUERY } from "@/sanity/queries/product";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { Skeleton } from "@/ui/skeleton";
import { PRODUCT_COLOR_QUERY } from "@/sanity/queries/color";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { consultationsData } from "@/lib/constants/consultation";
import { ConsultationCard } from "@/components/shared/consultation-card";
import { HeroComp } from "@/components/shared/hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pre-made Dresses",
  description:
    "Shop our collection of pre-made dresses. Find the perfect piece to suit your style and measurements.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Pre-made Dresses",
    siteName: siteConfig.title,
    description:
      "Shop our collection of pre-made dresses. Find the perfect piece to suit your style and measurements.",
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
    title: "Pre-made Dresses",
    description:
      "Shop our collection of pre-made dresses. Find the perfect piece to suit your style and measurements.",
    images: ["/twitter-image.png"],
  },
};

export default async function ProductsPage() {
  const { data: products } = await sanityFetch({ query: PRODUCT_QUERY });
  const { data: categories } = await sanityFetch({ query: CATEGORIES_QUERY });
  const { data: colors } = await sanityFetch({ query: PRODUCT_COLOR_QUERY });

  return (
    <div className="flex flex-col">
      <HeroComp
        title="Pre-Made Dresses"
        description="Explore our curated selection of luxury fashion pieces, each crafted with unparalleled attention to detail."
        imagePath="shop.jpeg"
      />

      <div className="py-24 lg:py-32">
        <Container className="relative flex flex-col gap-6 md:flex-row md:gap-8">
          <Suspense
            fallback={
              <div className="flex h-max w-full flex-col gap-10 md:sticky md:top-26 md:w-64 lg:top-32">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-40" />
                    <div className="relative mt-2 w-full">
                      <Skeleton className="absolute top-1/2 left-0 size-4.5 -translate-y-1/2 rounded-full" />
                      <Skeleton className="absolute top-1/2 right-0 size-4.5 -translate-y-1/2 rounded-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                  {[3, 7, 4].map((item, idx) => (
                    <div className="flex flex-col gap-6" key={idx}>
                      <Skeleton className="h-4 w-20" />

                      <div className="flex flex-col gap-3">
                        {Array.from({ length: item }).map((_, idx) => {
                          const randomWidth =
                            Math.floor(Math.random() * (40 - 28 + 1)) + 28;

                          return (
                            <Skeleton
                              key={idx}
                              className="h-4"
                              style={{ width: `${randomWidth * 0.25}rem` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <Filters
              categories={categories}
              colors={colors}
              products={products}
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="flex-1">
                <div className="mb-6 flex items-center">
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="block">
                      <Skeleton className="mb-4 aspect-3/4 w-full" />

                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-10" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <ProductGrid products={products} />
          </Suspense>
        </Container>
      </div>

      <div className="bg-secondary/30 py-24 lg:py-32">
        <Container>
          {consultationsData
            .filter((item) => item.slug === "try-on")
            .map((service, index) => (
              <ConsultationCard key={index} data={service} />
            ))}
        </Container>
      </div>
    </div>
  );
}
