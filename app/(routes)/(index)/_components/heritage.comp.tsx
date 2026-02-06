import Link from "next/link";
import Image from "next/image";

import { buttonVariants } from "@/ui/button";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/site.config";

export const HeritageComp = () => {
  return (
    <div className="bg-background">
      <div className="from-secondary via-secondary/50 bg-linear-to-b to-transparent py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 items-center gap-20 md:grid-cols-2">
            <div className="flex flex-col gap-6 md:gap-8">
              <header className="flex flex-col gap-2">
                <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
                  Heritage & Vision
                </span>
                <h2 className="leading-[1.1]">
                  Dedicated to Creativity, Culture & Growth
                </h2>
              </header>

              <div className="flex max-w-lg flex-col gap-6 md:gap-8">
                <p className="text-lg leading-relaxed font-light">
                  Since its inception, {siteConfig.title} has stood at the
                  intersection of classical craftsmanship and radical modernism.
                  Every piece is a dialogue between the past and the future.
                </p>
                <p className="text-sm leading-relaxed opacity-40">
                  Our atelier in the heart of Paris remains the soul of our
                  maison, where artisans spend hundreds of hours hand-stitching
                  each garment to perfection. We believe that fashion is not
                  just clothing; it is a legacy.
                </p>

                <Link
                  href="/about"
                  className={buttonVariants({
                    size: "xl",
                    variant: "default",
                    className: "w-full sm:w-max",
                  })}
                >
                  Discover Our Story
                </Link>
              </div>
            </div>

            <div className="relative aspect-4/5 overflow-hidden shadow-xs">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
                alt="Atelier Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
