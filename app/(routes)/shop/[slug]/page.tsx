import Link from "next/link";
import { Metadata } from "next";
import { FaChevronRight } from "react-icons/fa6";

import { notFound } from "next/navigation";
import { PRODUCTS } from "@/constants/products";
import { Container } from "@/components/shared/container";
import { ProductDetails } from "./_components/product-details";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) notFound();

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) notFound();

  return (
    <div className="py-12 md:py-24">
      <Container>
        <nav className="mb-8 flex items-center pt-16 text-sm text-neutral-500">
          <Link
            href="/shop"
            className="transition-colors hover:text-neutral-900"
          >
            Shop
          </Link>
          <FaChevronRight className="mx-2 h-3 w-3" />
          <span className="truncate font-medium text-neutral-900">
            {product.name}
          </span>
        </nav>
        <ProductDetails product={product} />
      </Container>
    </div>
  );
}
