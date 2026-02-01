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
    <div className="py-28 lg:py-36">
      <Container className="relative flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-16">
        <Suspense
          fallback={
            <div className="flex h-max w-full flex-col gap-10 md:sticky md:top-26 md:w-64 lg:top-32">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-20" />
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <Skeleton className="size-4" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <Filters categories={categories} colors={colors} />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex-1">
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="block">
                    <Skeleton className="mb-4 aspect-3/4 w-full" />

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-10" />
                      </div>
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
