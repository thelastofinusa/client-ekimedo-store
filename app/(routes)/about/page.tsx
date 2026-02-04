import type { Metadata } from "next";

import { siteConfig } from "@/site.config";
import { HeroComp } from "./_components/hero.comp";
import { QuoteComp } from "./_components/quote.comp";
import { PerformanceComp } from "./_components/performance.comp";
import { CTA } from "@/components/shared/cta";

export const metadata: Metadata = {
  title: "Our Story",
  description: `Learn about ${siteConfig.title}, a luxury couture maison crafting timeless bridal, prom, and special-event designs with meticulous artistry.`,
};

export default function About() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <PerformanceComp />
      <QuoteComp />
      <CTA
        mode="dark"
        title="Let's Create Together"
        description="Whether you're looking for a bespoke piece or a complete style transformation, we're here to bring your vision to life."
        route={{
          txt: "Schedule a Consultation",
          path: "/consultation",
        }}
      />
    </div>
  );
}
