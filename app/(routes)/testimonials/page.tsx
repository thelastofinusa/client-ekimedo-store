import type { Metadata } from "next";

import { siteConfig } from "@/site.config";
import { clientOptions } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { HeroComp } from "@/components/shared/hero";
import { ReviewsComp } from "./_components/reviews.comp";
import { TESTIMONIAL_QUERY } from "@/sanity/queries/testimonial";

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
  const testimonials = await client.fetch(TESTIMONIAL_QUERY, {}, clientOptions);

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
        imagePath="testimonials.jpeg"
      />

      <ReviewsComp testimonials={testimonials} />
    </div>
  );
}
