import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CTA } from "@/components/shared/cta";
import { HeroComp } from "./_components/hero.comp";
import { siteConfig } from "@/config/site.config";
import { DetailsComp } from "./_components/details.comp";
import { client } from "@/sanity/lib/client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths at build time
export async function generateStaticParams() {
  const categories = await client.fetch(`*[_type == "category"]{ "slug": slug.current }`);
  return categories.map((category: any) => ({
    slug: category.slug,
  }));
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;

  const info = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      name,
      "tagline": "Timeless Couture", // Default or add to schema
      "description": "Discover a collection of timeless silhouettes and intricate details.", // Default or add
      "image": billboard.asset->url,
      "slug": slug.current
    }`,
    { slug }
  );

  if (!info) notFound();

  return {
    title: info.name,
    description: info.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: `${info.name} - ${info.tagline}`,
      description: info.description,
      images: [
        {
          url: info.image,
          width: 1200,
          height: 630,
          alt: `${info.name} - ${info.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${info.name} - ${info.tagline}`,
      description: info.description,
      images: [info.image],
    },
  };
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // Fetch category info
  const info = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
        name,
        "slug": slug.current,
        "image": billboard.asset->url,
        "tagline": "Timeless Couture",
        "description": "Discover our exclusive collection."
    }`,
    { slug }
  );

  if (!info) notFound();

  // Fetch products in this category
  // Assuming 'categories' in product is array of references
  const dresses = await client.fetch(
    `*[_type == "product" && references(*[_type=="category" && slug.current == $slug]._id)]{
        _id,
        name,
        "category": $slug,
        "priceRange": price, // Map single price to range prop or update component
        description,
        "image": images[0].asset->url,
        "images": images[].asset->url,
        sizes,
        colors,
        "deliveryTime": "4-6 weeks" // Default
    }`,
    { slug }
  );

  // Remap dresses to match component expectation if needed
  // The component seems to expect `priceRange` string, but we have `price` number.
  // We can format it here.
  const formattedDresses = dresses.map((d: any) => ({
      ...d,
      priceRange: d.priceRange ? `$${d.priceRange}` : "Inquire for price",
      id: d._id
  }));

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp info={info} />
      <DetailsComp info={info} dresses={formattedDresses} />
      <CTA
        href="/consultation"
        title="Can't find exactly what you're looking for?"
        label="Custom Dress Consultation"
      />
      <footer className="border-primary/10 border-t py-8 text-center md:py-12">
        <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">
          {siteConfig.title} Couture © 2025
        </p>
      </footer>
    </div>
  );
}
