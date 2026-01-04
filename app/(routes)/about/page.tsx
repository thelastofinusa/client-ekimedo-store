import type { Metadata } from "next";

import { siteConfig } from "@/config/site.config";
import { HeroComp } from "./_components/hero.comp";
import { QuoteComp } from "./_components/quote.comp";
import { PerfomanceComp } from "./_components/perfomance.comp";

export const metadata: Metadata = {
  title: "Maison Story",
  description: `Learn about ${siteConfig.title}, a luxury couture maison crafting timeless bridal, prom, and special-event designs with meticulous artistry.`,
};

export default function About() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <PerfomanceComp />
      <QuoteComp />
    </div>
  );
}
