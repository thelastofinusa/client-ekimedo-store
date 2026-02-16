import Link from "next/link";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import { buttonVariants } from "@/ui/button";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const PreMadeDresses = () => {
  return (
    <div className="bg-secondary/30 py-24 lg:py-32">
      {/* Pre-made Dresses Try On Section */}
      <Container>
        <div className="flex flex-col items-center justify-start gap-4 md:gap-6 lg:flex-row lg:gap-8 lg:even:flex-row-reverse xl:gap-10">
          <div className="relative aspect-[1.3] w-full flex-1">
            <Image
              src="/collections/pre-made-dresses.avif"
              alt="PreMade Dresses"
              fill
              priority
              quality={100}
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 md:gap-6">
            <p className="text-muted-foreground flex items-center gap-2 font-mono text-sm sm:text-base">
              <span>{formatPrice(100)}</span>
            </p>

            <div className="flex flex-col gap-2 md:gap-3">
              <h3 className="font-serif text-2xl leading-tight font-medium md:text-3xl">
                Pre-made Dresses Try On
              </h3>
              <p className="text-sm leading-relaxed opacity-70 md:text-base">
                Visit our atelier to try on our curated selection of
                ready-to-wear gowns. Our stylists will help you find the perfect
                fit for your special occasion.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-serif text-sm">What&apos;s Included:</p>

              <ul className="flex flex-col gap-2">
                {[
                  "Personal styling consultation with an in-house stylist",
                  "Access to a curated selection of ready-to-wear gowns",
                  "Guided fitting to find the best size and silhouette",
                  "Basic alterations advice (length, fit, adjustments)",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm opacity-80 sm:text-base"
                  >
                    <span>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/consultation/try-on"
              className={buttonVariants({
                size: "lg",
                className: "mt-4 w-max",
              })}
            >
              <span>Book This Service</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
