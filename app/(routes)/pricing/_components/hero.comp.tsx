"use client";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="bg-foreground relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[url('/pricing.avif')] bg-cover bg-center opacity-20" />
      <Container className="pt-8 md:pt-16" size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-background mb-4 max-w-2xl font-serif text-5xl sm:text-6xl md:mb-6">
            Couture Pricing
          </h1>
          <p className="text-primary-foreground/60 max-w-xl">
            Because every gown is custom-designed, final pricing depends on your
            selected style, fabric, detailing and production timeline. Below are
            starting ranges to help you plan.
          </p>
        </motion.div>
      </Container>
    </div>
  );
};
