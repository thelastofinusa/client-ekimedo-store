import { HeroComp } from "./_components/hero.comp";
import { PerfomanceComp } from "./_components/perfomance.comp";
import { QuoteComp } from "./_components/quote.comp";

export default function About() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <PerfomanceComp />
      <QuoteComp />
    </div>
  );
}
