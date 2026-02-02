import { Suspense } from "react";
import { Container } from "@/shared/container";
import { Filters } from "./_components/filters";
import { ProductGrid } from "./_components/product-grid";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_QUERY } from "@/sanity/queries/product";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { Skeleton } from "@/ui/skeleton";
import { PRODUCT_COLOR_QUERY } from "@/sanity/queries/color";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { data: products } = await sanityFetch({ query: PRODUCT_QUERY });
  const { data: categories } = await sanityFetch({ query: CATEGORIES_QUERY });
  const { data: colors } = await sanityFetch({ query: PRODUCT_COLOR_QUERY });

  return (
    <div className="flex flex-col py-24 lg:py-32">
      <Container className="relative flex flex-col gap-6 pt-6 md:flex-row md:gap-8">
        <Suspense
          fallback={
            <div className="flex h-max w-full flex-col gap-10 md:sticky md:top-26 md:w-64 lg:top-32">
              <div className="flex flex-col gap-8">
                {[3, 3, 5].map((item, idx) => (
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
          <Filters categories={categories} colors={colors} />
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
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-20" />
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
  );
}
