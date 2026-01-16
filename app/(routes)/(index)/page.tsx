import { CTA } from "@/components/shared/cta";
import { HeroComp } from "./_components/hero.comp";
import { HeritageComp } from "./_components/heritage.comp";
import { ServicesComp } from "./_components/services.comp";
import { LookBookComp } from "./_components/lookbook.comp";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <HeritageComp />
      <ServicesComp />
      <LookBookComp />
      <CTA
        title="Crafting your vision into a masterpiece of couture."
        href="/consultation"
        label="Start Consultation"
      />
    </div>
  );
}
