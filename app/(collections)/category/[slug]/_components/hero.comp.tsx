/* eslint-disable @next/next/no-img-element */
import { Container } from "@/components/shared/container";
import { COLLECTIONS } from "@/constants";
import React from "react";

interface CompProps {
  info: (typeof COLLECTIONS)[0];
}

export const HeroComp: React.FC<CompProps> = ({ info }) => {
  return (
    <div className="relative flex h-[60vh] items-center justify-center overflow-hidden">
      <div className="from-foreground/80 via-foreground/60 to-foreground/30 absolute inset-0 z-10 bg-linear-to-b" />
      <img
        src={info.image || "/placeholder.svg"}
        alt={info.name}
        className="absolute inset-0 h-full w-full origin-top object-cover"
      />
      <Container className="z-20">
        <div className="relative text-center">
          <span className="text-background mb-4 block text-[10px] tracking-[0.5em] uppercase">
            Collection
          </span>
          <h2 className="text-background tracking-widest uppercase">
            {info.name}
          </h2>
        </div>
      </Container>
    </div>
  );
};
