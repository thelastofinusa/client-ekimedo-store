import Link from "next/link";
import { Metadata } from "next";
import { Icons } from "hugeicons-proxy";
import { notFound } from "next/navigation";

import { siteConfig } from "@/site.config";
import { Container } from "@/shared/container";
import { ProductDetails } from "../_components/product-details";
import { Recommended } from "../_components/recommended";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY, PRODUCT_QUERY } from "@/sanity/queries/product";
import {
  PRODUCT_BY_SLUG_QUERYResult,
  PRODUCT_QUERYResult,
} from "@/sanity.types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const result = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });
  const products =
    (result.data as unknown as PRODUCT_BY_SLUG_QUERYResult) || [];
  const product = products[0];

  if (!product) notFound();

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: product.name!,
      siteName: siteConfig.title,
      description: product.description!,
      images: [
        {
          url: product.images?.[0]!,
          width: 1200,
          height: 630,
          alt: product.name!,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name!,
      description: product.description!,
      images: product.images as string[],
    },
  };
};

export default async function ProductsDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch the product by slug
  const productResult = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });
  const products =
    (productResult.data as unknown as PRODUCT_BY_SLUG_QUERYResult) || [];
  const product = products[0];

  if (!product) notFound();

  // Fetch all products to get other products
  const allProductsResult = await sanityFetch({
    query: PRODUCT_QUERY,
  });
  const allProducts: PRODUCT_QUERYResult =
    allProductsResult.data as unknown as PRODUCT_QUERYResult;

  const otherProducts = allProducts.filter((p) => p.slug !== slug);

  return (
    <div className="py-28 lg:py-36">
      <Container>
        <nav className="mb-8 hidden items-center text-sm text-neutral-500 md:flex">
          <Link
            href="/products"
            className="transition-colors hover:text-neutral-900"
          >
            Products
          </Link>
          <Icons.ArrowRight01Icon className="mx-1 size-4" />
          <span className="truncate font-medium text-neutral-900">
            {product.name}
          </span>
        </nav>

        <ProductDetails product={product} />

        {otherProducts.length > 0 && (
          <div className="mt-28 lg:mt-36">
            <h2 className="mb-8 font-serif text-3xl font-medium">
              You may also like
            </h2>
            <Recommended products={otherProducts} />
          </div>
        )}
      </Container>
    </div>
  );
}
