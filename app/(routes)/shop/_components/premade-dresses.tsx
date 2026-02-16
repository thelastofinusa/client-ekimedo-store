import Link from "next/link";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import { buttonVariants } from "@/ui/button";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { preMadeDrConData } from "@/lib/constants/consultation";

export const PreMadeDresses = () => {
  return (
    <div className="bg-secondary/30 py-24 lg:py-32">
      {/* Pre-made Dresses Try On Section */}
      <Container>
        <div className="flex flex-col items-center justify-start gap-4 md:gap-6 lg:flex-row lg:gap-8 lg:even:flex-row-reverse xl:gap-10">
          <div className="relative aspect-[1.3] w-full flex-1">
            <Image
              src={preMadeDrConData.image}
              alt={preMadeDrConData.title}
              fill
              priority
              quality={100}
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 md:gap-6">
            <p className="text-muted-foreground flex items-center gap-2 font-mono text-sm sm:text-base">
              <span>{formatPrice(preMadeDrConData.price)}</span>
            </p>

            <div className="flex flex-col gap-2 md:gap-3">
              <h3 className="font-serif text-2xl leading-tight font-medium md:text-3xl">
                {preMadeDrConData.title}
              </h3>
              <p className="text-sm leading-relaxed opacity-70 md:text-base">
                {preMadeDrConData.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-serif text-sm">What&apos;s Included:</p>

              <ul className="flex flex-col gap-2">
                {preMadeDrConData.includes.map((item, i) => (
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
              href={`/consultation/${preMadeDrConData.slug}`}
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
