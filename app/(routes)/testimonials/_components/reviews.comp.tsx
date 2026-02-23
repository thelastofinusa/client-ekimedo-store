"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Icons } from "hugeicons-proxy";

import { cn, formatSanityDate, getInitials } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { Button } from "@/ui/button";
import { TESTIMONIAL_QUERYResult } from "@/sanity.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";

interface Props {
  testimonials: TESTIMONIAL_QUERYResult;
}

export const ReviewsComp: React.FC<Props> = ({ testimonials }) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const allImages = React.useMemo(() => {
    return testimonials.flatMap((t) =>
      (t.workAssets || []).map((asset) => ({
        url: asset,
        title: t.name,
      })),
    );
  }, [testimonials]);

  const offsets = React.useMemo(() => {
    const result: number[] = [];
    let count = 0;
    for (const t of testimonials) {
      result.push(count);
      count += t.workAssets?.length || 0;
    }
    return result;
  }, [testimonials]);

  const handlePrevious = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex === null) return;
      setSelectedIndex(
        selectedIndex === 0 ? allImages.length - 1 : selectedIndex - 1,
      );
    },
    [selectedIndex, allImages.length],
  );

  const handleNext = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex === null) return;
      setSelectedIndex(
        selectedIndex === allImages.length - 1 ? 0 : selectedIndex + 1,
      );
    },
    [selectedIndex, allImages.length],
  );

  return (
    <div className="py-24 lg:py-32">
      <Container size="sm">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              {/* Testimonial Quote */}
              <blockquote>
                <p className="text-charcoal/90 text-base leading-[1.7] font-light italic md:text-lg">
                  &quot;{testimonial.review}&quot;
                </p>
              </blockquote>

              {/* Author Profile */}
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name!}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getInitials(testimonial.name!)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-muted-foreground mt-0.5 text-[10px] tracking-widest uppercase">
                      {testimonial.category?.name}{" "}
                      {testimonial.date &&
                        `— ${formatSanityDate(testimonial.date)}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-px">
                  {[...Array(5)].map((_, i) => (
                    <Icons.StarIcon
                      key={i}
                      fill={i < testimonial.rating! ? "currentColor" : "none"}
                      className="text-primary size-4"
                    />
                  ))}
                </div>
              </div>

              {/* Work Assets Grid */}
              {testimonial.workAssets && testimonial.workAssets?.length > 0 && (
                <div className="border-border/50 grid grid-cols-4 gap-2 border-t pt-6">
                  {testimonial.workAssets?.slice(0, 4).map((asset, i) => (
                    <div
                      key={i}
                      className="bg-secondary group relative aspect-[0.8] w-full cursor-pointer overflow-hidden"
                      onClick={() => setSelectedIndex(offsets[index] + i)}
                    >
                      <Image
                        src={asset || "/placeholder.svg"}
                        alt={`Work ${i + 1}`}
                        fill
                        className="origin-top object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-foreground/95 fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-sm md:p-12"
            onClick={() => setSelectedIndex(null)}
          >
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-5 z-50 md:top-8 md:right-8"
            >
              <Icons.Cancel01Icon className="size-4.5" />
            </Button>

            <Button
              size={"icon"}
              variant={"secondary"}
              className="hover:bg-background/80 absolute left-4 z-50 md:left-8"
              onClick={handlePrevious}
            >
              <Icons.ArrowLeft01Icon className="size-4" />
            </Button>

            <Button
              size={"icon"}
              variant={"secondary"}
              className="hover:bg-background/80 absolute right-4 z-50 md:right-8"
              onClick={handleNext}
            >
              <Icons.ArrowRight01Icon className="size-4" />
            </Button>

            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex h-[80vh] w-full max-w-6xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full">
                <Image
                  fill
                  src={allImages[selectedIndex]?.url || "/placeholder.svg"}
                  alt={allImages[selectedIndex]?.title ?? ""}
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>

              <div className="absolute right-0 -bottom-16 left-0 text-center">
                <h2 className="text-background font-serif text-xl md:text-3xl">
                  {allImages[selectedIndex]?.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
