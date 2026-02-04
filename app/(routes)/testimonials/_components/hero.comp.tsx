"use client";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="bg-foreground text-background py-24 lg:py-32">
      <Container size="sm">
        <header className="flex flex-col items-end justify-between gap-12 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl pt-16"
          >
            <span className="text-muted-foreground/60 mb-3 block font-sans text-[11px] tracking-[0.3em] uppercase">
              Testimonials
            </span>
            <h1 className="mb-8 max-w-4xl font-serif text-5xl leading-[1.2] sm:text-6xl md:text-8xl md:leading-[0.95]">
              Stories of <br /> Transformation
            </h1>
            <p className="max-w-xl text-base leading-relaxed font-light opacity-70 md:text-lg">
              &quot;Real experiences from individuals who trusted EKIMEDO with
              their most cherished moments. Discover the elegance and
              craftsmanship that defines our Maison.&quot;
            </p>
          </motion.div>
        </header>
      </Container>
    </div>
  );
};
