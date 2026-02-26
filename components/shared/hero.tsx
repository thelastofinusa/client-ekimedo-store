"use client";
import React from "react";
import { motion } from "motion/react";

import { Container } from "./container";
import Image from "next/image";

export const HeroComp: React.FC<{
  title: string;
  description?: string | React.ReactElement;
  imagePath?: string;
  comp?: React.ReactElement;
}> = ({ title, description, imagePath, comp }) => {
  return (
    <div className="bg-foreground relative overflow-hidden py-24">
      {imagePath && (
        <Image
          src={`/assets/hero/${imagePath}`}
          alt={title}
          fill
          priority
          quality={100}
          className="absolute inset-0 bg-cover object-cover opacity-20"
        />
      )}
      <Container className="pt-8 md:pt-16" size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-background mb-4 max-w-2xl font-serif text-5xl sm:text-6xl md:mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-primary-foreground/60 max-w-[600px]">
              {description}
            </p>
          )}

          {comp && <div>{comp}</div>}
        </motion.div>
      </Container>
    </div>
  );
};
