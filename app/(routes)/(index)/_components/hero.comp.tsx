"use client";

import Link from "next/link";
import { Route } from "next";
import { motion } from "motion/react";

import Image from "next/image";
import { siteConfig } from "@/site.config";
import { buttonVariants } from "@/ui/button";

export const HeroComp = () => {
  return (
    <section className="bg-charcoal relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <Image
          src="/hero.avif"
          alt="Background"
          fill
          priority
          quality={100}
          className="bg-cover bg-fixed bg-center object-cover"
        />
        <div className="bg-foreground/80 absolute inset-0 backdrop-blur-xs" />
      </div>

      <div className="text-background relative z-10 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="flex flex-col items-center gap-4 text-center sm:gap-6 md:gap-12">
          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-[11px] tracking-[0.3em] uppercase"
          >
            Luxury Fashion & Styling
          </motion.span>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl leading-none sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {siteConfig.tagline}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="max-w-md text-sm leading-relaxed md:text-base"
          >
            Transform your closets into functional works of art with{" "}
            {siteConfig.title}&apos;s custom couture design solutions.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex w-full flex-col items-center justify-center gap-4 pt-8 sm:gap-6 md:flex-row"
          >
            <Link
              href="/products"
              className={buttonVariants({
                variant: "secondary",
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
                className: "hover:text-background w-full md:w-max",
              })}
            >
              Book Consultation
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-background text-[10px] tracking-[0.2em] uppercase">
            Scroll
          </span>
          <div className="from-secondary h-6 w-px bg-linear-to-b to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};
