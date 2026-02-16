"use client";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="py-24 lg:py-32">
      <Container size="sm">
        <header className="flex flex-col items-end justify-between gap-12 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl pt-16"
          >
            <h1 className="mb-6 max-w-4xl font-serif text-5xl leading-[1.2] sm:text-6xl md:leading-[0.98]">
              Couture Pricing
            </h1>
            <p className="max-w-xl text-base leading-relaxed font-light">
              Because every gown is custom-designed, final pricing depends on
              your selected style, fabric, detailing and production timeline.
              Below are starting ranges to help you plan.
            </p>
          </motion.div>
        </header>
      </Container>
    </div>
  );
};
