import Link from "next/link";
import { Route } from "next";
import * as React from "react";

import { Container } from "./container";
import { buttonVariants } from "@/ui/button";

interface CompProps {
  href?: string;
  label: string;
  title: string;
}

export const CTA: React.FC<CompProps> = ({ title, href, label }) => {
  return (
    <div className="bg-foreground text-background py-24 lg:py-32 xl:py-40">
      <Container className="flex flex-col items-center justify-center text-center">
        <h3 className="mb-8 max-w-3xl leading-tight">{title}</h3>
        <Link
          href={href as Route}
          className={buttonVariants({
            variant: "outline",
            size: "xl",
            className: "hover:text-background",
          })}
        >
          {label}
        </Link>
      </Container>
    </div>
  );
};
