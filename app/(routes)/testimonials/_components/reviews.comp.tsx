"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { PiQuotesFill } from "react-icons/pi";

import { TESTIMONIALS } from "@/constants";
import { Icons } from "hugeicons-proxy";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";

export const ReviewsComp = () => {
  return (
    <div className="bg-foreground text-background py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-48">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`flex flex-col items-start gap-20 lg:flex-row ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-12 lg:w-1/2"
              >
                <div className="flex items-center gap-6">
                  <div className="border-primary/10 ring-primary/5 ring-offset-charcoal relative h-16 w-16 overflow-hidden rounded-full border ring-1 ring-offset-4 grayscale">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      quality={100}
                      priority
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-serif text-2xl tracking-tight">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground font-sans text-[9px] tracking-[0.3em] uppercase">
                      {testimonial.role} — {testimonial.date}
                    </p>
                    <div className="mt-2 flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Icons.StarIcon
                          key={i}
                          fill={
                            i < testimonial.rating ? "currentColor" : "none"
                          }
                          className={cn("text-muted-foreground size-4", {
                            "text-background": i < testimonial.rating,
                          })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <PiQuotesFill
                    className="text-ivory absolute -top-10 -left-6 fill-current opacity-5"
                    size={120}
                    strokeWidth={0.5}
                  />
                  <h3 className="relative z-10 font-serif text-2xl leading-[1.2] text-balance opacity-95 md:text-4xl">
                    &quot;{testimonial.content}&quot;
                  </h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2"
              >
                <div className="flex flex-col gap-6">
                  <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
                    The Artisan Result — {testimonial.workAssets?.length || 0}{" "}
                    Assets
                  </span>
                  <div className="grid h-[600px] grid-cols-6 grid-rows-2 gap-4">
                    <div className="group bg-secondary/20 relative col-span-4 row-span-2 overflow-hidden transition-all duration-700">
                      <Image
                        src={testimonial.workAssets?.[0] || "/placeholder.svg"}
                        alt="Primary Work Asset"
                        fill
                        className="scale-110 object-cover transition-transform duration-1000 group-hover:scale-100"
                      />
                    </div>
                    <div className="group bg-secondary/20 relative col-span-2 row-span-1 overflow-hidden transition-all duration-700">
                      <Image
                        src={testimonial.workAssets?.[1] || "/placeholder.svg"}
                        alt="Secondary Work Asset"
                        fill
                        className="scale-110 object-cover transition-transform duration-1000 group-hover:scale-100"
                      />
                    </div>
                    <div className="group bg-secondary/20 relative col-span-2 row-span-1 overflow-hidden transition-all duration-700">
                      <Image
                        src={testimonial.workAssets?.[2] || "/placeholder.svg"}
                        alt="Tertiary Work Asset"
                        fill
                        className="scale-110 object-cover transition-transform duration-1000 group-hover:scale-100"
                      />
                    </div>
                  </div>
                  {testimonial.workAssets &&
                    testimonial.workAssets.length > 3 && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {testimonial.workAssets.slice(3, 5).map((asset, i) => (
                          <div
                            key={i}
                            className="group relative aspect-video overflow-hidden transition-all duration-700"
                          >
                            <Image
                              src={asset || "/placeholder.svg"}
                              alt={`Additional Asset ${i + 4}`}
                              fill
                              className="scale-110 object-cover transition-transform duration-1000 group-hover:scale-100"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
