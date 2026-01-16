import React from "react";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { CATEGORIES_QUERYResult } from "@/sanity.types";

interface Props {
  years: string[];
  categories: CATEGORIES_QUERYResult;
  activeCategory: string;
  activeYear: string;
  setActiveCategory: (value: string) => void;
  setActiveYear: (value: string) => void;
}

export const HeroComp: React.FC<Props> = ({
  years,
  categories,
  setActiveCategory,
  setActiveYear,
  activeCategory,
  activeYear,
}) => {
  return (
    <header className="border-border/10 border-b pb-24 lg:pb-20">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <span className="text-muted-foreground mb-4 text-[10px] tracking-[0.4em] uppercase">
            Archive
          </span>
          <h2 className="mt-4 mb-8 text-[12vw] leading-[0.9] tracking-tighter md:mb-12 md:text-[6vw]">
            Gallery
          </h2>

          <div className="grid w-full max-w-lg grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                Occasion
              </span>

              <Select
                value={activeCategory}
                onValueChange={(e) => setActiveCategory(e)}
              >
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((year) => (
                      <SelectItem key={year._id} value={year.slug!}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                Collection Year
              </span>

              <Select
                value={activeYear}
                onValueChange={(e) => setActiveYear(e)}
              >
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </Container>
    </header>
  );
};
