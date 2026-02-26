import type { Metadata } from "next";

import { siteConfig } from "@/site.config";
import { clientOptions } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { currentUser } from "@clerk/nextjs/server";
import { HeroComp } from "@/components/shared/hero";
import { ReviewsComp } from "./_components/reviews.comp";
import { Container } from "@/components/shared/container";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { TESTIMONIAL_QUERY } from "@/sanity/queries/testimonial";
import { TestimonialSheet } from "@/components/sheets/testimonial.sheet";

export const metadata: Metadata = {
  title: "Testimonials",
  description: `Read what our clients have to say about ${siteConfig.title}.`,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Testimonials",
    siteName: siteConfig.title,
    description: `Read what our clients have to say about ${siteConfig.title}.`,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Testimonials",
    description: `Read what our clients have to say about ${siteConfig.title}.`,
    images: ["/twitter-image.png"],
  },
};

export default async function TestimonialsPage() {
  const user = await currentUser();
  const testimonials = await client.fetch(TESTIMONIAL_QUERY, {}, clientOptions);
  const categories = await client.fetch(CATEGORIES_QUERY, {}, clientOptions);

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp
        title="Stories of Transformation"
        description={
          <span>
            &quot;Real experiences from individuals who trusted{" "}
            {siteConfig.title} with their most cherished moments. Discover the
            elegance and craftsmanship that defines our Maison.&quot;
          </span>
        }
      />

      <ReviewsComp testimonials={testimonials} />

      {user && (
        <div className="bg-foreground text-background py-24 lg:py-32">
          <Container className="flex flex-col items-center justify-center text-center">
            <h3 className="mb-8 max-w-2xl text-4xl md:text-5xl">
              Share your own experience with us
            </h3>
            <TestimonialSheet categories={categories} />
          </Container>
        </div>
      )}
    </div>
  );
}
