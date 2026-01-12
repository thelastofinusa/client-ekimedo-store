import type { Metadata } from "next";

import { siteConfig } from "@/config/site.config";
import { Button } from "@/ui/button";
import { HeroComp } from "./_components/hero.comp";
import { ReviewsComp } from "./_components/reviews.comp";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Client Voices",
  description: `Read stories from ${siteConfig.title} clients reflecting on their bespoke bridal, prom, and special-event couture experiences.`,
};

export default async function Testimonials() {
  const testimonials = await client.fetch(`*[_type == "testimonial"]{
    name,
    role,
    content,
    rating,
    "image": image.asset->url
  }`);

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      {/* Passing data to client component if ReviewsComp supports props, or we might need to update ReviewsComp */}
      <ReviewsComp testimonials={testimonials} /> 

      <section className="bg-bone px-8 py-40 text-center">
        <h3 className="mb-8">Your vision, our artisan hands.</h3>
        <Button size="lg" variant={"default"}>
          Begin the Consultation
        </Button>
      </section>
    </div>
  );
}
