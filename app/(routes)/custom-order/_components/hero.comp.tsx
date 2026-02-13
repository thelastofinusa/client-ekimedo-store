"use client";
import React from "react";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="bg-secondary/30 py-24 lg:py-32">
      <Container size="sm">
        <header className="flex flex-col items-end justify-between gap-12 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl pt-16"
          >
            <h1 className="mb-6 max-w-4xl font-serif text-5xl leading-[1.2] sm:text-6xl md:leading-[0.98]">
              Custom Orders
            </h1>
            <p className="max-w-xl text-base leading-relaxed font-light">
              Bring your dream dress to life. Our bespoke service creates
              one-of-a-kind pieces tailored perfectly to your vision and
              measurements.
            </p>
          </motion.div>
        </header>
      </Container>
    </div>
  );
};
