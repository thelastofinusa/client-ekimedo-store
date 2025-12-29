import Link from "next/link";

import { Logo } from "./logo";
import { Container } from "./container";
import { siteConfig } from "@/config/site.config";
import { NAVIGATIONS } from "@/constants";
import { Icons } from "hugeicons-proxy";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-border/10 border-t py-24">
      <Container>
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mb-24 lg:grid-cols-4 xl:grid-cols-5">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 xl:col-span-2">
            <Logo
              href="/"
              srcDesktop="horizontal"
              srcMobile="horizontal"
              mobileSize={[110, 32]}
              color="bone"
              className="block font-serif text-xl tracking-[0.2em] uppercase"
            />
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed tracking-wide">
              {siteConfig.description}
            </p>
          </div>

          {NAVIGATIONS.FOOTER.map(
            (
              section: {
                title: string;
                routes: { label: string; path: string; newTab?: boolean }[];
              },
              secIdx,
            ) => (
              <div key={secIdx} className="flex flex-col gap-8">
                <h4 className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
                  {section.title}
                </h4>
                <nav className="flex flex-col gap-4 text-xs tracking-widest uppercase">
                  {section.routes.map(
                    (route: (typeof section.routes)[number], routeIdx) => (
                      <Link
                        key={routeIdx}
                        target={route.newTab ? "_blank" : "_self"}
                        href={{ pathname: route.path }}
                        className="text-background hover:text-muted-foreground"
                      >
                        {route.label}
                      </Link>
                    ),
                  )}
                </nav>
              </div>
            ),
          )}
        </div>

        <div className="border-border/10 flex flex-col items-center justify-between gap-6 border-t pt-12 md:flex-row md:gap-8">
          <div className="text-background/50 flex gap-6 text-[10px] font-light tracking-[0.3em] uppercase md:gap-8">
            <div className="flex items-center gap-2">
              <Icons.Location06Icon className="size-4" />
              <span>Maryland, USA</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Mail01Icon className="size-4" />
              <span>info.e22fashion@gmail.com</span>
            </div>
          </div>

          <p className="text-background/50 text-[10px] font-light tracking-[0.4em] uppercase">
            © 2025 {siteConfig.title}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
