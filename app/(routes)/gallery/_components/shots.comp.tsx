import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/shared/container";

interface Props {
  shots: {
    id: string;
    year: string;
    category: string;
    title: string;
    image: string;
  }[];
}

export const ShotsComp: React.FC<Props> = ({ shots }) => {
  return (
    <section className="px-5 py-16 md:py-24 lg:px-8">
      <Container size="lg">
        <div className="columns-1 gap-5 space-y-4 sm:columns-2 md:columns-3 lg:columns-4">
          <AnimatePresence mode="popLayout">
            {shots.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group bg-background/5 relative mb-5 h-auto overflow-hidden border shadow-2xl"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={880}
                  height={0}
                  className="h-auto min-h-20 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-50"
                />
                <div className="bg-foreground/40 absolute inset-0 flex flex-col justify-end p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="mb-2 text-[10px] tracking-widest uppercase">
                    {item.year} — {item.category.replace("-", " ")}
                  </span>
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
