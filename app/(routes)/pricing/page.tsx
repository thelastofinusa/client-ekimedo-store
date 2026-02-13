import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";

import { HeroComp } from "./_components/hero.comp";
import { Container } from "@/components/shared/container";
import { Card } from "@/ui/card";
import { Icons } from "hugeicons-proxy";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/ui/button";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Because every gown is custom-designed, final pricing depends on your selected style, fabric, detailing and production timeline. Below are starting ranges to help you plan.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Pricing",
    siteName: siteConfig.title,
    description:
      "Because every gown is custom-designed, final pricing depends on your selected style, fabric, detailing and production timeline. Below are starting ranges to help you plan.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing",
    description:
      "Because every gown is custom-designed, final pricing depends on your selected style, fabric, detailing and production timeline. Below are starting ranges to help you plan.",
    images: ["/twitter-image.png"],
  },
};

const pricingTiers = [
  {
    name: "Custom Wedding Dress",
    price: 5000,
    tag: "The Masterpiece",
    description:
      "A fully bespoke bridal gown designed exclusively for your wedding day.",
    features: [
      "In-depth bridal design consultation",
      "Luxury couture fabric sourcing",
      "Custom silhouette & structural tailoring",
      "Handcrafted embellishments & 3D details",
      "Multiple fittings for a perfect bridal fit",
    ],
  },
  {
    name: "Reception & Evening Gowns",
    price: 3500,
    tag: "Evening Elegance",
    description:
      "A show-stopping gown designed for wedding receptions or formal evenings.",
    features: [
      "Personalized design consultation",
      "Premium or custom fabric selection",
      "Elegant evening-wear silhouettes",
      "Comfort-focused tailoring for movement",
      "Modern, red-carpet–inspired finish",
    ],
  },
  {
    name: "Custom Bridal Robe",
    price: 1200,
    tag: "The Morning Of",
    description:
      "A luxurious custom robe designed for bridal prep and special moments.",
    features: [
      "Custom robe design consultation",
      "Silk, satin, chiffon, or lace options",
      "Lightweight & comfortable construction",
      "Personalized detailing or embroidery",
      "Perfect for getting-ready photos",
    ],
  },
  {
    name: "Custom Prom Dresses",
    price: 1750,
    tag: "Red Carpet Ready",
    description:
      "A unique, custom-made prom dress tailored to your personal style.",
    features: [
      "One-on-one design consultation",
      "Essential to premium fabric options",
      "Trend-forward or classic silhouettes",
      "Flattering, body-conscious tailoring",
      "Standout look not found in stores",
    ],
  },
  {
    name: "Special Event Couture",
    price: 2000,
    tag: "Milestone Celebration",
    description:
      "A custom outfit designed for galas, parties, or milestone celebrations.",
    features: [
      "Personalized design consultation",
      "Fabric selection based on event type",
      "Custom silhouette and styling",
      "Optional embellishments",
      "Versatile couture-level finish",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />

      {/* Main Pricing Section */}
      <section className="bg-secondary/30 py-24">
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            {/* Left Column: Process Highlights */}
            <div className="space-y-12 lg:sticky lg:top-28 lg:col-span-4">
              <Card className="p-8">
                <h3 className="mb-4 font-serif text-2xl">
                  The Atelier Experience
                </h3>
                <ul className="space-y-6">
                  {[
                    {
                      icon: Icons.SparklesIcon,
                      title: "Bespoke Design",
                      desc: "Crafted from scratch to your proportions.",
                    },
                    {
                      icon: Icons.ScissorIcon,
                      title: "Luxury Fabrics",
                      desc: "The finest silks, laces, and hand-beading.",
                    },
                    {
                      icon: Icons.RulerIcon,
                      title: "Perfect Fit",
                      desc: "Multiple fittings ensure flawless silhouette.",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="bg-primary-foreground text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <item.icon size={18} />
                      </div>
                      <div className="mt-0.5">
                        <p className="text-xs font-medium tracking-widest uppercase">
                          {item.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Right Column: Pricing Tiers */}
            <div className="space-y-6 lg:col-span-8">
              {pricingTiers.map((tier, idx) => (
                <Card
                  key={idx}
                  className="p-8 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
                    {/* Tier Info */}
                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="bg-primary-foreground text-primary rounded px-2 py-1 text-[9px] font-medium tracking-[0.2em] uppercase">
                          {tier.tag}
                        </span>
                      </div>
                      <h2 className="group-hover:text-primary mb-3 font-serif text-3xl font-normal transition-colors">
                        {tier.name}
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed font-normal">
                        {tier.description}
                      </p>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                        {tier.features.map((feature, fIdx) => (
                          <div
                            key={fIdx}
                            className="text-muted-foreground flex items-center gap-2 text-[13px]"
                          >
                            <Icons.CheckmarkCircle01Icon
                              size={14}
                              className="text-primary shrink-0"
                            />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="border-border/50 flex shrink-0 flex-col items-center justify-center border-t pt-6 md:items-end md:border-t-0 md:pt-0">
                      <span className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
                        Starts At
                      </span>
                      <div className="text-primary mb-6 text-4xl">
                        {formatPrice(tier.price)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-card py-24">
        <Container size="xs" className="text-center">
          <div className="mb-10 flex flex-col items-center">
            <p className="mb-2 font-serif text-xl italic">
              Ready to start your journey?
            </p>
            <p className="text-muted-foreground mb-8 font-light">
              Book a consultation and let&apos;s bring your vision to life.
            </p>
            <Link
              href="/consultation"
              className={buttonVariants({ size: "xl" })}
            >
              Schedule Consultation
            </Link>
          </div>

          <div className="border-border/50 border-t pt-16 text-[13px] leading-relaxed font-light">
            <p>
              <strong>Note:</strong> Our pre-made dresses begin at{" "}
              <strong>$1,500</strong>. <br />
              Custom designs fall within the mid-luxury to high-luxury range.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
