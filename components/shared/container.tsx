import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-5", {
  variants: {
    size: {
      default: "max-w-[1460px]",
      sm: "max-w-[1118px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function Container({
  className,
  size,
  asChild = false,
  ...props
}: React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof containerVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "section";

  return (
    <Comp
      data-slot="section"
      className={cn(containerVariants({ size, className }))}
      {...props}
    />
  );
}

export { Container, containerVariants };
