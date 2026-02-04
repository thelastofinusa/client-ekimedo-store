import Link from "next/link";
import { RiVisaLine } from "react-icons/ri";
import { FaApplePay, FaGooglePay, FaStripe } from "react-icons/fa";

import { Logo } from "./logo";
import { Button } from "@/ui/button";
import { Container } from "./container";
import { siteConfig } from "@/site.config";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { FilteredResponseQueryOptions } from "@sanity/client/stega";
import { Icons } from "hugeicons-proxy";
import { BUSINESS_HOUR_QUERY } from "@/sanity/queries/hours";
import { SOCIAL_QUERY } from "@/sanity/queries/social";
import { sanityFetch } from "@/sanity/lib/live";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

export const Footer = async () => {
  const options: FilteredResponseQueryOptions = { next: { revalidate: 30 } };
  const categories = await client.fetch(CATEGORIES_QUERY, {}, options);
  const businessHours = await client.fetch(BUSINESS_HOUR_QUERY, {}, options);
  const { data: socialHandles } = await sanityFetch({ query: SOCIAL_QUERY });

  return (
    <footer className="bg-foreground text-background border-border/20 border-t">
      <Container
        size="sm"
        className="divide-border/20 flex flex-col divide-y py-24"
      >
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-16 pb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-1">
            <Logo
              href="/"
              srcDesktop="horizontal"
              srcMobile="horizontal"
              mobileSize={[110, 32]}
              color="bone"
              className="block font-serif text-xl tracking-[0.2em] uppercase"
            />
            <p className="text-sm leading-relaxed font-light opacity-70">
              {siteConfig.description}
            </p>

            <div className="flex items-center gap-2">
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

            <div className="flex items-center gap-2.5">
              {socialHandles &&
                socialHandles.map((social) => {
                  let Icon = Icons.LinkSquare01Icon; // Default icon

                  if (social.name?.toLowerCase().includes("instagram"))
                    Icon = Icons.InstagramIcon;
                  else if (social.name?.toLowerCase().includes("tiktok"))
                    Icon = Icons.TiktokIcon;
                  else if (social.name?.toLowerCase().includes("facebook"))
                    Icon = Icons.Facebook01Icon;
                  else if (social.name?.toLowerCase().includes("linkedin"))
                    Icon = Icons.Linkedin01Icon;
                  else if (
                    social.name?.toLowerCase().includes("twitter") ||
                    social.name?.toLowerCase().includes("x")
                  )
                    Icon = Icons.NewTwitterRectangleIcon;

                  return (
                    <Tooltip key={social._id}>
                      <TooltipTrigger>
                        <a
                          href={social.url || "#"}
                          target={social.url ? "_blank" : "_self"}
                          title={social.name || "Follow us"}
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Icon className="text-muted-foreground group-hover:text-background size-6 transition-colors" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent theme="light" align="start" side="bottom">
                        <p>{social.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-6">
            <h4 className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.3em] uppercase">
              Collections
            </h4>
            <nav className="flex flex-col gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/shop?category=${cat.slug}`}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore */}
          <div className="space-y-6">
            <h4 className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.3em] uppercase">
              Explore
            </h4>
            <nav className="flex flex-col gap-4">
              <Link
                href="/gallery"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Our Gallery
              </Link>
              <Link
                href="/about"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                About Us
              </Link>
              <Link
                href="/testimonials"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Testimonials
              </Link>
              <Link
                href="/contact"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Let&apos;s Talk
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <h4 className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.3em] uppercase">
              Services
            </h4>
            <nav className="flex flex-col gap-4">
              <Link
                href="/consultation"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Book Consultation
              </Link>
              <a
                target="_blank"
                href="mailto:ekimedoatelier1@gmail.com"
                className="flex items-center gap-2 text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                ekimedoatelier1@gmail.com
              </a>
              <a
                target="_blank"
                href="https://maps.app.goo.gl/8d2LfPehk2PMqN5Q8"
                className="flex items-center gap-2 text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Capitol Heights, Maryland
              </a>
            </nav>
          </div>
        </div>

        {businessHours?.hours && businessHours.hours.length > 0 && (
          <div className="space-y-6 py-16">
            <h4 className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.3em] uppercase">
              Business Hours
            </h4>
            <nav className="flex flex-col gap-4 sm:max-w-sm">
              {businessHours.hours?.map((item) => (
                <p
                  key={item._key}
                  className="flex items-center justify-between text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  <span className="font-medium">{item.day}</span>{" "}
                  <span>
                    {item.isOpen
                      ? `${item.startTime} - ${item.endTime}`
                      : "Closed"}
                  </span>
                </p>
              ))}
            </nav>
          </div>
        )}

        {/* Bottom Footer */}
        <div className="flex flex-col items-start justify-between gap-8 pt-16 text-xs tracking-widest md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="opacity-60">© 2025 {siteConfig.title}</p>
            <p>
              All Rights Reserved - Designed and Developed by{" "}
              <a
                target="_blank"
                href="http://x.com/thelastofinusa"
                className="font-medium underline"
              >
                Holiday
              </a>
            </p>
          </div>

          <div className="flex gap-4 md:text-right">
            <a href="tel:+12029074865" className="space-y-2">
              <p className="opacity-60">Phone Number</p>
              <p>(+1) 202-907-4865</p>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
