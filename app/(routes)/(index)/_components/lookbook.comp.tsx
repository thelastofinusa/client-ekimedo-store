import Link from "next/link";
import Image from "next/image";

import { buttonVariants } from "@/ui/button";
import { Container } from "@/components/shared/container";

const LOOKS = [
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1320&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop",
];

export const LookbookComp = () => {
  return (
    <div className="from-secondary via-secondary/50 bg-linear-to-b to-transparent py-24 lg:py-32">
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
              variant: "outline",
              className: "hidden! md:inline-flex!",
            })}
          >
            View Full Gallery
          </Link>
        </div>
      </Container>

      <Container>
        <div className="flex gap-4">
          {LOOKS.map((url, i) => (
            <div
              key={i}
              className={`relative shrink-0 shadow-xs ${i % 2 === 0 ? "aspect-3/4 w-[40vw] md:w-[25vw]" : "mt-12 aspect-4/5 w-[30vw] md:w-[20vw]"}`}
            >
              <Image
                src={url || "/placeholder.svg"}
                alt={`Look ${i + 1}`}
                fill
                priority
                quality={100}
                className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
