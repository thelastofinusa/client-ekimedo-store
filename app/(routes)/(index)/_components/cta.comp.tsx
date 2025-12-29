import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/ui/button";
import Link from "next/link";
import React from "react";

export const CATComp = () => {
  return (
    <section className="bg-foreground text-background py-24 lg:py-32 xl:py-40">
      <Container className="flex flex-col items-center justify-center text-center">
        <h3 className="mb-8 max-w-3xl leading-tight">
          Crafting your vision into a masterpiece of couture.
        </h3>
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            size: "xl",
            className: "hover:text-background",
          })}
        >
          Start Consultation
        </Link>
      </Container>
    </section>
  );
};
