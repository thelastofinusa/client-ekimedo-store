import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CTA } from "@/components/shared/cta";
import { COLLECTIONS, DRESSES } from "@/constants";
import { HeroComp } from "./_components/hero.comp";
import { siteConfig } from "@/config/site.config";
import { DetailsComp } from "./_components/details.comp";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths at build time
export async function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({
    slug: collection.slug,
  }));
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;

  const info = COLLECTIONS.find(
    (cl) => String(cl.slug).toLowerCase() === String(slug).toLowerCase(),
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

export default async function Prom({ params }: PageProps) {
  const { slug } = await params;

  const info = COLLECTIONS.find(
    (cl) => String(cl.slug).toLowerCase() === String(slug).toLowerCase(),
  );

  if (!info) notFound();

  const dresses = DRESSES.filter((d) => d.category === slug);

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp info={info} />
      <DetailsComp info={info} dresses={dresses} />
      <CTA
        href="/consultation"
        title="Can't find exactly what you're looking for?"
        label="Custom Dress Consultation"
      />
      <footer className="border-primary/10 border-t py-12 text-center">
        <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">
          {siteConfig.title} Couture © 2025
        </p>
      </footer>
    </div>
  );
}
