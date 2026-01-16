import { Suspense } from "react";
import { Container } from "@/shared/container";
import { Filters } from "./_components/filters";
import { ProductGrid } from "./_components/product-grid";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_QUERY } from "@/sanity/queries/product";
import { PRODUCT_QUERYResult } from "@/sanity.types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const result = await sanityFetch({ query: PRODUCT_QUERY });
  const products: PRODUCT_QUERYResult = result.data as PRODUCT_QUERYResult;

  return (
    <div className="py-28 lg:py-36">
      <Container className="relative flex flex-col gap-6 sm:gap-8 md:flex-row md:gap-16">
        <Suspense fallback={<div>Loading filters...</div>}>
          <Filters />
        </Suspense>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid products={products} />
        </Suspense>
      </Container>
    </div>
  );
}
