"use client";
import React from "react";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

interface Props {
  image?: string;
  title: string;
  description: string;
}

export const HeroComp: React.FC<Props> = ({ image, title, description }) => {
  return (
    <div className="bg-foreground relative overflow-hidden py-24">
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      )}
      <Container className="pt-8 md:pt-16" size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-background mb-4 max-w-[862px] font-serif text-5xl sm:text-6xl md:mb-6">
            {title}
          </h1>
          <p className="text-primary-foreground/60 max-w-xl">{description}</p>
        </motion.div>
      </Container>
    </div>
  );
};
