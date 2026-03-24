"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/shared/container";
import { Icons } from "hugeicons-proxy";
import { Button } from "@/ui/button";
import { GALLERY_QUERYResult } from "@/sanity.types";

export const ShotsComp: React.FC<{
  shots: GALLERY_QUERYResult;
}> = ({ shots }) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handlePrevious = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex === null) return;
      setSelectedIndex(
        selectedIndex === 0 ? shots.length - 1 : selectedIndex - 1,
      );
    },
    [selectedIndex, shots.length],
  );

  const handleNext = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex === null) return;
      setSelectedIndex(
        selectedIndex === shots.length - 1 ? 0 : selectedIndex + 1,
      );
    },
    [selectedIndex, shots.length],
  );

  return (
    <section className="py-16 md:py-24 lg:px-8">
      <Container size="lg">
        <div className="columns-2 gap-3 sm:gap-4 md:columns-3 md:gap-5 lg:columns-4">
          {shots.map((item, index) => (
            <div
              key={item._id}
              onClick={() => setSelectedIndex(index)}
              className="group bg-background/5 border-border/20 relative mb-3 w-full cursor-pointer break-inside-avoid-column overflow-hidden border shadow-xs sm:mb-4 md:mb-5"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt=""
                width={880}
                height={200}
                loading="lazy"
                priority={false}
                className="h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-80"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-b from-transparent via-black/20 to-black/70 p-4 duration-500 sm:p-6 md:px-8">
                <span className="text-background mb-1 text-xs font-medium tracking-widest uppercase md:mb-2 md:text-sm">
                  {item.category?.name?.replace("-", " ")}
                </span>
              </div>
            </div>
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
              variant={"outline"}
              className="hover:bg-background/80 absolute left-4 z-50 md:left-8"
              onClick={handlePrevious}
            >
              <Icons.ArrowLeft01Icon className="size-4" />
            </Button>

            <Button
              size={"icon"}
              variant={"outline"}
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
                  src={shots[selectedIndex].image || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>

              <div className="absolute right-0 -bottom-16 left-0 text-center">
                <h2 className="font-serif text-xl md:text-3xl">
                  {shots[selectedIndex].category?.name}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
