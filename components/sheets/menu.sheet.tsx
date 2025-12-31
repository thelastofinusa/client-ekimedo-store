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
import { useAppStore } from "@/lib/store";
import { buttonVariants } from "@/ui/button";
import { siteConfig } from "@/config/site.config";

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
  const { cart } = useAppStore();

  return (
    <Sheet open={openMenu} onOpenChange={setOpenMenu}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent background="dark">
        <SheetHeader className="border-b-border/10 bg-black/30">
          <SheetTitle>Maison Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col justify-center px-8 py-12 md:px-12">
          <nav className="flex flex-col gap-6">
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

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setOpenMenu(false)}
            >
              <Link
                href="/cart"
                className="group border-background/5 mt-4 flex w-full items-baseline gap-4 border-t pt-6"
              >
                <span className="font-serif text-2xl transition-all duration-500 md:text-4xl">
                  View Cart
                </span>
                {cart.length > 0 && (
                  <span className="font-sans text-sm tracking-tighter opacity-40">
                    [{cart.length}]
                  </span>
                )}
              </Link>
            </motion.div>
          </nav>
        </div>

        <SheetFooter className="gap-6 bg-black/20">
          <div className="space-y-2">
            <span className="text-[8px] tracking-[0.3em] uppercase opacity-30">
              The Atelier
            </span>
            <p className="max-w-[220px] text-[10px] leading-relaxed opacity-60">
              Private consultations by appointment only.
            </p>
          </div>
          <div className="flex items-end justify-between">
            <Link
              href="/consultation"
              onClick={() => setOpenMenu(false)}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "hover:text-background",
              })}
            >
              Book a visit
            </Link>
            <p className="text-[8px] tracking-widest uppercase opacity-20">
              © 2025 {siteConfig.title}
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
