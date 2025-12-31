"use client";

import * as React from "react";
import { Icons } from "hugeicons-proxy";

import { Logo } from "./logo";
import { Button } from "@/ui/button";
import { useAppStore } from "@/lib/store";
import { Container } from "./container";
import { MenuSheet } from "../sheets/menu.sheet";
import { CartSheet } from "../sheets/cart.sheet";

export const Header = () => {
  const { cart } = useAppStore();
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

          <div className="flex items-center gap-3">
            <CartSheet>
              <Button
                variant="secondary"
                className="pointer-events-auto"
                size={cart.length > 0 ? "sm" : "icon-sm"}
              >
                <Icons.ShoppingCart02Icon className="size-4.5" />
                {cart.length > 0 && (
                  <span className="font-mono text-xs tracking-normal">
                    {cart.length > 9 ? "+9" : cart.length}
                  </span>
                )}
              </Button>
            </CartSheet>
            <MenuSheet openMenu={openMenu} setOpenMenu={setOpenMenu}>
              <Button
                size="icon-sm"
                variant="secondary"
                className="pointer-events-auto"
                onClick={() => setOpenMenu(true)}
              >
                <Icons.Menu09Icon className="size-4.5" />
              </Button>
            </MenuSheet>
          </div>
        </Container>
      </nav>
    </React.Fragment>
  );
};
