"use client";

import Link from "next/link";
import * as React from "react";

import { ModeSwitcher } from "./switcher";
import { Container } from "./container";
import { siteConfig } from "@/config/site.config";
import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";
import { Separator } from "@/ui/separator";
import { useIsMobile } from "@/hooks/mobile";

export const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-background/60 sticky top-0 left-0 z-50 w-full backdrop-blur-md">
      <Container className="size-full">
        <nav className="flex size-full items-center justify-between gap-4 py-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium uppercase">
              {siteConfig.title}
            </Link>

            <div className="hidden items-center gap-0.5 md:flex">
              <Button size={"sm"} variant={"ghost"}>
                <span>Gallery</span>
              </Button>
              <Button size={"sm"} variant={"ghost"}>
                <span>Shop</span>
              </Button>
              <Button size={"sm"} variant={"ghost"}>
                <span>Testimonials</span>
              </Button>
              <Button size={"sm"} variant={"ghost"}>
                <span>Contact Us</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size={"icon-sm"} variant={"ghost"}>
              <Icons.ShoppingCart02Icon />
            </Button>
            <ModeSwitcher />
            {isMobile && (
              <React.Fragment>
                <Separator orientation="vertical" className="mx-1 h-3!" />
                <Button size={"icon-sm"} variant={"secondary"}>
                  <Icons.Menu09Icon />
                </Button>
              </React.Fragment>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};
