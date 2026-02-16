"use client";

import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="bg-foreground relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[url('/consultation.avif')] bg-cover bg-center opacity-20" />
      <Container className="pt-8 md:pt-16" size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-background mb-4 max-w-2xl font-serif text-5xl sm:text-6xl md:mb-6">
            Find Your Perfect Dress
          </h1>
          <p className="text-primary-foreground/60 max-w-[600px]">
            The Consultation fee goes toward dress production if you wish to
            move forward with the process, otherwise The Consultation fee is{" "}
            <strong className="text-background uppercase">nonrefundable</strong>
            .
          </p>
        </motion.div>
      </Container>
    </div>
  );
};
