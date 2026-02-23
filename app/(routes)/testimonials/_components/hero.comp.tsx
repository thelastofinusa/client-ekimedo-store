"use client";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";
import { siteConfig } from "@/site.config";

export const HeroComp = () => {
  return (
    <div className="bg-foreground relative overflow-hidden py-24">
      <Container className="pt-8 md:pt-16" size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-background mb-4 max-w-2xl font-serif text-5xl sm:text-6xl md:mb-6">
            Stories of Transformation
          </h1>
          <p className="text-primary-foreground/60 max-w-[600px]">
            &quot;Real experiences from individuals who trusted{" "}
            {siteConfig.title} with their most cherished moments. Discover the
            elegance and craftsmanship that defines our Maison.&quot;
          </p>
        </motion.div>
      </Container>
    </div>
  );
};
