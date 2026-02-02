import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/ui/button";
import { Container } from "@/components/shared/container";
import { GALLERY_ITEMS } from "@/lib/constants/filters";

export const LookBookComp = () => {
  const looks = GALLERY_ITEMS.map((item) => item.image);

  return (
    <div className="bg-background">
      <div className="from-secondary via-secondary/50 overflow-x-clip bg-linear-to-b to-transparent py-24 lg:py-32">
        <Container size="sm">
          <div className="mb-20 flex items-end justify-between">
            <div className="space-y-4">
              <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
                Visual Journal
              </span>
              <h2 className="leading-[1.1]">Runway & Beyond</h2>
            </div>
            <Link
              href="/gallery"
              className={buttonVariants({
                className: "hidden! md:inline-flex!",
              })}
            >
              View Full Gallery
            </Link>
          </div>
        </Container>

        <Container>
          <div className="flex gap-4">
            {looks
              .slice(0, 5)
              .reverse()
              .map((url, idx) => (
                <div
                  key={idx}
                  className={cn("relative shrink-0 shadow-xs", {
                    "aspect-3/4 w-[40vw] md:w-[25vw]": idx % 2 === 0,
                    "mt-10 aspect-4/5 w-[30vw] md:w-[20vw]": idx % 2 !== 0,
                  })}
                >
                  <Image
                    src={url}
                    alt={`Look ${idx + 1}`}
                    fill
                    loading="lazy"
                    quality={100}
                    className="object-cover transition-all duration-700"
                  />
                </div>
              ))}
          </div>
        </Container>
      </div>
    </div>
  );
};
