"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/empty";
import { ProductCard } from "@/components/shared/product-card";
import { Icons } from "hugeicons-proxy";
import { PRODUCT_QUERYResult } from "@/sanity.types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/pagination";

interface Props {
  products: PRODUCT_QUERYResult;
}

export const ProductGrid: React.FC<Props> = ({ products }) => {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 9;

  // Filter products based on URL parameters
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Filter by categories
    const category = searchParams.get("category");
    if (category) {
      filtered = filtered.filter((product) => {
        // category is a single object with slug property
        return product.category?.slug === category;
      });
    }

    // Filter by colors (SINGLE SELECT)
    const color = searchParams.get("color");
    if (color) {
      filtered = filtered.filter((product) => {
        const productColors = product.colors;

        if (!productColors || productColors.length === 0) return false;

        return productColors.some((c) => c.name === color);
      });
    }

    // Filter by price range
    const priceRange = searchParams.get("price");
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        return price >= min && price <= max;
      });
    }

    return filtered;
  }, [products, searchParams]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center">
        <p className="text-foreground text-sm font-normal">
          Showing{" "}
          <strong className="font-mono">{paginatedProducts.length}</strong> of{" "}
          <strong className="font-mono">{filteredProducts.length}</strong>{" "}
          results
        </p>
      </div>

      {paginatedProducts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
          {paginatedProducts.map((product, idx) => (
            <ProductCard key={`${product._id}-${idx}`} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center text-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icons.ProductLoadingIcon />
              </EmptyMedia>
              <EmptyTitle>No Product Found</EmptyTitle>
              <EmptyDescription>
                There are no products matching your filters.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={createPageURL(currentPage - 1)} />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={createPageURL(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={createPageURL(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
