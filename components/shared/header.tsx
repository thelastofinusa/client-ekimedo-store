"use client";
import * as React from "react";
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
import { headerRoutes } from "@/lib/constants/navigation";
import Link from "next/link";

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
      <Container className="flex h-20 w-full items-center justify-between gap-6 lg:h-24">
        <div className="flex w-full max-w-[150px] justify-start">
          <Logo
            href="/"
            srcDesktop="horizontal"
            color="bone"
            className="pointer-events-auto"
          />
        </div>

        <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          {headerRoutes.map((item) => {
            return (
              <Link
                key={item.path}
                href={{ pathname: item.path }}
                className="text-background pointer-events-auto text-xs font-medium tracking-wide uppercase transition-colors"
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex w-full max-w-[150px] justify-end">
          <div className="pointer-events-auto flex items-center gap-2">
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
                className="lg:hidden"
                variant="secondary"
              >
                <Icons.Menu09Icon className="size-4.5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </MenuSheet>
            <div className="flex items-center gap-2">
              <SignedIn>
                <React.Fragment>
                  <Separator orientation="vertical" className="h-3! w-px" />
                  <Button
                    size="icon-sm"
                    className="isolate mix-blend-normal"
                    variant="secondary"
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
                            href="/admin"
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
        </div>
      </Container>
    </header>
  );
};
