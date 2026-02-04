"use client";

import React from "react";
import Link from "next/link";
import { Route } from "next";
import Image from "next/image";
import { motion } from "motion/react";

import { siteConfig } from "@/site.config";
import { buttonVariants } from "@/ui/button";

export const HeroSlider = ({ images }: { images: string[] }) => {
  const [index, setIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5s per slide

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="bg-charcoal relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="flex h-full w-full"
          animate={{ x: `-${index * 100}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {images.map((src, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <Image
                src={src}
                alt="Hero background"
                fill
                priority={i === 0}
                quality={100}
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>

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
            className="mt-2 max-w-md font-mono text-sm leading-relaxed md:mt-0"
          >
            Bridal / Reception / Prom / Special Occasion
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 flex w-full max-w-lg flex-col items-center justify-center gap-4 sm:gap-6 md:mt-0 md:flex-row"
          >
            <Link
              href="/shop"
              className={buttonVariants({
                variant: "secondary",
                size: "xl",
                className: "w-full md:w-max md:flex-1",
              })}
            >
              Shop Collections
            </Link>
            <Link
              href={"/consultation" as Route}
              className={buttonVariants({
                variant: "outline",
                size: "xl",
                className: "w-full hover:text-white md:w-max md:flex-1",
              })}
            >
              Book Consultation
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
