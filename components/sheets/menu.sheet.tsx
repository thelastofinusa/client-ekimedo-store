import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
import { buttonVariants } from "@/ui/button";
import { headerRoutes } from "@/lib/constants/navigation";
import { Route } from "next";

interface Props {
  children: React.ReactNode;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MenuSheet: React.FC<Props> = ({
  children,
  openMenu,
  setOpenMenu,
}) => {
  return (
    <Sheet open={openMenu} onOpenChange={setOpenMenu}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent background="dark">
        <SheetHeader className="border-b-border/10 bg-black/30">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col justify-center p-8 md:px-12">
          <nav className="flex flex-col gap-4 md:gap-6">
            {headerRoutes.map((item, index) => {
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
                    <span className="font-serif text-3xl transition-all duration-500 md:text-4xl">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <SheetFooter className="flex flex-row items-center gap-4 bg-black/20">
          <SheetClose asChild>
            <Link
              href={"/consultation" as Route}
              onClick={() => setOpenMenu(false)}
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "flex-1",
              })}
            >
              Book an Appointment
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
