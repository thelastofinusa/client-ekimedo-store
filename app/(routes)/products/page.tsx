import { Suspense } from "react";
import { Container } from "@/shared/container";
import { Filters } from "./_components/filters";
import { ProductGrid } from "./_components/product-grid";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_QUERY } from "@/sanity/queries/product";
import { PRODUCT_QUERYResult } from "@/sanity.types";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { Skeleton } from "@/ui/skeleton";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { data: products } = await sanityFetch({ query: PRODUCT_QUERY });
  const { data: categories } = await sanityFetch({ query: CATEGORIES_QUERY });

  return (
    <div className="py-28 lg:py-36">
      <Container className="relative flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-16">
        <Suspense
          fallback={
            <Skeleton className="flex h-[200px] w-full flex-col gap-8 md:sticky md:top-26 md:w-64 lg:top-32" />
          }
        >
          <Filters categories={categories} />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex-1">
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={idx} className="aspect-3/4 w-full" />
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
