import React from "react";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/live";
import { Container } from "@/components/shared/container";
import { SERVICE_BY_ID_QUERY } from "@/sanity/queries/service";
import { SnapshotsGrid } from "../_components/snapshots-grid";
import { BookingForm } from "../_components/booking-form";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const generateMetadata = async (
  props: PageProps<"/consultation/[slug]">,
): Promise<Metadata> => {
  const { slug } = await props.params;
  const { data: services } = await sanityFetch({
    query: SERVICE_BY_ID_QUERY,
    params: { slug },
  });
  const service = services[0];

  if (!service) return notFound();

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      title: service.title!,
      siteName: siteConfig.title,
      description: service.description!,
      images: [
        {
          url: service.image ?? "",
          width: 1200,
          height: 630,
          alt: service.title!,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title!,
      description: service.description!,
      images: [service.image ?? ""],
    },
  };
};

export default async function ServicePage(
  props: PageProps<"/consultation/[slug]">,
) {
  const { slug } = await props.params;
  const { data: services } = await sanityFetch({
    query: SERVICE_BY_ID_QUERY,
    params: { slug },
  });
  const service = services[0];

  if (!service) return notFound();

  return (
    <div className="flex-1 overflow-x-clip">
      {/* Category Hero */}
      <section className="bg-foreground text-background relative flex items-center justify-center overflow-hidden py-32 sm:h-[60vh]">
        <Container size="sm" className="relative text-center">
          <span className="mb-6 block font-mono text-[10px] tracking-[0.5em] uppercase">
            Service
          </span>
          <h1 className="mx-auto max-w-4xl font-serif text-4xl tracking-widest uppercase md:text-5xl lg:text-7xl">
            {service.title}
          </h1>
        </Container>
      </section>

      <div className="py-24 lg:py-32">
        <Container>
          {service.snapshots && service.snapshots.length > 0 ? (
            <>
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <span className="text-foreground/50 font-mono text-[10px] tracking-[0.5em] uppercase">
                  Step 1
                </span>
                <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                  Inspiration & Process
                </h2>
                <p className="text-muted-foreground mt-2">
                  Explore the phases of your consultation journey.
                </p>
              </div>
              <SnapshotsGrid
                snapshots={(service.snapshots || [])
                  .filter((s) => s.url)
                  .map((s) => ({
                    url: s.url!,
                    description: s.description || undefined,
                  }))}
                title={service.title}
              />
            </>
          ) : (
            <p className="text-center opacity-50">Process steps coming soon.</p>
          )}

          {/* Booking Section */}
          <div className="mt-24 md:mt-32" id="booking-form">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <span className="text-foreground/50 font-mono text-[10px] tracking-[0.5em] uppercase">
                  Step 2
                </span>
                <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                  Schedule Your Consultation
                </h2>
                <p className="text-muted-foreground mt-2">
                  Pick a date and share your details.
                </p>
              </div>
              <BookingForm service={service} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
