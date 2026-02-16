import { Metadata } from "next";
import { HeroComp } from "../[type]/_components/hero.comp";
import { TryOnForm } from "./_components/try-on-form";
import { preMadeDrConData } from "@/lib/constants/consultation";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: preMadeDrConData?.title || "Consultation",
  description: preMadeDrConData?.description || "Book a dress consultation",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: preMadeDrConData?.title,
    siteName: siteConfig.title,
    description: preMadeDrConData?.description,
    images: [
      {
        url: preMadeDrConData?.image ?? "",
        width: 1200,
        height: 630,
        alt: preMadeDrConData?.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: preMadeDrConData?.title,
    description: preMadeDrConData?.description,
    images: [preMadeDrConData?.image ?? ""],
  },
};

export default function PreMadeDressesPage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp
        image="/collections/pre-made-dresses.avif"
        title="Pre-made Dresses Try On"
        description="Visit our atelier to try on our curated selection of ready-to-wear gowns. Our stylists will help you find the perfect fit for your special occasion."
      />
      <div className="from-secondary/80 via-secondary/30 to-background bg-linear-to-b py-24 lg:py-32">
        <Container size="default">
          <TryOnForm config={preMadeDrConData} />
        </Container>
      </div>
    </div>
  );
}
