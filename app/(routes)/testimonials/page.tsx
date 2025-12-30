import type { Metadata } from "next";

import { siteConfig } from "@/config/site.config";
import { Button } from "@/ui/button";
import { HeroComp } from "./_components/hero.comp";
import { ReviewsComp } from "./_components/reviews.comp";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description: `Read stories from ${siteConfig.title} clients reflecting on their bespoke bridal, prom, and special-event couture experiences.`,
};

export default function Testimonials() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <ReviewsComp />

      <section className="bg-bone px-8 py-40 text-center">
        <h3 className="mb-8">Your vision, our artisan hands.</h3>
        <Button size="lg" variant={"default"}>
          Begin the Consultation
        </Button>
      </section>
    </div>
  );
}
