import React from "react";
import { HeroComp } from "./_components/hero.comp";
import { Container } from "@/components/shared/container";
import Link from "next/link";
import { buttonVariants } from "@/ui/button";
import { Card } from "@/ui/card";
import { Icons } from "hugeicons-proxy";
import { formatPrice } from "@/lib/utils";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";

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

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
}

const pricingTiers: PricingTier[] = [
  {
    name: "Custom Wedding Dress",
    price: 5000,
    description:
      "A fully bespoke bridal gown designed exclusively for your wedding day.",
    features: [
      "In-depth bridal design consultation",
      "Luxury couture fabric sourcing",
      "Custom silhouette & structural tailoring",
      "Handcrafted embellishments & 3D details (optional)",
      "Multiple fittings for a perfect bridal fit",
      "One-of-a-kind couture wedding gown",
    ],
  },
  {
    name: "Custom Reception/Evening Gowns",
    price: 3500,
    description:
      "A show-stopping gown designed for wedding receptions or formal evenings.",
    features: [
      "Personalized design consultation",
      "Premium or custom fabric selection",
      "Elegant evening-wear silhouettes",
      "Optional hand embellishments & 3D details",
      "Comfort-focused tailoring for movement",
      "Modern, red-carpet–inspired finish",
    ],
  },
  {
    name: "Custom Bridal Robe",
    price: 1200,
    description:
      "A luxurious custom robe designed for bridal prep and special moments.",
    features: [
      "Custom robe design consultation",
      "Silk, satin, chiffon, or lace options",
      "Lightweight & comfortable construction",
      "Personalized detailing or embroidery (optional)",
      "Perfect for getting-ready photos",
      "Elegant, relaxed bridal fit",
    ],
  },
  {
    name: "Custom Prom Dresses",
    price: 1750,
    description:
      "A unique, custom-made prom dress tailored to your personal style.",
    features: [
      "One-on-one design consultation",
      "Essential to premium fabric options",
      "Trend-forward or classic prom silhouettes",
      "Optional 3D details or embellishments",
      "Flattering, body-conscious tailoring",
      "Standout look not found in stores",
    ],
  },
  {
    name: "Custom Special Event",
    price: 2000,
    description:
      "A custom outfit designed for galas, parties, or milestone celebrations.",
    features: [
      "Personalized design consultation",
      "Fabric selection based on event type",
      "Custom silhouette and styling",
      "Optional embellishments or statement details",
      "Elegant yet comfortable tailoring",
      "Versatile couture-level finish",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <div className="bg-secondary/30 py-24">
        <Container className="flex flex-col gap-16">
          {/* Desktop Table */}
          <div className="border-border hidden overflow-x-auto rounded-lg border md:block">
            <table className="w-full">
              <thead className="bg-secondary/30 border-border border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-serif text-lg font-light">
                    Dress Type
                  </th>
                  <th className="px-6 py-4 text-left font-serif text-lg font-light">
                    Starting Price
                  </th>
                  <th className="px-6 py-4 text-left font-serif text-lg font-light">
                    What&apos;s Included
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {pricingTiers.map((tier, idx) => (
                  <tr
                    key={idx}
                    className="bg-card hover:bg-card/70 transition-colors duration-300"
                  >
                    <td className="px-6 py-6 font-serif text-xl font-light">
                      {tier.name}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-3xl font-light">
                          {formatPrice(tier.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        {tier.features.map((feature, featureIdx) => (
                          <div
                            key={featureIdx}
                            className="flex items-start gap-3 text-sm"
                          >
                            <Icons.CheckmarkCircle01Icon className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {pricingTiers.map((tier, idx) => (
              <Card key={idx} className="overflow-hidden py-0!">
                <div className="bg-primary absolute top-0 right-0 left-0 h-1" />

                <div className="p-6">
                  <h3 className="mb-3 font-serif text-xl font-light">
                    {tier.name}
                  </h3>

                  <div className="mb-4 flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-light">
                      {formatPrice(tier.price)}
                    </span>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mb-6 space-y-3">
                    {tier.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-start gap-3">
                        <Icons.CheckmarkCircle01Icon className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex flex-col items-center gap-6">
            <p className="text-background text-center text-[15px] font-normal sm:text-base">
              Book a consultation and let&apos;s bring your vision to life.
            </p>
            <Link
              href="/consultation"
              className={buttonVariants({ size: "lg" })}
            >
              <span>Book A Consultation</span>
            </Link>
          </div>
        </Container>
      </div>
      <div className="bg-card py-24">
        <Container size="xs" className="flex flex-col items-center gap-4">
          <p className="text-center text-[15px] font-normal sm:text-base">
            <strong>Note:</strong> Our pre-made dresses begin at{" "}
            <strong>$1,500</strong> and are available for purchase on our
            website or{" "}
            <strong>
              <Link href="/shop" className="underline">
                click here
              </Link>
            </strong>
            . <br className="hidden md:block" />
            Customize dresses fall within the mid-luxury to high-luxury range.
          </p>
        </Container>
      </div>
    </div>
  );
}
