import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/live";
import { HeroComp } from "./_components/hero.comp";
import { ReviewsComp } from "./_components/reviews.comp";
import { TESTIMONIAL_QUERY } from "@/sanity/queries/testimonial";
import { currentUser } from "@clerk/nextjs/server";
import { Container } from "@/components/shared/container";
import { TestimonialSheet } from "@/components/sheets/testimonial.sheet";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read what our clients have to say about us.",
};

export default async function TestimonialsPage() {
  const user = await currentUser();
  const { data: testimonials } = await sanityFetch({
    query: TESTIMONIAL_QUERY,
  });
  const { data: categories } = await sanityFetch({
    query: CATEGORIES_QUERY,
  });

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />

      <ReviewsComp testimonials={testimonials} />

      {user && (
        <div className="bg-foreground text-background py-24 lg:py-32 xl:py-40">
          <Container className="flex flex-col items-center justify-center text-center">
            <h3 className="mb-8 max-w-2xl">
              Share your own experience with us
            </h3>
            <TestimonialSheet categories={categories} />
          </Container>
        </div>
      )}
    </div>
  );
}
