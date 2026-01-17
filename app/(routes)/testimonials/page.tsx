import { Metadata, Route } from "next";

import { HeroComp } from "./_components/hero.comp";
import Link from "next/link";
import { buttonVariants } from "@/ui/button";
import { ReviewsComp } from "./_components/reviews.comp";
import { TESTIMONIALS } from "@/lib/constants/testimonials";
import { sanityFetch } from "@/sanity/lib/live";
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

      <section className="bg-bone px-8 py-40 text-center">
        <h3 className="mb-8">Your vision, our artisan hands.</h3>
        <Link
          href={"/consultation" as Route}
          className={buttonVariants({ size: "lg", variant: "default" })}
        >
          Begin the Consultation
        </Link>
      </section>
    </div>
  );
}
