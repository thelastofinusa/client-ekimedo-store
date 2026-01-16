"use client";

import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

export const HeroComp = () => {
  return (
    <div className="py-24 lg:py-32">
      <Container size="sm">
        <header className="flex flex-col items-end justify-between gap-12 md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl pt-16"
          >
            <span className="text-muted-foreground block text-[10px] tracking-[0.4em] uppercase">
              Testimonials
            </span>
            <h1 className="mb-0 font-serif text-6xl leading-[1.1] tracking-tight md:text-7xl lg:text-8xl xl:text-9xl">
              Words from Our Clients
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-sm text-right"
          >
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              &quot;We believe the most beautiful thing a woman can wear is her
              own story, tailored to perfection.&quot;
            </p>
          </motion.div>
        </header>
      </Container>
    </div>
  );
};
