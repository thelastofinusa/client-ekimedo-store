import Link from "next/link";

import { buttonVariants } from "@/ui/button";
import { Container } from "@/components/shared/container";

export const CTA = () => {
  return (
    <div className="py-16 md:py-24 lg:py-32">
      <Container size="sm">
        <div className="bg-card ring-muted flex w-full flex-col items-center justify-between gap-6 rounded-2xl border p-8 text-center shadow-sm ring-4 sm:p-10 md:flex-row md:text-left dark:ring-0">
          <div className="flex flex-col gap-2 md:gap-4">
            <p className="font-mono text-sm font-normal sm:text-base">
              Ready for the experience?
            </p>
            <h1 className="text-xl font-medium sm:text-2xl">
              Book a consultation Today!
            </h1>
          </div>

          <Link
            href={{ pathname: "/book-consultation" }}
            className={buttonVariants({
              className: "rounded-full!",
              size: "lg",
            })}
          >
            <span className="font-semibold">BOOK NOW</span>
          </Link>
        </div>
      </Container>
    </div>
  );
};
