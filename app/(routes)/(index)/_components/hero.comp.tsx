"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { siteConfig } from "@/config/site.config";
import { buttonVariants } from "@/ui/button";

export const HeroComp = () => {
  return (
    <section className="bg-background relative flex h-dvh w-full items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-5xl space-y-8 px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-muted-foreground block text-[10px] font-medium tracking-[0.4em] uppercase"
        >
          {siteConfig.tagline}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[16vw] leading-[0.9] tracking-tighter md:text-[8vw]"
        >
          {siteConfig.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col items-center justify-center gap-8 pt-12 md:flex-row"
        >
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Explore Collections
          </Link>
          <div className="bg-border hidden h-6 w-px md:block" />
          <Link href="/" className={buttonVariants({ variant: "link" })}>
            Private Consultation
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4"
      >
        <span className="vertical-rl text-[8px] tracking-widest uppercase">
          Scroll
        </span>
        <div className="bg-border h-12 w-px" />
      </motion.div>
    </section>
  );
};
