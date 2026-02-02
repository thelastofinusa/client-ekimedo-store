"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";

interface Props {
  snapshots: string[];
  title?: string | null;
}

export const SnapshotsGrid: React.FC<Props> = ({ snapshots, title }) => {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleOpen = (index: number) => setSelectedIndex(index);
  const handleClose = () => setSelectedIndex(null);

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === 0 ? snapshots.length - 1 : selectedIndex - 1,
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === snapshots.length - 1 ? 0 : selectedIndex + 1,
    );
  };

  return (
    <React.Fragment>
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {snapshots.map((snapshot, index) => (
          <div
            key={`${snapshot}-${index}`}
            onClick={() => handleOpen(index)}
            className="group cursor-pointer text-left"
          >
            <div className="bg-secondary/5 relative aspect-4/5 w-full overflow-hidden rounded-md shadow-xs">
              <div className="absolute top-3 left-3 z-10 sm:top-4 sm:left-4">
                <span className="bg-background/80 rounded-md border px-3 py-1 text-[10px] tracking-[0.3em] uppercase backdrop-blur">
                  Phase {index + 1}
                </span>
              </div>
              <Image
                src={snapshot}
                alt={`${title ?? "Consultation"} Step ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-foreground/95 fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-sm md:p-12"
            onClick={handleClose}
          >
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={handleClose}
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
                  src={snapshots[selectedIndex]}
                  alt={`${title ?? ""} Phase ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};
