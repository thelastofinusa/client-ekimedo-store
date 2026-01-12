"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import { COLLECTIONS, DRESSES } from "@/constants";
import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/ui/button";

interface CompProps {
  info: (typeof COLLECTIONS)[0];
  dresses: typeof DRESSES;
}

export const DetailsComp: React.FC<CompProps> = ({ info, dresses }) => {
  return (
    <div className="bg-background py-24 lg:py-32">
      <Container size="sm">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-xl">
            <p className="text-charcoal mb-6 font-serif text-lg leading-relaxed">
              {info.description}
            </p>
            <div className="flex gap-4">
              <Link
                href="/consultation"
                className={buttonVariants({ variant: "outline" })}
              >
                Personalized Consultation
              </Link>
            </div>
          </div>
          <div className="flex gap-12 text-[10px] tracking-widest uppercase opacity-40">
            <span>{dresses.length} Styles</span>
            <span>Filter by Size</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-24 md:grid-cols-2 lg:grid-cols-3">
          {dresses.map((dress, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group"
            >
              <Link
                href={{ pathname: `/shop/${dress.id}` }}
                className="block"
              >
                <div className="bg-secondary/50 relative mb-6 aspect-3/4 overflow-hidden shadow-sm">
                  <Image
                    src={
                      dress.image ||
                      "/placeholder.svg?height=800&width=600&query=fashion dress"
                    }
                    alt={dress.name}
                    fill
                    quality={100}
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Hover Reveal */}
                  <div className="bg-charcoal/5 absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute right-6 bottom-6 left-6 flex translate-y-2 items-end justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-charcoal bg-white/90 px-3 py-1 text-[10px] tracking-widest uppercase backdrop-blur-sm">
                      View Details
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 font-serif text-lg transition-opacity group-hover:opacity-60">
                      {dress.name}
                    </h3>
                    <p className="text-[10px] tracking-[0.2em] uppercase opacity-40">
                      {dress.deliveryTime} Delivery
                    </p>
                  </div>
                  <span className="text-xs font-medium tracking-tight opacity-80">
                    {dress.priceRange}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};
