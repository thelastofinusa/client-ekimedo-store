"use client";

import Link from "next/link";
import * as React from "react";
import { Icons } from "hugeicons-proxy";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/ui/button";
import { Container, containerVariants } from "./container";
import { NAVIGATIONS } from "@/constants";
import { siteConfig } from "@/config/site.config";
import { ScrollArea } from "@/ui/scroll-area";
import { Logo } from "./logo";

export const Header = () => {
  const [openMenu, setOpenMenu] = React.useState(false);

  return (
    <React.Fragment>
      <nav className="pointer-events-none fixed top-0 left-0 z-50 flex w-full items-center justify-between mix-blend-difference">
        <Container className="flex w-full items-center justify-between py-6 md:py-8">
          <Logo
            href="/"
            srcDesktop="horizontal"
            color="bone"
            className="pointer-events-auto"
          />

          <div className="flex items-center gap-4">
            <Button
              size="icon-sm"
              variant="secondary"
              className="pointer-events-auto"
            >
              <Icons.ShoppingCart02Icon className="size-4.5" />
            </Button>
            <Button
              size="icon-sm"
              variant="secondary"
              className="pointer-events-auto"
              onClick={() => setOpenMenu(true)}
            >
              <Icons.Menu09Icon className="size-4.5" />
            </Button>
          </div>
        </Container>
      </nav>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="bg-primary text-background fixed inset-0 z-60"
          >
            <ScrollArea
              className={containerVariants({
                className: "relative flex h-full flex-col overflow-y-auto",
              })}
            >
              <div className="flex w-full items-center justify-between py-6 md:py-8">
                <Logo
                  href="/"
                  srcDesktop="horizontal"
                  color="bone"
                  className="pointer-events-auto"
                />

                <Button
                  size="icon-sm"
                  variant="secondary"
                  onClick={() => setOpenMenu(false)}
                  className="mr-1"
                >
                  <Icons.Cancel01Icon className="size-4.5" />
                </Button>
              </div>

              <nav className="flex flex-1 flex-col justify-center gap-6 py-6 md:gap-8 md:py-8 2xl:pt-16">
                {NAVIGATIONS.HEADER.map((route, routeIdx) => (
                  <Link
                    key={routeIdx}
                    href={{ pathname: route.path }}
                    onClick={() => setOpenMenu(false)}
                    className="w-fit font-serif text-4xl transition-transform duration-500 hover:translate-x-4 md:text-6xl 2xl:text-7xl"
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>

              <div className="border-border/10 flex flex-col items-end justify-between gap-8 border-t py-10 md:mt-10 md:flex-row">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-widest uppercase opacity-40">
                    Consultation
                  </span>
                  <Link
                    href="/"
                    className="border-ivory/20 border-b pb-1 text-sm"
                  >
                    Start your journey
                  </Link>
                </div>
                <p className="text-[10px] tracking-widest uppercase opacity-40">
                  © 2025 {siteConfig.title}. All rights reserved.
                </p>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};
