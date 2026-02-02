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
        mode="dark"
        title="Ready to Transform Your Style?"
        description="Book a consultation with our expert stylists and discover a wardrobe that truly reflects who you are."
        route={{
          txt: "Book a Consultation",
          path: "/consultation",
        }}
      />
    </div>
  );
}
