import Link from "next/link";
import { FaApplePay, FaGooglePay, FaStripe } from "react-icons/fa6";
import { RiVisaLine } from "react-icons/ri";

import { Logo } from "./logo";
import { Button } from "@/ui/button";
import { Container } from "./container";

import { siteConfig } from "@/site.config";
import { Icons } from "hugeicons-proxy";
import { footerRoutes } from "@/lib/constants/navigation";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-border/10 border-t py-24">
      <Container className="flex flex-col gap-32">
        <div className="flex flex-col items-start justify-between gap-20 md:flex-row">
          <div className="flex max-w-sm flex-col gap-4">
            <Logo
              href="/"
              srcDesktop="horizontal"
              srcMobile="horizontal"
              mobileSize={[110, 32]}
              color="bone"
              className="block font-serif text-xl tracking-[0.2em] uppercase"
            />
            <p className="text-[11px] leading-relaxed font-light tracking-[0.3em] uppercase opacity-40">
              {siteConfig.tagline}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Button variant={"outline"} size="xs" disabled>
                <FaStripe className="size-7" />
              </Button>
              <Button variant={"outline"} size="xs" disabled>
                <FaApplePay className="size-7" />
              </Button>
              <Button variant={"outline"} size="xs" disabled>
                <RiVisaLine className="size-6" />
              </Button>
              <Button variant={"outline"} size="xs" disabled>
                <FaGooglePay className="size-7" />
              </Button>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-8 lg:w-max lg:grid-cols-3 lg:gap-10">
            {footerRoutes.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="space-y-6 last-of-type:col-span-2 lg:last-of-type:col-span-1"
              >
                <span className="block text-[11px] tracking-widest uppercase opacity-20">
                  {item.title}
                </span>
                <nav className="flex flex-col gap-3 text-[11px] tracking-widest uppercase">
                  {item.routes.map((route, routeIdx) => (
                    <Link
                      key={routeIdx}
                      href={{ pathname: route.path }}
                      className="opacity-60 transition-opacity hover:opacity-100"
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border/10 flex items-center justify-between border-t pt-12 text-[9px] tracking-[0.3em] uppercase">
          <div className="flex items-center gap-3">
            <Icons.InstagramIcon className="text-muted-foreground size-5" />
            <Icons.TiktokIcon className="text-muted-foreground size-5" />
          </div>
          <p>© 2025 {siteConfig.title}. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
