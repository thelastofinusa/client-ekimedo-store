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
import { useUser } from "@clerk/nextjs";
import { env } from "@/lib/env";

interface Props {
  children: React.ReactNode;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

type SubRoute = {
  label: string;
  path: string;
};

type RouteItem =
  | {
      label: string;
      path: string;
      subroutes?: never;
    }
  | {
      label: string;
      subroutes: SubRoute[];
      path?: never;
    };

export const MenuSheet: React.FC<Props> = ({
  children,
  openMenu,
  setOpenMenu,
}) => {
  const { user } = useUser();
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;

  const flattenedRoutes: SubRoute[] = headerRoutes.flatMap((route) => {
    if ("subroutes" in route && route.subroutes) {
      return route.subroutes;
    }

    if ("path" in route && route.path) {
      return [
        {
          label: route.label,
          path: route.path,
        },
      ];
    }

    return [];
  });

  return (
    <Sheet open={openMenu} onOpenChange={setOpenMenu}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent background="dark">
        <SheetHeader className="border-b-border/10 bg-black/30">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col justify-center p-8 md:px-12">
          <nav className="flex flex-col gap-4">
            {flattenedRoutes.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setOpenMenu(false)}
              >
                <Link
                  href={item.path as Route}
                  className="group flex w-fit items-baseline gap-4"
                >
                  <span className="font-serif text-2xl transition-all duration-500 md:text-3xl">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {isAdmin && (
          <SheetFooter className="flex flex-row items-center gap-4 bg-black/20">
            <SheetClose asChild>
              <Link
                target="_blank"
                href={"/admin" as Route}
                onClick={() => setOpenMenu(false)}
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  className: "flex-1",
                })}
              >
                Admin Dashboard
              </Link>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
