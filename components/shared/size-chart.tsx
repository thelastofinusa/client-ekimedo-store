import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

const sizeChart = [
  {
    size: "XS",
    numeric: "0—2",
    bust: "32—33 / 81—84",
    waist: "24—25 / 61—64",
    hip: "34—35 / 86—89",
  },
  {
    size: "S",
    numeric: "4—6",
    bust: "34—35 / 86—89",
    waist: "26—27 / 66—69",
    hip: "36—37 / 91—94",
  },
  {
    size: "M",
    numeric: "8—10",
    bust: "36—37 / 91—94",
    waist: "28—29 / 71—74",
    hip: "38—39 / 96—99",
  },
  {
    size: "L",
    numeric: "12—14",
    bust: "38.5—40 / 98—101",
    waist: "30.5—32 / 77—81",
    hip: "40.5—42 / 103—107",
  },
  {
    size: "XL",
    numeric: "16—18",
    bust: "41.5—43 / 105—109",
    waist: "33.5—35 / 85—89",
    hip: "44.5—46 / 113—117",
  },
];

export const SizeChart: React.FC<Props> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card top-0 mt-6 max-w-5xl translate-y-0 p-6 md:p-8 lg:p-12">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
        </VisuallyHidden>

        <div className="scroll h-full max-h-[80dvh] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
          <div className="mb-4 w-full border shadow-xs">
            {/* Header (Desktop Only) */}
            <div className="size-table-header bg-foreground text-background hidden grid-cols-5 lg:grid">
              {[
                "Size",
                "Numeric Size",
                "Bust (in/cm)",
                "Waist (in/cm)",
                "Hip (in/cm)",
              ].map((label) => (
                <div key={label} className="p-4 text-sm font-semibold">
                  {label}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div>
              {sizeChart.map((row) => (
                <div
                  key={row.size}
                  className="size-row even:bg-secondary/50 grid border-b transition-colors last-of-type:border-0 lg:grid-cols-5"
                >
                  <div
                    className="size-cell p-3 text-sm font-medium lg:p-4"
                    data-label="Size"
                  >
                    {row.size}
                  </div>
                  <div
                    className="size-cell text-foreground p-3 text-sm lg:p-4"
                    data-label="Numeric Size"
                  >
                    {row.numeric}
                  </div>
                  <div
                    className="size-cell text-foreground p-3 text-sm lg:p-4"
                    data-label="Bust"
                  >
                    {row.bust}
                  </div>
                  <div
                    className="size-cell text-foreground p-3 text-sm lg:p-4"
                    data-label="Waist"
                  >
                    {row.waist}
                  </div>
                  <div
                    className="size-cell text-foreground p-3 text-sm lg:p-4"
                    data-label="Hip"
                  >
                    {row.hip}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Image
            src="/measurements-guide.webp"
            alt="measurements-guide"
            width={546}
            height={0}
            className="mx-auto h-auto object-contain"
            priority
            quality={100}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
