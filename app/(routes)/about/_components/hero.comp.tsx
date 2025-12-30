import Image from "next/image";

import { siteConfig } from "@/config/site.config";
import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="py-24 lg:py-32">
      <Container>
        <header className="py-24 text-center md:text-left">
          <h1 className="font-serif text-[12vw] leading-[0.9] tracking-tighter uppercase md:text-[10vw]">
            About <br />
            <span className="ml-[10vw] italic md:ml-[12vw]">
              {siteConfig.title}
            </span>
          </h1>
        </header>

        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-24">
          <div className="space-y-12 lg:col-span-5">
            <div className="bg-secondary relative aspect-4/5 overflow-hidden shadow-xs">
              <Image
                src="https://images.unsplash.com/photo-1548313093-370cf4ba3892?q=80&w=1364&auto=format&fit=crop"
                alt="Atelier detail"
                fill
                priority
                quality={100}
                className="origin-bottom object-cover grayscale transition-transform duration-700 hover:scale-105"
              />
            </div>
            <p className="max-w-md font-serif text-xl leading-relaxed md:text-2xl">
              Crafted for the Bride Who Becomes
            </p>
          </div>

          <div className="space-y-16 lg:col-span-7">
            <div className="flex flex-col items-start gap-12 md:flex-row">
              <div className="pt-4 md:w-1/3">
                <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
                  The Genesis
                </span>
              </div>
              <div className="space-y-8 text-lg leading-relaxed opacity-90 md:w-2/3 md:text-xl">
                <p>
                  At 22, Ekimedo picked up her first needle. What started as
                  practice became purpose.
                </p>
                <p>
                  Ekimedo was born from a love for detail, movement, and quiet
                  elegance. Not just gowns but moments made to last.
                </p>
              </div>
            </div>
            <div className="bg-secondary relative h-[400px] overflow-hidden shadow-xs md:h-[600px]">
              <Image
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop"
                alt="Craftsmanship"
                fill
                priority
                quality={100}
                className="origin-bottom-right object-cover brightness-90 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
