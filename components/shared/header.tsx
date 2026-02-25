"use client";

import React from "react";
import { containerVariants } from "./container";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { CartSheet } from "../sheets/cart.sheet";
import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";
import { MenuSheet } from "../sheets/menu.sheet";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Separator } from "@/ui/separator";
import { PiPackageDuotone } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { useTotalItems } from "../providers/cart.provider";
import { env } from "@/lib/env";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/ui/navigation-menu";
import Link from "next/link";
import { Route } from "next";
import { usePathname } from "next/navigation";
import { headerRoutes } from "@/lib/constants/navigation";

export const Header = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const forceActiveRoutes = [
    "/about",
    "/contact",
    "/shop/",
    "/checkout",
    "/orders",
    "/email-preview",
  ];
  const isDynamicShopRoute =
    pathname.startsWith("/shop/") && pathname !== "/shop";

  const totalItems: number = useTotalItems();
  const lastScrollY = React.useRef<number>(0);
  const scrollTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const [openCart, setOpenCart] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);

  const forceActive = React.useMemo(
    () => isDynamicShopRoute || forceActiveRoutes.includes(pathname),
    [forceActiveRoutes, isDynamicShopRoute, pathname],
  );

  React.useEffect(() => {
    if (forceActive) {
      setIsActive(true);
      setIsScrolling(false);
      return;
    }

    setIsActive(false);
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      // mark scrolling
      setIsScrolling(true);

      // clear previous stop timer
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // scrolling stopped after 120ms
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 120);

      // direction logic
      if (currentY < lastScrollY.current || currentY < 80) {
        setIsActive(false);
      } else {
        setIsActive(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [forceActive]);

  return (
    <NavigationMenu
      viewport={false}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-50 w-full max-w-full transition-all duration-300",
        {
          "bg-background md:bg-background/80 md:backdrop-blur-md": isActive,
          "mix-blend-difference": !isActive && isScrolling,
        },
      )}
    >
      <header
        className={containerVariants({
          className:
            "flex h-20 w-full items-center justify-between gap-6 lg:h-24",
        })}
      >
        <div className="flex w-full max-w-[150px] justify-start">
          <Logo
            href="/"
            srcDesktop="horizontal"
            color={isActive ? "charcoal" : "bone"}
            className="pointer-events-auto"
          />
        </div>

        <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
          <NavigationMenuList className="flex items-center justify-center gap-6">
            {headerRoutes.map((item) => {
              const LinkRefactored =
                item.subroutes && item.subroutes?.length > 0 ? "p" : Link;

              return (
                <NavigationMenuItem
                  key={item.label}
                  className="pointer-events-auto"
                >
                  {item.subroutes && item.subroutes.length > 0 ? (
                    <NavigationMenuTrigger
                      className={cn("mt-1", !isActive && "text-secondary")}
                    >
                      <span>{item.label}</span>
                    </NavigationMenuTrigger>
                  ) : (
                    <LinkRefactored
                      key={item.path}
                      href={item.path as Route}
                      className={cn(
                        "pointer-events-auto text-xs font-medium tracking-wider uppercase transition-colors",
                        !isActive && "text-secondary",
                      )}
                    >
                      <span>{item.label}</span>
                    </LinkRefactored>
                  )}
                  {item.subroutes && item.subroutes.length > 0 && (
                    <NavigationMenuContent>
                      <ul className="pointer-events-auto w-60">
                        {item.subroutes.map((route) => (
                          <NavigationMenuLink key={route.path} asChild>
                            <Link
                              href={route.path as Route}
                              className="pointer-events-auto text-xs font-medium tracking-wider uppercase transition-colors"
                            >
                              <span>{route.label}</span>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  )}
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </div>

        <div className="flex w-full max-w-[150px] justify-end">
          <div className="pointer-events-auto flex items-center gap-2">
            <CartSheet openCart={openCart} setOpenCart={setOpenCart}>
              <Button
                size={totalItems > 0 ? "sm" : "icon-sm"}
                variant={isActive ? "default" : "secondary"}
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
                variant={isActive ? "default" : "secondary"}
                className="lg:hidden"
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
                    variant={isActive ? "default" : "secondary"}
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
                            label="Content Management"
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
                    <Button
                      size="icon-sm"
                      variant={isActive ? "default" : "secondary"}
                    >
                      <Icons.UserCircleIcon className="size-4.5" />
                      <span className="sr-only">Sign in</span>
                    </Button>
                  </SignInButton>
                </React.Fragment>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
    </NavigationMenu>
  );
};
