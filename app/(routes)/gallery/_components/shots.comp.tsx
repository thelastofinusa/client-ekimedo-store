"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/shared/container";
import { Icons } from "hugeicons-proxy";
import { Button } from "@/ui/button";
import { GALLERY_QUERYResult } from "@/sanity.types";
import { formatSanityDate } from "@/lib/utils";

interface Props {
  shots: GALLERY_QUERYResult;
}

export const ShotsComp: React.FC<Props> = ({ shots }) => {
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
        {shots.length > 0 ? (
          <div className="columns-2 gap-4 space-y-4 md:columns-3 md:gap-5 lg:columns-4">
            <AnimatePresence mode="popLayout">
              {shots.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => setSelectedIndex(index)}
                  className="group bg-background/5 border-border/20 relative mb-5 h-auto w-full cursor-pointer overflow-hidden border shadow-xs"
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title || ""}
                    width={880}
                    height={0}
                    className="h-auto object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-50"
                  />
                  <div className="bg-foreground/40 absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:p-8">
                    <span className="mb-1 text-[10px] tracking-widest uppercase md:mb-2">
                      {formatSanityDate(item.year!)} —{" "}
                      {item.category?.name?.replace("-", " ")}
                    </span>
                    {item.title && (
                      <h3 className="font-serif text-xl md:text-2xl">
                        {item.title}
                      </h3>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-6 py-10 text-center"
          >
            <div className="border-ivory/10 flex h-20 w-20 items-center justify-center rounded-full border opacity-20">
              <Icons.DeliveryBox02Icon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl">No Archive Found</h3>
              <p className="max-w-xs text-xs leading-relaxed tracking-widest uppercase opacity-40">
                We have no curated selections for this specific criteria in our
                historical archives.
              </p>
            </div>
          </motion.div>
        )}
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
                  alt={shots[selectedIndex].title ?? ""}
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>

              <div className="absolute right-0 -bottom-16 left-0 text-center">
                <h2 className="font-serif text-xl md:text-3xl">
                  {shots[selectedIndex].title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
