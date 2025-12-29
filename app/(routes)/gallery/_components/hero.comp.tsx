import React from "react";
import { motion } from "motion/react";

import { Container } from "@/components/shared/container";

interface Props {
  years: string[];
  categories: string[];
  activeCategory: string;
  activeYear: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
  setActiveYear: React.Dispatch<React.SetStateAction<string>>;
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
    <header className="border-border/10 border-b py-24 lg:pt-40 lg:pb-20">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="text-muted-foreground mb-4 text-[10px] tracking-[0.4em] uppercase">
            Archive
          </span>
          <h2 className="mt-4 mb-6 text-[12vw] leading-[0.9] tracking-tighter md:mb-12 md:text-[6vw]">
            The Gallery
          </h2>

          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex flex-col gap-4">
              <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                Occasion
              </span>
              <div className="flex gap-6">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`cursor-pointer text-xs tracking-widest uppercase transition-colors ${
                      activeCategory === cat
                        ? "text-background"
                        : "text-background/30 hover:text-background/60"
                    }`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">
                Collection Year
              </span>
              <div className="flex gap-6">
                {years.map((year) => (
                  <span
                    key={year}
                    onClick={() => setActiveYear(year)}
                    className={`cursor-pointer text-xs tracking-widest uppercase transition-colors ${
                      activeYear === year
                        ? "text-background"
                        : "text-background/30 hover:text-background/60"
                    }`}
                  >
                    {year}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </header>
  );
};
