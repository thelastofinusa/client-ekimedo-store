import { CTA } from "@/components/shared/cta";
import { HeroComp } from "./_components/hero.comp";
import { DiscoverComp } from "./_components/discover.comp";
import { ServicesComp } from "./_components/services.comp";
import { GalleryComp } from "./_components/gallery.comp";
import { TestimonialComp } from "./_components/testimonial.comp";

export default function HomePage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <DiscoverComp />
      <ServicesComp />
      <GalleryComp />
      <TestimonialComp />
      <CTA
        mode="light"
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
