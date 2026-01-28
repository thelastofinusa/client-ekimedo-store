import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/live";
import { HeroComp } from "./_components/hero.comp";
import { ReviewsComp } from "./_components/reviews.comp";
import { TESTIMONIAL_QUERY } from "@/sanity/queries/testimonial";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read what our clients have to say about us.",
};

export default async function TestimonialsPage() {
  const { data: testimonials } = await sanityFetch({
    query: TESTIMONIAL_QUERY,
  });

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />

      <ReviewsComp testimonials={testimonials} />
    </div>
  );
}
