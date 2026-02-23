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
    <div className="bg-foreground text-background relative overflow-hidden py-24">
      <Container className="pt-8 md:pt-16" size="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-background mb-4 max-w-2xl font-serif text-5xl sm:text-6xl md:mb-8">
            Our Gallery
          </h1>
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
    </div>
  );
};
