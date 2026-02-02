"use client";
import * as React from "react";
import { Package } from "lucide-react";
import { Icons } from "hugeicons-proxy";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { Logo } from "./logo";
import { Button } from "@/ui/button";
import { Container } from "./container";
import { Separator } from "@/ui/separator";
import { MenuSheet } from "@/sheets/menu.sheet";
import { CartSheet } from "@/sheets/cart.sheet";
import { useTotalItems } from "@/providers/cart.provider";
import { env } from "@/lib/env";
import { PiPackageDuotone } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";

export const Header = () => {
  const { user } = useUser();
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;

  const totalItems = useTotalItems();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openCart, setOpenCart] = React.useState(false);

  return (
    <header className="pointer-events-none fixed top-0 left-0 z-50 w-full mix-blend-difference">
      <Container className="flex h-24 w-full items-center justify-between lg:h-28">
        <Logo
          href="/"
          srcDesktop="horizontal"
          color="bone"
          className="pointer-events-auto"
        />

        <div className="pointer-events-auto flex items-center gap-2.5">
          <CartSheet openCart={openCart} setOpenCart={setOpenCart}>
            <Button
              size={totalItems > 0 ? "sm" : "icon-sm"}
              variant="secondary"
            >
              <Icons.ShoppingCart02Icon className="size-4.5" />
              {totalItems > 0 && (
                <span className="font-mono text-xs tracking-tighter">
                  [{totalItems > 99 ? "99+" : totalItems}]
                </span>
              )}
              <span className="sr-only">Open cart ({totalItems} items)</span>
            </Button>
          </CartSheet>

          <MenuSheet openMenu={openMenu} setOpenMenu={setOpenMenu}>
            <Button
              size="icon-sm"
              onClick={() => setOpenMenu(true)}
              variant="secondary"
            >
              <Icons.Menu09Icon className="size-4.5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </MenuSheet>
          <div className="flex items-center gap-2.5">
            <SignedIn>
              <React.Fragment>
                <Separator orientation="vertical" className="h-3! w-px" />
                <Button
                  size="icon-sm"
                  variant="secondary"
                  className="isolate mix-blend-normal"
                >
                  <UserButton
                    afterSwitchSessionUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9",
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="My Orders"
                        labelIcon={
                          <PiPackageDuotone className="mt-px size-4" />
                        }
                        href="/orders"
                      />
                      {isAdmin && (
                        <UserButton.Link
                          label="Admin Dashboard"
                          labelIcon={<RiAdminLine className="mt-px size-4" />}
                          href="/studio"
                        />
                      )}
                    </UserButton.MenuItems>
                  </UserButton>
                </Button>
              </React.Fragment>
            </SignedIn>
            <SignedOut>
              <React.Fragment>
                <Separator orientation="vertical" className="h-3! w-px" />
                <SignInButton mode="modal">
                  <Button size="icon-sm" variant="secondary">
                    <Icons.UserCircleIcon className="size-4.5" />
                    <span className="sr-only">Sign in</span>
                  </Button>
                </SignInButton>
              </React.Fragment>
            </SignedOut>
          </div>
        </div>
      </Container>
    </header>
  );
};
