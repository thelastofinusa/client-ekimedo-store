"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
import { NAVIGATIONS } from "@/constants";
import { buttonVariants } from "@/ui/button";

interface CompProps {
  children: React.ReactNode;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MenuSheet: React.FC<CompProps> = ({
  children,
  openMenu,
  setOpenMenu,
}) => {
  return (
    <Sheet open={openMenu} onOpenChange={setOpenMenu}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent background="dark">
        <SheetHeader className="border-b-border/10 bg-black/30">
          <SheetTitle>Maison Navigation</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col justify-center p-8 md:px-12">
          <nav className="flex flex-col gap-4 md:gap-6">
            {NAVIGATIONS.HEADER.map((item, index) => {
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setOpenMenu(false)}
                >
                  <Link
                    href={{ pathname: item.path }}
                    className="group flex w-fit items-baseline gap-4"
                  >
                    <span className="font-sans text-[10px] opacity-20 transition-opacity duration-500 group-hover:opacity-100">
                      0{index + 1}
                    </span>
                    <span className="font-serif text-2xl transition-all duration-500 md:text-4xl">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <SheetFooter className="gap-6 bg-black/20">
          <Link
            href="/consultation"
            onClick={() => setOpenMenu(false)}
            className={buttonVariants({
              variant: "secondary",
              size: "xl",
              className: "w-full",
            })}
          >
            Book an Appointment
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
