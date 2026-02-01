"use client";

import Link from "next/link";
import { Route } from "next";
import { motion } from "motion/react";

import { siteConfig } from "@/site.config";
import { buttonVariants } from "@/ui/button";

export const HeroComp = () => {
  return (
    <section className="bg-background relative flex h-dvh w-full items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-5xl space-y-8 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl leading-[1.1] tracking-tighter md:text-[8vw] lg:text-[6vw]"
        >
          {siteConfig.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-primary/60 mx-auto max-w-md font-sans text-sm leading-relaxed md:text-base"
        >
          Transform your closets into functional works of art with{" "}
          {siteConfig.title}&apos;s custom couture design solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex flex-col items-center justify-center gap-4 pt-8 sm:gap-6 md:flex-row md:gap-8 md:pt-12"
        >
          <Link
            href="/products"
            className={buttonVariants({
              size: "lg",
              className: "w-full md:w-max",
            })}
          >
            Explore Products
          </Link>
          <div className="bg-border hidden h-6 w-px md:block" />
          <Link
            href={"/consultation" as Route}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full md:w-max",
            })}
          >
            Book Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
